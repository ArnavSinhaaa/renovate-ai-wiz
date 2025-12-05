import React, { useState } from 'react';
import { Wand2, Download, Sparkles, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { RenovationSuggestion } from '@/data/renovationSuggestions';
import { ImageComparisonSlider } from './ImageComparisonSlider';
import { toast } from 'sonner';
import { saveUserPhoto } from '@/services/database';

interface RenovationPreviewProps {
  selectedSuggestions: RenovationSuggestion[];
  roomType?: string;
  budget: number;
  uploadedImage: string | null;
  imageProvider?: string;
  imageModel?: string;
  providerStatus?: { [key: string]: string };
  onProviderStatusUpdate?: (provider: string, status: string) => void;
}

export const RenovationPreview: React.FC<RenovationPreviewProps> = ({
  selectedSuggestions,
  roomType,
  budget,
  uploadedImage,
  imageProvider = 'LOVABLE',
  imageModel = 'black-forest-labs/FLUX.1-schnell',
  providerStatus = {},
  onProviderStatusUpdate
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [generationPrompt, setGenerationPrompt] = useState<string>('');
  const [wallColors, setWallColors] = useState({
    left: { color: '#FFFFFF', name: 'Pure White' },
    right: { color: '#FFFFFF', name: 'Pure White' },
    front: { color: '#FFFFFF', name: 'Pure White' },
  });
  const [flooring, setFlooring] = useState({ type: 'none', name: 'Original', cost: 0 });
  const [tile, setTile] = useState({ type: 'none', name: 'Original', cost: 0 });
  const [falseCeiling, setFalseCeiling] = useState({ type: 'none', name: 'None', cost: 0 });

  const handleWallColorsChange = (colors: typeof wallColors) => {
    setWallColors(colors);
  };

  const generateRenovationImage = async () => {
    if (!uploadedImage) {
      alert('Please upload a room photo first');
      return;
    }

    setIsGenerating(true);
    
    try {
      // Convert blob URL to base64 if needed
      let imageBase64 = uploadedImage;
      if (uploadedImage.startsWith('blob:')) {
        console.log('Converting blob URL to base64...');
        const response = await fetch(uploadedImage);
        const blob = await response.blob();
        imageBase64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(blob);
        });
      }
      
      // Process all selected suggestions
      const suggestions = selectedSuggestions
        .map(s => s.suggestion)
        .slice(0, 5);
      
      // Enhanced prompt for image editing that preserves structure
      const editingPrompt = suggestions.length > 0 
        ? `Apply these renovation changes to the room: ${suggestions.join(', ')}. Use ${Object.values(wallColors).map(w => w.name).join(', ')} for wall colors. Apply ${flooring.name} for flooring and ${tile.name} for tiles.`
        : `Modernize this room with: ${Object.values(wallColors).map(w => w.name).join(', ')} wall colors, ${flooring.name} flooring, and ${tile.name} tiles.`;
      
      console.log('🎨 Generating room renovation preview with img2img...');
      console.log(`Using ${imageProvider} for image generation`);
      toast.info('Generating renovation preview with AI', {
        description: `Using ${imageProvider === 'LOVABLE' ? 'Lovable AI (free)' : imageProvider} for results`,
        duration: 4000
      });
      
      const { data, error } = await supabase.functions.invoke('generate-image-v2', {
        body: {
          prompt: editingPrompt,
          originalImage: imageBase64,
          selectedProvider: imageProvider,
          selectedModel: imageModel,
          width: 1024, // OpenAI gpt-image-1 requires 1024x1024, 1024x1536, or 1536x1024
          height: 1024,
          // Control how much the image should change (0.3-0.8 range)
          // Lower = more faithful to original, Higher = more creative changes
          strength: 0.45 // Optimized for credit efficiency while maintaining quality
        }
      });
      
      console.log('💳 Image generation completed - credits consumed');

      if (error) {
        console.error('Edge function error:', error);
        const errorMessage = `Failed to generate image:\n\nError: ${error.message || 'Unknown error'}\n\nProvider: ${imageProvider}\nModel: ${imageModel}\n\nPlease check:\n1. API key is configured in Supabase secrets\n2. Provider is not rate limited\n3. Edge function logs for details`;
        alert(errorMessage);
        setIsGenerating(false);
        return;
      }

      console.log('Edge function response:', data);
      
      // Update provider status
      if (data.status && onProviderStatusUpdate) {
        onProviderStatusUpdate(imageProvider, data.status);
      }
      
      if (data.status === 'rate_limited') {
        alert(`⚠️ Rate Limit Exceeded\n\nProvider: ${data.provider}\n\nThe ${data.provider} rate limit has been exceeded.\n\nSolutions:\n1. Wait a few minutes and try again\n2. Switch to a different provider\n3. Check your API usage limits\n\nDetails: ${data.details || data.error}`);
        return;
      } else if (data.status === 'out_of_service') {
        alert(`❌ Provider Unavailable\n\nProvider: ${data.provider}\n\nThe ${data.provider} API is not configured or unavailable.\n\nRequired: ${data.keyName || 'API key'}\n\nPlease:\n1. Add the API key to Supabase secrets\n2. Or switch to a different provider\n\nDetails: ${data.error}`);
        return;
      } else if (data.status === 'error') {
        alert(`❌ Generation Failed\n\nProvider: ${data.provider}\nModel: ${data.model || imageModel}\n\nError: ${data.error}\n\n${data.suggestion || 'Please try again or switch providers'}`);
        return;
      }
      
      if (!data.imageUrl) {
        alert('❌ No image received from provider. Please check edge function logs.');
        return;
      }
      
      setGeneratedImage(data.imageUrl);
      setGenerationPrompt(data.prompt || editingPrompt);
      console.log('✅ Image generated successfully');
      toast.success('Renovation preview generated!', {
        description: 'Your AI-generated preview is ready'
      });

      // Save the generated image to database using session ID
      try {
        const sessionId = localStorage.getItem('fixfy_session_id') || `session-${Date.now()}`;
        localStorage.setItem('fixfy_session_id', sessionId);
        
        await saveUserPhoto(sessionId, {
          imageUrl: data.imageUrl,
          roomType: roomType || 'Custom'
        });
        console.log('💾 Generated image saved to database');
      } catch (saveError) {
        console.error('Failed to save image to database:', saveError);
        // Don't show error to user as the image was generated successfully
      }
    } catch (error) {
      console.error('Failed to generate renovation preview:', error);
      alert(`❌ Unexpected Error\n\n${error.message || error}\n\nPlease:\n1. Check console for details\n2. Verify edge function is deployed\n3. Check Supabase edge function logs\n4. Try a different provider`);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadImage = async () => {
    if (!generatedImage) return;
    
    try {
      const response = await fetch(generatedImage);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `renovation-preview-${Date.now()}.jpg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Failed to download image:', error);
    }
  };

  return (
    <Card className="shadow-lg border-2 hover:shadow-glow transition-all duration-300 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10">
        <CardTitle className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center shadow-glow">
            <Wand2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-xl">AI Renovation Preview</span>
            <p className="text-sm text-muted-foreground font-normal">Powered by {imageProvider === 'LOVABLE' ? 'Lovable AI' : imageProvider}</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {!generatedImage ? (
          <div className="text-center space-y-6 py-8">
            <div className="relative">
              <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-gradient-primary flex items-center justify-center shadow-glow animate-pulse">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-accent rounded-full flex items-center justify-center animate-bounce">
                <span className="text-xs font-bold text-white">AI</span>
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Generate Your Dream Room
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Transform your space with AI-powered visualization. See your renovations come to life instantly!
              </p>
            </div>
            {selectedSuggestions.length > 0 && (
              <div className="bg-muted/50 rounded-xl p-4 max-w-md mx-auto">
                <p className="text-sm font-semibold mb-3 flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  Selected Renovations
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {selectedSuggestions.slice(0, 3).map((suggestion) => (
                    <Badge key={suggestion.id} variant="secondary" className="text-xs py-1.5 px-3">
                      {suggestion.suggestion}
                    </Badge>
                  ))}
                  {selectedSuggestions.length > 3 && (
                    <Badge variant="outline" className="text-xs py-1.5 px-3">
                      +{selectedSuggestions.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>
            )}
            <Button 
              onClick={generateRenovationImage}
              disabled={isGenerating || !uploadedImage}
              size="lg"
              className="w-full max-w-md bg-gradient-primary hover:opacity-90 text-white shadow-glow transition-all duration-300 hover:scale-[1.02]"
            >
              {isGenerating ? (
                <>
                  <Sparkles className="w-5 h-5 mr-2 animate-spin" />
                  Creating Your Vision...
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5 mr-2" />
                  Generate AI Preview
                </>
              )}
            </Button>
            {!uploadedImage && (
              <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Upload a room photo first to generate preview
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-6 animate-fade-in">
            <div className="rounded-xl overflow-hidden shadow-lg border">
              <ImageComparisonSlider
                beforeImage={uploadedImage}
                afterImage={generatedImage}
                beforeLabel="Original"
                afterLabel="AI Renovated"
              />
            </div>
            <div className="flex gap-3">
              <Button onClick={downloadImage} variant="outline" size="lg" className="flex-1 hover-lift">
                <Download className="w-5 h-5 mr-2" />
                Download Result
              </Button>
              <Button onClick={() => setGeneratedImage(null)} size="lg" className="flex-1 bg-gradient-primary hover:opacity-90">
                <Sparkles className="w-5 h-5 mr-2" />
                Regenerate
              </Button>
            </div>
            {generationPrompt && (
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-xs text-muted-foreground">
                  <span className="font-semibold">AI Prompt:</span> "{generationPrompt}"
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

import React, { useState } from 'react';
import { Wand2, Download, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { RenovationSuggestion } from '@/data/renovationSuggestions';
import { WallColorCustomizer } from './WallColorCustomizer';

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
  imageProvider = 'HUGGINGFACE',
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
  const [flooring, setFlooring] = useState({ type: 'none', name: 'Original' });
  const [tile, setTile] = useState({ type: 'none', name: 'Original' });

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
        ? `Transform this room by applying ONLY these changes while keeping the room layout, furniture positions, and architecture intact: ${suggestions.join(', ')}. Wall colors: ${Object.values(wallColors).map(w => w.name).join(', ')}. Flooring: ${flooring.name}. Tiles: ${tile.name}. IMPORTANT: Preserve the original room structure, lighting, and perspective. Only modify the specified elements. Keep the same camera angle and composition.`
        : `Enhance this room with modern improvements while maintaining its original layout and structure. Apply these colors: ${Object.values(wallColors).map(w => w.name).join(', ')} to walls. Use ${flooring.name} flooring and ${tile.name} tiles. Keep all furniture positions and room architecture unchanged. Preserve lighting and perspective.`;
      
      console.log('Generating room renovation preview with img2img...');
      
      const { data, error } = await supabase.functions.invoke('generate-image-v2', {
        body: {
          prompt: editingPrompt,
          originalImage: imageBase64,
          selectedProvider: imageProvider,
          selectedModel: imageModel,
          width: 1024,
          height: 1024,
          // Control how much the image should change (0.3-0.8 range)
          // Lower = more faithful to original, Higher = more creative changes
          strength: 0.5 // Balanced preservation and transformation
        }
      });

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
      setGenerationPrompt(data.prompt || prompt);
      console.log('Image generated successfully');
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
    <Card className="shadow-soft">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wand2 className="w-5 h-5 text-primary" />
          AI Renovation Preview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="preview" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="colors">Wall Colors</TabsTrigger>
          </TabsList>
          
          <TabsContent value="preview" className="space-y-4">
        {!generatedImage ? (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-sage flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="font-medium mb-2">Generate Your Dream Room</h3>
              <p className="text-sm text-muted-foreground mb-4">
                See how your selected renovations will look using AI
              </p>
              {selectedSuggestions.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-medium mb-2">Will include:</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedSuggestions.slice(0, 3).map((suggestion) => (
                      <Badge key={suggestion.id} variant="outline" className="text-xs">
                        {suggestion.suggestion}
                      </Badge>
                    ))}
                    {selectedSuggestions.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{selectedSuggestions.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}
              <Button 
                onClick={generateRenovationImage}
                disabled={isGenerating}
                className="w-full"
                variant="default"
              >
                {isGenerating ? (
                  <>
                    <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4 mr-2" />
                    Generate Preview
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 animate-fade-in">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium mb-2">Before</p>
                <img 
                  src={uploadedImage} 
                  alt="Original Room" 
                  className="w-full rounded-lg shadow-soft"
                />
              </div>
              <div>
                <p className="text-sm font-medium mb-2">After (AI Renovation)</p>
                <img
                  src={generatedImage} 
                  alt="AI Edited Renovation Preview" 
                  className="w-full rounded-lg shadow-soft hover:shadow-warm transition-shadow duration-300"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={downloadImage} variant="outline" className="flex-1">
                <Download className="w-4 h-4 mr-2" />
                Download After
              </Button>
              <Button onClick={() => setGeneratedImage(null)} variant="secondary" className="flex-1">
                Generate New
              </Button>
            </div>
            {generationPrompt && (
              <p className="text-xs text-muted-foreground italic">
                "{generationPrompt}"
              </p>
            )}
          </div>
        )}
          </TabsContent>
          
          <TabsContent value="colors" className="space-y-4">
            <WallColorCustomizer
              onWallColorsChange={handleWallColorsChange}
              wallColors={wallColors}
              onFlooringChange={setFlooring}
              flooring={flooring}
              onTileChange={setTile}
              tile={tile}
            />
            <div className="p-4 bg-muted/50 rounded-lg border">
              <p className="text-sm text-muted-foreground">
                💡 <strong>Tip:</strong> Customize walls, flooring, and tiles, then generate your renovation preview to see the complete transformation!
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Wand2, DollarSign, Clock, Sparkles, Loader2, Package } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface CustomRenovationPromptProps {
  onAddCustomRenovation: (prompt: string, cost: number, time: number) => void;
  analysisProvider?: string;
}

interface AIEstimate {
  estimatedCost: number;
  estimatedTime: number;
  materials: Array<{
    name: string;
    quantity: string;
    estimatedPrice: number;
  }>;
  breakdown: string;
}

export const CustomRenovationPrompt: React.FC<CustomRenovationPromptProps> = ({
  onAddCustomRenovation,
  analysisProvider = 'LOVABLE'
}) => {
  const [prompt, setPrompt] = useState('');
  const [estimatedCost, setEstimatedCost] = useState<number>(0);
  const [estimatedTime, setEstimatedTime] = useState<number>(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiEstimate, setAiEstimate] = useState<AIEstimate | null>(null);
  const [showManualInput, setShowManualInput] = useState(false);

  const analyzeWithAI = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a renovation description first');
      return;
    }

    setIsAnalyzing(true);
    setAiEstimate(null);

    try {
      const { data, error } = await supabase.functions.invoke('analyze-custom-renovation', {
        body: {
          prompt: prompt.trim(),
          provider: analysisProvider
        }
      });

      if (error) throw error;

      if (data && data.estimatedCost && data.estimatedTime) {
        setAiEstimate(data);
        setEstimatedCost(data.estimatedCost);
        setEstimatedTime(data.estimatedTime);
        toast.success('AI analysis complete!');
      } else {
        throw new Error('Invalid response from AI');
      }
    } catch (error) {
      console.error('AI analysis error:', error);
      toast.error('AI analysis failed. Please enter estimates manually.');
      setShowManualInput(true);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = () => {
    if (!prompt.trim()) {
      toast.error('Please enter a renovation description');
      return;
    }
    if (estimatedCost <= 0) {
      toast.error('Please get AI estimate or enter cost manually');
      return;
    }
    if (estimatedTime <= 0) {
      toast.error('Please get AI estimate or enter time manually');
      return;
    }

    onAddCustomRenovation(prompt.trim(), estimatedCost, estimatedTime);
    
    // Reset form
    setPrompt('');
    setEstimatedCost(0);
    setEstimatedTime(0);
    setAiEstimate(null);
    setShowManualInput(false);
  };

  return (
    <Card className="shadow-soft border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wand2 className="w-5 h-5 text-primary" />
          Custom Renovation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="custom-prompt">Describe Your Renovation Idea</Label>
          <Textarea
            id="custom-prompt"
            placeholder="E.g., Install modern LED strip lighting under kitchen cabinets with color-changing options"
            value={prompt}
            onChange={(e) => {
              setPrompt(e.target.value);
              setAiEstimate(null);
              setEstimatedCost(0);
              setEstimatedTime(0);
            }}
            className="min-h-[100px] resize-none"
          />
          <p className="text-xs text-muted-foreground">
            Describe what you want to renovate. Our AI will analyze materials, cost, and time.
          </p>
        </div>

        {/* AI Analysis Button */}
        <Button
          onClick={analyzeWithAI}
          variant="outline"
          className="w-full"
          disabled={isAnalyzing || !prompt.trim()}
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Analyzing with AI...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Get AI Estimate
            </>
          )}
        </Button>

        {/* AI Estimate Results */}
        {aiEstimate && (
          <div className="p-4 bg-primary/5 rounded-lg border border-primary/20 space-y-3 animate-fade-in">
            <h4 className="font-semibold flex items-center gap-2 text-primary">
              <Sparkles className="w-4 h-4" />
              AI Estimate
            </h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-green-500" />
                <div>
                  <p className="text-xs text-muted-foreground">Estimated Cost</p>
                  <p className="font-bold text-lg">₹{aiEstimate.estimatedCost.toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-500" />
                <div>
                  <p className="text-xs text-muted-foreground">Estimated Time</p>
                  <p className="font-bold text-lg">{aiEstimate.estimatedTime} days</p>
                </div>
              </div>
            </div>

            {/* Materials List */}
            {aiEstimate.materials && aiEstimate.materials.length > 0 && (
              <div className="space-y-2">
                <h5 className="text-sm font-medium flex items-center gap-1">
                  <Package className="w-3 h-3" />
                  Materials Needed
                </h5>
                <div className="space-y-1">
                  {aiEstimate.materials.map((material, index) => (
                    <div key={index} className="flex justify-between text-sm py-1 border-b border-border/50 last:border-0">
                      <span className="text-muted-foreground">
                        {material.name} ({material.quantity})
                      </span>
                      <span className="font-medium">₹{material.estimatedPrice.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Breakdown */}
            {aiEstimate.breakdown && (
              <p className="text-xs text-muted-foreground italic">
                {aiEstimate.breakdown}
              </p>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowManualInput(!showManualInput)}
              className="text-xs"
            >
              {showManualInput ? 'Hide' : 'Adjust'} manually
            </Button>
          </div>
        )}

        {/* Manual Input (shown when AI fails or user wants to adjust) */}
        {(showManualInput || (!aiEstimate && (estimatedCost > 0 || estimatedTime > 0))) && (
          <div className="grid grid-cols-2 gap-4 animate-fade-in">
            <div className="space-y-2">
              <Label htmlFor="custom-cost" className="flex items-center gap-1">
                <DollarSign className="w-3 h-3" />
                Cost (₹)
              </Label>
              <Input
                id="custom-cost"
                type="number"
                min="0"
                value={estimatedCost || ''}
                onChange={(e) => setEstimatedCost(parseInt(e.target.value) || 0)}
                placeholder="Enter cost"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="custom-time" className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Time (days)
              </Label>
              <Input
                id="custom-time"
                type="number"
                min="0"
                value={estimatedTime || ''}
                onChange={(e) => setEstimatedTime(parseInt(e.target.value) || 0)}
                placeholder="Enter days"
              />
            </div>
          </div>
        )}

        <Button
          onClick={handleSubmit}
          className="w-full"
          variant="default"
          disabled={!prompt.trim() || estimatedCost <= 0 || estimatedTime <= 0}
        >
          <Wand2 className="w-4 h-4 mr-2" />
          Add Custom Renovation
        </Button>
      </CardContent>
    </Card>
  );
};

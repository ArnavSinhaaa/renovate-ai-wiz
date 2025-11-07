import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Wand2, DollarSign, Clock } from 'lucide-react';

interface CustomRenovationPromptProps {
  onAddCustomRenovation: (prompt: string, cost: number, time: number) => void;
}

export const CustomRenovationPrompt: React.FC<CustomRenovationPromptProps> = ({
  onAddCustomRenovation
}) => {
  const [prompt, setPrompt] = useState('');
  const [estimatedCost, setEstimatedCost] = useState<number>(0);
  const [estimatedTime, setEstimatedTime] = useState<number>(0);

  const handleSubmit = () => {
    if (!prompt.trim()) {
      alert('Please enter a renovation description');
      return;
    }
    if (estimatedCost <= 0) {
      alert('Please enter a valid estimated cost');
      return;
    }
    if (estimatedTime <= 0) {
      alert('Please enter a valid estimated time');
      return;
    }

    onAddCustomRenovation(prompt.trim(), estimatedCost, estimatedTime);
    
    // Reset form
    setPrompt('');
    setEstimatedCost(0);
    setEstimatedTime(0);
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
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-[100px] resize-none"
          />
          <p className="text-xs text-muted-foreground">
            Describe what you want to renovate or improve. Be as detailed as possible.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="custom-cost" className="flex items-center gap-1">
              <DollarSign className="w-3 h-3" />
              Estimated Cost (₹)
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
              Estimated Time (days)
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

        <Button
          onClick={handleSubmit}
          className="w-full"
          variant="default"
        >
          <Wand2 className="w-4 h-4 mr-2" />
          Add Custom Renovation
        </Button>
      </CardContent>
    </Card>
  );
};

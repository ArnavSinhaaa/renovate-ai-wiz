import React, { useState } from 'react';
import { Settings, Zap, AlertCircle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface AIProvider {
  id: string;
  name: string;
  models: string[];
  freeLimit: number;
  rateLimit: number;
  status: 'available' | 'rate_limited' | 'out_of_service';
  description: string;
}

const AI_PROVIDERS: AIProvider[] = [
  {
    id: 'LOVABLE',
    name: 'Lovable AI',
    models: ['google/gemini-2.5-flash', 'google/gemini-2.5-pro'],
    freeLimit: 50,
    rateLimit: 5,
    status: 'available',
    description: 'Built-in AI gateway with Gemini - Recommended'
  },
  {
    id: 'GOOGLE',
    name: 'Google Gemini',
    models: ['gemini-2.0-flash-exp', 'gemini-1.5-flash-latest', 'gemini-1.5-pro-latest'],
    freeLimit: 1500,
    rateLimit: 15,
    status: 'available',
    description: 'Google\'s latest Gemini models - Best for detailed room analysis'
  },
  {
    id: 'OPENAI',
    name: 'OpenAI GPT-4',
    models: ['gpt-4o-mini', 'gpt-4o'],
    freeLimit: 200,
    rateLimit: 10,
    status: 'available',
    description: 'OpenAI vision models - Excellent for object detection'
  },
  {
    id: 'GROQ',
    name: 'Groq',
    models: ['llama-3.2-90b-vision-preview', 'llava-v1.5-7b-4096-preview'],
    freeLimit: 100,
    rateLimit: 30,
    status: 'available',
    description: 'Fast inference with Llama vision models'
  }
];

const IMAGE_PROVIDERS: AIProvider[] = [
  {
    id: 'LOVABLE',
    name: 'Lovable AI',
    models: ['google/gemini-2.5-flash-image'],
    freeLimit: 30,
    rateLimit: 3,
    status: 'available',
    description: 'Built-in image editing via Lovable gateway - ⭐ Recommended for image generation'
  },
  {
    id: 'REPLICATE',
    name: 'Replicate',
    models: ['black-forest-labs/flux-schnell', 'stability-ai/sdxl'],
    freeLimit: 50,
    rateLimit: 5,
    status: 'available',
    description: 'High-quality img2img with FLUX - Good for transformations'
  },
  {
    id: 'HUGGINGFACE',
    name: 'Hugging Face',
    models: ['black-forest-labs/FLUX.1-schnell', 'black-forest-labs/FLUX.1-dev', 'stabilityai/stable-diffusion-xl-base-1.0'],
    freeLimit: 100,
    rateLimit: 10,
    status: 'available',
    description: 'Free FLUX models - Limited img2img support'
  },
  {
    id: 'STABILITY',
    name: 'Stability AI',
    models: ['stable-diffusion-xl-1024-v1-0', 'stable-diffusion-v1-6'],
    freeLimit: 25,
    rateLimit: 5,
    status: 'available',
    description: 'SDXL models - Text-to-image only (no editing)'
  }
];

interface Props {
  type: 'analysis' | 'generation';
  selectedProvider: string;
  selectedModel: string;
  onProviderChange: (provider: string) => void;
  onModelChange: (model: string) => void;
  providerStatus?: { [key: string]: string };
}

export const AIProviderSelector: React.FC<Props> = ({
  type,
  selectedProvider,
  selectedModel,
  onProviderChange,
  onModelChange,
  providerStatus = {}
}) => {
  const [showDetails, setShowDetails] = useState(false);
  
  const providers = type === 'analysis' ? AI_PROVIDERS : IMAGE_PROVIDERS;
  const currentProvider = providers.find(p => p.id === selectedProvider);
  const currentStatus = providerStatus[selectedProvider] || 'available';

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'rate_limited':
        return <AlertCircle className="w-4 h-4 text-orange-500" />;
      case 'out_of_service':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Zap className="w-4 h-4 text-blue-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <Badge variant="secondary" className="text-green-700 bg-green-100">Available</Badge>;
      case 'rate_limited':
        return <Badge variant="secondary" className="text-orange-700 bg-orange-100">Rate Limited</Badge>;
      case 'out_of_service':
        return <Badge variant="secondary" className="text-red-700 bg-red-100">Out of Service</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <Card className="shadow-soft">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-primary" />
            AI Provider Settings
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? 'Hide Details' : 'Show Details'}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              {type === 'analysis' ? 'Analysis Provider' : 'Image Provider'}
            </label>
            <Select value={selectedProvider} onValueChange={onProviderChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {providers.map((provider) => (
                  <SelectItem key={provider.id} value={provider.id}>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(providerStatus[provider.id] || 'available')}
                      {provider.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Model</label>
            <Select value={selectedModel} onValueChange={onModelChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {currentProvider?.models.map((model) => (
                  <SelectItem key={model} value={model}>
                    {model}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {currentProvider && (
          <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-2">
              {getStatusIcon(currentStatus)}
              <span className="font-medium">{currentProvider.name}</span>
              {getStatusBadge(currentStatus)}
            </div>
            <div className="text-sm text-muted-foreground">
              {currentProvider.freeLimit} free/day
            </div>
          </div>
        )}

        {currentStatus === 'rate_limited' && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Rate limit exceeded for {currentProvider?.name}. Try switching to another provider or wait before retrying.
            </AlertDescription>
          </Alert>
        )}

        {currentStatus === 'out_of_service' && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {currentProvider?.name} is currently out of service. API key might be missing or invalid.
            </AlertDescription>
          </Alert>
        )}

        {showDetails && currentProvider && (
          <div className="space-y-3 p-4 bg-muted/20 rounded-lg border">
            <h4 className="font-medium">Provider Details</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Free Limit:</span>
                <span className="ml-2 font-medium">{currentProvider.freeLimit}/day</span>
              </div>
              <div>
                <span className="text-muted-foreground">Rate Limit:</span>
                <span className="ml-2 font-medium">{currentProvider.rateLimit}/min</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              {currentProvider.description}
            </p>
            <div>
              <span className="text-sm font-medium">Available Models:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {currentProvider.models.map((model) => (
                  <Badge key={model} variant="outline" className="text-xs">
                    {model}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
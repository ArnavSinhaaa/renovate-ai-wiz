import React from 'react';
import { Cpu, Sparkles, Zap, Brain, Bot } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

export interface AIOption {
  id: string;
  name: string;
  icon: React.ReactNode;
  models: string[];
  description: string;
  badge?: string;
}

export const ANALYSIS_PROVIDERS: AIOption[] = [
  {
    id: 'LOVABLE',
    name: 'Lovable AI',
    icon: <Sparkles className="w-4 h-4 text-purple-500" />,
    models: ['google/gemini-2.5-flash', 'google/gemini-2.5-pro'],
    description: 'Built-in gateway',
    badge: 'Recommended'
  },
  {
    id: 'GOOGLE',
    name: 'Google Gemini',
    icon: <Zap className="w-4 h-4 text-blue-500" />,
    models: ['gemini-2.5-flash', 'gemini-2.5-pro', 'gemini-3-pro-preview'],
    description: 'Best for analysis'
  },
  {
    id: 'DEEPSEEK',
    name: 'DeepSeek',
    icon: <Brain className="w-4 h-4 text-cyan-500" />,
    models: ['deepseek-chat', 'deepseek-reasoner'],
    description: 'Advanced reasoning',
    badge: 'New'
  },
  {
    id: 'OPENAI',
    name: 'OpenAI GPT-4',
    icon: <Bot className="w-4 h-4 text-green-500" />,
    models: ['gpt-4o-mini', 'gpt-4o'],
    description: 'Powerful vision'
  },
  {
    id: 'GROQ',
    name: 'Groq',
    icon: <Cpu className="w-4 h-4 text-orange-500" />,
    models: ['llama-3.2-90b-vision-preview', 'llava-v1.5-7b-4096-preview'],
    description: 'Fast inference'
  }
];

export const IMAGE_PROVIDERS: AIOption[] = [
  {
    id: 'LOVABLE',
    name: 'Lovable AI',
    icon: <Sparkles className="w-4 h-4 text-purple-500" />,
    models: ['google/gemini-2.5-flash-image-preview'],
    description: 'Image editing',
    badge: 'Recommended'
  },
  {
    id: 'OPENAI',
    name: 'OpenAI',
    icon: <Bot className="w-4 h-4 text-green-500" />,
    models: ['gpt-image-1', 'dall-e-3'],
    description: 'High quality'
  },
  {
    id: 'HUGGINGFACE',
    name: 'Hugging Face',
    icon: <Cpu className="w-4 h-4 text-yellow-500" />,
    models: ['black-forest-labs/FLUX.1-schnell', 'black-forest-labs/FLUX.1-dev'],
    description: 'Free FLUX models'
  },
  {
    id: 'REPLICATE',
    name: 'Replicate',
    icon: <Zap className="w-4 h-4 text-blue-500" />,
    models: ['black-forest-labs/flux-schnell', 'stability-ai/sdxl'],
    description: 'img2img support'
  },
  {
    id: 'STABILITY',
    name: 'Stability AI',
    icon: <Brain className="w-4 h-4 text-indigo-500" />,
    models: ['stable-diffusion-xl-1024-v1-0'],
    description: 'Text-to-image'
  }
];

interface InlineModelSelectorProps {
  type: 'analysis' | 'image';
  selectedProvider: string;
  selectedModel: string;
  onProviderChange: (provider: string) => void;
  onModelChange: (model: string) => void;
  compact?: boolean;
  label?: string;
}

export const InlineModelSelector: React.FC<InlineModelSelectorProps> = ({
  type,
  selectedProvider,
  selectedModel,
  onProviderChange,
  onModelChange,
  compact = false,
  label
}) => {
  const providers = type === 'analysis' ? ANALYSIS_PROVIDERS : IMAGE_PROVIDERS;
  const currentProvider = providers.find(p => p.id === selectedProvider);

  const handleProviderChange = (providerId: string) => {
    const provider = providers.find(p => p.id === providerId);
    onProviderChange(providerId);
    if (provider && provider.models.length > 0) {
      onModelChange(provider.models[0]);
    }
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        {label && <span className="text-xs text-muted-foreground whitespace-nowrap">{label}:</span>}
        <Select value={selectedProvider} onValueChange={handleProviderChange}>
          <SelectTrigger className="h-8 text-xs w-[130px] bg-background/50">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {providers.map((provider) => (
              <SelectItem key={provider.id} value={provider.id}>
                <div className="flex items-center gap-1.5">
                  {provider.icon}
                  <span className="text-xs">{provider.name}</span>
                  {provider.badge && (
                    <Badge variant="secondary" className="text-[10px] px-1 py-0 h-4">
                      {provider.badge}
                    </Badge>
                  )}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3 p-3 bg-muted/30 rounded-lg border border-border/50">
      <div className="flex-1 space-y-1.5">
        {label && <label className="text-xs font-medium text-muted-foreground">{label}</label>}
        <Select value={selectedProvider} onValueChange={handleProviderChange}>
          <SelectTrigger className="h-9 bg-background">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {providers.map((provider) => (
              <SelectItem key={provider.id} value={provider.id}>
                <div className="flex items-center gap-2">
                  {provider.icon}
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-medium">{provider.name}</span>
                    <span className="text-xs text-muted-foreground">{provider.description}</span>
                  </div>
                  {provider.badge && (
                    <Badge variant="secondary" className="ml-auto text-[10px]">
                      {provider.badge}
                    </Badge>
                  )}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex-1 space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground">Model</label>
        <Select value={selectedModel} onValueChange={onModelChange}>
          <SelectTrigger className="h-9 bg-background">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {currentProvider?.models.map((model) => (
              <SelectItem key={model} value={model}>
                <span className="text-sm">{model}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

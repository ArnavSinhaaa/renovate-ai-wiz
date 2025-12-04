import React from 'react';
import { Cpu, Sparkles, Zap, Brain, Bot, Star, Clock, DollarSign, Award } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export interface AIOption {
  id: string;
  name: string;
  icon: React.ReactNode;
  defaultModel: string;
  description: string;
  badge?: string;
  ratings: {
    cost: 1 | 2 | 3 | 4 | 5; // 1 = expensive, 5 = cheap
    speed: 1 | 2 | 3 | 4 | 5; // 1 = slow, 5 = fast
    quality: 1 | 2 | 3 | 4 | 5; // 1 = low, 5 = high
  };
}

export const ANALYSIS_PROVIDERS: AIOption[] = [
  {
    id: 'LOVABLE',
    name: 'Fixfy AI',
    icon: <Sparkles className="w-4 h-4 text-primary" />,
    defaultModel: 'google/gemini-2.5-flash',
    description: 'Our optimized model',
    badge: 'Recommended',
    ratings: { cost: 5, speed: 5, quality: 4 }
  },
  {
    id: 'GOOGLE',
    name: 'Google Gemini',
    icon: <Zap className="w-4 h-4 text-blue-500" />,
    defaultModel: 'gemini-2.5-flash',
    description: 'Best for analysis',
    ratings: { cost: 4, speed: 4, quality: 5 }
  },
  {
    id: 'DEEPSEEK',
    name: 'DeepSeek',
    icon: <Brain className="w-4 h-4 text-cyan-500" />,
    defaultModel: 'deepseek-chat',
    description: 'Advanced reasoning',
    badge: 'New',
    ratings: { cost: 5, speed: 3, quality: 4 }
  },
  {
    id: 'OPENAI',
    name: 'OpenAI GPT-4',
    icon: <Bot className="w-4 h-4 text-green-500" />,
    defaultModel: 'gpt-4o-mini',
    description: 'Powerful vision',
    ratings: { cost: 2, speed: 3, quality: 5 }
  },
  {
    id: 'GROQ',
    name: 'Groq',
    icon: <Cpu className="w-4 h-4 text-orange-500" />,
    defaultModel: 'llama-3.2-90b-vision-preview',
    description: 'Fast inference',
    ratings: { cost: 4, speed: 5, quality: 3 }
  }
];

export const IMAGE_PROVIDERS: AIOption[] = [
  {
    id: 'LOVABLE',
    name: 'Fixfy AI',
    icon: <Sparkles className="w-4 h-4 text-primary" />,
    defaultModel: 'google/gemini-2.5-flash-image-preview',
    description: 'Image editing',
    badge: 'Recommended',
    ratings: { cost: 5, speed: 4, quality: 4 }
  },
  {
    id: 'OPENAI',
    name: 'OpenAI',
    icon: <Bot className="w-4 h-4 text-green-500" />,
    defaultModel: 'gpt-image-1',
    description: 'High quality',
    ratings: { cost: 1, speed: 2, quality: 5 }
  },
  {
    id: 'HUGGINGFACE',
    name: 'Hugging Face',
    icon: <Cpu className="w-4 h-4 text-yellow-500" />,
    defaultModel: 'black-forest-labs/FLUX.1-schnell',
    description: 'Free FLUX models',
    ratings: { cost: 5, speed: 5, quality: 3 }
  },
  {
    id: 'REPLICATE',
    name: 'Replicate',
    icon: <Zap className="w-4 h-4 text-blue-500" />,
    defaultModel: 'black-forest-labs/flux-schnell',
    description: 'img2img support',
    ratings: { cost: 3, speed: 3, quality: 4 }
  },
  {
    id: 'STABILITY',
    name: 'Stability AI',
    icon: <Brain className="w-4 h-4 text-indigo-500" />,
    defaultModel: 'stable-diffusion-xl-1024-v1-0',
    description: 'Text-to-image',
    ratings: { cost: 3, speed: 3, quality: 4 }
  }
];

// Rating bar component
const RatingBar: React.FC<{ value: number; max?: number; color: string }> = ({ value, max = 5, color }) => (
  <div className="flex gap-0.5">
    {Array.from({ length: max }).map((_, i) => (
      <div
        key={i}
        className={`w-1.5 h-3 rounded-sm ${i < value ? color : 'bg-muted'}`}
      />
    ))}
  </div>
);

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
    if (provider) {
      onModelChange(provider.defaultModel);
    }
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        {label && <span className="text-xs text-muted-foreground whitespace-nowrap">{label}:</span>}
        <Select value={selectedProvider} onValueChange={handleProviderChange}>
          <SelectTrigger className="h-8 text-xs w-[140px] bg-background/50">
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
    <TooltipProvider>
      <div className="space-y-3">
        {label && <label className="text-xs font-medium text-muted-foreground">{label}</label>}
        
        <Select value={selectedProvider} onValueChange={handleProviderChange}>
          <SelectTrigger className="h-auto py-3 bg-background">
            <SelectValue>
              {currentProvider && (
                <div className="flex items-center gap-3">
                  {currentProvider.icon}
                  <div className="flex flex-col items-start text-left">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{currentProvider.name}</span>
                      {currentProvider.badge && (
                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                          {currentProvider.badge}
                        </Badge>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">{currentProvider.description}</span>
                  </div>
                </div>
              )}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="w-[320px]">
            {providers.map((provider) => (
              <SelectItem key={provider.id} value={provider.id} className="py-3">
                <div className="flex items-start gap-3 w-full">
                  <div className="mt-0.5">{provider.icon}</div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{provider.name}</span>
                      {provider.badge && (
                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                          {provider.badge}
                        </Badge>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground block">{provider.description}</span>
                    
                    {/* Ratings */}
                    <div className="flex items-center gap-4 pt-1">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center gap-1.5">
                            <DollarSign className="w-3 h-3 text-green-500" />
                            <RatingBar value={provider.ratings.cost} color="bg-green-500" />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="bottom">
                          <p className="text-xs">Cost: {provider.ratings.cost === 5 ? 'Free/Very Cheap' : provider.ratings.cost >= 3 ? 'Affordable' : 'Expensive'}</p>
                        </TooltipContent>
                      </Tooltip>
                      
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3 h-3 text-blue-500" />
                            <RatingBar value={provider.ratings.speed} color="bg-blue-500" />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="bottom">
                          <p className="text-xs">Speed: {provider.ratings.speed >= 4 ? 'Very Fast' : provider.ratings.speed >= 2 ? 'Moderate' : 'Slow'}</p>
                        </TooltipContent>
                      </Tooltip>
                      
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center gap-1.5">
                            <Award className="w-3 h-3 text-amber-500" />
                            <RatingBar value={provider.ratings.quality} color="bg-amber-500" />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="bottom">
                          <p className="text-xs">Quality: {provider.ratings.quality >= 4 ? 'Excellent' : provider.ratings.quality >= 2 ? 'Good' : 'Basic'}</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Current selection summary with ratings */}
        {currentProvider && (
          <div className="flex items-center justify-between px-3 py-2 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1">
                <DollarSign className="w-3 h-3 text-green-500" />
                <span className="text-muted-foreground">Cost</span>
                <RatingBar value={currentProvider.ratings.cost} color="bg-green-500" />
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-blue-500" />
                <span className="text-muted-foreground">Speed</span>
                <RatingBar value={currentProvider.ratings.speed} color="bg-blue-500" />
              </div>
              <div className="flex items-center gap-1">
                <Award className="w-3 h-3 text-amber-500" />
                <span className="text-muted-foreground">Quality</span>
                <RatingBar value={currentProvider.ratings.quality} color="bg-amber-500" />
              </div>
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
};

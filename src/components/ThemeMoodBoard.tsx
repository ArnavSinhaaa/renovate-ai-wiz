import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, ArrowRight } from 'lucide-react';

interface ThemeMoodBoardProps {
  selectedTheme: string;
}

interface MoodBoardData {
  title: string;
  description: string;
  beforeColors: string[];
  afterColors: string[];
  beforeElements: string[];
  afterElements: string[];
  keyTransformations: string[];
  aesthetic: string;
}

const themeMoodBoards: Record<string, MoodBoardData> = {
  general: {
    title: "Modern Refresh",
    description: "Clean, timeless updates that work for any space",
    beforeColors: ["#8B7355", "#D4C4B0", "#696969", "#F5F5DC"],
    afterColors: ["#FFFFFF", "#E8E4E1", "#2C3E50", "#D4AF37"],
    beforeElements: ["Cluttered surfaces", "Dated furniture", "Poor lighting", "Mismatched decor"],
    afterElements: ["Minimalist layout", "Modern pieces", "Layered lighting", "Cohesive styling"],
    keyTransformations: ["Declutter & organize", "Neutral base colors", "Statement lighting", "Quality over quantity"],
    aesthetic: "Timeless Elegance"
  },
  girls: {
    title: "Dreamy Sanctuary",
    description: "Soft, sophisticated feminine retreat",
    beforeColors: ["#D3D3D3", "#FFFFFF", "#8B4513", "#696969"],
    afterColors: ["#FFB6C1", "#E6E6FA", "#DDA0DD", "#F5E6E8"],
    beforeElements: ["Plain walls", "Basic furniture", "No personality", "Harsh lighting"],
    afterElements: ["Accent wallpaper", "Velvet textures", "Fairy lights", "Vanity setup"],
    keyTransformations: ["Blush pink accents", "Gold hardware", "Floral patterns", "Cozy textiles"],
    aesthetic: "Romantic & Chic"
  },
  boys: {
    title: "Adventure Zone",
    description: "Bold, energetic space for creativity and play",
    beforeColors: ["#FFFFFF", "#D3D3D3", "#8B4513", "#F5F5DC"],
    afterColors: ["#1E3A5F", "#2E8B57", "#FF6B35", "#4A4A4A"],
    beforeElements: ["Boring walls", "Basic bed", "No storage", "Generic decor"],
    afterElements: ["Themed murals", "Loft bed", "Sports displays", "Adventure maps"],
    keyTransformations: ["Bold accent walls", "Industrial touches", "Display shelving", "Activity zones"],
    aesthetic: "Bold & Adventurous"
  },
  coder: {
    title: "Tech Command Center",
    description: "Optimized workspace for maximum productivity",
    beforeColors: ["#FFFFFF", "#D3D3D3", "#8B4513", "#FFFAF0"],
    afterColors: ["#1A1A2E", "#16213E", "#0F3460", "#00FF88"],
    beforeElements: ["Messy desk", "Poor ergonomics", "Cable chaos", "Bad lighting"],
    afterElements: ["Multi-monitor setup", "RGB lighting", "Cable management", "Ergonomic chair"],
    keyTransformations: ["Dark theme aesthetic", "Ambient LED strips", "Floating shelves", "Smart home integration"],
    aesthetic: "Cyberpunk Minimal"
  },
  gamer: {
    title: "Gaming Paradise",
    description: "Immersive entertainment battlestation",
    beforeColors: ["#FFFFFF", "#D3D3D3", "#696969", "#F0F0F0"],
    afterColors: ["#0D0D0D", "#7B2CBF", "#E94560", "#00D9FF"],
    beforeElements: ["Basic setup", "No ambiance", "Uncomfortable seating", "Plain walls"],
    afterElements: ["RGB everything", "Gaming chair", "Acoustic panels", "LED wall art"],
    keyTransformations: ["Neon accent lighting", "Sound dampening", "Display collectibles", "Streaming setup"],
    aesthetic: "Neon Arcade"
  },
  minimalist: {
    title: "Zen Simplicity",
    description: "Less is more - curated calm",
    beforeColors: ["#8B7355", "#D4C4B0", "#696969", "#DAA520"],
    afterColors: ["#FFFFFF", "#F5F5F5", "#2C2C2C", "#C4A77D"],
    beforeElements: ["Visual clutter", "Too much furniture", "Busy patterns", "Random objects"],
    afterElements: ["Empty space", "Hidden storage", "Single focal point", "Natural materials"],
    keyTransformations: ["Remove 50% of items", "Monochromatic palette", "Quality essentials only", "Negative space"],
    aesthetic: "Scandinavian Calm"
  },
  bohemian: {
    title: "Free Spirit Oasis",
    description: "Eclectic, worldly, and warmly layered",
    beforeColors: ["#FFFFFF", "#D3D3D3", "#696969", "#F5F5DC"],
    afterColors: ["#C19A6B", "#8B4513", "#CD853F", "#228B22"],
    beforeElements: ["Plain surfaces", "Matching furniture", "No texture", "Cold feel"],
    afterElements: ["Layered textiles", "Plants everywhere", "Global artifacts", "Macramé & rattan"],
    keyTransformations: ["Mix patterns boldly", "Add plants", "Vintage finds", "Warm earth tones"],
    aesthetic: "Global Wanderer"
  },
  luxury: {
    title: "Opulent Haven",
    description: "Hotel-worthy sophistication at home",
    beforeColors: ["#FFFFFF", "#D3D3D3", "#696969", "#F5F5DC"],
    afterColors: ["#1C1C1C", "#D4AF37", "#4A0E4E", "#C0C0C0"],
    beforeElements: ["Builder-grade finishes", "Basic lighting", "No drama", "Flat surfaces"],
    afterElements: ["Marble accents", "Crystal chandelier", "Velvet upholstery", "Art collection"],
    keyTransformations: ["Metalllic accents", "Statement furniture", "Dramatic lighting", "High-end materials"],
    aesthetic: "Art Deco Glamour"
  }
};

export const ThemeMoodBoard: React.FC<ThemeMoodBoardProps> = ({ selectedTheme }) => {
  const moodBoard = themeMoodBoards[selectedTheme] || themeMoodBoards.general;

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            {moodBoard.title}
          </CardTitle>
          <Badge variant="secondary" className="text-xs">
            {moodBoard.aesthetic}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">{moodBoard.description}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Before/After Color Palettes */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Before</p>
            <div className="flex gap-1 h-8 rounded-lg overflow-hidden shadow-inner">
              {moodBoard.beforeColors.map((color, i) => (
                <div
                  key={i}
                  className="flex-1 transition-transform hover:scale-105"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">After</p>
            <div className="flex gap-1 h-8 rounded-lg overflow-hidden shadow-inner ring-2 ring-primary/20">
              {moodBoard.afterColors.map((color, i) => (
                <div
                  key={i}
                  className="flex-1 transition-transform hover:scale-105"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Transformation Visual */}
        <div className="grid grid-cols-[1fr_auto_1fr] gap-3 items-center py-2">
          <div className="bg-muted/50 rounded-lg p-3 space-y-1.5">
            <p className="text-xs font-semibold text-muted-foreground mb-2">Current State</p>
            {moodBoard.beforeElements.map((element, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-destructive/60" />
                <span className="text-xs text-muted-foreground">{element}</span>
              </div>
            ))}
          </div>
          
          <div className="flex flex-col items-center gap-1">
            <ArrowRight className="h-5 w-5 text-primary animate-pulse" />
            <span className="text-[10px] text-muted-foreground">Transform</span>
          </div>
          
          <div className="bg-primary/5 rounded-lg p-3 space-y-1.5 ring-1 ring-primary/20">
            <p className="text-xs font-semibold text-primary mb-2">Dream Result</p>
            {moodBoard.afterElements.map((element, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                <span className="text-xs text-foreground">{element}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Key Transformations */}
        <div className="pt-2 border-t border-border/50">
          <p className="text-xs font-medium text-muted-foreground mb-2">Key Transformations</p>
          <div className="flex flex-wrap gap-1.5">
            {moodBoard.keyTransformations.map((item, i) => (
              <Badge 
                key={i} 
                variant="outline" 
                className="text-xs bg-background/50 hover:bg-primary/10 transition-colors"
              >
                {item}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

import React, { useState } from 'react';
import { Palette, Save, Share2, Copy, RotateCcw, Square, Layers } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { WallSelector, WallSide } from './WallSelector';

interface WallColor {
  name: string;
  hex: string;
}

const PRESET_COLORS: WallColor[] = [
  { name: 'Pure White', hex: '#FFFFFF' },
  { name: 'Cream', hex: '#FFFDD0' },
  { name: 'Light Beige', hex: '#F5F5DC' },
  { name: 'Soft Gray', hex: '#D3D3D3' },
  { name: 'Sky Blue', hex: '#87CEEB' },
  { name: 'Mint Green', hex: '#98FB98' },
  { name: 'Lavender', hex: '#E6E6FA' },
  { name: 'Peach', hex: '#FFDAB9' },
  { name: 'Light Yellow', hex: '#FFFFE0' },
  { name: 'Coral', hex: '#FF7F50' },
  { name: 'Sage Green', hex: '#B2AC88' },
  { name: 'Dusty Rose', hex: '#DCAE96' },
];

interface WallColors {
  left: { color: string; name: string };
  right: { color: string; name: string };
  front: { color: string; name: string };
}

export interface FlooringOption {
  type: string;
  name: string;
  imageUrl?: string;
}

interface WallColorCustomizerProps {
  roomType?: string;
  onWallColorsChange: (colors: WallColors) => void;
  wallColors: WallColors;
  onFlooringChange: (flooring: FlooringOption) => void;
  flooring: FlooringOption;
  onTileChange: (tile: FlooringOption) => void;
  tile: FlooringOption;
}

const FLOORING_OPTIONS: FlooringOption[] = [
  { type: 'wood', name: 'Oak Hardwood' },
  { type: 'wood', name: 'Walnut Engineered' },
  { type: 'wood', name: 'Bamboo Flooring' },
  { type: 'laminate', name: 'Light Laminate' },
  { type: 'laminate', name: 'Dark Laminate' },
  { type: 'vinyl', name: 'Luxury Vinyl Plank' },
  { type: 'vinyl', name: 'Stone-look Vinyl' },
  { type: 'tile', name: 'Porcelain Tile' },
  { type: 'tile', name: 'Ceramic Tile' },
  { type: 'marble', name: 'White Marble' },
  { type: 'marble', name: 'Black Marble' },
  { type: 'granite', name: 'Granite Tile' },
];

const TILE_OPTIONS: FlooringOption[] = [
  { type: 'ceramic', name: 'White Ceramic Tile' },
  { type: 'ceramic', name: 'Beige Ceramic Tile' },
  { type: 'ceramic', name: 'Gray Ceramic Tile' },
  { type: 'porcelain', name: 'Polished Porcelain' },
  { type: 'porcelain', name: 'Matte Porcelain' },
  { type: 'mosaic', name: 'Glass Mosaic' },
  { type: 'mosaic', name: 'Stone Mosaic' },
  { type: 'subway', name: 'White Subway Tile' },
  { type: 'subway', name: 'Colored Subway Tile' },
  { type: 'marble', name: 'Marble Tile' },
  { type: 'granite', name: 'Granite Tile' },
  { type: 'natural', name: 'Natural Stone' },
];

// Helper function to get visual pattern for flooring
const getFlooringPattern = (type: string, name: string): React.CSSProperties => {
  const patterns: Record<string, React.CSSProperties> = {
    'Oak Hardwood': {
      background: 'linear-gradient(90deg, #d4a574 0%, #c9955e 50%, #d4a574 100%)',
      backgroundSize: '40px 100%',
      boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.1)',
    },
    'Walnut Engineered': {
      background: 'linear-gradient(90deg, #5d4037 0%, #4e342e 50%, #5d4037 100%)',
      backgroundSize: '40px 100%',
      boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.2)',
    },
    'Bamboo Flooring': {
      background: 'linear-gradient(90deg, #e8d5a9 0%, #d4c4a0 50%, #e8d5a9 100%)',
      backgroundSize: '35px 100%',
      boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.1)',
    },
    'Light Laminate': {
      background: 'linear-gradient(90deg, #f5deb3 0%, #e8d4a2 50%, #f5deb3 100%)',
      backgroundSize: '45px 100%',
    },
    'Dark Laminate': {
      background: 'linear-gradient(90deg, #3e2723 0%, #2b1b17 50%, #3e2723 100%)',
      backgroundSize: '45px 100%',
    },
    'Luxury Vinyl Plank': {
      background: 'linear-gradient(90deg, #a0826d 0%, #8b6f5a 50%, #a0826d 100%)',
      backgroundSize: '50px 100%',
    },
    'Stone-look Vinyl': {
      background: 'radial-gradient(circle at 20% 50%, #9e9e9e 0%, #757575 50%, #616161 100%)',
    },
    'Porcelain Tile': {
      background: 'linear-gradient(to right, #e0e0e0 0%, #e0e0e0 48%, #bdbdbd 48%, #bdbdbd 52%, #e0e0e0 52%, #e0e0e0 100%)',
      backgroundSize: '100px 100px',
    },
    'Ceramic Tile': {
      background: 'linear-gradient(to right, #f5f5f5 0%, #f5f5f5 48%, #e0e0e0 48%, #e0e0e0 52%, #f5f5f5 52%, #f5f5f5 100%)',
      backgroundSize: '100px 100px',
    },
    'White Marble': {
      background: 'linear-gradient(135deg, #ffffff 25%, #f5f5f5 25%, #f5f5f5 50%, #ffffff 50%, #ffffff 75%, #f5f5f5 75%, #f5f5f5)',
      backgroundSize: '40px 40px',
    },
    'Black Marble': {
      background: 'radial-gradient(circle at 30% 40%, #424242 0%, #212121 60%, #000000 100%)',
    },
    'Granite Tile': {
      background: 'radial-gradient(circle at 20% 30%, #8d6e63 0%, #6d4c41 30%, #5d4037 60%, #4e342e 100%)',
    },
  };
  return patterns[name] || { background: '#e0e0e0' };
};

// Helper function to get visual pattern for tiles
const getTilePattern = (type: string, name: string): React.CSSProperties => {
  const patterns: Record<string, React.CSSProperties> = {
    'White Ceramic Tile': {
      background: `
        linear-gradient(to right, #ffffff 0%, #ffffff 48%, #e0e0e0 48%, #e0e0e0 52%, #ffffff 52%, #ffffff 100%),
        linear-gradient(to bottom, #ffffff 0%, #ffffff 48%, #e0e0e0 48%, #e0e0e0 52%, #ffffff 52%, #ffffff 100%)
      `,
      backgroundSize: '60px 60px',
    },
    'Beige Ceramic Tile': {
      background: `
        linear-gradient(to right, #f5f5dc 0%, #f5f5dc 48%, #d4c4a0 48%, #d4c4a0 52%, #f5f5dc 52%, #f5f5dc 100%),
        linear-gradient(to bottom, #f5f5dc 0%, #f5f5dc 48%, #d4c4a0 48%, #d4c4a0 52%, #f5f5dc 52%, #f5f5dc 100%)
      `,
      backgroundSize: '60px 60px',
    },
    'Gray Ceramic Tile': {
      background: `
        linear-gradient(to right, #9e9e9e 0%, #9e9e9e 48%, #757575 48%, #757575 52%, #9e9e9e 52%, #9e9e9e 100%),
        linear-gradient(to bottom, #9e9e9e 0%, #9e9e9e 48%, #757575 48%, #757575 52%, #9e9e9e 52%, #9e9e9e 100%)
      `,
      backgroundSize: '60px 60px',
    },
    'Polished Porcelain': {
      background: 'linear-gradient(135deg, #fafafa 25%, #f5f5f5 25%, #f5f5f5 50%, #fafafa 50%, #fafafa 75%, #f5f5f5 75%, #f5f5f5)',
      backgroundSize: '80px 80px',
      boxShadow: 'inset 0 0 10px rgba(255,255,255,0.5)',
    },
    'Matte Porcelain': {
      background: 'linear-gradient(to right, #e8e8e8 0%, #e8e8e8 48%, #d0d0d0 48%, #d0d0d0 52%, #e8e8e8 52%, #e8e8e8 100%)',
      backgroundSize: '70px 70px',
    },
    'Glass Mosaic': {
      background: `
        radial-gradient(circle at 25% 25%, #64b5f6 0%, #42a5f5 40%, transparent 40%),
        radial-gradient(circle at 75% 25%, #81c784 0%, #66bb6a 40%, transparent 40%),
        radial-gradient(circle at 25% 75%, #ffb74d 0%, #ffa726 40%, transparent 40%),
        radial-gradient(circle at 75% 75%, #e57373 0%, #ef5350 40%, transparent 40%),
        #f5f5f5
      `,
      backgroundSize: '40px 40px',
    },
    'Stone Mosaic': {
      background: `
        radial-gradient(circle at 30% 30%, #8d6e63 0%, #6d4c41 45%, transparent 45%),
        radial-gradient(circle at 70% 30%, #a1887f 0%, #8d6e63 45%, transparent 45%),
        radial-gradient(circle at 30% 70%, #bcaaa4 0%, #a1887f 45%, transparent 45%),
        radial-gradient(circle at 70% 70%, #d7ccc8 0%, #bcaaa4 45%, transparent 45%),
        #efebe9
      `,
      backgroundSize: '35px 35px',
    },
    'White Subway Tile': {
      background: `
        repeating-linear-gradient(
          0deg,
          #ffffff,
          #ffffff 30px,
          #e0e0e0 30px,
          #e0e0e0 32px
        ),
        repeating-linear-gradient(
          90deg,
          #ffffff,
          #ffffff 60px,
          #e0e0e0 60px,
          #e0e0e0 62px
        )
      `,
      backgroundSize: '62px 32px',
    },
    'Colored Subway Tile': {
      background: `
        repeating-linear-gradient(
          0deg,
          #90caf9,
          #90caf9 30px,
          #64b5f6 30px,
          #64b5f6 32px
        ),
        repeating-linear-gradient(
          90deg,
          #90caf9,
          #90caf9 60px,
          #64b5f6 60px,
          #64b5f6 62px
        )
      `,
      backgroundSize: '62px 32px',
    },
    'Marble Tile': {
      background: 'radial-gradient(circle at 35% 45%, #ffffff 0%, #f5f5f5 30%, #e8e8e8 60%, #d4d4d4 100%)',
      boxShadow: 'inset 0 0 20px rgba(0,0,0,0.1)',
    },
    'Granite Tile': {
      background: `
        radial-gradient(circle at 20% 30%, #8d6e63 0px, transparent 12px),
        radial-gradient(circle at 60% 20%, #a1887f 0px, transparent 10px),
        radial-gradient(circle at 80% 60%, #6d4c41 0px, transparent 15px),
        radial-gradient(circle at 40% 70%, #5d4037 0px, transparent 8px),
        #795548
      `,
      backgroundSize: '100px 100px',
    },
    'Natural Stone': {
      background: `
        radial-gradient(ellipse at 25% 35%, #bcaaa4 0%, transparent 60%),
        radial-gradient(ellipse at 75% 25%, #a1887f 0%, transparent 50%),
        radial-gradient(ellipse at 60% 75%, #8d6e63 0%, transparent 55%),
        #d7ccc8
      `,
    },
  };
  return patterns[name] || { background: '#e0e0e0' };
};

export const WallColorCustomizer: React.FC<WallColorCustomizerProps> = ({
  roomType = 'Room',
  onWallColorsChange,
  wallColors,
  onFlooringChange,
  flooring,
  onTileChange,
  tile,
}) => {
  const [selectedWall, setSelectedWall] = useState<WallSide>('front');
  const [customColor, setCustomColor] = useState('#FFFFFF');
  const [savedSchemes, setSavedSchemes] = useState<{ room: string; colors: WallColors }[]>([]);

  const currentWallColor = wallColors[selectedWall];
  
  const wallColorsForSelector = {
    left: wallColors.left.color,
    right: wallColors.right.color,
    front: wallColors.front.color,
  };

  const handlePresetSelect = (color: WallColor) => {
    const updatedColors = {
      ...wallColors,
      [selectedWall]: { color: color.hex, name: color.name }
    };
    onWallColorsChange(updatedColors);
    toast.success(`${color.name} applied to ${selectedWall} wall`);
  };

  const handleCustomColorApply = () => {
    const updatedColors = {
      ...wallColors,
      [selectedWall]: { color: customColor, name: 'Custom Color' }
    };
    onWallColorsChange(updatedColors);
    toast.success(`Custom color applied to ${selectedWall} wall`);
  };

  const handleSaveScheme = () => {
    const newScheme = {
      room: roomType,
      colors: wallColors,
    };
    setSavedSchemes([...savedSchemes, newScheme]);
    toast.success(`Wall color scheme saved for ${roomType}`);
  };

  const handleShareScheme = () => {
    const shareText = `Wall Colors for ${roomType}:\nLeft: ${wallColors.left.name} (${wallColors.left.color})\nRight: ${wallColors.right.name} (${wallColors.right.color})\nFront: ${wallColors.front.name} (${wallColors.front.color})`;
    if (navigator.share) {
      navigator.share({
        title: 'Wall Color Scheme',
        text: shareText,
      }).catch(() => {
        navigator.clipboard.writeText(shareText);
        toast.success('Color scheme copied to clipboard');
      });
    } else {
      navigator.clipboard.writeText(shareText);
      toast.success('Color scheme copied to clipboard');
    }
  };

  const handleCopyColor = () => {
    navigator.clipboard.writeText(currentWallColor.color);
    toast.success(`${selectedWall} wall color ${currentWallColor.color} copied!`);
  };

  const handleResetWall = () => {
    const updatedColors = {
      ...wallColors,
      [selectedWall]: { color: '#FFFFFF', name: 'Pure White' }
    };
    onWallColorsChange(updatedColors);
    toast.success(`${selectedWall} wall reset to white`);
  };

  const handleResetAll = () => {
    const resetColors: WallColors = {
      left: { color: '#FFFFFF', name: 'Pure White' },
      right: { color: '#FFFFFF', name: 'Pure White' },
      front: { color: '#FFFFFF', name: 'Pure White' },
    };
    onWallColorsChange(resetColors);
    toast.success('All walls reset to white');
  };

  return (
    <Card className="shadow-soft">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 justify-between">
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-primary" />
            Material Customizer - {roomType}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleResetAll}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset All
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="walls" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="walls">
              <Palette className="w-4 h-4 mr-2" />
              Walls
            </TabsTrigger>
            <TabsTrigger value="flooring">
              <Layers className="w-4 h-4 mr-2" />
              Flooring
            </TabsTrigger>
            <TabsTrigger value="tiles">
              <Square className="w-4 h-4 mr-2" />
              Tiles
            </TabsTrigger>
          </TabsList>

          <TabsContent value="walls" className="space-y-6 mt-6">
        {/* Wall Selector */}
        <WallSelector
          selectedWall={selectedWall}
          onWallSelect={setSelectedWall}
          wallColors={wallColorsForSelector}
        />

        {/* Current Wall Color */}
        <div className="p-4 border rounded-lg bg-card">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium">Current {selectedWall} Wall:</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetWall}
            >
              <RotateCcw className="w-3 h-3 mr-1" />
              Reset
            </Button>
          </div>
          <div className="flex items-center gap-3">
            <div
              className="w-16 h-16 rounded-lg border-2 border-border shadow-sm"
              style={{ backgroundColor: currentWallColor.color }}
            />
            <div className="flex-1">
              <p className="font-medium">{currentWallColor.name}</p>
              <p className="text-sm text-muted-foreground">{currentWallColor.color}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopyColor}
            >
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Preset Colors */}
        <div>
          <p className="text-sm font-medium mb-3">Popular Color Palettes:</p>
          <div className="grid grid-cols-4 gap-2">
            {PRESET_COLORS.map((color) => (
              <button
                key={color.hex}
                onClick={() => handlePresetSelect(color)}
                className="group relative"
              >
                <div
                  className={`w-full aspect-square rounded-lg border-2 transition-all hover:scale-105 ${
                    currentWallColor.color === color.hex
                      ? 'border-primary ring-2 ring-primary/20'
                      : 'border-border hover:border-primary/50'
                  }`}
                  style={{ backgroundColor: color.hex }}
                />
                <p className="text-xs mt-1 text-center truncate">{color.name}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Color Picker */}
        <div className="space-y-2">
          <p className="text-sm font-medium">Custom Color:</p>
          <div className="flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start">
                  <div
                    className="w-6 h-6 rounded border mr-2"
                    style={{ backgroundColor: customColor }}
                  />
                  {customColor}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64">
                <div className="space-y-3">
                  <label className="text-sm font-medium">Pick a color:</label>
                  <input
                    type="color"
                    value={customColor}
                    onChange={(e) => setCustomColor(e.target.value)}
                    className="w-full h-32 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={customColor}
                    onChange={(e) => setCustomColor(e.target.value)}
                    className="w-full px-3 py-2 border rounded text-sm"
                    placeholder="#FFFFFF"
                  />
                  <Button
                    onClick={handleCustomColorApply}
                    className="w-full"
                    size="sm"
                  >
                    Apply Color
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button
            onClick={handleSaveScheme}
            variant="outline"
            className="flex-1"
            size="sm"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Scheme
          </Button>
          <Button
            onClick={handleShareScheme}
            variant="outline"
            className="flex-1"
            size="sm"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>

        {/* All Walls Summary */}
        <div className="space-y-2">
          <p className="text-sm font-medium">All Walls Summary:</p>
          <div className="grid grid-cols-3 gap-2">
            {(['left', 'right', 'front'] as WallSide[]).map((wall) => (
              <div
                key={wall}
                className="p-2 border rounded-lg text-center hover:border-primary/50 transition-colors cursor-pointer"
                onClick={() => setSelectedWall(wall)}
              >
                <div
                  className="w-full h-12 rounded border mb-1"
                  style={{ backgroundColor: wallColors[wall].color }}
                />
                <p className="text-xs font-medium capitalize">{wall}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {wallColors[wall].name}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Saved Schemes */}
        {savedSchemes.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Saved Color Schemes:</p>
            <div className="space-y-3">
              {savedSchemes.map((scheme, idx) => (
                <div
                  key={idx}
                  className="p-3 border rounded-lg space-y-2"
                >
                  <p className="text-sm font-medium">{scheme.room}</p>
                  <div className="grid grid-cols-3 gap-2">
                    {(['left', 'right', 'front'] as WallSide[]).map((wall) => (
                      <div key={wall} className="text-center">
                        <div
                          className="w-full h-8 rounded border mb-1"
                          style={{ backgroundColor: scheme.colors[wall].color }}
                        />
                        <p className="text-xs capitalize">{wall}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
          </TabsContent>

          <TabsContent value="flooring" className="space-y-6 mt-6">
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium">Selected Flooring:</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    onFlooringChange({ type: 'none', name: 'Original' });
                    toast.success('Flooring reset to original');
                  }}
                >
                  <RotateCcw className="w-3 h-3 mr-1" />
                  Reset
                </Button>
              </div>
              <div className="p-4 border rounded-lg bg-card mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-lg border-2 border-border shadow-sm bg-muted flex items-center justify-center">
                    <Layers className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{flooring.name}</p>
                    <p className="text-sm text-muted-foreground capitalize">{flooring.type}</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium mb-3">Flooring Options:</p>
              <div className="grid grid-cols-2 gap-3">
                {FLOORING_OPTIONS.map((option) => (
                  <button
                    key={option.name}
                    onClick={() => {
                      onFlooringChange(option);
                      toast.success(`${option.name} selected`);
                    }}
                    className={`group border rounded-lg overflow-hidden transition-all hover:border-primary/50 hover:shadow-md ${
                      flooring.name === option.name
                        ? 'border-primary ring-2 ring-primary/20'
                        : 'border-border'
                    }`}
                  >
                    <div 
                      className="w-full h-24 transition-transform group-hover:scale-105"
                      style={getFlooringPattern(option.type, option.name)}
                    />
                    <div className="p-3 bg-card text-left">
                      <p className="font-medium text-sm mb-1">{option.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">{option.type}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="tiles" className="space-y-6 mt-6">
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium">Selected Tile:</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    onTileChange({ type: 'none', name: 'Original' });
                    toast.success('Tile reset to original');
                  }}
                >
                  <RotateCcw className="w-3 h-3 mr-1" />
                  Reset
                </Button>
              </div>
              <div className="p-4 border rounded-lg bg-card mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-lg border-2 border-border shadow-sm bg-muted flex items-center justify-center">
                    <Square className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{tile.name}</p>
                    <p className="text-sm text-muted-foreground capitalize">{tile.type}</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium mb-3">Tile Options:</p>
              <div className="grid grid-cols-2 gap-3">
                {TILE_OPTIONS.map((option) => (
                  <button
                    key={option.name}
                    onClick={() => {
                      onTileChange(option);
                      toast.success(`${option.name} selected`);
                    }}
                    className={`group border rounded-lg overflow-hidden transition-all hover:border-primary/50 hover:shadow-md ${
                      tile.name === option.name
                        ? 'border-primary ring-2 ring-primary/20'
                        : 'border-border'
                    }`}
                  >
                    <div 
                      className="w-full h-24 transition-transform group-hover:scale-105"
                      style={getTilePattern(option.type, option.name)}
                    />
                    <div className="p-3 bg-card text-left">
                      <p className="font-medium text-sm mb-1">{option.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">{option.type}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

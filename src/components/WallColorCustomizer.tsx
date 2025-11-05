import React, { useState, useEffect } from 'react';
import { Palette, Save, Share2, Copy, RotateCcw, Square, Layers, DollarSign, Ruler } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { WallSelector, WallSide } from './WallSelector';

interface WallColor { 
  name: string; 
  hex: string; 
}

interface WallColors { 
  left: { color: string; name: string }; 
  right: { color: string; name: string }; 
  front: { color: string; name: string } 
}

export interface FlooringOption { 
  type: string; 
  name: string; 
  cost: number; 
}

export interface MaterialCosts { 
  walls: number; 
  flooring: number; 
  tiles: number; 
  falseCeiling: number;
  total: number; 
}

export interface FalseCeilingOption {
  type: string;
  name: string;
  cost: number;
}

interface Props {
  wallColors: WallColors;
  onWallColorsChange: (colors: WallColors) => void;
  flooring: FlooringOption;
  onFlooringChange: (f: FlooringOption) => void;
  tile: FlooringOption;
  onTileChange: (t: FlooringOption) => void;
  falseCeiling?: FalseCeilingOption;
  onFalseCeilingChange?: (fc: FalseCeilingOption) => void;
  onMaterialCostsChange?: (costs: MaterialCosts) => void;
}

const PRESET_COLORS: WallColor[] = [
  { name: 'Pure White', hex: '#FFFFFF' },
  { name: 'Cream', hex: '#FFFDD0' },
  { name: 'Soft Gray', hex: '#D3D3D3' },
  { name: 'Light Blue', hex: '#ADD8E6' },
  { name: 'Mint Green', hex: '#98FF98' },
  { name: 'Peach', hex: '#FFDAB9' },
  { name: 'Lavender', hex: '#E6E6FA' },
  { name: 'Beige', hex: '#F5F5DC' },
];

const FLOORING_OPTIONS: FlooringOption[] = [
  { type: 'none', name: 'None (Original)', cost: 0 },
  { type: 'laminate', name: 'Laminate', cost: 200 },
  { type: 'hardwood', name: 'Hardwood', cost: 500 },
  { type: 'vinyl', name: 'Vinyl', cost: 150 },
  { type: 'carpet', name: 'Carpet', cost: 180 },
];

const TILE_OPTIONS: FlooringOption[] = [
  { type: 'none', name: 'None (Original)', cost: 0 },
  { type: 'ceramic', name: 'Ceramic', cost: 300 },
  { type: 'porcelain', name: 'Porcelain', cost: 450 },
  { type: 'marble', name: 'Marble', cost: 800 },
  { type: 'granite', name: 'Granite', cost: 600 },
];

const FALSE_CEILING_OPTIONS: FalseCeilingOption[] = [
  { type: 'none', name: 'None', cost: 0 },
  { type: 'gypsum', name: 'Gypsum Board', cost: 250 },
  { type: 'pop', name: 'POP (Plaster of Paris)', cost: 200 },
  { type: 'pvc', name: 'PVC Panels', cost: 150 },
  { type: 'wooden', name: 'Wooden Panels', cost: 600 },
  { type: 'metal', name: 'Metal Grid', cost: 350 },
  { type: 'fiber', name: 'Fiber Panels', cost: 180 },
];

export const WallColorCustomizer: React.FC<Props> = ({
  wallColors, 
  onWallColorsChange,
  flooring, 
  onFlooringChange,
  tile, 
  onTileChange,
  falseCeiling = { type: 'none', name: 'None', cost: 0 },
  onFalseCeilingChange,
  onMaterialCostsChange
}) => {
  const [selectedWall, setSelectedWall] = useState<WallSide>('front');
  const [customColor, setCustomColor] = useState<string>('#FFFFFF');
  const [customColorName, setCustomColorName] = useState<string>('');
  const [roomLength, setRoomLength] = useState<number>(5);
  const [roomBreadth, setRoomBreadth] = useState<number>(4);
  const [roomHeight, setRoomHeight] = useState<number>(3);
  const [tilePct, setTilePct] = useState<number>(30);
  
  // Additional measurements for better calculations
  const [numDoors, setNumDoors] = useState<number>(1);
  const [numWindows, setNumWindows] = useState<number>(2);
  const [doorArea, setDoorArea] = useState<number>(2);
  const [windowArea, setWindowArea] = useState<number>(1.5);
  const [paintCoats, setPaintCoats] = useState<number>(2);
  const [wastage, setWastage] = useState<number>(10);

  // Area & cost calculations
  const floorArea = roomLength * roomBreadth;
  const grossWallArea = 2 * (roomLength + roomBreadth) * roomHeight;
  const deductArea = (numDoors * doorArea) + (numWindows * windowArea);
  const netWallArea = grossWallArea - deductArea;
  const paintableArea = netWallArea * paintCoats * (1 + wastage / 100);
  const tileArea = (floorArea * tilePct) / 100;
  
  const PAINT_RATE = 80;
  const paintCost = paintableArea * PAINT_RATE;
  const flooringCost = (flooring.cost || 0) * (floorArea - tileArea);
  const tileCost = (tile.cost || 0) * tileArea;
  const falseCeilingCost = (falseCeiling?.cost || 0) * floorArea;
  const total = paintCost + flooringCost + tileCost + falseCeilingCost;

  useEffect(() => {
    onMaterialCostsChange?.({ 
      walls: paintCost, 
      flooring: flooringCost, 
      tiles: tileCost,
      falseCeiling: falseCeilingCost,
      total 
    });
  }, [paintCost, flooringCost, tileCost, falseCeilingCost, total]);

  const handleCustomColorApply = () => {
    if (customColorName.trim()) {
      onWallColorsChange({
        ...wallColors,
        [selectedWall]: { name: customColorName, color: customColor }
      });
      toast.success(`Custom color "${customColorName}" applied to ${selectedWall} wall`);
    } else {
      toast.error('Please enter a color name');
    }
  };

  const handleCopyColor = (color: string) => {
    navigator.clipboard.writeText(color);
    toast.success('Color code copied!');
  };

  const handleShareColors = () => {
    const colorData = JSON.stringify(wallColors);
    navigator.clipboard.writeText(colorData);
    toast.success('Color scheme copied to clipboard!');
  };

  const handleReset = () => {
    onWallColorsChange({
      left: { color: '#FFFFFF', name: 'Pure White' },
      right: { color: '#FFFFFF', name: 'Pure White' },
      front: { color: '#FFFFFF', name: 'Pure White' }
    });
    toast.success('Colors reset to default');
  };

  return (
    <div className="space-y-6">
      {/* ========== COLOR OPTIONS SECTION ========== */}
      
      {/* Wall Selector */}
      <WallSelector
        selectedWall={selectedWall}
        onWallSelect={setSelectedWall}
        wallColors={{
          left: wallColors.left.color,
          right: wallColors.right.color,
          front: wallColors.front.color
        }}
      />

      {/* Current Wall Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Palette className="w-5 h-5" />
              {selectedWall.charAt(0).toUpperCase() + selectedWall.slice(1)} Wall
            </span>
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => handleCopyColor(wallColors[selectedWall].color)}
              >
                <Copy className="w-4 h-4 mr-1" />
                Copy
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={handleShareColors}
              >
                <Share2 className="w-4 h-4 mr-1" />
                Share
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={handleReset}
              >
                <RotateCcw className="w-4 h-4 mr-1" />
                Reset
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div 
              className="w-16 h-16 rounded-lg border-2 shadow-md" 
              style={{ backgroundColor: wallColors[selectedWall].color }}
            />
            <div>
              <p className="font-semibold text-lg">{wallColors[selectedWall].name}</p>
              <p className="text-sm text-gray-500">{wallColors[selectedWall].color}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for Color/Material Selection */}
      <Tabs defaultValue="walls">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="walls">Walls</TabsTrigger>
          <TabsTrigger value="flooring">Flooring</TabsTrigger>
          <TabsTrigger value="tiles">Tiles</TabsTrigger>
          <TabsTrigger value="ceiling">Ceiling</TabsTrigger>
        </TabsList>
        
        <TabsContent value="walls" className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            {PRESET_COLORS.map(c => (
              <Button 
                key={c.hex}
                variant="outline"
                className="justify-start h-auto py-3"
                onClick={() => onWallColorsChange({
                  ...wallColors,
                  [selectedWall]: { name: c.name, color: c.hex }
                })}
              >
                <div 
                  className="w-8 h-8 rounded border mr-2" 
                  style={{ backgroundColor: c.hex }}
                />
                {c.name}
              </Button>
            ))}
          </div>

          {/* Custom Color Picker */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Custom Color</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="colorName">Color Name</Label>
                  <Input 
                    id="colorName"
                    placeholder="e.g., Ocean Blue"
                    value={customColorName}
                    onChange={e => setCustomColorName(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="colorPicker">Pick Color</Label>
                  <div className="flex gap-2">
                    <Input 
                      id="colorPicker"
                      type="color"
                      value={customColor}
                      onChange={e => setCustomColor(e.target.value)}
                      className="w-20 h-10 cursor-pointer"
                    />
                    <Input 
                      type="text"
                      value={customColor}
                      onChange={e => setCustomColor(e.target.value)}
                      placeholder="#FFFFFF"
                      className="flex-1"
                    />
                  </div>
                </div>
                <Button 
                  onClick={handleCustomColorApply}
                  className="w-full"
                >
                  Apply Custom Color
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="flooring">
          <div className="grid grid-cols-1 gap-2">
            {FLOORING_OPTIONS.map(o => (
              <Button 
                key={o.name}
                variant={flooring.name === o.name ? "default" : "outline"}
                className="justify-between"
                onClick={() => onFlooringChange(o)}
              >
                <span>{o.name}</span>
                <span>₹{o.cost}/m²</span>
              </Button>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="tiles">
          <div className="grid grid-cols-1 gap-2">
            {TILE_OPTIONS.map(o => (
              <Button 
                key={o.name}
                variant={tile.name === o.name ? "default" : "outline"}
                className="justify-between"
                onClick={() => onTileChange(o)}
              >
                <span>{o.name}</span>
                <span>₹{o.cost}/m²</span>
              </Button>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="ceiling">
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <h4 className="font-semibold mb-2 flex items-center gap-2 text-blue-900 dark:text-blue-100">
                <Layers className="w-4 h-4" />
                False Ceiling Options
              </h4>
              <p className="text-sm text-blue-800 dark:text-blue-200 mb-3">
                Transform your space with stylish false ceiling designs. Prices are per m² of floor area.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-2">
              <Button 
                variant={falseCeiling?.type === 'none' ? "default" : "outline"}
                className="justify-between"
                onClick={() => onFalseCeilingChange?.({ type: 'none', name: 'None', cost: 0 })}
              >
                <span>No False Ceiling</span>
                <span>₹0</span>
              </Button>
              {FALSE_CEILING_OPTIONS.map(o => (
                <Button 
                  key={o.name}
                  variant={falseCeiling?.name === o.name ? "default" : "outline"}
                  className="justify-between"
                  onClick={() => onFalseCeilingChange?.(o)}
                >
                  <span>{o.name}</span>
                  <span>₹{o.cost}/m²</span>
                </Button>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* ========== CALCULATION SECTION ========== */}

      {/* Dimension Inputs */}
      <Card>
        <CardHeader>
          <CardTitle>Room Dimensions <Ruler className="inline w-5 h-5" /></CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <Label>Length (m)</Label>
              <Input type="number" value={roomLength} onChange={e=>setRoomLength(+e.target.value)} />
            </div>
            <div>
              <Label>Breadth (m)</Label>
              <Input type="number" value={roomBreadth} onChange={e=>setRoomBreadth(+e.target.value)} />
            </div>
            <div>
              <Label>Height (m)</Label>
              <Input type="number" value={roomHeight} onChange={e=>setRoomHeight(+e.target.value)} />
            </div>
            <div className="col-span-3">
              <Label>Tile Coverage (%)</Label>
              <Input type="number" value={tilePct} onChange={e=>setTilePct(+e.target.value)} />
            </div>
          </div>
          <div className="flex gap-2 mb-4">
            <Badge>Floor: {floorArea.toFixed(1)} m²</Badge>
            <Badge>Wall: {grossWallArea.toFixed(1)} m²</Badge>
            <Badge>Tile: {tileArea.toFixed(1)} m²</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Measurements Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Ruler className="w-5 h-5" />
            Advanced Measurements
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Openings & Deductions */}
          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Square className="w-4 h-4" />
              Openings & Deductions
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="doors">Number of Doors</Label>
                <Input 
                  id="doors"
                  type="number" 
                  min="0"
                  value={numDoors} 
                  onChange={e=>setNumDoors(Math.max(0, +e.target.value))} 
                />
              </div>
              <div>
                <Label htmlFor="doorArea">Door Area (m² each)</Label>
                <Input 
                  id="doorArea"
                  type="number" 
                  min="0"
                  step="0.1"
                  value={doorArea} 
                  onChange={e=>setDoorArea(Math.max(0, +e.target.value))} 
                />
              </div>
              <div>
                <Label htmlFor="windows">Number of Windows</Label>
                <Input 
                  id="windows"
                  type="number" 
                  min="0"
                  value={numWindows} 
                  onChange={e=>setNumWindows(Math.max(0, +e.target.value))} 
                />
              </div>
              <div>
                <Label htmlFor="windowArea">Window Area (m² each)</Label>
                <Input 
                  id="windowArea"
                  type="number" 
                  min="0"
                  step="0.1"
                  value={windowArea} 
                  onChange={e=>setWindowArea(Math.max(0, +e.target.value))} 
                />
              </div>
            </div>
          </div>

          {/* Paint & Coverage */}
          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Layers className="w-4 h-4" />
              Paint & Coverage
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="coats">Number of Coats</Label>
                <Input 
                  id="coats"
                  type="number" 
                  min="1"
                  max="5"
                  value={paintCoats} 
                  onChange={e=>setPaintCoats(Math.max(1, +e.target.value))} 
                />
              </div>
              <div>
                <Label htmlFor="wastage">Wastage (%)</Label>
                <Input 
                  id="wastage"
                  type="number" 
                  min="0"
                  max="50"
                  value={wastage} 
                  onChange={e=>setWastage(Math.max(0, +e.target.value))} 
                />
              </div>
            </div>
          </div>

          {/* Calculated Areas Summary */}
          <div className="border-t pt-4">
            <h4 className="font-semibold mb-3">Calculation Summary</h4>
            <div className="grid grid-cols-2 gap-2">
              <Badge variant="secondary" className="justify-between py-2">
                <span>Floor Area:</span>
                <span className="font-mono">{floorArea.toFixed(2)} m²</span>
              </Badge>
              <Badge variant="secondary" className="justify-between py-2">
                <span>Gross Wall:</span>
                <span className="font-mono">{grossWallArea.toFixed(2)} m²</span>
              </Badge>
              <Badge variant="secondary" className="justify-between py-2">
                <span>Deductions:</span>
                <span className="font-mono">{deductArea.toFixed(2)} m²</span>
              </Badge>
              <Badge variant="secondary" className="justify-between py-2">
                <span>Net Wall:</span>
                <span className="font-mono">{netWallArea.toFixed(2)} m²</span>
              </Badge>
              <Badge variant="secondary" className="justify-between py-2">
                <span>Paintable Area:</span>
                <span className="font-mono">{paintableArea.toFixed(2)} m²</span>
              </Badge>
              <Badge variant="secondary" className="justify-between py-2">
                <span>Flooring Area:</span>
                <span className="font-mono">{(floorArea - tileArea).toFixed(2)} m²</span>
              </Badge>
            </div>
            <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                <strong>Note:</strong> Paintable area includes {paintCoats} coat(s) with {wastage}% wastage allowance. 
                Openings (doors & windows) are deducted from wall area for accurate paint calculation.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Costs Display */}
      <Card>
        <CardHeader>
          <CardTitle>Material Costs <DollarSign className="inline w-5 h-5" /></CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Paint ({paintableArea.toFixed(1)} m² × ₹{PAINT_RATE})</span>
              <span>₹{paintCost.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Flooring ({(floorArea - tileArea).toFixed(1)} m² × ₹{flooring.cost})</span>
              <span>₹{flooringCost.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Tiles ({tileArea.toFixed(1)} m² × ₹{tile.cost})</span>
              <span>₹{tileCost.toLocaleString()}</span>
            </div>
            {falseCeilingCost > 0 && (
              <div className="flex justify-between">
                <span>False Ceiling ({floorArea.toFixed(1)} m² × ₹{falseCeiling?.cost})</span>
                <span>₹{falseCeilingCost.toLocaleString()}</span>
              </div>
            )}
            <hr />
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>₹{total.toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Palette } from 'lucide-react';
import { WallColorCustomizer, MaterialCosts, FalseCeilingOption } from './WallColorCustomizer';

interface WallCustomizationPanelProps {
  onMaterialCostsChange: (costs: MaterialCosts) => void;
  falseCeiling: FalseCeilingOption;
  onFalseCeilingChange: (fc: FalseCeilingOption) => void;
}

export const WallCustomizationPanel: React.FC<WallCustomizationPanelProps> = ({
  onMaterialCostsChange,
  falseCeiling,
  onFalseCeilingChange
}) => {
  const [wallColors, setWallColors] = useState({
    left: { color: '#FFFFFF', name: 'Pure White' },
    right: { color: '#FFFFFF', name: 'Pure White' },
    front: { color: '#FFFFFF', name: 'Pure White' },
  });
  const [flooring, setFlooring] = useState({ type: 'laminate', name: 'Laminate', cost: 200 });
  const [tile, setTile] = useState({ type: 'ceramic', name: 'Ceramic', cost: 300 });

  // Calculate wall status (number of changes per wall)
  const wallStatus = useMemo(() => ({
    left: wallColors.left.name !== 'Pure White' ? 1 : 0,
    right: wallColors.right.name !== 'Pure White' ? 1 : 0,
    front: wallColors.front.name !== 'Pure White' ? 1 : 0,
  }), [wallColors]);

  return (
    <Card className="shadow-md border-2 border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Palette className="w-4 h-4 text-primary" />
          </div>
          <span>Wall & Material Customization</span>
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-1">
          Pick colors and materials for each wall
        </p>
      </CardHeader>
      <CardContent>
        <WallColorCustomizer
          wallColors={wallColors}
          onWallColorsChange={setWallColors}
          flooring={flooring}
          onFlooringChange={setFlooring}
          tile={tile}
          onTileChange={setTile}
          falseCeiling={falseCeiling}
          onFalseCeilingChange={onFalseCeilingChange}
          onMaterialCostsChange={onMaterialCostsChange}
          wallStatus={wallStatus}
        />
      </CardContent>
    </Card>
  );
};

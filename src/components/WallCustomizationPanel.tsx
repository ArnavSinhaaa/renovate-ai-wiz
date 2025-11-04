import React, { useState } from 'react';
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

  return (
    <Card className="shadow-soft">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="w-5 h-5 text-primary" />
          Wall & Material Customization
        </CardTitle>
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
        />
      </CardContent>
    </Card>
  );
};
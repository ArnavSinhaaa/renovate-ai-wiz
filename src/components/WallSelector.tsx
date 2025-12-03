import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, MousePointer } from 'lucide-react';
import { cn } from '@/lib/utils';

export type WallSide = 'left' | 'right' | 'front';

interface WallColors {
  left: string;
  right: string;
  front: string;
}

interface WallSelectorProps {
  selectedWall: WallSide;
  onWallSelect: (wall: WallSide) => void;
  wallColors: WallColors;
  wallStatus?: {
    left: number;
    right: number;
    front: number;
  };
}

export const WallSelector: React.FC<WallSelectorProps> = ({
  selectedWall,
  onWallSelect,
  wallColors,
  wallStatus = { left: 0, right: 0, front: 0 },
}) => {
  const getStatusText = (changes: number) => {
    if (changes === 0) return 'No changes yet';
    return `${changes} change${changes > 1 ? 's' : ''} applied`;
  };

  return (
    <div className="space-y-3">
      {/* 3D Room Perspective View */}
      <div className="relative mx-auto group" style={{ width: '300px', height: '220px' }}>
        {/* Instruction tooltip */}
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/80 px-3 py-1.5 rounded-full opacity-80 group-hover:opacity-100 transition-opacity">
          <MousePointer className="w-3 h-3" />
          <span>Click a wall to select</span>
        </div>
        
        <svg
          viewBox="0 0 280 200"
          className="w-full h-full mt-4"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Floor */}
          <path
            d="M 40 140 L 140 180 L 240 140 L 140 100 Z"
            fill="hsl(var(--muted))"
            stroke="hsl(var(--border))"
            strokeWidth="2"
            opacity="0.5"
          />
          
          {/* Left Wall */}
          <g
            onClick={() => onWallSelect('left')}
            className="cursor-pointer"
          >
            <path
              d="M 40 20 L 40 140 L 140 180 L 140 60 Z"
              fill={wallColors.left === 'transparent' ? 'hsl(var(--muted))' : wallColors.left}
              stroke={selectedWall === 'left' ? 'hsl(var(--primary))' : 'hsl(var(--border))'}
              strokeWidth={selectedWall === 'left' ? 3 : 2}
              className="transition-all duration-200 hover:brightness-90"
            />
            {selectedWall === 'left' && (
              <path
                d="M 40 20 L 40 140 L 140 180 L 140 60 Z"
                fill="hsl(var(--primary))"
                opacity="0.15"
              />
            )}
            {/* Hover outline */}
            <path
              d="M 40 20 L 40 140 L 140 180 L 140 60 Z"
              fill="transparent"
              stroke="hsl(var(--primary))"
              strokeWidth="2"
              strokeDasharray="4 4"
              opacity="0"
              className="transition-opacity duration-200 hover:opacity-60"
            />
          </g>
          
          {/* Right Wall */}
          <g
            onClick={() => onWallSelect('right')}
            className="cursor-pointer"
          >
            <path
              d="M 240 20 L 240 140 L 140 180 L 140 60 Z"
              fill={wallColors.right === 'transparent' ? 'hsl(var(--muted))' : wallColors.right}
              stroke={selectedWall === 'right' ? 'hsl(var(--primary))' : 'hsl(var(--border))'}
              strokeWidth={selectedWall === 'right' ? 3 : 2}
              className="transition-all duration-200 hover:brightness-90"
            />
            {selectedWall === 'right' && (
              <path
                d="M 240 20 L 240 140 L 140 180 L 140 60 Z"
                fill="hsl(var(--primary))"
                opacity="0.15"
              />
            )}
            <path
              d="M 240 20 L 240 140 L 140 180 L 140 60 Z"
              fill="transparent"
              stroke="hsl(var(--primary))"
              strokeWidth="2"
              strokeDasharray="4 4"
              opacity="0"
              className="transition-opacity duration-200 hover:opacity-60"
            />
          </g>
          
          {/* Front Wall */}
          <g
            onClick={() => onWallSelect('front')}
            className="cursor-pointer"
          >
            <path
              d="M 40 20 L 240 20 L 240 140 L 40 140 Z"
              fill={wallColors.front === 'transparent' ? 'hsl(var(--muted))' : wallColors.front}
              stroke={selectedWall === 'front' ? 'hsl(var(--primary))' : 'hsl(var(--border))'}
              strokeWidth={selectedWall === 'front' ? 3 : 2}
              className="transition-all duration-200 hover:brightness-90"
            />
            {selectedWall === 'front' && (
              <path
                d="M 40 20 L 240 20 L 240 140 L 40 140 Z"
                fill="hsl(var(--primary))"
                opacity="0.15"
              />
            )}
            <path
              d="M 40 20 L 240 20 L 240 140 L 40 140 Z"
              fill="transparent"
              stroke="hsl(var(--primary))"
              strokeWidth="2"
              strokeDasharray="4 4"
              opacity="0"
              className="transition-opacity duration-200 hover:opacity-60"
            />
          </g>
          
          {/* Wall Labels */}
          <text
            x="70"
            y="90"
            fill="hsl(var(--foreground))"
            fontSize="11"
            fontWeight="600"
            className="pointer-events-none select-none"
          >
            Left
          </text>
          
          <text
            x="185"
            y="90"
            fill="hsl(var(--foreground))"
            fontSize="11"
            fontWeight="600"
            className="pointer-events-none select-none"
          >
            Right
          </text>
          
          <text
            x="125"
            y="50"
            fill="hsl(var(--foreground))"
            fontSize="11"
            fontWeight="600"
            className="pointer-events-none select-none"
          >
            Front
          </text>
        </svg>
      </div>

      {/* Wall Selection Cards with Status */}
      <div className="grid grid-cols-3 gap-2">
        {(['left', 'right', 'front'] as WallSide[]).map((wall) => {
          const isSelected = selectedWall === wall;
          const changes = wallStatus[wall];
          
          return (
            <button
              key={wall}
              onClick={() => onWallSelect(wall)}
              className={cn(
                "relative p-3 rounded-xl border-2 transition-all duration-200",
                isSelected
                  ? "border-primary bg-primary/10 shadow-md ring-2 ring-primary/20"
                  : "border-border hover:border-primary/50 hover:bg-muted/50"
              )}
            >
              {/* Color preview with connecting indicator */}
              <div className="relative">
                <div
                  className={cn(
                    "w-full h-10 rounded-lg border transition-all",
                    isSelected ? "border-primary shadow-sm" : "border-border"
                  )}
                  style={{ backgroundColor: wallColors[wall] === 'transparent' ? 'hsl(var(--muted))' : wallColors[wall] }}
                />
                {isSelected && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
              
              {/* Wall name */}
              <p className={cn(
                "text-sm font-semibold capitalize mt-2",
                isSelected ? "text-primary" : "text-foreground"
              )}>
                {wall} Wall
              </p>
              
              {/* Status indicator */}
              <p className={cn(
                "text-xs mt-0.5",
                changes > 0 ? "text-primary" : "text-muted-foreground"
              )}>
                {getStatusText(changes)}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};

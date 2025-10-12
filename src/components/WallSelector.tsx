import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
}

export const WallSelector: React.FC<WallSelectorProps> = ({
  selectedWall,
  onWallSelect,
  wallColors,
}) => {
  return (
    <div className="space-y-4">
      <div className="text-center">
        <p className="text-sm font-medium mb-2">Select Wall to Customize</p>
        <p className="text-xs text-muted-foreground">Click on any wall to change its color</p>
      </div>
      
      {/* 3D Room Perspective View */}
      <div className="relative mx-auto" style={{ width: '280px', height: '200px' }}>
        <svg
          viewBox="0 0 280 200"
          className="w-full h-full"
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
            className="cursor-pointer transition-all hover:opacity-80"
          >
            <path
              d="M 40 20 L 40 140 L 140 180 L 140 60 Z"
              fill={wallColors.left}
              stroke="hsl(var(--border))"
              strokeWidth="2"
              className={cn(
                "transition-all",
                selectedWall === 'left' && "drop-shadow-lg"
              )}
            />
            {selectedWall === 'left' && (
              <path
                d="M 40 20 L 40 140 L 140 180 L 140 60 Z"
                fill="hsl(var(--primary))"
                opacity="0.2"
                strokeWidth="3"
                stroke="hsl(var(--primary))"
              />
            )}
          </g>
          
          {/* Right Wall */}
          <g
            onClick={() => onWallSelect('right')}
            className="cursor-pointer transition-all hover:opacity-80"
          >
            <path
              d="M 240 20 L 240 140 L 140 180 L 140 60 Z"
              fill={wallColors.right}
              stroke="hsl(var(--border))"
              strokeWidth="2"
              className={cn(
                "transition-all",
                selectedWall === 'right' && "drop-shadow-lg"
              )}
            />
            {selectedWall === 'right' && (
              <path
                d="M 240 20 L 240 140 L 140 180 L 140 60 Z"
                fill="hsl(var(--primary))"
                opacity="0.2"
                strokeWidth="3"
                stroke="hsl(var(--primary))"
              />
            )}
          </g>
          
          {/* Front Wall */}
          <g
            onClick={() => onWallSelect('front')}
            className="cursor-pointer transition-all hover:opacity-80"
          >
            <path
              d="M 40 20 L 240 20 L 240 140 L 40 140 Z"
              fill={wallColors.front}
              stroke="hsl(var(--border))"
              strokeWidth="2"
              className={cn(
                "transition-all",
                selectedWall === 'front' && "drop-shadow-lg"
              )}
            />
            {selectedWall === 'front' && (
              <path
                d="M 40 20 L 240 20 L 240 140 L 40 140 Z"
                fill="hsl(var(--primary))"
                opacity="0.2"
                strokeWidth="3"
                stroke="hsl(var(--primary))"
              />
            )}
          </g>
          
          {/* Wall Labels */}
          <text
            x="70"
            y="90"
            fill="hsl(var(--foreground))"
            fontSize="12"
            fontWeight="500"
            className="pointer-events-none"
          >
            Left
          </text>
          
          <text
            x="185"
            y="90"
            fill="hsl(var(--foreground))"
            fontSize="12"
            fontWeight="500"
            className="pointer-events-none"
          >
            Right
          </text>
          
          <text
            x="125"
            y="50"
            fill="hsl(var(--foreground))"
            fontSize="12"
            fontWeight="500"
            className="pointer-events-none"
          >
            Front
          </text>
        </svg>
      </div>

      {/* Wall Selection Buttons (Alternative/Mobile-friendly) */}
      <div className="grid grid-cols-3 gap-2">
        {(['left', 'right', 'front'] as WallSide[]).map((wall) => (
          <button
            key={wall}
            onClick={() => onWallSelect(wall)}
            className={cn(
              "relative p-3 rounded-lg border-2 transition-all hover:scale-105",
              selectedWall === wall
                ? "border-primary bg-primary/10"
                : "border-border hover:border-primary/50"
            )}
          >
            <div
              className="w-full h-12 rounded border mb-2"
              style={{ backgroundColor: wallColors[wall] }}
            />
            <p className="text-xs font-medium capitalize">{wall} Wall</p>
            {selectedWall === wall && (
              <Badge className="absolute -top-2 -right-2 text-xs">
                Selected
              </Badge>
            )}
          </button>
        ))}
      </div>

      {/* Current Selection Info */}
      <Card>
        <CardContent className="p-3">
          <p className="text-xs text-muted-foreground">
            Currently editing: <span className="font-semibold capitalize text-foreground">{selectedWall} Wall</span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

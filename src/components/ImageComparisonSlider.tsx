import React from 'react';
import {
  ReactCompareSlider,
  ReactCompareSliderImage
} from 'react-compare-slider';

interface ImageComparisonSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
}

export const ImageComparisonSlider: React.FC<ImageComparisonSliderProps> = ({
  beforeImage,
  afterImage,
  beforeLabel = 'Before',
  afterLabel = 'After'
}) => {
  return (
    <div className="w-full rounded-lg overflow-hidden shadow-soft">
      <ReactCompareSlider
        itemOne={
          <ReactCompareSliderImage
            src={beforeImage}
            alt={beforeLabel}
            className="w-full h-full object-cover"
          />
        }
        itemTwo={
          <ReactCompareSliderImage
            src={afterImage}
            alt={afterLabel}
            className="w-full h-full object-cover"
          />
        }
        position={50}
        style={{
          width: '100%',
          height: '400px'
        }}
      />
      <div className="flex justify-between p-2 bg-card/50 backdrop-blur-sm">
        <span className="text-xs font-medium text-muted-foreground">{beforeLabel}</span>
        <span className="text-xs font-medium text-muted-foreground">{afterLabel}</span>
      </div>
    </div>
  );
};

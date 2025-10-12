/**
 * AdBanner component for displaying various types of advertisements
 * Supports Google AdSense, affiliate links, and custom banner ads
 */

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ExternalLink, Star } from 'lucide-react';
import GoogleAdSense from './GoogleAdSense';

interface AdBannerProps {
  /** Type of ad to display */
  type: 'adsense' | 'affiliate' | 'sponsored' | 'custom';
  /** Ad unit ID for Google AdSense */
  adUnitId?: string;
  /** Ad size for responsive display */
  size?: 'banner' | 'rectangle' | 'square' | 'skyscraper';
  /** Custom ad content for affiliate/sponsored ads */
  content?: {
    title: string;
    description: string;
    image: string;
    link: string;
    price?: string;
    rating?: number;
    badge?: string;
  };
  /** CSS classes for styling */
  className?: string;
  /** Whether to show as sponsored content */
  isSponsored?: boolean;
}

/**
 * AdBanner component for displaying advertisements
 * @param props - Component props
 * @returns JSX element containing the ad banner
 */
export const AdBanner: React.FC<AdBannerProps> = ({
  type,
  adUnitId,
  size = 'banner',
  content,
  className = '',
  isSponsored = false
}) => {
  // Size configurations for different ad types
  const sizeConfig = {
    banner: 'w-full h-32 md:h-24',
    rectangle: 'w-full h-48 md:h-40',
    square: 'w-64 h-64',
    skyscraper: 'w-48 h-96'
  };

  // Google AdSense implementation
  const renderAdSense = () => {
    if (adUnitId) {
      return (
        <GoogleAdSense
          adUnitId={adUnitId}
          adSlot={adUnitId}
          format="auto"
          className={`${sizeConfig[size]} ${className}`}
          responsive={true}
        />
      );
    }
    
    // Fallback for development/demo
    return (
      <div 
        className={`${sizeConfig[size]} ${className} bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600`}
      >
        <div className="text-center text-gray-500 dark:text-gray-400">
          <div className="text-sm font-medium mb-1">Advertisement</div>
          <div className="text-xs">Ad Unit: {adUnitId || 'adsense-123'}</div>
          <div className="text-xs">Size: {size}</div>
        </div>
      </div>
    );
  };

  // Affiliate/Sponsored content implementation
  const renderAffiliate = () => {
    if (!content) return null;

    return (
      <Card className={`${className} hover:shadow-lg transition-shadow duration-200 group`}>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <img 
                src={content.image} 
                alt={content.title}
                className="w-20 h-20 object-cover rounded-lg"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
                  {content.title}
                </h3>
                {content.badge && (
                  <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full ml-2 flex-shrink-0">
                    {content.badge}
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                {content.description}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {content.rating && (
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs font-medium">{content.rating}</span>
                    </div>
                  )}
                  {content.price && (
                    <span className="text-sm font-bold text-primary">{content.price}</span>
                  )}
                </div>
                <a 
                  href={content.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors"
                >
                  View Details
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
          {isSponsored && (
            <div className="mt-2 text-xs text-muted-foreground text-center">
              Sponsored Content
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  // Custom ad implementation
  const renderCustom = () => (
    <div className={`${sizeConfig[size]} ${className} bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center border border-primary/20`}>
      <div className="text-center">
        <div className="text-sm font-medium text-primary mb-1">Custom Ad Space</div>
        <div className="text-xs text-muted-foreground">Perfect for your brand</div>
      </div>
    </div>
  );

  // Render based on ad type
  switch (type) {
    case 'adsense':
      return renderAdSense();
    case 'affiliate':
    case 'sponsored':
      return renderAffiliate();
    case 'custom':
      return renderCustom();
    default:
      return null;
  }
};

export default AdBanner;

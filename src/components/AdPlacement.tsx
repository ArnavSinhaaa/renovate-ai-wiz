/**
 * AdPlacement component for strategic ad positioning
 * Provides different ad placement strategies throughout the application
 */

import React from 'react';
import { AdBanner } from './AdBanner';

interface AdPlacementProps {
  /** Position of the ad placement */
  position: 'header' | 'sidebar' | 'content' | 'footer' | 'between-sections' | 'floating';
  /** Ad type to display */
  adType?: 'adsense' | 'affiliate' | 'sponsored' | 'custom';
  /** Whether the ad should be visible on mobile */
  mobileVisible?: boolean;
  /** Whether the ad should be visible on desktop */
  desktopVisible?: boolean;
  /** Custom ad content for affiliate ads */
  adContent?: any;
}

/**
 * AdPlacement component for strategic ad positioning
 * @param props - Component props
 * @returns JSX element containing the ad placement
 */
export const AdPlacement: React.FC<AdPlacementProps> = ({
  position,
  adType = 'adsense',
  mobileVisible = true,
  desktopVisible = true,
  adContent
}) => {
  // Responsive visibility classes
  const visibilityClasses = [
    mobileVisible ? 'block' : 'hidden',
    desktopVisible ? 'md:block' : 'md:hidden'
  ].join(' ');

  // Position-specific configurations
  const getPositionConfig = () => {
    switch (position) {
      case 'header':
        return {
          size: 'banner' as const,
          className: 'w-full mb-4',
          adUnitId: 'ca-pub-5430259388561714'
        };
      case 'sidebar':
        return {
          size: 'skyscraper' as const,
          className: 'w-full max-w-48 mx-auto',
          adUnitId: 'ca-pub-5430259388561714'
        };
      case 'content':
        return {
          size: 'rectangle' as const,
          className: 'w-full my-6',
          adUnitId: 'ca-pub-5430259388561714'
        };
      case 'footer':
        return {
          size: 'banner' as const,
          className: 'w-full mt-8',
          adUnitId: 'ca-pub-5430259388561714'
        };
      case 'between-sections':
        return {
          size: 'banner' as const,
          className: 'w-full my-8',
          adUnitId: 'ca-pub-5430259388561714'
        };
      case 'floating':
        return {
          size: 'square' as const,
          className: 'fixed bottom-4 right-4 z-50 w-64 h-64',
          adUnitId: 'ca-pub-5430259388561714'
        };
      default:
        return {
          size: 'banner' as const,
          className: 'w-full',
          adUnitId: 'ca-pub-5430259388561714'
        };
    }
  };

  const config = getPositionConfig();

  // Sample affiliate content for renovation-related ads
  const getSampleAffiliateContent = () => ({
    title: "Premium Home Decor Collection",
    description: "Transform your space with our curated selection of modern furniture and decor items.",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&h=200&fit=crop",
    link: "https://amazon.in/home-decor",
    price: "₹2,999",
    rating: 4.5,
    badge: "Best Seller"
  });

  return (
    <div className={visibilityClasses}>
      <AdBanner
        type={adType}
        adUnitId={config.adUnitId}
        size={config.size}
        className={config.className}
        content={adContent || (adType === 'affiliate' ? getSampleAffiliateContent() : undefined)}
        isSponsored={adType === 'sponsored'}
      />
    </div>
  );
};

export default AdPlacement;

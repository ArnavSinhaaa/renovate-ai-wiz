/**
 * Google AdSense integration component
 * Handles Google AdSense ad loading and display
 */

import React, { useEffect, useRef } from 'react';

interface GoogleAdSenseProps {
  /** Ad unit ID from Google AdSense */
  adUnitId: string;
  /** Ad slot ID */
  adSlot: string;
  /** Ad format */
  format?: 'auto' | 'rectangle' | 'vertical' | 'horizontal';
  /** Ad size */
  size?: string;
  /** CSS classes */
  className?: string;
  /** Whether the ad is responsive */
  responsive?: boolean;
}

/**
 * Google AdSense component for displaying Google ads
 * @param props - Component props
 * @returns JSX element containing the Google AdSense ad
 */
export const GoogleAdSense: React.FC<GoogleAdSenseProps> = ({
  adUnitId,
  adSlot,
  format = 'auto',
  size,
  className = '',
  responsive = true
}) => {
  const adRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    // Load Google AdSense script if not already loaded
    if (typeof window !== 'undefined' && !(window as any).adsbygoogle) {
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adUnitId}`;
      script.crossOrigin = 'anonymous';
      document.head.appendChild(script);
    }

    // Initialize ad when component mounts
    if (adRef.current && (window as any).adsbygoogle) {
      try {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      } catch (error) {
        console.warn('AdSense error:', error);
      }
    }
  }, [adUnitId]);

  return (
    <div className={`adsense-container ${className}`}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={adUnitId}
        data-ad-slot={adSlot}
        data-ad-format={format}
        data-full-width-responsive={responsive.toString()}
        {...(size && { 'data-ad-size': size })}
      />
    </div>
  );
};

export default GoogleAdSense;

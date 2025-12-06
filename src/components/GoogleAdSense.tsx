/**
 * Google AdSense integration component
 * Handles Google AdSense ad loading and display
 * Deferred loading to improve initial page performance
 */

import React, { useEffect, useRef, useState } from 'react';

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
 * Uses deferred loading to avoid blocking initial render
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
  const [shouldLoad, setShouldLoad] = useState(false);

  // Defer loading until after initial render and user interaction
  useEffect(() => {
    // Use requestIdleCallback for non-blocking load, fallback to setTimeout
    const loadAds = () => setShouldLoad(true);
    
    if ('requestIdleCallback' in window) {
      const id = (window as any).requestIdleCallback(loadAds, { timeout: 3000 });
      return () => (window as any).cancelIdleCallback(id);
    } else {
      const timeout = setTimeout(loadAds, 2000);
      return () => clearTimeout(timeout);
    }
  }, []);

  useEffect(() => {
    if (!shouldLoad) return;

    // Load Google AdSense script if not already loaded
    if (typeof window !== 'undefined' && !(window as any).adsbygoogle) {
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adUnitId}`;
      script.crossOrigin = 'anonymous';
      document.head.appendChild(script);
    }

    // Initialize ad when script is ready
    const initAd = () => {
      if (adRef.current && (window as any).adsbygoogle) {
        try {
          ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
        } catch (error) {
          console.warn('AdSense error:', error);
        }
      }
    };

    // Wait for script to load before initializing
    const checkScript = setInterval(() => {
      if ((window as any).adsbygoogle) {
        initAd();
        clearInterval(checkScript);
      }
    }, 100);

    // Cleanup after 5 seconds
    const timeout = setTimeout(() => clearInterval(checkScript), 5000);

    return () => {
      clearInterval(checkScript);
      clearTimeout(timeout);
    };
  }, [shouldLoad, adUnitId]);

  // Don't render until ready to load
  if (!shouldLoad) {
    return (
      <div className={`adsense-container ${className}`}>
        <div className="bg-muted/30 animate-pulse rounded" style={{ minHeight: '90px' }} />
      </div>
    );
  }

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

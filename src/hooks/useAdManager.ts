/**
 * Custom hook for managing ads throughout the application
 * Handles ad loading, display logic, and performance optimization
 */

import { useState, useEffect, useCallback } from 'react';

interface AdConfig {
  /** Whether ads are enabled */
  enabled: boolean;
  /** Ad refresh interval in milliseconds */
  refreshInterval: number;
  /** Maximum number of ads per page */
  maxAdsPerPage: number;
  /** Ad loading delay to improve page performance */
  loadingDelay: number;
}

interface AdManagerState {
  /** Whether ads are currently loading */
  isLoading: boolean;
  /** Number of ads currently displayed */
  adCount: number;
  /** Whether the user has ad blocker enabled */
  hasAdBlocker: boolean;
  /** Ad performance metrics */
  metrics: {
    loadTime: number;
    viewCount: number;
    clickCount: number;
  };
}

const defaultConfig: AdConfig = {
  enabled: true,
  refreshInterval: 30000, // 30 seconds
  maxAdsPerPage: 5,
  loadingDelay: 1000 // 1 second
};

/**
 * Custom hook for managing ads
 * @param config - Ad configuration options
 * @returns Ad manager state and methods
 */
export const useAdManager = (config: Partial<AdConfig> = {}) => {
  const finalConfig = { ...defaultConfig, ...config };
  
  const [state, setState] = useState<AdManagerState>({
    isLoading: true,
    adCount: 0,
    hasAdBlocker: false,
    metrics: {
      loadTime: 0,
      viewCount: 0,
      clickCount: 0
    }
  });

  // Check for ad blocker
  const checkAdBlocker = useCallback(() => {
    const testAd = document.createElement('div');
    testAd.innerHTML = '&nbsp;';
    testAd.className = 'adsbox';
    testAd.style.cssText = 'position:absolute;left:-10000px;';
    document.body.appendChild(testAd);
    
    setTimeout(() => {
      const hasBlocker = testAd.offsetHeight === 0;
      setState(prev => ({ ...prev, hasAdBlocker: hasBlocker }));
      document.body.removeChild(testAd);
    }, 100);
  }, []);

  // Load ads with delay for better performance
  const loadAds = useCallback(() => {
    if (!finalConfig.enabled) return;

    setState(prev => ({ ...prev, isLoading: true }));
    
    setTimeout(() => {
      setState(prev => ({ 
        ...prev, 
        isLoading: false,
        metrics: { ...prev.metrics, loadTime: Date.now() }
      }));
    }, finalConfig.loadingDelay);
  }, [finalConfig.enabled, finalConfig.loadingDelay]);

  // Track ad view
  const trackAdView = useCallback((adId: string) => {
    setState(prev => ({
      ...prev,
      adCount: Math.min(prev.adCount + 1, finalConfig.maxAdsPerPage),
      metrics: {
        ...prev.metrics,
        viewCount: prev.metrics.viewCount + 1
      }
    }));

    // Send analytics event
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'ad_view', {
        ad_id: adId,
        page_location: window.location.href
      });
    }
  }, [finalConfig.maxAdsPerPage]);

  // Track ad click
  const trackAdClick = useCallback((adId: string) => {
    setState(prev => ({
      ...prev,
      metrics: {
        ...prev.metrics,
        clickCount: prev.metrics.clickCount + 1
      }
    }));

    // Send analytics event
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'ad_click', {
        ad_id: adId,
        page_location: window.location.href
      });
    }
  }, []);

  // Check if more ads can be displayed
  const canShowMoreAds = useCallback(() => {
    return state.adCount < finalConfig.maxAdsPerPage;
  }, [state.adCount, finalConfig.maxAdsPerPage]);

  // Initialize ad manager
  useEffect(() => {
    checkAdBlocker();
    loadAds();
  }, [checkAdBlocker, loadAds]);

  // Set up ad refresh interval
  useEffect(() => {
    if (!finalConfig.enabled || finalConfig.refreshInterval <= 0) return;

    const interval = setInterval(() => {
      loadAds();
    }, finalConfig.refreshInterval);

    return () => clearInterval(interval);
  }, [finalConfig.enabled, finalConfig.refreshInterval, loadAds]);

  return {
    ...state,
    config: finalConfig,
    loadAds,
    trackAdView,
    trackAdClick,
    canShowMoreAds
  };
};

export default useAdManager;

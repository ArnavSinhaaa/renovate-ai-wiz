/**
 * AdDemo component for testing and demonstrating ad functionality
 * This component shows all available ad types and placements
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AdBanner } from './AdBanner';
import { AdPlacement } from './AdPlacement';
import { useAdManager } from '@/hooks/useAdManager';

/**
 * AdDemo component for testing ad functionality
 * @returns JSX element containing ad demonstrations
 */
export const AdDemo: React.FC = () => {
  const adManager = useAdManager({
    enabled: true,
    maxAdsPerPage: 6,
    loadingDelay: 1000
  });

  const sampleAffiliateContent = {
    title: "Premium Home Decor Collection",
    description: "Transform your space with our curated selection of modern furniture and decor items.",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&h=200&fit=crop",
    link: "https://amazon.in/home-decor",
    price: "₹2,999",
    rating: 4.5,
    badge: "Best Seller"
  };

  const sampleSponsoredContent = {
    title: "Professional Interior Design Services",
    description: "Get expert consultation for your renovation project with our certified designers.",
    image: "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=200&h=200&fit=crop",
    link: "https://example.com/interior-design",
    price: "Free Consultation",
    rating: 4.9,
    badge: "Expert"
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Ad Integration Demo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Ad Manager Status</h3>
              <div className="text-sm text-muted-foreground">
                <p>Loading: {adManager.isLoading ? 'Yes' : 'No'}</p>
                <p>Ad Count: {adManager.adCount}</p>
                <p>Can Show More: {adManager.canShowMoreAds() ? 'Yes' : 'No'}</p>
                <p>Has Ad Blocker: {adManager.hasAdBlocker ? 'Yes' : 'No'}</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Ad Types</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Google AdSense (Demo)</h4>
                  <AdBanner
                    type="adsense"
                    adUnitId="demo-adsense-123"
                    size="rectangle"
                    className="w-full"
                  />
                </div>

                <div>
                  <h4 className="font-medium mb-2">Affiliate Ad</h4>
                  <AdBanner
                    type="affiliate"
                    content={sampleAffiliateContent}
                    size="rectangle"
                    className="w-full"
                  />
                </div>

                <div>
                  <h4 className="font-medium mb-2">Sponsored Content</h4>
                  <AdBanner
                    type="sponsored"
                    content={sampleSponsoredContent}
                    size="rectangle"
                    className="w-full"
                    isSponsored={true}
                  />
                </div>

                <div>
                  <h4 className="font-medium mb-2">Custom Ad</h4>
                  <AdBanner
                    type="custom"
                    size="rectangle"
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Ad Placements</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Header Banner</h4>
                  <AdPlacement
                    position="header"
                    adType="affiliate"
                    adContent={sampleAffiliateContent}
                  />
                </div>

                <div>
                  <h4 className="font-medium mb-2">Content Rectangle</h4>
                  <AdPlacement
                    position="content"
                    adType="sponsored"
                    adContent={sampleSponsoredContent}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Sidebar Skyscraper</h4>
                    <AdPlacement
                      position="sidebar"
                      adType="affiliate"
                      adContent={sampleAffiliateContent}
                    />
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Footer Banner</h4>
                    <AdPlacement
                      position="footer"
                      adType="custom"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Ad Sizes</h3>
              <div className="grid gap-4">
                <div>
                  <h4 className="font-medium mb-2">Banner (728x90)</h4>
                  <AdBanner
                    type="custom"
                    size="banner"
                    className="w-full"
                  />
                </div>

                <div>
                  <h4 className="font-medium mb-2">Rectangle (300x250)</h4>
                  <AdBanner
                    type="custom"
                    size="rectangle"
                    className="w-80 mx-auto"
                  />
                </div>

                <div className="flex justify-center gap-4">
                  <div>
                    <h4 className="font-medium mb-2 text-center">Square (250x250)</h4>
                    <AdBanner
                      type="custom"
                      size="square"
                    />
                  </div>

                  <div>
                    <h4 className="font-medium mb-2 text-center">Skyscraper (160x600)</h4>
                    <AdBanner
                      type="custom"
                      size="skyscraper"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdDemo;

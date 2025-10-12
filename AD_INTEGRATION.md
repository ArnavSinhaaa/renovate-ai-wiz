# Ad Integration Guide

This guide explains how to integrate and manage advertisements in the AI Home Renovation application.

## Overview

The application supports multiple types of advertisements:
- **Google AdSense** - Traditional display ads
- **Affiliate Marketing** - Commission-based product recommendations
- **Sponsored Content** - Native ads that blend with the UI
- **Custom Ads** - Your own promotional content

## Quick Start

### 1. Environment Setup

Copy the example environment file and configure your ad settings:

```bash
cp env.example .env.local
```

Edit `.env.local` with your actual ad configuration:

```env
# Enable ads
VITE_ADS_ENABLED=true

# Google AdSense (get from adsense.google.com)
VITE_ADSENSE_PUBLISHER_ID=ca-pub-your-publisher-id
VITE_ADSENSE_HEADER_UNIT=your-header-ad-unit
VITE_ADSENSE_SIDEBAR_UNIT=your-sidebar-ad-unit
VITE_ADSENSE_CONTENT_UNIT=your-content-ad-unit
VITE_ADSENSE_FOOTER_UNIT=your-footer-ad-unit

# Affiliate Marketing
VITE_AMAZON_TRACKING_ID=your-amazon-tracking-id
VITE_FLIPKART_TRACKING_ID=your-flipkart-tracking-id
VITE_IKEA_TRACKING_ID=your-ikea-tracking-id
```

### 2. Ad Placement

Ads are automatically placed in strategic locations:

- **Header Banner** - Top of the page (affiliate/sponsored)
- **Sidebar** - Right column (affiliate/AdSense)
- **Content** - Between analysis and suggestions (sponsored)
- **Footer** - Bottom of the page (custom/AdSense)

### 3. Customization

#### Adding New Ad Placements

```tsx
import { AdPlacement } from '@/components/AdPlacement';

// Add a new ad placement
<AdPlacement 
  position="between-sections" 
  adType="affiliate"
  adContent={{
    title: "Your Product",
    description: "Product description",
    image: "product-image-url",
    link: "affiliate-link",
    price: "₹999",
    rating: 4.5,
    badge: "Best Deal"
  }}
/>
```

#### Custom Ad Content

```tsx
import { AdBanner } from '@/components/AdBanner';

<AdBanner
  type="custom"
  size="banner"
  className="my-custom-ad"
/>
```

## Ad Types

### 1. Google AdSense

Traditional display ads from Google AdSense.

```tsx
<AdPlacement 
  position="sidebar" 
  adType="adsense"
/>
```

**Requirements:**
- Google AdSense account
- Ad unit IDs from AdSense dashboard
- Publisher ID

### 2. Affiliate Marketing

Commission-based product recommendations.

```tsx
<AdPlacement 
  position="content" 
  adType="affiliate"
  adContent={{
    title: "Product Name",
    description: "Product description",
    image: "https://example.com/image.jpg",
    link: "https://amazon.in/product?tag=your-tracking-id",
    price: "₹999",
    rating: 4.5,
    badge: "Best Seller"
  }}
/>
```

**Supported Partners:**
- Amazon Associates
- Flipkart Affiliate
- IKEA Affiliate

### 3. Sponsored Content

Native ads that blend with the application UI.

```tsx
<AdPlacement 
  position="header" 
  adType="sponsored"
  adContent={{
    title: "Sponsored Service",
    description: "Professional interior design services",
    image: "https://example.com/service.jpg",
    link: "https://example.com/service",
    price: "Free Consultation",
    rating: 4.9,
    badge: "Expert"
  }}
/>
```

### 4. Custom Ads

Your own promotional content.

```tsx
<AdPlacement 
  position="footer" 
  adType="custom"
/>
```

## Configuration

### Ad Manager Hook

The `useAdManager` hook provides ad management functionality:

```tsx
import { useAdManager } from '@/hooks/useAdManager';

const MyComponent = () => {
  const adManager = useAdManager({
    enabled: true,
    maxAdsPerPage: 4,
    loadingDelay: 1500
  });

  return (
    <div>
      {adManager.canShowMoreAds() && (
        <AdPlacement position="content" adType="affiliate" />
      )}
    </div>
  );
};
```

### Ad Configuration

Configure ads in `src/config/ads.ts`:

```typescript
export const defaultAdConfig: AdConfig = {
  enabled: true,
  adsense: {
    enabled: true,
    publisherId: 'ca-pub-your-id',
    adUnits: {
      header: 'your-header-unit',
      sidebar: 'your-sidebar-unit',
      content: 'your-content-unit',
      footer: 'your-footer-unit',
      floating: 'your-floating-unit',
    },
  },
  affiliate: {
    enabled: true,
    partners: {
      amazon: {
        enabled: true,
        trackingId: 'your-tracking-id',
        baseUrl: 'https://amazon.in',
      },
      // ... other partners
    },
  },
  display: {
    maxAdsPerPage: 4,
    loadingDelay: 1500,
    refreshInterval: 30000,
    mobileVisible: true,
    desktopVisible: true,
  },
};
```

## Performance Optimization

### 1. Lazy Loading

Ads are loaded with a delay to improve initial page performance:

```typescript
const adManager = useAdManager({
  loadingDelay: 1500 // 1.5 seconds delay
});
```

### 2. Ad Limits

Control the maximum number of ads per page:

```typescript
const adManager = useAdManager({
  maxAdsPerPage: 4
});
```

### 3. Responsive Display

Ads can be hidden on mobile or desktop:

```tsx
<AdPlacement 
  position="sidebar" 
  adType="adsense"
  mobileVisible={false}
  desktopVisible={true}
/>
```

## Analytics

### Google Analytics Integration

Track ad performance with Google Analytics:

```env
VITE_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
```

The ad manager automatically tracks:
- Ad views
- Ad clicks
- Ad load times
- Ad blocker detection

### Custom Analytics

```tsx
const adManager = useAdManager();

// Track custom events
adManager.trackAdView('ad-id');
adManager.trackAdClick('ad-id');
```

## Best Practices

### 1. Ad Placement
- Place ads where they don't interfere with user experience
- Use native-looking ads for better engagement
- Balance ad density with content quality

### 2. Content Relevance
- Use renovation/home improvement related ads
- Match ad content to user interests
- Rotate ad content regularly

### 3. Performance
- Use lazy loading for ads
- Optimize ad sizes for mobile
- Monitor page load times

### 4. Compliance
- Follow Google AdSense policies
- Disclose affiliate relationships
- Respect user privacy

## Troubleshooting

### Common Issues

1. **Ads not showing**
   - Check if ads are enabled in configuration
   - Verify ad unit IDs are correct
   - Check for ad blocker

2. **AdSense not loading**
   - Verify publisher ID
   - Check AdSense approval status
   - Ensure proper script loading

3. **Affiliate links not working**
   - Verify tracking IDs
   - Check partner approval status
   - Test links manually

### Debug Mode

Enable debug mode to see ad information:

```typescript
const adManager = useAdManager({
  enabled: true,
  debug: true
});
```

## Revenue Optimization

### 1. A/B Testing
Test different ad placements and content to optimize revenue.

### 2. Seasonal Content
Update ad content based on seasons and trends.

### 3. User Segmentation
Show different ads based on user behavior and preferences.

### 4. Performance Monitoring
Regularly monitor ad performance and adjust strategy.

## Support

For issues or questions about ad integration:
1. Check this documentation
2. Review the code examples
3. Test with different ad configurations
4. Monitor browser console for errors

## Legal Considerations

- Ensure compliance with advertising regulations
- Disclose affiliate relationships
- Respect user privacy and GDPR
- Follow platform-specific policies (Google AdSense, Amazon Associates, etc.)

/**
 * Ad configuration and settings
 * Centralized configuration for all ad-related settings
 */

export interface AdConfig {
  /** Whether ads are enabled globally */
  enabled: boolean;
  /** Google AdSense configuration */
  adsense: {
    enabled: boolean;
    publisherId: string;
    adUnits: {
      header: string;
      sidebar: string;
      content: string;
      footer: string;
      floating: string;
    };
  };
  /** Affiliate marketing configuration */
  affiliate: {
    enabled: boolean;
    partners: {
      amazon: {
        enabled: boolean;
        trackingId: string;
        baseUrl: string;
      };
      flipkart: {
        enabled: boolean;
        trackingId: string;
        baseUrl: string;
      };
      ikea: {
        enabled: boolean;
        trackingId: string;
        baseUrl: string;
      };
    };
  };
  /** Ad display settings */
  display: {
    maxAdsPerPage: number;
    loadingDelay: number;
    refreshInterval: number;
    mobileVisible: boolean;
    desktopVisible: boolean;
  };
  /** Ad content settings */
  content: {
    showSponsoredLabel: boolean;
    showAdLabel: boolean;
    customAdText: string;
  };
}

// Default ad configuration
export const defaultAdConfig: AdConfig = {
  enabled: true,
  adsense: {
    enabled: true,
    publisherId: process.env.VITE_ADSENSE_PUBLISHER_ID || 'ca-pub-5430259388561714',
    adUnits: {
      header: process.env.VITE_ADSENSE_HEADER_UNIT || '1234567890',
      sidebar: process.env.VITE_ADSENSE_SIDEBAR_UNIT || '1234567891',
      content: process.env.VITE_ADSENSE_CONTENT_UNIT || '1234567892',
      footer: process.env.VITE_ADSENSE_FOOTER_UNIT || '1234567893',
      floating: process.env.VITE_ADSENSE_FLOATING_UNIT || '1234567894',
    },
  },
  affiliate: {
    enabled: true,
    partners: {
      amazon: {
        enabled: true,
        trackingId: process.env.VITE_AMAZON_TRACKING_ID || 'renovateai-21',
        baseUrl: 'https://amazon.in',
      },
      flipkart: {
        enabled: true,
        trackingId: process.env.VITE_FLIPKART_TRACKING_ID || 'renovateai',
        baseUrl: 'https://flipkart.com',
      },
      ikea: {
        enabled: true,
        trackingId: process.env.VITE_IKEA_TRACKING_ID || 'renovateai',
        baseUrl: 'https://ikea.com/in',
      },
    },
  },
  display: {
    maxAdsPerPage: 4,
    loadingDelay: 1500,
    refreshInterval: 30000,
    mobileVisible: true,
    desktopVisible: true,
  },
  content: {
    showSponsoredLabel: true,
    showAdLabel: true,
    customAdText: 'Advertisement',
  },
};

// Sample affiliate products for renovation
export const sampleAffiliateProducts = [
  {
    id: 'furniture-1',
    title: 'Modern Sofa Set',
    description: 'Comfortable 3-seater sofa perfect for living rooms',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&h=200&fit=crop',
    price: '₹45,999',
    originalPrice: '₹59,999',
    rating: 4.5,
    badge: 'Best Seller',
    link: 'https://amazon.in/modern-sofa-set',
    partner: 'amazon',
  },
  {
    id: 'lighting-1',
    title: 'LED Pendant Lights',
    description: 'Modern pendant lights for kitchen and dining areas',
    image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=200&h=200&fit=crop',
    price: '₹2,499',
    originalPrice: '₹3,999',
    rating: 4.3,
    badge: 'Sale',
    link: 'https://flipkart.com/led-pendant-lights',
    partner: 'flipkart',
  },
  {
    id: 'storage-1',
    title: 'Storage Solutions',
    description: 'IKEA storage units for organized living spaces',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&h=200&fit=crop',
    price: '₹8,999',
    originalPrice: '₹12,999',
    rating: 4.7,
    badge: 'IKEA',
    link: 'https://ikea.com/in/storage-solutions',
    partner: 'ikea',
  },
  {
    id: 'tools-1',
    title: 'Home Improvement Tools',
    description: 'Professional tools for DIY renovation projects',
    image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=200&h=200&fit=crop',
    price: 'From ₹299',
    rating: 4.6,
    badge: 'Best Deals',
    link: 'https://amazon.in/home-tools',
    partner: 'amazon',
  },
];

// Ad placement strategies
export const adPlacementStrategies = {
  header: {
    priority: 1,
    types: ['affiliate', 'sponsored'],
    maxWidth: '100%',
    height: '120px',
  },
  sidebar: {
    priority: 2,
    types: ['affiliate', 'adsense'],
    maxWidth: '300px',
    height: '600px',
  },
  content: {
    priority: 3,
    types: ['sponsored', 'affiliate'],
    maxWidth: '100%',
    height: '200px',
  },
  footer: {
    priority: 4,
    types: ['custom', 'adsense'],
    maxWidth: '100%',
    height: '100px',
  },
  floating: {
    priority: 5,
    types: ['affiliate'],
    maxWidth: '250px',
    height: '250px',
  },
};

export default defaultAdConfig;

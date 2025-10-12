/**
 * Tailwind CSS Configuration
 * Defines the design system, colors, spacing, and utility classes
 * Uses CSS custom properties for theming and dark mode support
 */

import type { Config } from "tailwindcss";

/**
 * Tailwind CSS configuration object
 * Extends the default Tailwind configuration with custom design tokens
 */
export default {
  /**
   * Dark mode configuration
   * Uses class-based dark mode (add 'dark' class to enable)
   */
  darkMode: ["class"],
  
  /**
   * Content paths for purging unused CSS
   * Tells Tailwind where to look for class names
   */
  content: [
    "./pages/**/*.{ts,tsx}", 
    "./components/**/*.{ts,tsx}", 
    "./app/**/*.{ts,tsx}", 
    "./src/**/*.{ts,tsx}"
  ],
  
  /**
   * CSS prefix for utility classes
   * Empty string means no prefix (default)
   */
  prefix: "",
  
  /**
   * Theme configuration
   * Extends Tailwind's default theme with custom values
   */
  theme: {
    /**
     * Container configuration
     * Defines max-width and centering for container elements
     */
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    
    /**
     * Extended theme values
     * Adds custom colors, spacing, animations, etc.
     */
    extend: {
      /**
       * Custom color palette
       * Uses CSS custom properties for theming and dark mode
       */
      colors: {
        // Base colors using CSS custom properties
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        
        // Primary color scheme
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        
        // Secondary color scheme
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        
        // Destructive/danger color scheme
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        
        // Muted/subtle color scheme
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        
        // Accent color scheme
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        
        // Popover/modal color scheme
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        
        // Card component color scheme
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        
        // Sidebar component color scheme
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        
        // Fixfy brand colors
        fixfy: {
          primary: "#06b6d4", // cyan-500
          secondary: "#0891b2", // cyan-600
          accent: "#0e7490", // cyan-700
          light: "#67e8f9", // cyan-300
          dark: "#164e63", // cyan-900
        },
      },
      
      /**
       * Custom background images
       * Defines gradient patterns used throughout the app
       */
      backgroundImage: {
        'gradient-warm': 'var(--gradient-warm)',
        'gradient-sage': 'var(--gradient-sage)',
        'gradient-hero': 'var(--gradient-hero)',
      },
      
      /**
       * Custom box shadows
       * Defines shadow styles for depth and elevation
       */
      boxShadow: {
        'soft': 'var(--shadow-soft)',
        'warm': 'var(--shadow-warm)',
      },
      
      /**
       * Custom transition timing functions
       * Defines easing curves for animations
       */
      transitionTimingFunction: {
        'smooth': 'var(--transition-smooth)',
      },
      
      /**
       * Custom border radius values
       * Uses CSS custom properties for consistent rounding
       */
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      
      /**
       * Custom keyframe animations
       * Defines animation sequences for components
       */
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      
      /**
       * Custom animation classes
       * Combines keyframes with timing and easing
       */
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  
  /**
   * Tailwind CSS plugins
   * Extends functionality with additional utilities
   */
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

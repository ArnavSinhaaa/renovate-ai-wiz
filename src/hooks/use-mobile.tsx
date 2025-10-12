/**
 * Mobile Detection Hook
 * Provides responsive design utilities for detecting mobile devices
 * Uses window.matchMedia API for efficient resize event handling
 */

import * as React from "react";

/** Breakpoint for mobile devices (768px and below) */
const MOBILE_BREAKPOINT = 768;

/**
 * Custom hook to detect if the current viewport is mobile-sized
 * Uses window.matchMedia for efficient media query listening
 * @returns boolean indicating if the current viewport is mobile-sized
 */
export function useIsMobile() {
  // State to track mobile status, undefined during initial render
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    // Create media query listener for mobile breakpoint
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    
    // Handler function to update mobile state
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    
    // Add event listener for media query changes
    mql.addEventListener("change", onChange);
    
    // Set initial state
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    
    // Cleanup: remove event listener on unmount
    return () => mql.removeEventListener("change", onChange);
  }, []);

  // Convert undefined to false for consistent boolean return
  return !!isMobile;
}

/**
 * Utility Functions
 * Common utility functions used throughout the application
 * Includes CSS class merging and other helper functions
 */

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines and merges CSS classes using clsx and tailwind-merge
 * 
 * This function is essential for conditional styling in React components.
 * It combines multiple class inputs, handles conditional classes, and
 * intelligently merges Tailwind CSS classes to avoid conflicts.
 * 
 * @param inputs - Variable number of class values (strings, objects, arrays, etc.)
 * @returns Merged and deduplicated class string
 * 
 * @example
 * ```typescript
 * // Basic usage
 * cn("px-4 py-2", "bg-blue-500") // "px-4 py-2 bg-blue-500"
 * 
 * // Conditional classes
 * cn("base-class", { "active": isActive, "disabled": isDisabled })
 * 
 * // Tailwind class merging (removes conflicting classes)
 * cn("px-4 px-6") // "px-6" (px-4 is removed)
 * 
 * // Complex example
 * cn(
 *   "flex items-center",
 *   isActive && "bg-primary text-white",
 *   isDisabled && "opacity-50 cursor-not-allowed",
 *   className // additional classes from props
 * )
 * ```
 */
export function cn(...inputs: ClassValue[]) {
  // First, use clsx to combine all class inputs into a single string
  // clsx handles conditional classes, arrays, objects, etc.
  const combinedClasses = clsx(inputs);
  
  // Then use tailwind-merge to intelligently merge Tailwind classes
  // This removes conflicting classes (e.g., px-4 and px-6 -> px-6)
  return twMerge(combinedClasses);
}

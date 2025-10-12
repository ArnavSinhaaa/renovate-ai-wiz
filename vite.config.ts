/**
 * Vite Configuration
 * Build tool configuration for the React application
 * Defines development server settings, plugins, and path aliases
 */

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

/**
 * Vite configuration function
 * @param mode - Build mode (development, production, etc.)
 * @returns Vite configuration object
 */
export default defineConfig(({ mode }) => ({
  /**
   * Development server configuration
   * Controls how the dev server runs during development
   */
  server: {
    // Listen on all network interfaces (IPv4 and IPv6)
    // Allows access from other devices on the network
    host: "::",
    // Port number for the development server
    port: 8080,
  },
  
  /**
   * Vite plugins array
   * Extends Vite's functionality with additional tools
   */
  plugins: [
    // React plugin with SWC compiler for fast builds
    react(),
    // Component tagger for development mode only
    // Helps with component identification and debugging
    mode === "development" && componentTagger()
  ].filter(Boolean), // Remove falsy values from the array
  
  /**
   * Module resolution configuration
   * Defines how modules are resolved and imported
   */
  resolve: {
    /**
     * Path aliases for cleaner imports
     * Allows using @/ instead of relative paths
     */
    alias: {
      // @ alias points to the src directory
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));

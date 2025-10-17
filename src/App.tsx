/**
 * Main App component that sets up the application's routing and global providers
 * This component wraps the entire application with necessary context providers
 * and defines the routing structure for the single-page application
 */

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Create a new QueryClient instance for React Query
// This manages server state, caching, and background updates
const queryClient = new QueryClient();
// Add this state

/**
 * Main App component that provides the application structure
 * @returns JSX element containing the app with all necessary providers
 */
const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      {/* TooltipProvider enables tooltips throughout the app */}
      <TooltipProvider>
        {/* Toast notifications for user feedback */}
        <Toaster />
        <Sonner />
        
        {/* Browser router for client-side routing */}
        <BrowserRouter>
          <Routes>
            {/* Main application route - the home page with renovation tools */}
            <Route path="/" element={<Index />} />
            
            {/* Catch-all route for 404 pages - must be last */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;

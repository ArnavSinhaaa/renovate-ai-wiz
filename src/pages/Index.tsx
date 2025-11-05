/**
 * Main Index page component for the AI Home Renovation application
 * This is the primary interface where users can upload room photos,
 * get AI-powered renovation suggestions, and manage their budget
 */

import React, { useState, useCallback } from 'react';
import { Home, Upload, Sparkles, Calculator, ShoppingBag } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ImageUpload } from '@/components/ImageUpload';
import { ObjectDetection } from '@/components/ObjectDetection';
import { RenovationSuggestionCard } from '@/components/RenovationSuggestionCard';
import { BudgetPlanner } from '@/components/BudgetPlanner';
import { RenovationPreview } from '@/components/RenovationPreview';
import { DonationSection } from '@/components/DonationSection';
import { AdPlacement } from '@/components/AdPlacement';
import { FixfyLogo } from '@/components/FixfyLogo';
import { ImageHistory } from '@/components/ImageHistory';
import { useAdManager } from '@/hooks/useAdManager';
import { useUserSession } from '@/hooks/useUserSession';
import { getFilteredSuggestions, RenovationSuggestion } from '@/data/renovationSuggestions';
import { MaterialCosts, FalseCeilingOption } from '@/components/WallColorCustomizer';
import { WallCustomizationPanel } from '@/components/WallCustomizationPanel';
import { toast } from 'sonner';
import heroImage from '@/assets/hero-renovation.jpg';

/**
 * Interface for objects detected by AI analysis
 * @interface DetectedObject
 */
interface DetectedObject {
  /** Name of the detected object (e.g., 'sofa', 'lighting') */
  name: string;
  /** Confidence score from AI (0-1) */
  confidence: number;
  /** Location of the object in the room */
  location: string;
  /** Optional condition assessment of the object */
  condition?: string;
}
/**
 * Main Index component - the primary page of the renovation application
 * @returns JSX element containing the complete renovation interface
 */
const Index = () => {
  // State for uploaded image management
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  // State for AI analysis process
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [detectedObjects, setDetectedObjects] = useState<DetectedObject[]>([]);

  // State for budget and room filtering
  const [budget, setBudget] = useState<number>(50000);
  const [selectedRoom, setSelectedRoom] = useState<string>('all');

  // State for renovation suggestions and cart management
  const [cartItems, setCartItems] = useState<RenovationSuggestion[]>([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState<RenovationSuggestion[]>([]);
  const [currentImageId, setCurrentImageId] = useState<string | null>(null);

  // State for material costs tracking
  const [materialCosts, setMaterialCosts] = useState<MaterialCosts>({
    walls: 0,
    flooring: 0,
    tiles: 0,
    falseCeiling: 0,
    total: 0
  });

  // State for false ceiling
  const [falseCeiling, setFalseCeiling] = useState<FalseCeilingOption>({
    type: 'none',
    name: 'None',
    cost: 0
  });

  // Ad management
  const adManager = useAdManager({
    enabled: true,
    maxAdsPerPage: 4,
    loadingDelay: 1500
  });

  // User session management
  const {
    userId,
    isLoading: userLoading,
    error: userError
  } = useUserSession();

  // AI Provider settings - Default to Google Gemini for best accuracy
  const [analysisProvider, setAnalysisProvider] = useState('GOOGLE'); // Google Gemini for accurate object detection
  const [analysisModel, setAnalysisModel] = useState('gemini-2.0-flash-exp');
  const [imageProvider, setImageProvider] = useState('LOVABLE'); // Lovable AI for image generation (Google doesn't support img generation)
  const [imageModel, setImageModel] = useState('google/gemini-2.5-flash-image');
  const [providerStatus, setProviderStatus] = useState<{ [key: string]: string }>({});

  /**
   * Handles image upload from user
   * Creates a URL for the uploaded file and starts the analysis process
   * @param file - The uploaded image file
   */
  const handleImageUpload = useCallback(async (file: File) => {
    const imageUrl = URL.createObjectURL(file);
    setUploadedImage(imageUrl);
    setIsAnalyzing(true);
  }, []);

  /**
   * Handles completion of AI analysis
   * Updates detected objects and generates renovation suggestions based on findings
   * @param objects - Array of objects detected by AI analysis
   */
  const handleAnalysisComplete = useCallback((objects: DetectedObject[]) => {
    setDetectedObjects(objects);

    // Get renovation suggestions based on detected objects
    const objectNames = objects.map(obj => obj.name.toLowerCase());
    const suggestions = getFilteredSuggestions(objectNames, budget, selectedRoom === 'all' ? undefined : selectedRoom);
    
    // Filter to show only suggestions matching detected objects
    const relevantSuggestions = suggestions.filter(suggestion => 
      objectNames.some(objName => 
        suggestion.trigger.toLowerCase().includes(objName) ||
        objName.includes(suggestion.trigger.toLowerCase())
      )
    );
    
    setFilteredSuggestions(relevantSuggestions.length > 0 ? relevantSuggestions : suggestions.slice(0, 6));
    setIsAnalyzing(false);
    toast.success(`Room analysis complete! Found ${relevantSuggestions.length} matching suggestions.`);
  }, [budget, selectedRoom]);

  /**
   * Handles removal of uploaded image
   * Clears all analysis data and resets the interface
   */
  const handleRemoveImage = useCallback(() => {
    setUploadedImage(null);
    setDetectedObjects([]);
    setFilteredSuggestions([]);
    setIsAnalyzing(false);
  }, []);

  /**
   * Adds a renovation suggestion to the cart
   * Prevents duplicate items and shows success notification
   * @param suggestion - The renovation suggestion to add
   */
  const handleAddToCart = useCallback((suggestion: RenovationSuggestion) => {
    setCartItems(prev => {
      if (prev.find(item => item.id === suggestion.id)) {
        return prev;
      }
      const newItems = [...prev, suggestion];
      toast.success(`${suggestion.suggestion} added to cart!`);
      return newItems;
    });
  }, []);

  /**
   * Removes an item from the cart
   * @param id - The ID of the item to remove
   */
  const handleRemoveItem = useCallback((id: string) => {
    setCartItems(prev => {
      const newItems = prev.filter(item => item.id !== id);
      toast.success('Item removed from cart');
      return newItems;
    });
  }, []);

  /**
   * Handles budget changes and updates suggestions accordingly
   * @param value - The new budget value as a string
   */
  const handleBudgetChange = useCallback((value: string) => {
    const newBudget = parseInt(value) || 0;
    setBudget(newBudget);
    if (detectedObjects.length > 0) {
      const objectNames = detectedObjects.map(obj => obj.name.toLowerCase());
      const suggestions = getFilteredSuggestions(objectNames, newBudget, selectedRoom === 'all' ? undefined : selectedRoom);
      
      const relevantSuggestions = suggestions.filter(suggestion => 
        objectNames.some(objName => 
          suggestion.trigger.toLowerCase().includes(objName) ||
          objName.includes(suggestion.trigger.toLowerCase())
        )
      );
      
      setFilteredSuggestions(relevantSuggestions.length > 0 ? relevantSuggestions : suggestions.slice(0, 6));
    }
  }, [detectedObjects, selectedRoom]);

  /**
   * Handles room type changes and updates suggestions accordingly
   * @param room - The selected room type
   */
  const handleRoomChange = useCallback((room: string) => {
    setSelectedRoom(room);
    if (detectedObjects.length > 0) {
      const objectNames = detectedObjects.map(obj => obj.name.toLowerCase());
      const suggestions = getFilteredSuggestions(objectNames, budget, room === 'all' ? undefined : room);
      
      const relevantSuggestions = suggestions.filter(suggestion => 
        objectNames.some(objName => 
          suggestion.trigger.toLowerCase().includes(objName) ||
          objName.includes(suggestion.trigger.toLowerCase())
        )
      );
      
      setFilteredSuggestions(relevantSuggestions.length > 0 ? relevantSuggestions : suggestions.slice(0, 6));
    }
  }, [detectedObjects, budget]);
  return <div className="min-h-screen bg-background">
      {/* Header with theme toggle only */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-end">
          <ThemeToggle />
        </div>
      </header>
      
      {/* Header Ad Banner */}
      <AdPlacement position="header" adType="adsense" />

      {/* Hero Section - Main landing area with compelling visuals and messaging */}
      <section className="relative overflow-hidden min-h-[600px]">
        {/* Background image with gradient overlays for visual appeal */}
        <div className="absolute inset-0">
          <img src={heroImage} alt="Beautiful home renovation transformation" className="w-full h-full object-cover" loading="lazy" />
          {/* Primary gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/90 via-indigo-900/80 to-background/95" />
          {/* Secondary radial gradient for depth */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(124,58,237,0.1),transparent_50%)]" />
        </div>
        
        {/* Main hero content container */}
        <div className="relative z-10 container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-4xl animate-fade-in">
            {/* Trend badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6 text-white">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Fixfy AI-Powered Home Renovation | 2025 Trends</span>
            </div>
            
            {/* Main headline with gradient text effect */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white leading-tight text-center">
              Transform Your Home with{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">
                Fixfy AI
              </span>
            </h1>
            
            {/* Value proposition description */}
            <p className="text-xl md:text-2xl mb-10 text-gray-200 leading-relaxed max-w-2xl">
              Upload your room photo and get realistic renovation suggestions powered by Fixfy's advanced AI. 
              Complete with ₹ costs, timelines, and direct shopping links from Amazon, Flipkart, IKEA & more.
            </p>
            
            {/* Process steps indicator */}
            <div className="flex items-center gap-6 text-sm text-white/90 mb-8">
              <div className="flex items-center gap-2">
                <Upload className="w-4 h-4" />
                <span>Upload Photo</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>AI Analysis</span>
              </div>
              <div className="flex items-center gap-2">
                <Calculator className="w-4 h-4" />
                <span>Budget Planning</span>
              </div>
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4" />
                <span>Shop on Amazon, Flipkart & More</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative floating elements for visual interest */}
        <div className="absolute top-20 right-10 w-32 h-32 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{
        animationDelay: '1s'
      }} />
      </section>

      {/* Main Content Section - Interactive renovation tools */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Main interaction area */}
          <div className="lg:col-span-2 space-y-8">
            {/* User Controls - Budget and room type selection */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>Get Started</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Budget input field */}
                  <div className="space-y-2">
                    <Label htmlFor="budget">Budget (₹)</Label>
                    <Input id="budget" type="number" value={budget} onChange={e => handleBudgetChange(e.target.value)} placeholder="Enter your budget" min="0" />
                  </div>
                  
                  {/* Room type selection dropdown */}
                  <div className="space-y-2">
                    <Label htmlFor="room">Room Type (Optional)</Label>
                    <Select value={selectedRoom} onValueChange={handleRoomChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select room type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Rooms</SelectItem>
                        <SelectItem value="Living Room">Living Room</SelectItem>
                        <SelectItem value="Bedroom">Bedroom</SelectItem>
                        <SelectItem value="Kitchen">Kitchen</SelectItem>
                        <SelectItem value="Bathroom">Bathroom</SelectItem>
                        <SelectItem value="Balcony">Balcony</SelectItem>
                        <SelectItem value="Outdoor">Outdoor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Image Upload Component - Handles file upload and AI analysis */}
            <ImageUpload onImageUpload={handleImageUpload} uploadedImage={uploadedImage} onRemoveImage={handleRemoveImage} isAnalyzing={isAnalyzing} onAnalysisComplete={handleAnalysisComplete} currentImageId={currentImageId || undefined} />

            {/* Object Detection Results - Shows AI analysis findings */}
            <ObjectDetection detectedObjects={detectedObjects} isAnalyzing={isAnalyzing} />

            {/* Wall Customization Panel - Material selection and costs */}
            <WallCustomizationPanel 
              onMaterialCostsChange={setMaterialCosts}
              falseCeiling={falseCeiling}
              onFalseCeilingChange={setFalseCeiling}
            />

            {/* Content Ad - Between analysis and suggestions */}
            {adManager.canShowMoreAds() && !adManager.isLoading && <AdPlacement position="content" adType="adsense" />}

            {/* Renovation Suggestions - AI-generated recommendations */}
            {filteredSuggestions.length > 0 && <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    Renovation Suggestions ({filteredSuggestions.length})
                    {detectedObjects.length > 0 && (
                      <span className="text-sm font-normal text-muted-foreground">
                        - Based on detected objects
                      </span>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    {filteredSuggestions.map(suggestion => <RenovationSuggestionCard key={suggestion.id} suggestion={suggestion} onAddToCart={handleAddToCart} isInCart={cartItems.some(item => item.id === suggestion.id)} />)}
                  </div>
                </CardContent>
              </Card>}
          </div>

          {/* Right Column - Budget management and preview tools */}
          <div className="space-y-8">
            {/* Sidebar Ad - Top of sidebar */}
            {adManager.canShowMoreAds() && !adManager.isLoading && <AdPlacement position="sidebar" adType="adsense" />}

            {/* Budget Planner - Track costs and timeline */}
            <BudgetPlanner 
              budget={budget} 
              cartItems={cartItems} 
              onRemoveItem={handleRemoveItem}
              materialCosts={materialCosts}
            />
            
            {/* AI Renovation Preview - always available for easier experimentation */}
            <RenovationPreview 
              selectedSuggestions={cartItems} 
              roomType={selectedRoom === 'all' ? undefined : selectedRoom} 
              budget={budget} 
              uploadedImage={uploadedImage}
              imageProvider={imageProvider}
              imageModel={imageModel}
              providerStatus={providerStatus}
              onProviderStatusUpdate={(provider, status) => {
                setProviderStatus(prev => ({ ...prev, [provider]: status }));
              }}
            />
            
            {/* Image History - User's uploaded images (only show if authenticated) */}
            {userId && <ImageHistory onImageSelect={(imageUrl) => {
            setUploadedImage(imageUrl);
          }} />}
          </div>
        </div>
      </section>

      {/* Footer Ad Banner */}
      <AdPlacement position="footer" adType="adsense" />

      {/* Donation Section */}
      <section className="container mx-auto px-4 py-8">
        <DonationSection upiId="9430253372@fam" buyMeACoffeeUrl="buymeacoffee.com/arnavsinhav" />
      </section>

      {/* Footer with attribution and copyright */}
      <footer className="border-t bg-card/50 backdrop-blur-sm mt-16">
        <div className="container mx-auto py-8 px-[31px] my-[13px]">
          <div className="flex flex-col items-center justify-center gap-2 text-center">
            <p className="text-sm text-muted-foreground">
              Made with <span className="text-cyan-500">❤️</span> by{' '}
              <span className="font-semibold text-foreground">Arnav Sinha</span>
            </p>
            <p className="text-xs text-muted-foreground">
              © 2025 Fixfy. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>;
};
export default Index;
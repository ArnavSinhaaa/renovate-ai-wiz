/**
 * Main Index page component for the AI Home Renovation application
 * This is the primary interface where users can upload room photos,
 * get AI-powered renovation suggestions, and manage their budget
 */

import React, { useState, useCallback } from 'react';
import { Home, Upload, Sparkles, Calculator, ShoppingBag, Settings } from 'lucide-react';
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
import { InlineModelSelector } from '@/components/InlineModelSelector';
import { useAdManager } from '@/hooks/useAdManager';
import { useUserSession } from '@/hooks/useUserSession';
import { getFilteredSuggestions, RenovationSuggestion } from '@/data/renovationSuggestions';
import { MaterialCosts, FalseCeilingOption } from '@/components/WallColorCustomizer';
import { WallCustomizationPanel } from '@/components/WallCustomizationPanel';
import { CustomRenovationPrompt } from '@/components/CustomRenovationPrompt';
import { toast } from 'sonner';
// Hero image is in public folder for LCP optimization (discoverable in initial HTML)

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
  // Step tracking
  const [currentStep, setCurrentStep] = useState(1);
  
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
    total: 0,
    wallsDuration: 0,
    flooringDuration: 0,
    tilesDuration: 0,
    ceilingDuration: 0,
    totalDuration: 0
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

  // AI Provider settings - simplified (model auto-selected based on provider)
  const [analysisProvider, setAnalysisProvider] = useState('LOVABLE'); // Fixfy AI as default
  const [analysisModel, setAnalysisModel] = useState('google/gemini-2.5-flash');
  const [imageProvider, setImageProvider] = useState('LOVABLE'); // Fixfy AI as default
  const [imageModel, setImageModel] = useState('google/gemini-2.5-flash-image-preview');
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
    setCurrentStep(2); // Move to step 2 after upload
  }, []);

  /**
   * Handles completion of AI analysis
   * Updates detected objects and generates renovation suggestions based on findings
   * @param objects - Array of objects detected by AI analysis
   */
  const handleAnalysisComplete = useCallback((objects: DetectedObject[]) => {
    setDetectedObjects(objects);
    setIsAnalyzing(false);
    
    if (objects.length > 0) {
      setCurrentStep(3); // Move to step 3 after analysis

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
      toast.success(`${relevantSuggestions.length || suggestions.slice(0, 6).length} suggestions ready`, {
        description: 'Scroll down to view AI recommendations',
        action: {
          label: 'View',
          onClick: () => {
            document.getElementById('renovation-options')?.scrollIntoView({ behavior: 'smooth' });
          }
        }
      });
    }
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
    setCurrentStep(1); // Reset to step 1
    toast.info('Image removed');
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
      if (currentStep < 4) setCurrentStep(4); // Move to step 4 when adding items
      toast.success(`${suggestion.suggestion} added to cart!`);
      return newItems;
    });
  }, [currentStep]);

  /**
   * Adds a custom renovation from user prompt
   */
  const handleAddCustomRenovation = useCallback((prompt: string, cost: number, time: number) => {
    // Map room type to valid RenovationSuggestion room types
    const validRooms = ['Living Room', 'Bedroom', 'Kitchen', 'Bathroom', 'Balcony', 'Outdoor'] as const;
    const roomMapping: { [key: string]: typeof validRooms[number] } = {
      'Living Room': 'Living Room',
      'Bedroom': 'Bedroom',
      'Kitchen': 'Kitchen',
      'Bathroom': 'Bathroom',
      'Balcony': 'Balcony',
      'Outdoor': 'Outdoor',
    };
    
    const mappedRoom = roomMapping[selectedRoom] || 'Living Room';
    
    const customRenovation: RenovationSuggestion = {
      id: `custom-${Date.now()}`,
      trigger: 'custom',
      condition: 'User-defined renovation',
      suggestion: prompt,
      cost,
      time,
      impact: 'Medium',
      type: 'Professional',
      room: mappedRoom,
      buyLinks: []
    };
    
    setCartItems(prev => [...prev, customRenovation]);
    toast.success('Custom renovation added!');
  }, [selectedRoom]);

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
  const steps = [
    { number: 1, title: 'Upload Photo', icon: Upload },
    { number: 2, title: 'Set Budget', icon: Calculator },
    { number: 3, title: 'AI Analysis', icon: Sparkles },
    { number: 4, title: 'Choose Options', icon: ShoppingBag },
  ];

  return <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header with theme toggle only */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Home className="w-6 h-6 text-primary" />
              <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">Fixfy AI</span>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>
      
      {/* Step Progress Indicator - Improved with check icons */}
      {currentStep > 1 && (
        <div className="sticky top-[73px] z-40 bg-background/95 backdrop-blur-md border-b shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between max-w-3xl mx-auto">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isCompleted = currentStep > step.number;
                const isCurrent = currentStep === step.number;
                
                return (
                  <React.Fragment key={step.number}>
                    <div className="flex flex-col items-center gap-1.5 flex-1">
                      <div className={`
                        w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 relative
                        ${isCompleted ? 'bg-primary/20 text-primary' : ''}
                        ${isCurrent ? 'bg-primary text-white shadow-lg ring-4 ring-primary/20' : ''}
                        ${!isCompleted && !isCurrent ? 'bg-muted text-muted-foreground' : ''}
                      `}>
                        {isCompleted ? (
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <Icon className="w-5 h-5" />
                        )}
                      </div>
                      <div className="text-center hidden md:block">
                        <div className={`text-sm font-medium transition-colors ${
                          isCurrent ? 'text-primary' : isCompleted ? 'text-foreground' : 'text-muted-foreground'
                        }`}>
                          {step.title}
                        </div>
                        <div className={`text-xs ${isCompleted ? 'text-primary/70' : 'text-muted-foreground'}`}>
                          {isCompleted ? 'Done' : `Step ${step.number}`}
                        </div>
                      </div>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`h-0.5 flex-1 mx-2 rounded-full transition-all duration-300 ${
                        currentStep > step.number ? 'bg-primary' : 'bg-muted'
                      }`} />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>
      )}
      
      {/* Header Ad Banner */}
      <AdPlacement position="header" adType="adsense" />

      {/* Hero Section - Main landing area with compelling visuals and messaging */}
      <section className="relative overflow-hidden min-h-[600px]">
        {/* Background image with gradient overlays for visual appeal */}
        <div className="absolute inset-0">
          <img 
            src="/hero-renovation.jpg" 
            alt="Beautiful home renovation transformation" 
            className="w-full h-full object-cover" 
            width={1920}
            height={1017}
            fetchPriority="high"
            decoding="async"
          />
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

      {/* Main Content Section - Step-by-step interactive renovation process */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Step 1: Upload Photo */}
          <Card className="shadow-lg border-2 hover:shadow-glow transition-shadow duration-300 animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <div className="w-10 h-10 rounded-full bg-gradient-primary text-white flex items-center justify-center shadow-glow">
                  1
                </div>
                <span>Upload Your Room Photo</span>
              </CardTitle>
              <p className="text-muted-foreground mt-2">
                Start by uploading a clear photo of the room you want to renovate
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* AI Model Selector for Upload/Analysis */}
              <div className="p-3 bg-muted/30 rounded-lg border border-border/50">
                <div className="flex items-center gap-2 mb-2">
                  <Settings className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">Analysis AI Model</span>
                </div>
                <InlineModelSelector
                  type="analysis"
                  selectedProvider={analysisProvider}
                  selectedModel={analysisModel}
                  onProviderChange={setAnalysisProvider}
                  onModelChange={setAnalysisModel}
                />
              </div>
              
              <ImageUpload 
                onImageUpload={handleImageUpload} 
                uploadedImage={uploadedImage} 
                onRemoveImage={handleRemoveImage} 
                isAnalyzing={isAnalyzing} 
                onAnalysisComplete={handleAnalysisComplete} 
                currentImageId={currentImageId || undefined} 
              />
            </CardContent>
          </Card>

          {/* Step 2: Set Budget & Room Type */}
          {currentStep >= 2 && (
            <Card className="shadow-lg border-2 hover:shadow-glow transition-all duration-300 animate-slide-up">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <div className="w-10 h-10 rounded-full bg-gradient-primary text-white flex items-center justify-center shadow-glow">
                    2
                  </div>
                  <span>Set Your Budget & Preferences</span>
                </CardTitle>
                <p className="text-muted-foreground mt-2">
                  Tell us your budget and room type for personalized suggestions
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="budget" className="text-base font-semibold">Budget (₹)</Label>
                    <Input 
                      id="budget" 
                      type="number" 
                      value={budget} 
                      onChange={e => handleBudgetChange(e.target.value)} 
                      placeholder="Enter your budget" 
                      min="0"
                      className="h-12 text-lg"
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="room" className="text-base font-semibold">Room Type (Optional)</Label>
                    <Select value={selectedRoom} onValueChange={handleRoomChange}>
                      <SelectTrigger className="h-12 text-lg bg-background">
                        <SelectValue placeholder="Select room type" />
                      </SelectTrigger>
                      <SelectContent className="bg-background z-50">
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
          )}

          {/* Step 3: AI Analysis Results */}
          {currentStep >= 3 && (
            <Card className="shadow-lg border-2 hover:shadow-glow transition-all duration-300 animate-slide-up">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <div className="w-10 h-10 rounded-full bg-gradient-primary text-white flex items-center justify-center shadow-glow">
                    3
                  </div>
                  <span>AI Analysis Results</span>
                </CardTitle>
                <p className="text-muted-foreground mt-2">
                  Our AI has detected these items in your room
                </p>
              </CardHeader>
              <CardContent>
                <ObjectDetection detectedObjects={detectedObjects} isAnalyzing={isAnalyzing} />
              </CardContent>
            </Card>
          )}

          {/* Step 4: Renovation Options */}
          {currentStep >= 3 && filteredSuggestions.length > 0 && (
            <>
              {/* Wall Customization */}
              <Card id="renovation-options" className="shadow-lg border-2 hover:shadow-xl transition-all duration-300 scroll-mt-32">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <div className="w-10 h-10 rounded-full bg-gradient-primary text-white flex items-center justify-center shadow-md">
                      4
                    </div>
                    <div>
                      <span className="block">Choose Your Renovations</span>
                      <p className="text-sm font-normal text-muted-foreground mt-1">
                        Pick an AI plan or customize each wall
                      </p>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Wall Customization Panel */}
                  <WallCustomizationPanel
                    onMaterialCostsChange={setMaterialCosts}
                    falseCeiling={falseCeiling}
                    onFalseCeilingChange={setFalseCeiling}
                  />

                  {/* Custom Renovation Prompt with AI Analysis */}
                  <CustomRenovationPrompt 
                    onAddCustomRenovation={handleAddCustomRenovation}
                    analysisProvider={analysisProvider}
                  />

                  {/* AI Suggestions */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-primary" />
                      AI Suggested Renovations
                      <span className="text-sm font-normal text-muted-foreground ml-1">({filteredSuggestions.length} ready)</span>
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      {filteredSuggestions.map(suggestion => (
                        <RenovationSuggestionCard 
                          key={suggestion.id} 
                          suggestion={suggestion} 
                          onAddToCart={handleAddToCart} 
                          isInCart={cartItems.some(item => item.id === suggestion.id)} 
                        />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Budget Planner & Preview - Sidebar */}
              {currentStep >= 4 && (
                <div className="grid lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2">
                    <Card className="shadow-lg border-2 hover:shadow-glow transition-all duration-300">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-3 text-2xl">
                          <Sparkles className="w-6 h-6 text-primary" />
                          Generate AI Preview
                        </CardTitle>
                        <p className="text-muted-foreground mt-2">
                          See how your renovated room will look with AI-generated visualization
                        </p>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* AI Model Selector for Image Generation */}
                        <div className="p-3 bg-muted/30 rounded-lg border border-border/50">
                          <div className="flex items-center gap-2 mb-2">
                            <Settings className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm font-medium text-muted-foreground">Image Generation AI Model</span>
                          </div>
                          <InlineModelSelector
                            type="image"
                            selectedProvider={imageProvider}
                            selectedModel={imageModel}
                            onProviderChange={setImageProvider}
                            onModelChange={setImageModel}
                          />
                        </div>
                        
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
                      </CardContent>
                    </Card>
                  </div>

                  <div className="space-y-6">
                    <Card className="shadow-lg border-2 hover:shadow-glow transition-all duration-300 sticky top-24">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-3 text-xl">
                          <Calculator className="w-5 h-5 text-primary" />
                          Budget Summary
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <BudgetPlanner 
                          budget={budget} 
                          cartItems={cartItems} 
                          onRemoveItem={handleRemoveItem}
                          materialCosts={materialCosts}
                        />
                      </CardContent>
                    </Card>

                    {/* Image History */}
                    {userId && (
                      <Card className="shadow-lg border-2 hover:shadow-glow transition-all duration-300">
                        <CardContent className="pt-6">
                          <ImageHistory onImageSelect={(imageUrl) => {
                            setUploadedImage(imageUrl);
                            setCurrentStep(2);
                          }} />
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
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
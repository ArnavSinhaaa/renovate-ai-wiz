/**
 * Main Index page component for the AI Home Renovation application
 * Simplified approach: AI analysis provides upgrade options (Budget/Standard/Premium) directly
 */

import React, { useState, useCallback } from 'react';
import { Home, Upload, Sparkles, Calculator, Settings, IndianRupee, Trash2 } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ImageUpload } from '@/components/ImageUpload';
import { ObjectDetection } from '@/components/ObjectDetection';
import { DonationSection } from '@/components/DonationSection';
import { AdPlacement } from '@/components/AdPlacement';
import { InlineModelSelector } from '@/components/InlineModelSelector';
import { useAdManager } from '@/hooks/useAdManager';
import { toast } from 'sonner';

/**
 * Interface for selected upgrade items
 */
interface SelectedUpgrade {
  id: string;
  name: string;
  tier: string;
  cost: number;
  description: string;
}

/**
 * Interface for objects detected by AI analysis
 */
interface DetectedObject {
  name: string;
  confidence: number;
  location: string;
  condition?: string;
  upgrades?: {
    budget: any;
    standard: any;
    premium: any;
  };
}

const Index = () => {
  // Step tracking
  const [currentStep, setCurrentStep] = useState(1);
  
  // State for uploaded image management
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  // State for AI analysis process
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [detectedObjects, setDetectedObjects] = useState<DetectedObject[]>([]);

  // State for budget
  const [budget, setBudget] = useState<number>(100000);
  const [selectedRoom, setSelectedRoom] = useState<string>('all');

  // State for selected upgrades (cart)
  const [selectedUpgrades, setSelectedUpgrades] = useState<SelectedUpgrade[]>([]);

  // Ad management
  useAdManager({
    enabled: true,
    maxAdsPerPage: 4,
    loadingDelay: 1500
  });

  // AI Provider settings
  const [analysisProvider, setAnalysisProvider] = useState('LOVABLE');
  const [analysisModel, setAnalysisModel] = useState('google/gemini-2.5-flash');

  /**
   * Handles image upload from user
   */
  const handleImageUpload = useCallback(async (file: File) => {
    const imageUrl = URL.createObjectURL(file);
    setUploadedImage(imageUrl);
    setIsAnalyzing(true);
    setCurrentStep(2);
  }, []);

  /**
   * Handles completion of AI analysis
   */
  const handleAnalysisComplete = useCallback((objects: DetectedObject[]) => {
    setDetectedObjects(objects);
    setIsAnalyzing(false);
    
    if (objects.length > 0) {
      setCurrentStep(3);
      toast.success(`${objects.length} items detected!`, {
        description: 'Choose Budget, Standard, or Premium upgrades for each item',
        action: {
          label: 'View Options',
          onClick: () => {
            document.getElementById('upgrade-options')?.scrollIntoView({ behavior: 'smooth' });
          }
        }
      });
    }
  }, []);

  /**
   * Handles removal of uploaded image
   */
  const handleRemoveImage = useCallback(() => {
    setUploadedImage(null);
    setDetectedObjects([]);
    setSelectedUpgrades([]);
    setIsAnalyzing(false);
    setCurrentStep(1);
    toast.info('Image removed');
  }, []);

  /**
   * Handles adding upgrade to cart
   */
  const handleAddToCart = useCallback((item: { name: string; upgrade: string; cost: number; description: string }) => {
    const upgradeId = `${item.name}-${item.upgrade}`;
    
    setSelectedUpgrades(prev => {
      // Remove any existing upgrade for the same item
      const filtered = prev.filter(u => !u.id.startsWith(item.name + '-'));
      return [...filtered, { ...item, id: upgradeId, tier: item.upgrade }];
    });
  }, []);

  /**
   * Removes an item from cart
   */
  const handleRemoveFromCart = useCallback((id: string) => {
    setSelectedUpgrades(prev => prev.filter(u => u.id !== id));
    toast.info('Upgrade removed');
  }, []);

  /**
   * Handles budget changes
   */
  const handleBudgetChange = useCallback((value: string) => {
    const newBudget = parseInt(value) || 0;
    setBudget(newBudget);
  }, []);

  // Calculate totals
  const totalCost = selectedUpgrades.reduce((sum, item) => sum + item.cost, 0);
  const isOverBudget = totalCost > budget;
  const remainingBudget = budget - totalCost;

  const steps = [
    { number: 1, title: 'Upload Photo', icon: Upload },
    { number: 2, title: 'Set Budget', icon: Calculator },
    { number: 3, title: 'Choose Upgrades', icon: Sparkles },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
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
      
      {/* Step Progress Indicator */}
      {currentStep > 1 && (
        <div className="sticky top-[73px] z-40 bg-background/95 backdrop-blur-md border-b shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between max-w-2xl mx-auto">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isCompleted = currentStep > step.number;
                const isCurrent = currentStep === step.number;
                
                return (
                  <React.Fragment key={step.number}>
                    <div className="flex flex-col items-center gap-1.5 flex-1">
                      <div className={`
                        w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300
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
                        <div className={`text-sm font-medium ${
                          isCurrent ? 'text-primary' : isCompleted ? 'text-foreground' : 'text-muted-foreground'
                        }`}>
                          {step.title}
                        </div>
                      </div>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`h-0.5 flex-1 mx-2 rounded-full ${
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
      
      {/* Header Ad */}
      <AdPlacement position="header" adType="adsense" />

      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[500px]">
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
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/90 via-indigo-900/80 to-background/95" />
        </div>
        
        <div className="relative z-10 container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-4xl animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6 text-white">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">AI-Powered Home Renovation</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white leading-tight">
              Get Smart Upgrade Suggestions for{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">
                Every Budget
              </span>
            </h1>
            
            <p className="text-lg md:text-xl mb-8 text-gray-200 leading-relaxed max-w-2xl">
              Upload your room photo and get personalized upgrade options - from budget-friendly fixes 
              to premium renovations. Complete with ₹ costs and shopping links.
            </p>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-white/90">
              <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-full">
                <span className="text-blue-400">💰</span>
                <span>Budget Options</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-full">
                <span className="text-amber-400">⭐</span>
                <span>Standard Options</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-full">
                <span className="text-emerald-400">👑</span>
                <span>Premium Options</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto space-y-8">
          
          {/* Step 1: Upload Photo */}
          <Card className="shadow-lg border-2 hover:shadow-glow transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <div className="w-10 h-10 rounded-full bg-gradient-primary text-white flex items-center justify-center shadow-glow">
                  1
                </div>
                <span>Upload Your Room Photo</span>
              </CardTitle>
              <p className="text-muted-foreground mt-2">
                Our AI will analyze your room and suggest upgrades for every detected item
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* AI Model Selector */}
              <div className="p-3 bg-muted/30 rounded-lg border border-border/50">
                <div className="flex items-center gap-2 mb-2">
                  <Settings className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">AI Model</span>
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
              />
            </CardContent>
          </Card>

          {/* Step 2: Set Budget */}
          {currentStep >= 2 && (
            <Card className="shadow-lg border-2 hover:shadow-glow transition-all duration-300 animate-slide-up">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <div className="w-10 h-10 rounded-full bg-gradient-primary text-white flex items-center justify-center shadow-glow">
                    2
                  </div>
                  <span>Set Your Budget</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="budget" className="text-base font-semibold">Total Budget (₹)</Label>
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
                    <Label htmlFor="room" className="text-base font-semibold">Room Type</Label>
                    <Select value={selectedRoom} onValueChange={setSelectedRoom}>
                      <SelectTrigger className="h-12 text-lg bg-background">
                        <SelectValue placeholder="Select room type" />
                      </SelectTrigger>
                      <SelectContent className="bg-background z-50">
                        <SelectItem value="all">All Rooms</SelectItem>
                        <SelectItem value="Living Room">Living Room</SelectItem>
                        <SelectItem value="Bedroom">Bedroom</SelectItem>
                        <SelectItem value="Kitchen">Kitchen</SelectItem>
                        <SelectItem value="Bathroom">Bathroom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: AI Upgrade Options */}
          {currentStep >= 3 && (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left: Detected Objects with Upgrades */}
              <div className="lg:col-span-2 space-y-6" id="upgrade-options">
                <Card className="shadow-lg border-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-2xl">
                      <div className="w-10 h-10 rounded-full bg-gradient-primary text-white flex items-center justify-center shadow-glow">
                        3
                      </div>
                      <div>
                        <span>Choose Your Upgrades</span>
                        <p className="text-sm font-normal text-muted-foreground mt-1">
                          Select Budget, Standard, or Premium for each item
                        </p>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ObjectDetection 
                      detectedObjects={detectedObjects} 
                      isAnalyzing={isAnalyzing}
                      onAddToCart={handleAddToCart}
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Right: Budget Summary */}
              <div className="space-y-6">
                <Card className={`shadow-lg border-2 sticky top-40 ${isOverBudget ? 'border-destructive/50' : 'border-primary/30'}`}>
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2">
                      <Calculator className="w-5 h-5 text-primary" />
                      Budget Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Budget Progress */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Used</span>
                        <span className="font-medium">
                          ₹{totalCost.toLocaleString()} / ₹{budget.toLocaleString()}
                        </span>
                      </div>
                      <div className="h-3 bg-muted rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-500 ${
                            isOverBudget ? 'bg-destructive' : 'bg-gradient-to-r from-primary to-accent'
                          }`}
                          style={{ width: `${Math.min((totalCost / budget) * 100, 100)}%` }}
                        />
                      </div>
                      {isOverBudget && (
                        <p className="text-sm text-destructive flex items-center gap-1">
                          ⚠️ Over budget by ₹{Math.abs(remainingBudget).toLocaleString()}
                        </p>
                      )}
                    </div>

                    {/* Selected Upgrades */}
                    {selectedUpgrades.length > 0 ? (
                      <div className="space-y-3 pt-4 border-t">
                        <h4 className="font-semibold text-sm">Selected Upgrades ({selectedUpgrades.length})</h4>
                        {selectedUpgrades.map((item) => (
                          <div key={item.id} className="flex items-start justify-between gap-2 p-2 bg-muted/30 rounded-lg">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{item.name}</p>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">
                                  {item.tier === 'budget' && '💰'}
                                  {item.tier === 'standard' && '⭐'}
                                  {item.tier === 'premium' && '👑'}
                                  {item.tier}
                                </Badge>
                                <span className="text-xs text-primary font-medium">
                                  ₹{item.cost.toLocaleString()}
                                </span>
                              </div>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                              onClick={() => handleRemoveFromCart(item.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-8 text-center text-muted-foreground">
                        <IndianRupee className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Select upgrades from the detected items</p>
                      </div>
                    )}

                    {/* Total */}
                    {selectedUpgrades.length > 0 && (
                      <div className="pt-4 border-t">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold">Total Cost</span>
                          <span className={`text-xl font-bold ${isOverBudget ? 'text-destructive' : 'text-primary'}`}>
                            ₹{totalCost.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm text-muted-foreground mt-1">
                          <span>Remaining</span>
                          <span className={isOverBudget ? 'text-destructive' : ''}>
                            ₹{remainingBudget.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Footer Ad */}
      <AdPlacement position="footer" adType="adsense" />

      {/* Donation Section */}
      <section className="container mx-auto px-4 py-8">
        <DonationSection upiId="9430253372@fam" buyMeACoffeeUrl="buymeacoffee.com/arnavsinhav" />
      </section>

      {/* Footer */}
      <footer className="border-t bg-card/50 backdrop-blur-sm mt-16">
        <div className="container mx-auto py-8 px-8">
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
    </div>
  );
};

export default Index;
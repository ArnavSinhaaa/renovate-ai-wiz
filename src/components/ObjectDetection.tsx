/**
 * ObjectDetection Component
 * Displays AI-detected objects with upgrade options (Budget, Standard, Premium)
 */

import React, { useState } from 'react';
import { Eye, MapPin, Lightbulb, ExternalLink, IndianRupee, Clock, TrendingUp, ChevronDown, ChevronUp, ShoppingCart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

/**
 * Upgrade option interface
 */
interface UpgradeOption {
  title: string;
  description: string;
  cost: number;
  timelineDays: number;
  impact: 'Low' | 'Medium' | 'High';
  shoppingLinks: Array<{
    store: string;
    url: string;
    price: string;
  }>;
}

/**
 * Interface for detected objects with upgrade tiers
 */
interface DetectedObject {
  name: string;
  confidence: number;
  location: string;
  condition?: string;
  upgrades?: {
    budget: UpgradeOption;
    standard: UpgradeOption;
    premium: UpgradeOption;
  };
  // Legacy fields for backward compatibility
  projectTitle?: string;
  roomArea?: string;
  projectType?: string;
  issueSolved?: string;
  estimatedCost?: number;
  timelineDays?: number;
  shoppingLinks?: Array<{
    store: string;
    url: string;
    price: string;
  }>;
}

interface ObjectDetectionProps {
  detectedObjects: DetectedObject[];
  isAnalyzing: boolean;
  onAddToCart?: (item: { name: string; upgrade: string; cost: number; description: string }) => void;
}

const impactColors = {
  Low: 'bg-blue-500/20 text-blue-600 dark:text-blue-400',
  Medium: 'bg-amber-500/20 text-amber-600 dark:text-amber-400',
  High: 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
};

const tierColors = {
  budget: 'border-blue-500/50 bg-blue-500/5',
  standard: 'border-amber-500/50 bg-amber-500/5',
  premium: 'border-emerald-500/50 bg-emerald-500/5'
};

const tierLabels = {
  budget: { label: 'Budget', icon: '💰', description: 'Affordable upgrades' },
  standard: { label: 'Standard', icon: '⭐', description: 'Best value' },
  premium: { label: 'Premium', icon: '👑', description: 'Luxury upgrades' }
};

export const ObjectDetection: React.FC<ObjectDetectionProps> = ({ 
  detectedObjects, 
  isAnalyzing,
  onAddToCart
}) => {
  const [expandedObjects, setExpandedObjects] = useState<Set<number>>(new Set([0]));
  const [selectedUpgrades, setSelectedUpgrades] = useState<Map<number, string>>(new Map());

  const toggleExpand = (index: number) => {
    setExpandedObjects(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const handleSelectUpgrade = (objectIndex: number, tier: string, obj: DetectedObject) => {
    setSelectedUpgrades(prev => {
      const newMap = new Map(prev);
      if (newMap.get(objectIndex) === tier) {
        newMap.delete(objectIndex);
      } else {
        newMap.set(objectIndex, tier);
      }
      return newMap;
    });

    const upgrade = obj.upgrades?.[tier as keyof typeof obj.upgrades];
    if (upgrade && onAddToCart) {
      onAddToCart({
        name: obj.name,
        upgrade: tier,
        cost: upgrade.cost,
        description: upgrade.title
      });
      toast.success(`${tierLabels[tier as keyof typeof tierLabels].label} upgrade added!`, {
        description: `${obj.name}: ${upgrade.title}`
      });
    }
  };

  // Loading state
  if (isAnalyzing) {
    return (
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-primary animate-pulse" />
            Analyzing Your Room...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-3 p-4 rounded-lg bg-muted/30">
                <div className="w-12 h-12 bg-muted rounded-lg animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
                  <div className="h-3 bg-muted rounded animate-pulse w-1/2" />
                  <div className="flex gap-2 mt-2">
                    <div className="h-8 bg-muted rounded animate-pulse w-20" />
                    <div className="h-8 bg-muted rounded animate-pulse w-20" />
                    <div className="h-8 bg-muted rounded animate-pulse w-20" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Empty state
  if (detectedObjects.length === 0) {
    return (
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-primary" />
            AI Renovation Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Eye className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Upload a room photo to get personalized upgrade suggestions</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {detectedObjects.map((obj, index) => {
        const isExpanded = expandedObjects.has(index);
        const hasUpgrades = obj.upgrades && Object.keys(obj.upgrades).length > 0;
        const selectedTier = selectedUpgrades.get(index);

        return (
          <Card key={index} className="shadow-soft overflow-hidden transition-all duration-300 hover:shadow-lg">
            {/* Object Header - Always visible */}
            <div 
              className="p-4 cursor-pointer hover:bg-muted/30 transition-colors"
              onClick={() => toggleExpand(index)}
            >
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-gradient-primary text-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                  <Lightbulb className="w-6 h-6" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-lg">{obj.name}</h3>
                    <Badge variant="outline" className="text-xs">
                      {Math.round(obj.confidence * 100)}% match
                    </Badge>
                    {selectedTier && (
                      <Badge className={`text-xs ${tierColors[selectedTier as keyof typeof tierColors]}`}>
                        {tierLabels[selectedTier as keyof typeof tierLabels].icon} Selected
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {obj.location}
                    </span>
                    {obj.condition && (
                      <span className="text-xs italic">• {obj.condition}</span>
                    )}
                  </div>

                  {/* Quick price range preview */}
                  {hasUpgrades && (
                    <div className="flex items-center gap-4 mt-2 text-sm">
                      <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                        <IndianRupee className="w-3 h-3" />
                        {obj.upgrades!.budget.cost.toLocaleString()}
                      </span>
                      <span className="text-muted-foreground">to</span>
                      <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                        <IndianRupee className="w-3 h-3" />
                        {obj.upgrades!.premium.cost.toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>

                <Button variant="ghost" size="sm" className="flex-shrink-0">
                  {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </Button>
              </div>
            </div>

            {/* Upgrade Options - Expandable */}
            {isExpanded && hasUpgrades && (
              <CardContent className="pt-0 pb-4">
                <Tabs defaultValue="standard" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 mb-4">
                    {(Object.keys(tierLabels) as Array<keyof typeof tierLabels>).map((tier) => (
                      <TabsTrigger 
                        key={tier} 
                        value={tier}
                        className={`text-sm ${selectedTier === tier ? 'ring-2 ring-primary' : ''}`}
                      >
                        {tierLabels[tier].icon} {tierLabels[tier].label}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {(Object.keys(obj.upgrades!) as Array<keyof typeof obj.upgrades>).map((tier) => {
                    const upgrade = obj.upgrades![tier];
                    if (!upgrade) return null;

                    return (
                      <TabsContent key={tier} value={tier} className="mt-0">
                        <div className={`p-4 rounded-xl border-2 ${tierColors[tier]} transition-all`}>
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className="font-bold text-base">{upgrade.title}</h4>
                              <p className="text-sm text-muted-foreground mt-1">{upgrade.description}</p>
                            </div>
                            <Badge className={impactColors[upgrade.impact]}>
                              <TrendingUp className="w-3 h-3 mr-1" />
                              {upgrade.impact} Impact
                            </Badge>
                          </div>

                          <div className="flex items-center gap-6 my-4">
                            <div className="flex items-center gap-1">
                              <IndianRupee className="w-4 h-4 text-primary" />
                              <span className="font-bold text-xl text-primary">
                                {upgrade.cost.toLocaleString()}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Clock className="w-4 h-4" />
                              <span>{upgrade.timelineDays} {upgrade.timelineDays === 1 ? 'day' : 'days'}</span>
                            </div>
                          </div>

                          {/* Shopping Links */}
                          {upgrade.shoppingLinks && upgrade.shoppingLinks.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4">
                              {upgrade.shoppingLinks.map((link, idx) => (
                                <a 
                                  key={idx}
                                  href={link.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors text-sm"
                                >
                                  {link.store}
                                  <span className="text-xs opacity-70">{link.price}</span>
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              ))}
                            </div>
                          )}

                          <Button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectUpgrade(index, tier, obj);
                            }}
                            className={`w-full ${selectedTier === tier ? 'bg-primary/20 text-primary border-2 border-primary' : 'bg-gradient-primary text-white'}`}
                            variant={selectedTier === tier ? "outline" : "default"}
                          >
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            {selectedTier === tier ? 'Selected ✓' : `Choose ${tierLabels[tier].label}`}
                          </Button>
                        </div>
                      </TabsContent>
                    );
                  })}
                </Tabs>
              </CardContent>
            )}

            {/* Legacy display for objects without new upgrade structure */}
            {isExpanded && !hasUpgrades && obj.estimatedCost && (
              <CardContent className="pt-0">
                <div className="p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div>
                      <span className="font-semibold text-primary">₹{obj.estimatedCost.toLocaleString()}</span>
                      <span className="text-muted-foreground ml-1">estimated</span>
                    </div>
                    {obj.timelineDays && (
                      <div className="text-muted-foreground">
                        {obj.timelineDays} days
                      </div>
                    )}
                  </div>
                  {obj.shoppingLinks && obj.shoppingLinks.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {obj.shoppingLinks.map((link, idx) => (
                        <a 
                          key={idx}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2 py-1 rounded bg-muted text-sm hover:bg-primary hover:text-primary-foreground transition-colors"
                        >
                          {link.store} - {link.price}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            )}
          </Card>
        );
      })}

      {/* Summary */}
      {selectedUpgrades.size > 0 && (
        <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/30">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">{selectedUpgrades.size} upgrades selected</p>
                <p className="text-sm text-muted-foreground">
                  Scroll down to see your total budget
                </p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setSelectedUpgrades(new Map())}
              >
                Clear All
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ObjectDetection;
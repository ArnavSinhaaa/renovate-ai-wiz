/**
 * RenovationSuggestionCard Component
 * Displays individual renovation suggestions with detailed information
 * Includes cost breakdown, shopping links, and add-to-cart functionality
 */

import React from 'react';
import { Clock, DollarSign, Zap, User, ShoppingCart, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RenovationSuggestion } from '@/data/renovationSuggestions';

/**
 * Props interface for RenovationSuggestionCard component
 * @interface RenovationSuggestionCardProps
 */
interface RenovationSuggestionCardProps {
  /** The renovation suggestion data to display */
  suggestion: RenovationSuggestion;
  /** Callback function when user adds suggestion to cart */
  onAddToCart: (suggestion: RenovationSuggestion) => void;
  /** Whether this suggestion is already in the user's cart */
  isInCart: boolean;
}

/**
 * RenovationSuggestionCard component for displaying renovation suggestions
 * @param props - Component props
 * @returns JSX element containing the suggestion card
 */
export const RenovationSuggestionCard: React.FC<RenovationSuggestionCardProps> = ({
  suggestion,
  onAddToCart,
  isInCart
}) => {
  /**
   * Color mapping for impact level badges
   * Provides visual distinction between High, Medium, and Low impact suggestions
   */
  const impactColors = {
    'High': 'bg-gradient-warm text-white',
    'Medium': 'bg-gradient-sage text-foreground',
    'Low': 'bg-muted text-muted-foreground'
  };

  /**
   * Icon mapping for project types
   * Shows different icons for DIY vs Professional projects
   */
  const typeIcons = {
    'DIY': User,
    'Professional': Zap
  };

  // Get the appropriate icon component for the project type
  const TypeIcon = typeIcons[suggestion.type];

  return (
    <Card className="h-full flex flex-col shadow-soft hover:shadow-warm transition-all duration-300 hover:scale-[1.02]">
      {/* Card Header - Title, Impact Badge, and Metadata */}
      <CardHeader className="pb-4">
        {/* Title and Impact Badge Row */}
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg leading-tight">{suggestion.suggestion}</CardTitle>
          <Badge className={impactColors[suggestion.impact]}>
            {suggestion.impact}
          </Badge>
        </div>
        
        {/* Room Type and Project Type Metadata */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="px-2 py-1 bg-accent rounded-full">{suggestion.room}</span>
          <span>•</span>
          <div className="flex items-center gap-1">
            <TypeIcon className="w-3 h-3" />
            <span>{suggestion.type}</span>
          </div>
        </div>
      </CardHeader>

      {/* Card Content - Main information and details */}
      <CardContent className="flex-1 space-y-4">
        {/* Issue Solved Section - Shows why this suggestion helps */}
        {suggestion.issueSolved && (
          <div className="p-3 bg-accent/50 rounded-lg">
            <p className="text-sm">
              <strong className="text-primary">Why this helps:</strong>
              <span className="text-muted-foreground ml-2">{suggestion.issueSolved}</span>
            </p>
          </div>
        )}
        
        {/* Issue Description - Shows the problem this addresses */}
        {!suggestion.issueSolved && (
          <p className="text-sm text-muted-foreground leading-relaxed">
            <strong>Issue:</strong> {suggestion.condition}
          </p>
        )}

        {/* Cost and Timeline Information */}
        <div className="space-y-3">
          {/* Cost and Timeline Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Cost Information */}
            <div className="flex items-center gap-2 text-sm">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="font-medium">₹{suggestion.cost.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Total cost</p>
              </div>
            </div>

            {/* Timeline Information */}
            <div className="flex items-center gap-2 text-sm">
              <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center">
                <Clock className="w-4 h-4 text-secondary-foreground" />
              </div>
              <div>
                <p className="font-medium">{suggestion.time} {suggestion.time === 1 ? 'day' : 'days'}</p>
                <p className="text-xs text-muted-foreground">Timeline</p>
              </div>
            </div>
          </div>

          {/* Cost Breakdown for specific renovation types */}
          {/* Only show detailed breakdown for major renovation projects */}
          {(suggestion.suggestion.toLowerCase().includes('paint') || 
            suggestion.suggestion.toLowerCase().includes('wall') ||
            suggestion.suggestion.toLowerCase().includes('floor') ||
            suggestion.suggestion.toLowerCase().includes('tile')) && (
            <div className="p-3 bg-muted/50 rounded-lg space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase">Cost Breakdown</p>
              <div className="space-y-1 text-xs">
                {/* Paint/Wall Renovation Cost Breakdown */}
                {suggestion.suggestion.toLowerCase().includes('paint') || suggestion.suggestion.toLowerCase().includes('wall') ? (
                  <>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Paint materials</span>
                      <span className="font-medium">₹{Math.floor(suggestion.cost * 0.4).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Labor charges</span>
                      <span className="font-medium">₹{Math.floor(suggestion.cost * 0.45).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Surface prep & tools</span>
                      <span className="font-medium">₹{Math.floor(suggestion.cost * 0.15).toLocaleString()}</span>
                    </div>
                  </>
                ) : null}
                
                {/* Flooring Renovation Cost Breakdown (non-tile) */}
                {suggestion.suggestion.toLowerCase().includes('floor') && !suggestion.suggestion.toLowerCase().includes('tile') ? (
                  <>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Flooring materials</span>
                      <span className="font-medium">₹{Math.floor(suggestion.cost * 0.55).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Installation labor</span>
                      <span className="font-medium">₹{Math.floor(suggestion.cost * 0.35).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Adhesive & finishing</span>
                      <span className="font-medium">₹{Math.floor(suggestion.cost * 0.1).toLocaleString()}</span>
                    </div>
                  </>
                ) : null}

                {/* Tile Installation Cost Breakdown */}
                {suggestion.suggestion.toLowerCase().includes('tile') ? (
                  <>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tiles</span>
                      <span className="font-medium">₹{Math.floor(suggestion.cost * 0.5).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Installation & grouting</span>
                      <span className="font-medium">₹{Math.floor(suggestion.cost * 0.35).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Materials & prep</span>
                      <span className="font-medium">₹{Math.floor(suggestion.cost * 0.15).toLocaleString()}</span>
                    </div>
                  </>
                ) : null}
              </div>
            </div>
          )}
        </div>

        {/* Shopping Links Section */}
        <div className="space-y-2">
          <p className="text-sm font-medium flex items-center gap-1">
            <ShoppingCart className="w-4 h-4" />
            Shop from:
          </p>
          <div className="flex flex-wrap gap-2">
            {suggestion.buyLinks.map((link, index) => (
              <a 
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block"
              >
                <Badge 
                  variant="outline" 
                  className="text-xs cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors flex items-center gap-1"
                >
                  {link.store} - {link.price}
                  <ExternalLink className="w-3 h-3" />
                </Badge>
              </a>
            ))}
          </div>
        </div>
      </CardContent>

      {/* Card Footer - Add to Cart Button */}
      <CardFooter>
        <Button 
          onClick={() => onAddToCart(suggestion)}
          disabled={isInCart}
          className="w-full"
          variant={isInCart ? "secondary" : "default"}
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          {isInCart ? 'Added to Cart' : 'Add to Cart'}
        </Button>
      </CardFooter>
    </Card>
  );
};
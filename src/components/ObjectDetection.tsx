/**
 * ObjectDetection Component
 * Displays the results of AI analysis on uploaded room images
 * Shows detected objects with their properties, costs, and shopping links
 */

import React from 'react';
import { Eye, MapPin, Lightbulb, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

/**
 * Interface for detected objects with enhanced properties
 * @interface DetectedObject
 */
interface DetectedObject {
  /** Name of the detected object */
  name: string;
  /** AI confidence score (0-1) */
  confidence: number;
  /** Location of the object in the room */
  location: string;
  /** Optional condition assessment */
  condition?: string;
  /** Project title for renovation suggestions */
  projectTitle?: string;
  /** Room area where the object is located */
  roomArea?: string;
  /** Type of renovation project */
  projectType?: string;
  /** Description of the issue this solves */
  issueSolved?: string;
  /** Estimated cost in rupees */
  estimatedCost?: number;
  /** Timeline in days */
  timelineDays?: number;
  /** Shopping links for purchasing items */
  shoppingLinks?: Array<{
    store: string;
    url: string;
    price: string;
  }>;
}

/**
 * Props interface for ObjectDetection component
 * @interface ObjectDetectionProps
 */
interface ObjectDetectionProps {
  /** Array of detected objects from AI analysis */
  detectedObjects: DetectedObject[];
  /** Whether analysis is currently in progress */
  isAnalyzing: boolean;
}

/**
 * ObjectDetection component for displaying AI analysis results
 * @param props - Component props
 * @returns JSX element containing the detection results
 */
export const ObjectDetection: React.FC<ObjectDetectionProps> = ({ 
  detectedObjects, 
  isAnalyzing 
}) => {
  // Show loading state while AI is analyzing
  if (isAnalyzing) {
    return (
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-primary" />
            Analyzing Objects...
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Skeleton loading animation */}
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-12 h-12 bg-muted rounded-lg animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded animate-pulse" />
                  <div className="h-3 bg-muted rounded w-2/3 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show empty state when no objects are detected
  if (detectedObjects.length === 0) {
    return (
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-primary" />
            Object Detection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Eye className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Upload a room photo to detect objects and get renovation suggestions</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show detected objects with detailed information
  return (
    <Card className="shadow-soft">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="w-5 h-5 text-primary" />
          Detected Objects ({detectedObjects.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Render each detected object */}
          {detectedObjects.map((obj, index) => (
            <div key={index} className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg border border-border/50">
              {/* Object icon */}
              <div className="w-10 h-10 bg-gradient-warm text-white rounded-lg flex items-center justify-center flex-shrink-0">
                <Lightbulb className="w-5 h-5" />
              </div>
              
              <div className="flex-1 min-w-0">
                {/* Object name and confidence score */}
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-semibold text-base">{obj.projectTitle || obj.name}</h4>
                  <Badge variant="outline" className="text-xs">
                    {Math.round(obj.confidence * 100)}% match
                  </Badge>
                </div>
                
                {/* Room area and project type badges */}
                {obj.roomArea && (
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="text-xs">{obj.roomArea}</Badge>
                    {obj.projectType && (
                      <Badge variant="secondary" className="text-xs">{obj.projectType}</Badge>
                    )}
                  </div>
                )}
                
                {/* Object location */}
                <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                  <MapPin className="w-3 h-3" />
                  <span>{obj.location}</span>
                </div>
                
                {/* Issue solved description */}
                {obj.issueSolved && (
                  <div className="mb-2 p-2 bg-accent/50 rounded">
                    <p className="text-sm">
                      <strong className="text-primary">Benefit:</strong>
                      <span className="text-muted-foreground ml-1">{obj.issueSolved}</span>
                    </p>
                  </div>
                )}
                
                {/* Cost and timeline information */}
                {obj.estimatedCost && (
                  <div className="flex items-center gap-4 mt-3 text-sm">
                    <div>
                      <span className="font-semibold text-primary">₹{obj.estimatedCost.toLocaleString()}</span>
                      <span className="text-muted-foreground ml-1">estimated</span>
                    </div>
                    {obj.timelineDays && (
                      <div>
                        <span className="font-semibold">{obj.timelineDays}</span>
                        <span className="text-muted-foreground ml-1">{obj.timelineDays === 1 ? 'day' : 'days'}</span>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Shopping links */}
                {obj.shoppingLinks && obj.shoppingLinks.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {obj.shoppingLinks.map((link, idx) => (
                      <a 
                        key={idx}
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
                )}
                
                {/* Additional condition notes */}
                {obj.condition && !obj.projectTitle && (
                  <p className="text-sm text-muted-foreground mt-2">
                    <strong>Notes:</strong> {obj.condition}
                  </p>
                )}
              </div>
            </div>
          ))}
          
          {/* Analysis completion summary */}
          <div className="mt-4 p-3 bg-accent/50 rounded-lg">
            <div className="flex items-center gap-2 text-sm">
              <Lightbulb className="w-4 h-4 text-primary" />
              <span className="font-medium">AI Analysis Complete</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Based on these objects, we'll suggest relevant renovation ideas below.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ObjectDetection;
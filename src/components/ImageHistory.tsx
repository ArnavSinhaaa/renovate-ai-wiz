/**
 * ImageHistory Component
 * Displays user's uploaded images and analysis history
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ImageIcon, Calendar, Eye, Trash2, Download } from 'lucide-react';
import { useUserSession } from '@/hooks/useUserSession';
import { toast } from 'sonner';
import type { UserImage, AnalysisResult } from '@/services/database';

interface ImageHistoryProps {
  onImageSelect?: (imageUrl: string, analysisData?: AnalysisResult) => void;
  className?: string;
}

/**
 * ImageHistory component for displaying user's image history
 * @param props - Component props
 * @returns JSX element containing the image history
 */
export const ImageHistory: React.FC<ImageHistoryProps> = ({
  onImageSelect,
  className = ''
}) => {
  const { getUserImages, getUserAnalyses, user, isLoading } = useUserSession();
  const [images, setImages] = useState<UserImage[]>([]);
  const [analyses, setAnalyses] = useState<AnalysisResult[]>([]);
  const [loading, setLoading] = useState(false);

  // Load user's images and analyses
  useEffect(() => {
    const loadUserData = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const [userImages, userAnalyses] = await Promise.all([
          getUserImages(),
          getUserAnalyses()
        ]);
        
        setImages(userImages);
        setAnalyses(userAnalyses);
      } catch (error) {
        console.error('Failed to load user data:', error);
        toast.error('Failed to load image history');
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [user, getUserImages, getUserAnalyses]);

  // Get analysis for a specific image
  const getImageAnalysis = (imageId: string): AnalysisResult | undefined => {
    return analyses.find(analysis => analysis.image_id === imageId);
  };

  // Format date for display
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Handle image selection
  const handleImageSelect = (image: UserImage) => {
    const analysis = getImageAnalysis(image.id);
    onImageSelect?.(image.image_url, analysis);
  };

  // Handle image deletion
  const handleImageDelete = async (imageId: string) => {
    try {
      // Remove from local state
      setImages(prev => prev.filter(img => img.id !== imageId));
      setAnalyses(prev => prev.filter(analysis => analysis.image_id !== imageId));
      
      toast.success('Image deleted successfully');
    } catch (error) {
      console.error('Failed to delete image:', error);
      toast.error('Failed to delete image');
    }
  };

  if (isLoading || loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5" />
            Image History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-sm text-muted-foreground mt-2">Loading your images...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (images.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5" />
            Image History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No images uploaded yet</p>
            <p className="text-sm text-muted-foreground">
              Upload your first room photo to get started!
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="w-5 h-5" />
          Image History ({images.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {images.map((image) => {
            const analysis = getImageAnalysis(image.id);
            const detectedObjects = analysis?.detected_objects as any[] || [];
            
            return (
              <div
                key={image.id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleImageSelect(image)}
              >
                <div className="flex gap-4">
                  {/* Image thumbnail */}
                  <div className="flex-shrink-0">
                    <img
                      src={image.image_url}
                      alt={image.image_name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  </div>
                  
                  {/* Image details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-sm truncate">
                        {image.image_name}
                      </h4>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleImageSelect(image);
                          }}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleImageDelete(image.id);
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(image.uploaded_at)}</span>
                      <Badge variant="secondary" className="text-xs">
                        {Math.round(image.image_size / 1024)}KB
                      </Badge>
                    </div>
                    
                    {/* Analysis status */}
                    {analysis ? (
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="default" className="text-xs">
                            Analyzed
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {Math.round(analysis.analysis_confidence * 100)}% confidence
                          </span>
                        </div>
                        {detectedObjects.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {detectedObjects.slice(0, 3).map((obj, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {obj.name}
                              </Badge>
                            ))}
                            {detectedObjects.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{detectedObjects.length - 3} more
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      <Badge variant="secondary" className="text-xs">
                        Not analyzed
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default ImageHistory;


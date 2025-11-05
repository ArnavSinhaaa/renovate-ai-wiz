/**
 * ImageHistory Component
 * Displays user's uploaded room photos
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ImageIcon, Calendar, Eye, Trash2 } from 'lucide-react';
import { useUserSession } from '@/hooks/useUserSession';
import { toast } from 'sonner';
import type { UserPhoto } from '@/services/database';

interface ImageHistoryProps {
  onImageSelect?: (imageUrl: string) => void;
  className?: string;
}

/**
 * ImageHistory component for displaying user's photo history
 */
export const ImageHistory: React.FC<ImageHistoryProps> = ({
  onImageSelect,
  className = ''
}) => {
  const { getUserPhotos, deletePhoto, userId, isLoading } = useUserSession();
  const [photos, setPhotos] = useState<UserPhoto[]>([]);
  const [loading, setLoading] = useState(false);

  // Load user's photos
  useEffect(() => {
    const loadUserPhotos = async () => {
      if (!userId) return;

      try {
        setLoading(true);
        const userPhotos = await getUserPhotos();
        setPhotos(userPhotos);
      } catch (error) {
        console.error('Failed to load photos:', error);
        toast.error('Failed to load photo history');
      } finally {
        setLoading(false);
      }
    };

    loadUserPhotos();
  }, [userId, getUserPhotos]);

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

  // Handle photo selection
  const handlePhotoSelect = (photo: UserPhoto) => {
    onImageSelect?.(photo.image_url);
  };

  // Handle photo deletion
  const handlePhotoDelete = async (photoId: string) => {
    try {
      await deletePhoto(photoId);
      setPhotos(prev => prev.filter(photo => photo.id !== photoId));
      toast.success('Photo deleted successfully');
    } catch (error) {
      console.error('Failed to delete photo:', error);
      toast.error('Failed to delete photo');
    }
  };

  if (isLoading || loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5" />
            Photo History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-sm text-muted-foreground mt-2">Loading your photos...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (photos.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5" />
            Photo History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No photos uploaded yet</p>
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
          Photo History ({photos.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handlePhotoSelect(photo)}
            >
              <div className="flex gap-4">
                {/* Photo thumbnail */}
                <div className="flex-shrink-0">
                  <img
                    src={photo.image_url}
                    alt={photo.room_type || 'Room photo'}
                    className="w-20 h-20 object-cover rounded-lg"
                    loading="lazy"
                  />
                </div>
                
                {/* Photo details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-sm">
                      {photo.room_type || 'Room Photo'}
                    </h4>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePhotoSelect(photo);
                        }}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePhotoDelete(photo.id);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(photo.upload_timestamp)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ImageHistory;

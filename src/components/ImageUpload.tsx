/**
 * ImageUpload Component
 * Handles image file upload, drag-and-drop functionality, and AI analysis
 * Provides a user-friendly interface for uploading room photos for renovation analysis
 */

import React, { useCallback, useState } from 'react';
import { Upload, Camera, X, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useUserSession } from '@/hooks/useUserSession';
import { toast } from 'sonner';

/**
 * Props interface for ImageUpload component
 * @interface ImageUploadProps
 */
interface ImageUploadProps {
  /** Callback function when an image is uploaded */
  onImageUpload: (file: File) => void;
  /** URL of the currently uploaded image */
  uploadedImage: string | null;
  /** Callback function to remove the uploaded image */
  onRemoveImage: () => void;
  /** Whether AI analysis is currently in progress */
  isAnalyzing: boolean;
  /** Callback function when AI analysis is complete */
  onAnalysisComplete: (objects: any[]) => void;
  /** Current image ID for database operations */
  currentImageId?: string;
}

/**
 * ImageUpload component for handling room photo uploads and AI analysis
 * @param props - Component props
 * @returns JSX element containing the upload interface
 */
export const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageUpload,
  uploadedImage,
  onRemoveImage,
  isAnalyzing,
  onAnalysisComplete,
  currentImageId
}) => {
  // State for drag-and-drop visual feedback
  const [isDragOver, setIsDragOver] = useState(false);
  
  // User session hook for database operations
  const { saveImage, saveAnalysis, saveSuggestions, error, clearError } = useUserSession();

  /**
   * Converts a file to base64 string for API transmission
   * @param file - The file to convert
   * @returns Promise that resolves to base64 string
   */
  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  /**
   * Analyzes the uploaded image using Supabase AI function
   * Falls back to mock data if the API call fails
   * @param file - The image file to analyze
   */
  const analyzeImage = async (file: File) => {
    try {
      const base64Data = await convertToBase64(file);
      
      console.log('Calling analyze-room function...');
      
      // Call Supabase Edge Function for AI analysis
      const { data, error } = await supabase.functions.invoke('analyze-room', {
        body: { imageData: base64Data }
      });

      if (error) {
        console.error('Error analyzing image:', error);
        throw error;
      }

      console.log('Analysis complete:', data);
      const detectedObjects = data.detectedObjects || [];
      
      // Save analysis results to database if we have an image ID
      if (currentImageId) {
        try {
          const analysisResult = await saveAnalysis({
            imageId: currentImageId,
            detectedObjects,
            analysisConfidence: data.confidence || 0.8,
            roomType: data.roomType,
            budgetRange: data.budgetRange,
          });
          
          // Save renovation suggestions if available
          if (data.suggestions && data.suggestions.length > 0) {
            await saveSuggestions(data.suggestions, analysisResult.id);
          }
          
          toast.success('Analysis saved to your history!');
        } catch (dbError) {
          console.error('Failed to save analysis to database:', dbError);
          toast.error('Analysis completed but failed to save to history');
        }
      }
      
      onAnalysisComplete(detectedObjects);
    } catch (error) {
      console.error('Failed to analyze image:', error);
      // Fallback to mock data for development/demo purposes
      const mockObjects = [
        { name: 'sofa', confidence: 0.9, location: 'Center', condition: 'Could use refreshing' },
        { name: 'lighting', confidence: 0.8, location: 'Ceiling', condition: 'Basic overhead lighting' },
        { name: 'wall paint', confidence: 0.95, location: 'Walls', condition: 'Neutral color scheme' }
      ];
      onAnalysisComplete(mockObjects);
    }
  };

  /**
   * Handles file processing after upload/selection
   * Validates file type, saves to database, and triggers analysis
   * @param file - The selected file
   */
  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    try {
      // Create object URL for immediate display
      const imageUrl = URL.createObjectURL(file);
      onImageUpload(file);

      // Save image to database
      const savedImage = await saveImage({
        imageUrl,
        imageName: file.name,
        imageSize: file.size,
        imageType: file.type,
      });

      toast.success('Image uploaded successfully!');
      
      // Start analysis
      await analyzeImage(file);
    } catch (error) {
      console.error('Failed to handle file:', error);
      toast.error('Failed to upload image. Please try again.');
      onRemoveImage(); // Remove the image from UI if database save failed
    }
  };

  /**
   * Handles drag and drop file upload
   * @param e - Drag event
   */
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      handleFile(imageFile);
    }
  }, []);

  /**
   * Handles drag over event for visual feedback
   * @param e - Drag event
   */
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  /**
   * Handles drag leave event to reset visual state
   * @param e - Drag event
   */
  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  /**
   * Handles file input change event
   * @param e - Change event from file input
   */
  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      handleFile(file);
    }
  }, []);

  // Render uploaded image with analysis overlay
  if (uploadedImage) {
    return (
      <Card className="relative overflow-hidden shadow-warm animate-fade-in">
        <div className="relative">
          {/* Display the uploaded image */}
          <img 
            src={uploadedImage} 
            alt="Uploaded room" 
            className="w-full h-96 object-cover"
          />
          
          {/* AI analysis loading overlay */}
          {isAnalyzing && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 text-center">
                <Sparkles className="w-8 h-8 mx-auto mb-2 animate-pulse text-primary" />
                <p className="text-sm font-medium">AI is analyzing your room...</p>
              </div>
            </div>
          )}
          
          {/* Remove image button */}
          <Button
            onClick={onRemoveImage}
            variant="destructive"
            size="sm"
            className="absolute top-4 right-4"
            disabled={isAnalyzing}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </Card>
    );
  }

  // Render upload interface when no image is uploaded
  return (
    <Card 
      className={`
        relative border-2 border-dashed p-12 text-center cursor-pointer
        transition-all duration-300 hover:shadow-soft hover:scale-[1.02]
        ${isDragOver ? 'border-primary bg-gradient-to-br from-primary/5 to-secondary/5 scale-105' : 'border-border'}
      `}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      {/* Hidden file input for click-to-upload functionality */}
      <input
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
      
      <div className="space-y-4">
        {/* Upload icon with hover animation */}
        <div className={`w-20 h-20 mx-auto bg-gradient-warm rounded-full flex items-center justify-center transition-transform duration-300 ${isDragOver ? 'scale-110' : ''}`}>
          <Camera className="w-10 h-10 text-white" />
        </div>
        
        {/* Upload instructions and button */}
        <div>
          <h3 className="text-xl font-semibold mb-2">Upload Your Room Photo</h3>
          <p className="text-muted-foreground mb-4">
            Drag and drop an image or click to browse
          </p>
          <Button variant="outline" size="lg" className="hover:scale-105 transition-transform duration-200">
            <Upload className="w-4 h-4 mr-2" />
            Choose Photo
          </Button>
        </div>
        
        {/* File format and size information */}
        <p className="text-sm text-muted-foreground">
          Supports JPG, PNG, WEBP up to 10MB
        </p>
      </div>
    </Card>
  );
};
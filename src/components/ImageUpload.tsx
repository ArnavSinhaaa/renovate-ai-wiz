/**
 * ImageUpload Component - Enhanced Version
 * Handles image file upload, camera capture, drag-and-drop, and AI analysis
 * Provides a modern, user-friendly interface with multiple upload options
 */

import React, { useCallback, useState, useRef } from 'react';
import { Upload, Camera, X, Sparkles, Image as ImageIcon, RefreshCw, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useUserSession } from '@/hooks/useUserSession';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

/**
 * Props interface for ImageUpload component
 */
interface ImageUploadProps {
  onImageUpload: (file: File) => void;
  uploadedImage: string | null;
  onRemoveImage: () => void;
  isAnalyzing: boolean;
  onAnalysisComplete: (objects: any[]) => void;
  currentImageId?: string;
}

/**
 * Enhanced ImageUpload component with camera support
 */
export const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageUpload,
  uploadedImage,
  onRemoveImage,
  isAnalyzing,
  onAnalysisComplete,
  currentImageId
}) => {
  // State management
  const [isDragOver, setIsDragOver] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [uploadMode, setUploadMode] = useState<'upload' | 'camera'>('upload');
  
  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // User session hook for database operations
  const { saveImage, saveAnalysis, saveSuggestions } = useUserSession();

  /**
   * Converts a file to base64 string for API transmission
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
   */
  const analyzeImage = async (file: File) => {
    try {
      const base64Data = await convertToBase64(file);
      console.log('Calling analyze-room function...');
      
      const { data, error } = await supabase.functions.invoke('analyze-room-v2', {
        body: { imageBase64: base64Data, selectedProvider: 'GROQ', selectedModel: 'llama-3.2-11b-vision-preview' }
      });

      if (error) {
        console.error('Error analyzing image:', error);
        throw error;
      }

      console.log('Analysis complete:', data);
      if (data.status === 'rate_limited') {
        toast.error('Analysis provider rate limited. Please try again later or switch provider.');
      }
      const detectedObjects = data.detectedObjects || [];
      
      if (currentImageId) {
        try {
          const analysisResult = await saveAnalysis({
            imageId: currentImageId,
            detectedObjects,
            analysisConfidence: data.confidence || 0.8,
            roomType: data.roomType,
            budgetRange: data.budgetRange,
          });
          
          if (data.suggestions && data.suggestions.length > 0) {
            await saveSuggestions(data.suggestions, analysisResult.id);
          }
          
          console.log('Analysis saved to database:', analysisResult.id);
        } catch (dbError) {
          console.warn('Failed to save analysis to database:', dbError);
        }
      }
      
      onAnalysisComplete(detectedObjects);
    } catch (error) {
      console.error('Failed to analyze image:', error);
      toast.error('Failed to analyze image. Falling back to default detection.');
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
   */
  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    try {
      const imageUrl = URL.createObjectURL(file);
      onImageUpload(file);

      try {
        const savedImage = await saveImage({
          imageUrl,
          imageName: file.name,
          imageSize: file.size,
          imageType: file.type,
        });
        console.log('Image saved to database:', savedImage.id);
        toast.success('Image uploaded successfully!');
      } catch (dbError) {
        console.warn('Database save failed:', dbError);
        toast.success('Image uploaded! (Not saved to history)');
      }
      
      await analyzeImage(file);
    } catch (error) {
      console.error('Failed to handle file:', error);
      toast.error('Failed to upload image. Please try again.');
      onRemoveImage();
    }
  };

  /**
   * Start camera stream
   */
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        } 
      });
      
      setCameraStream(stream);
      setShowCamera(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      
      toast.success('Camera started!');
    } catch (error) {
      console.error('Failed to access camera:', error);
      toast.error('Failed to access camera. Please check permissions.');
    }
  };

  /**
   * Stop camera stream
   */
  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
      setShowCamera(false);
      setCapturedImage(null);
    }
  };

  /**
   * Capture photo from camera
   */
  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = canvas.toDataURL('image/jpeg', 0.9);
        setCapturedImage(imageData);
        toast.success('Photo captured!');
      }
    }
  };

  /**
   * Use captured photo
   */
  const useCapturedPhoto = async () => {
    if (capturedImage) {
      const response = await fetch(capturedImage);
      const blob = await response.blob();
      const file = new File([blob], `camera-${Date.now()}.jpg`, { type: 'image/jpeg' });
      
      stopCamera();
      await handleFile(file);
    }
  };

  /**
   * Retake photo
   */
  const retakePhoto = () => {
    setCapturedImage(null);
  };

  /**
   * Drag and drop handlers
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

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      handleFile(file);
    }
  }, []);

  // Render uploaded image with analysis overlay
  if (uploadedImage) {
    return (
      <Card className="relative overflow-hidden shadow-lg border-2 border-primary/20 animate-fade-in">
        <div className="relative group">
          <img 
            src={uploadedImage} 
            alt="Uploaded room" 
            className="w-full h-[500px] object-cover"
          />
          
          {isAnalyzing && (
            <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/50 to-black/60 flex items-center justify-center backdrop-blur-sm">
              <div className="bg-white/95 backdrop-blur-md rounded-2xl p-8 text-center shadow-2xl transform scale-100 animate-pulse">
                <div className="relative">
                  <Sparkles className="w-16 h-16 mx-auto mb-4 text-primary animate-spin" />
                  <div className="absolute inset-0 w-16 h-16 mx-auto">
                    <Sparkles className="w-16 h-16 text-secondary animate-ping opacity-50" />
                  </div>
                </div>
                <p className="text-lg font-bold text-gray-800 mb-2">AI Analysis in Progress</p>
                <p className="text-sm text-gray-600">Analyzing your room for renovation opportunities...</p>
                <div className="mt-4 flex gap-1 justify-center">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <Button
            onClick={onRemoveImage}
            variant="destructive"
            size="sm"
            className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg hover:scale-110"
            disabled={isAnalyzing}
          >
            <X className="w-4 h-4 mr-1" />
            Remove
          </Button>
        </div>
      </Card>
    );
  }

  // Camera view
  if (showCamera) {
    return (
      <Card className="relative overflow-hidden shadow-lg border-2 border-primary/20">
        <div className="relative bg-black">
          <video 
            ref={videoRef} 
            className="w-full h-[500px] object-cover"
            autoPlay 
            playsInline
          />
          <canvas ref={canvasRef} className="hidden" />
          
          {capturedImage && (
            <div className="absolute inset-0 bg-black">
              <img 
                src={capturedImage} 
                alt="Captured" 
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-4 px-4">
            {!capturedImage ? (
              <>
                <Button
                  onClick={stopCamera}
                  variant="outline"
                  size="lg"
                  className="bg-white/90 backdrop-blur-sm hover:bg-white"
                >
                  <X className="w-5 h-5 mr-2" />
                  Cancel
                </Button>
                <Button
                  onClick={capturePhoto}
                  size="lg"
                  className="bg-primary hover:bg-primary/90 shadow-lg px-8"
                >
                  <Camera className="w-5 h-5 mr-2" />
                  Capture Photo
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={retakePhoto}
                  variant="outline"
                  size="lg"
                  className="bg-white/90 backdrop-blur-sm hover:bg-white"
                >
                  <RefreshCw className="w-5 h-5 mr-2" />
                  Retake
                </Button>
                <Button
                  onClick={useCapturedPhoto}
                  size="lg"
                  className="bg-green-600 hover:bg-green-700 shadow-lg px-8"
                >
                  <Check className="w-5 h-5 mr-2" />
                  Use Photo
                </Button>
              </>
            )}
          </div>
        </div>
      </Card>
    );
  }

  // Upload interface
  return (
    <Card className="shadow-lg border-2 border-dashed border-primary/30 hover:border-primary/50 transition-all duration-300">
      <Tabs defaultValue="upload" value={uploadMode} onValueChange={(v) => setUploadMode(v as 'upload' | 'camera')} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Upload Photo
          </TabsTrigger>
          <TabsTrigger value="camera" className="flex items-center gap-2">
            <Camera className="w-4 h-4" />
            Take Photo
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="upload" className="mt-0">
          <div
            className={`
              relative p-12 text-center cursor-pointer rounded-lg
              transition-all duration-300 hover:bg-gradient-to-br hover:from-primary/5 hover:to-secondary/5
              ${isDragOver ? 'bg-gradient-to-br from-primary/10 to-secondary/10 scale-[1.02] border-primary' : ''}
            `}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            
            <div className="space-y-6">
              <div className={`w-24 h-24 mx-auto bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center transition-transform duration-300 shadow-lg ${isDragOver ? 'scale-110 rotate-6' : ''}`}>
                <ImageIcon className="w-12 h-12 text-white" />
              </div>
              
              <div>
                <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Upload Your Room Photo
                </h3>
                <p className="text-muted-foreground mb-6 text-lg">
                  Drag and drop an image here, or click to browse
                </p>
                <Button 
                  variant="default" 
                  size="lg" 
                  className="hover:scale-105 transition-transform duration-200 shadow-lg px-8"
                >
                  <Upload className="w-5 h-5 mr-2" />
                  Choose from Device
                </Button>
              </div>
              
              <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground pt-4 border-t">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>JPG, PNG, WEBP</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Up to 10MB</span>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="camera" className="mt-0">
          <div className="p-12 text-center">
            <div className="space-y-6">
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-secondary to-primary rounded-2xl flex items-center justify-center shadow-lg animate-pulse">
                <Camera className="w-12 h-12 text-white" />
              </div>
              
              <div>
                <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
                  Take a Photo
                </h3>
                <p className="text-muted-foreground mb-6 text-lg">
                  Use your device camera to capture your room
                </p>
                <Button 
                  onClick={startCamera}
                  size="lg" 
                  className="hover:scale-105 transition-transform duration-200 shadow-lg px-8 bg-gradient-to-r from-secondary to-primary"
                >
                  <Camera className="w-5 h-5 mr-2" />
                  Open Camera
                </Button>
              </div>
              
              <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground pt-4 border-t">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>HD Quality</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Instant Capture</span>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

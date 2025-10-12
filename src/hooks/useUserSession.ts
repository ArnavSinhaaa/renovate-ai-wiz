/**
 * Custom hook for managing user sessions and database operations
 */

import { useState, useEffect, useCallback } from 'react';
import { 
  generateSessionId, 
  getOrCreateUser, 
  saveUserImage, 
  getUserImages,
  saveAnalysisResult,
  getUserAnalysisResults,
  saveRenovationSuggestions,
  getUserStats,
  type User,
  type UserImage,
  type AnalysisResult
} from '@/services/database';

interface UserSessionState {
  user: User | null;
  sessionId: string | null;
  isLoading: boolean;
  error: string | null;
}

interface UserSessionActions {
  initializeSession: () => Promise<void>;
  saveImage: (imageData: {
    imageUrl: string;
    imageName: string;
    imageSize: number;
    imageType: string;
  }) => Promise<UserImage>;
  getUserImages: () => Promise<UserImage[]>;
  saveAnalysis: (analysisData: {
    imageId: string;
    detectedObjects: any[];
    analysisConfidence: number;
    roomType?: string;
    budgetRange?: string;
  }) => Promise<AnalysisResult>;
  getUserAnalyses: () => Promise<AnalysisResult[]>;
  saveSuggestions: (suggestions: any[], analysisId: string) => Promise<void>;
  getUserStats: () => Promise<{
    totalImages: number;
    totalAnalyses: number;
    totalSuggestions: number;
    lastActivity: string | null;
  }>;
  clearError: () => void;
}

/**
 * Custom hook for managing user sessions and database operations
 * @returns User session state and actions
 */
export const useUserSession = (): UserSessionState & UserSessionActions => {
  const [user, setUser] = useState<User | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Initialize user session
   */
  const initializeSession = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Get or create session ID
      let currentSessionId = sessionId;
      if (!currentSessionId) {
        currentSessionId = generateSessionId();
        setSessionId(currentSessionId);
        localStorage.setItem('fixfy_session_id', currentSessionId);
      }

      // Get or create user
      const userData = await getOrCreateUser(currentSessionId);
      setUser(userData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to initialize session';
      setError(errorMessage);
      console.error('Session initialization error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [sessionId]);

  /**
   * Save uploaded image
   */
  const saveImage = useCallback(async (imageData: {
    imageUrl: string;
    imageName: string;
    imageSize: number;
    imageType: string;
  }): Promise<UserImage> => {
    if (!user) {
      throw new Error('User not initialized');
    }

    try {
      setError(null);
      const savedImage = await saveUserImage(user.id, imageData);
      return savedImage;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save image';
      setError(errorMessage);
      throw err;
    }
  }, [user]);

  /**
   * Get user images
   */
  const getUserImagesList = useCallback(async (): Promise<UserImage[]> => {
    if (!user) {
      throw new Error('User not initialized');
    }

    try {
      setError(null);
      return await getUserImages(user.id);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch images';
      setError(errorMessage);
      throw err;
    }
  }, [user]);

  /**
   * Save analysis results
   */
  const saveAnalysis = useCallback(async (analysisData: {
    imageId: string;
    detectedObjects: any[];
    analysisConfidence: number;
    roomType?: string;
    budgetRange?: string;
  }): Promise<AnalysisResult> => {
    if (!user) {
      throw new Error('User not initialized');
    }

    try {
      setError(null);
      const savedAnalysis = await saveAnalysisResult({
        user_id: user.id,
        image_id: analysisData.imageId,
        detected_objects: analysisData.detectedObjects,
        analysis_confidence: analysisData.analysisConfidence,
        room_type: analysisData.roomType || null,
        budget_range: analysisData.budgetRange || null,
      });
      return savedAnalysis;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save analysis';
      setError(errorMessage);
      throw err;
    }
  }, [user]);

  /**
   * Get user analyses
   */
  const getUserAnalyses = useCallback(async (): Promise<AnalysisResult[]> => {
    if (!user) {
      throw new Error('User not initialized');
    }

    try {
      setError(null);
      return await getUserAnalysisResults(user.id);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch analyses';
      setError(errorMessage);
      throw err;
    }
  }, [user]);

  /**
   * Save renovation suggestions
   */
  const saveSuggestions = useCallback(async (suggestions: any[], analysisId: string): Promise<void> => {
    try {
      setError(null);
      const suggestionData = suggestions.map(suggestion => ({
        analysis_id: analysisId,
        suggestion_text: suggestion.suggestion || suggestion.text,
        suggestion_type: suggestion.type || 'general',
        estimated_cost: suggestion.cost || suggestion.estimatedCost || null,
        priority_score: suggestion.priority || 0,
        is_selected: false,
      }));

      await saveRenovationSuggestions(suggestionData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save suggestions';
      setError(errorMessage);
      throw err;
    }
  }, []);

  /**
   * Get user statistics
   */
  const getUserStatsData = useCallback(async () => {
    if (!user) {
      throw new Error('User not initialized');
    }

    try {
      setError(null);
      return await getUserStats(user.id);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch stats';
      setError(errorMessage);
      throw err;
    }
  }, [user]);

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Initialize session on mount
  useEffect(() => {
    // Check for existing session ID in localStorage
    const existingSessionId = localStorage.getItem('fixfy_session_id');
    if (existingSessionId) {
      setSessionId(existingSessionId);
    }
    
    initializeSession();
  }, [initializeSession]);

  return {
    // State
    user,
    sessionId,
    isLoading,
    error,
    
    // Actions
    initializeSession,
    saveImage,
    getUserImages: getUserImagesList,
    saveAnalysis,
    getUserAnalyses,
    saveSuggestions,
    getUserStats: getUserStatsData,
    clearError,
  };
};

export default useUserSession;


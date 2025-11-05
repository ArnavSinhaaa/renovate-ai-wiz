/**
 * Custom hook for managing user sessions and database operations
 */

import { useState, useEffect, useCallback } from 'react';
import { 
  generateSessionId,
  saveUserPhoto,
  getUserPhotos,
  deleteUserPhoto,
  type UserPhoto
} from '@/services/database';
import { supabase } from '@/integrations/supabase/client';

interface UserSessionState {
  userId: string | null;
  sessionId: string | null;
  isLoading: boolean;
  error: string | null;
}

interface UserSessionActions {
  initializeSession: () => Promise<void>;
  savePhoto: (photoData: { imageUrl: string; roomType?: string }) => Promise<UserPhoto>;
  getUserPhotos: () => Promise<UserPhoto[]>;
  deletePhoto: (photoId: string) => Promise<void>;
  clearError: () => void;
}

/**
 * Custom hook for managing user sessions and database operations
 * @returns User session state and actions
 */
export const useUserSession = (): UserSessionState & UserSessionActions => {
  const [userId, setUserId] = useState<string | null>(null);
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

      // Get current user from Supabase auth
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError) {
        console.warn('No authenticated user:', authError);
        setError('Please sign in to continue');
        return;
      }

      if (user) {
        setUserId(user.id);
        // Generate session ID if needed
        let currentSessionId = sessionId;
        if (!currentSessionId) {
          currentSessionId = generateSessionId();
          setSessionId(currentSessionId);
          localStorage.setItem('fixfy_session_id', currentSessionId);
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to initialize session';
      setError(errorMessage);
      console.error('Session initialization error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [sessionId]);

  /**
   * Save uploaded photo
   */
  const savePhoto = useCallback(async (photoData: {
    imageUrl: string;
    roomType?: string;
  }): Promise<UserPhoto> => {
    if (!userId) {
      throw new Error('User not authenticated');
    }

    try {
      setError(null);
      const savedPhoto = await saveUserPhoto(userId, photoData);
      return savedPhoto;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save photo';
      setError(errorMessage);
      throw err;
    }
  }, [userId]);

  /**
   * Get user photos
   */
  const getUserPhotosList = useCallback(async (): Promise<UserPhoto[]> => {
    if (!userId) {
      throw new Error('User not authenticated');
    }

    try {
      setError(null);
      return await getUserPhotos(userId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch photos';
      setError(errorMessage);
      throw err;
    }
  }, [userId]);

  /**
   * Delete photo
   */
  const deletePhoto = useCallback(async (photoId: string): Promise<void> => {
    try {
      setError(null);
      await deleteUserPhoto(photoId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete photo';
      setError(errorMessage);
      throw err;
    }
  }, []);

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
    userId,
    sessionId,
    isLoading,
    error,
    
    // Actions
    initializeSession,
    savePhoto,
    getUserPhotos: getUserPhotosList,
    deletePhoto,
    clearError,
  };
};

export default useUserSession;

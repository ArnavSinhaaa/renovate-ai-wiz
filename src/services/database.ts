/**
 * Database Service
 * Handles all database operations for the Fixfy application
 */

import { supabase } from '@/integrations/supabase/client';
import type { Tables, TablesInsert } from '@/integrations/supabase/types';

// Type definitions for our data models
export type User = Tables<'users'>;
export type UserImage = Tables<'user_images'>;
export type AnalysisResult = Tables<'analysis_results'>;
export type RenovationSuggestion = Tables<'renovation_suggestions'>;
export type UserSession = Tables<'user_sessions'>;

export type UserImageInsert = TablesInsert<'user_images'>;
export type AnalysisResultInsert = TablesInsert<'analysis_results'>;
export type RenovationSuggestionInsert = TablesInsert<'renovation_suggestions'>;
export type UserSessionInsert = TablesInsert<'user_sessions'>;

/**
 * Generate a unique session ID for anonymous users
 */
export const generateSessionId = (): string => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Get or create a user by session ID
 */
export const getOrCreateUser = async (sessionId: string): Promise<User> => {
  try {
    // First, try to get existing user
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('session_id', sessionId)
      .single();

    if (existingUser && !fetchError) {
      return existingUser;
    }

    // If user doesn't exist, create one
    const { data: newUser, error: createError } = await supabase
      .from('users')
      .insert({ session_id: sessionId })
      .select()
      .single();

    if (createError) {
      throw new Error(`Failed to create user: ${createError.message}`);
    }

    return newUser;
  } catch (error) {
    console.error('Error in getOrCreateUser:', error);
    throw error;
  }
};

/**
 * Save uploaded image to database
 */
export const saveUserImage = async (
  userId: string,
  imageData: {
    imageUrl: string;
    imageName: string;
    imageSize: number;
    imageType: string;
  }
): Promise<UserImage> => {
  try {
    const { data, error } = await supabase
      .from('user_images')
      .insert({
        user_id: userId,
        image_url: imageData.imageUrl,
        image_name: imageData.imageName,
        image_size: imageData.imageSize,
        image_type: imageData.imageType,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to save image: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Error in saveUserImage:', error);
    throw error;
  }
};

/**
 * Get user images
 */
export const getUserImages = async (userId: string): Promise<UserImage[]> => {
  try {
    const { data, error } = await supabase
      .from('user_images')
      .select('*')
      .eq('user_id', userId)
      .order('uploaded_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch images: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error('Error in getUserImages:', error);
    throw error;
  }
};

/**
 * Save analysis results to database
 */
export const saveAnalysisResult = async (
  analysisData: AnalysisResultInsert
): Promise<AnalysisResult> => {
  try {
    const { data, error } = await supabase
      .from('analysis_results')
      .insert(analysisData)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to save analysis: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Error in saveAnalysisResult:', error);
    throw error;
  }
};

/**
 * Get analysis results for a user
 */
export const getUserAnalysisResults = async (userId: string): Promise<AnalysisResult[]> => {
  try {
    const { data, error } = await supabase
      .from('analysis_results')
      .select(`
        *,
        user_images (
          image_url,
          image_name,
          uploaded_at
        )
      `)
      .eq('user_id', userId)
      .order('analysis_completed_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch analysis results: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error('Error in getUserAnalysisResults:', error);
    throw error;
  }
};

/**
 * Save renovation suggestions
 */
export const saveRenovationSuggestions = async (
  suggestions: RenovationSuggestionInsert[]
): Promise<RenovationSuggestion[]> => {
  try {
    const { data, error } = await supabase
      .from('renovation_suggestions')
      .insert(suggestions)
      .select();

    if (error) {
      throw new Error(`Failed to save suggestions: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error('Error in saveRenovationSuggestions:', error);
    throw error;
  }
};

/**
 * Get renovation suggestions for an analysis
 */
export const getRenovationSuggestions = async (analysisId: string): Promise<RenovationSuggestion[]> => {
  try {
    const { data, error } = await supabase
      .from('renovation_suggestions')
      .select('*')
      .eq('analysis_id', analysisId)
      .order('priority_score', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch suggestions: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error('Error in getRenovationSuggestions:', error);
    throw error;
  }
};

/**
 * Update renovation suggestion selection status
 */
export const updateSuggestionSelection = async (
  suggestionId: string,
  isSelected: boolean
): Promise<void> => {
  try {
    const { error } = await supabase
      .from('renovation_suggestions')
      .update({ is_selected: isSelected })
      .eq('id', suggestionId);

    if (error) {
      throw new Error(`Failed to update suggestion: ${error.message}`);
    }
  } catch (error) {
    console.error('Error in updateSuggestionSelection:', error);
    throw error;
  }
};

/**
 * Save or update user session data
 */
export const saveUserSession = async (
  userId: string,
  sessionData: Record<string, any>
): Promise<UserSession> => {
  try {
    // First, try to update existing session
    const { data: existingSession, error: fetchError } = await supabase
      .from('user_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('last_activity', { ascending: false })
      .limit(1)
      .single();

    if (existingSession && !fetchError) {
      // Update existing session
      const { data, error } = await supabase
        .from('user_sessions')
        .update({
          session_data: sessionData,
          last_activity: new Date().toISOString(),
        })
        .eq('id', existingSession.id)
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to update session: ${error.message}`);
      }

      return data;
    } else {
      // Create new session
      const { data, error } = await supabase
        .from('user_sessions')
        .insert({
          user_id: userId,
          session_data: sessionData,
          last_activity: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to create session: ${error.message}`);
      }

      return data;
    }
  } catch (error) {
    console.error('Error in saveUserSession:', error);
    throw error;
  }
};

/**
 * Get user session data
 */
export const getUserSession = async (userId: string): Promise<UserSession | null> => {
  try {
    const { data, error } = await supabase
      .from('user_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('last_activity', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found" error
      throw new Error(`Failed to fetch session: ${error.message}`);
    }

    return data || null;
  } catch (error) {
    console.error('Error in getUserSession:', error);
    throw error;
  }
};

/**
 * Delete user image and related data
 */
export const deleteUserImage = async (imageId: string): Promise<void> => {
  try {
    // Delete related analysis results and suggestions first
    const { error: analysisError } = await supabase
      .from('analysis_results')
      .delete()
      .eq('image_id', imageId);

    if (analysisError) {
      console.warn('Failed to delete analysis results:', analysisError);
    }

    // Delete the image
    const { error: imageError } = await supabase
      .from('user_images')
      .delete()
      .eq('id', imageId);

    if (imageError) {
      throw new Error(`Failed to delete image: ${imageError.message}`);
    }
  } catch (error) {
    console.error('Error in deleteUserImage:', error);
    throw error;
  }
};

/**
 * Get user statistics
 */
export const getUserStats = async (userId: string): Promise<{
  totalImages: number;
  totalAnalyses: number;
  totalSuggestions: number;
  lastActivity: string | null;
}> => {
  try {
    const [imagesResult, analysesResult, sessionResult] = await Promise.all([
      supabase
        .from('user_images')
        .select('id', { count: 'exact' })
        .eq('user_id', userId),
      supabase
        .from('analysis_results')
        .select('id', { count: 'exact' })
        .eq('user_id', userId),
      supabase
        .from('user_sessions')
        .select('last_activity')
        .eq('user_id', userId)
        .order('last_activity', { ascending: false })
        .limit(1)
        .single(),
    ]);

    const totalSuggestions = analysesResult.data?.length || 0;

    return {
      totalImages: imagesResult.count || 0,
      totalAnalyses: analysesResult.count || 0,
      totalSuggestions,
      lastActivity: sessionResult.data?.last_activity || null,
    };
  } catch (error) {
    console.error('Error in getUserStats:', error);
    throw error;
  }
};


/**
 * Database Service
 * Handles all database operations for user photos
 */

import { supabase } from '@/integrations/supabase/client';
import type { Tables, TablesInsert } from '@/integrations/supabase/types';

// Type definitions - only user_photos exists in current schema
export type UserPhoto = Tables<'user_photos'>;
export type UserPhotoInsert = TablesInsert<'user_photos'>;

/**
 * Generate a unique session ID for anonymous users
 */
export const generateSessionId = (): string => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Save uploaded photo to user_photos table
 */
export const saveUserPhoto = async (
  userId: string,
  photoData: {
    imageUrl: string;
    roomType?: string;
  }
): Promise<UserPhoto> => {
  try {
    const { data, error } = await supabase
      .from('user_photos')
      .insert({
        user_id: userId,
        image_url: photoData.imageUrl,
        room_type: photoData.roomType || null,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to save photo: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Error in saveUserPhoto:', error);
    throw error;
  }
};

/**
 * Get user photos
 */
export const getUserPhotos = async (userId: string): Promise<UserPhoto[]> => {
  try {
    const { data, error } = await supabase
      .from('user_photos')
      .select('*')
      .eq('user_id', userId)
      .order('upload_timestamp', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch photos: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error('Error in getUserPhotos:', error);
    throw error;
  }
};

/**
 * Delete user photo
 */
export const deleteUserPhoto = async (photoId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('user_photos')
      .delete()
      .eq('id', photoId);

    if (error) {
      throw new Error(`Failed to delete photo: ${error.message}`);
    }
  } catch (error) {
    console.error('Error in deleteUserPhoto:', error);
    throw error;
  }
};

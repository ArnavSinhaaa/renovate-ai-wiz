/**
 * Supabase Database Types
 * Auto-generated TypeScript types for the Supabase database schema
 * Provides type safety for all database operations
 */

/**
 * JSON type definition for Supabase
 * Represents any valid JSON value that can be stored in the database
 */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

/**
 * Main database schema type
 * Defines the structure of the entire Supabase database
 * @interface Database
 */
export type Database = {
  /**
   * Internal Supabase metadata
   * Used for version compatibility and client configuration
   */
  __InternalSupabase: {
    /** PostgREST API version for compatibility checks */
    PostgrestVersion: "13.0.4"
  }
  
  /**
   * Public schema - the main database schema accessible to clients
   * Contains all tables, views, functions, enums, and composite types
   */
  public: {
    /** Database tables - Fixfy application tables */
    Tables: {
      users: {
        Row: {
          id: string
          session_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          session_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      user_images: {
        Row: {
          id: string
          user_id: string
          image_url: string
          image_name: string
          image_size: number
          image_type: string
          uploaded_at: string
          processed: boolean
        }
        Insert: {
          id?: string
          user_id: string
          image_url: string
          image_name: string
          image_size: number
          image_type: string
          uploaded_at?: string
          processed?: boolean
        }
        Update: {
          id?: string
          user_id?: string
          image_url?: string
          image_name?: string
          image_size?: number
          image_type?: string
          uploaded_at?: string
          processed?: boolean
        }
      }
      analysis_results: {
        Row: {
          id: string
          user_id: string
          image_id: string
          detected_objects: Json
          analysis_confidence: number
          room_type: string | null
          budget_range: string | null
          analysis_completed_at: string
        }
        Insert: {
          id?: string
          user_id: string
          image_id: string
          detected_objects?: Json
          analysis_confidence?: number
          room_type?: string | null
          budget_range?: string | null
          analysis_completed_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          image_id?: string
          detected_objects?: Json
          analysis_confidence?: number
          room_type?: string | null
          budget_range?: string | null
          analysis_completed_at?: string
        }
      }
      renovation_suggestions: {
        Row: {
          id: string
          analysis_id: string
          suggestion_text: string
          suggestion_type: string
          estimated_cost: number | null
          priority_score: number
          is_selected: boolean
          created_at: string
        }
        Insert: {
          id?: string
          analysis_id: string
          suggestion_text: string
          suggestion_type: string
          estimated_cost?: number | null
          priority_score?: number
          is_selected?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          analysis_id?: string
          suggestion_text?: string
          suggestion_type?: string
          estimated_cost?: number | null
          priority_score?: number
          is_selected?: boolean
          created_at?: string
        }
      }
      user_sessions: {
        Row: {
          id: string
          user_id: string
          session_data: Json
          last_activity: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          session_data?: Json
          last_activity?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          session_data?: Json
          last_activity?: string
          created_at?: string
        }
      }
    }
    
    /** Database views - currently empty (no views defined) */
    Views: {
      [_ in never]: never
    }
    
    /** Database functions - currently empty (no functions defined) */
    Functions: {
      [_ in never]: never
    }
    
    /** Database enums - currently empty (no enums defined) */
    Enums: {
      [_ in never]: never
    }
    
    /** Database composite types - currently empty (no composite types defined) */
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

/**
 * Database type without internal Supabase metadata
 * Used for cleaner type definitions
 */
type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

/**
 * Default schema type (currently 'public')
 * Extracted from the database structure
 */
type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

/**
 * Generic type for extracting table row types
 * Provides type safety for table data retrieval
 * @template DefaultSchemaTableNameOrOptions - Table name or schema options
 * @template TableName - Specific table name (inferred from options)
 * @returns The row type for the specified table
 */
export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

/**
 * Generic type for extracting table insert types
 * Provides type safety for data insertion operations
 * @template DefaultSchemaTableNameOrOptions - Table name or schema options
 * @template TableName - Specific table name (inferred from options)
 * @returns The insert type for the specified table
 */
export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

/**
 * Generic type for extracting table update types
 * Provides type safety for data update operations
 * @template DefaultSchemaTableNameOrOptions - Table name or schema options
 * @template TableName - Specific table name (inferred from options)
 * @returns The update type for the specified table
 */
export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

/**
 * Generic type for extracting database enum types
 * Provides type safety for enum values in database operations
 * @template DefaultSchemaEnumNameOrOptions - Enum name or schema options
 * @template EnumName - Specific enum name (inferred from options)
 * @returns The enum type for the specified enum
 */
export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

/**
 * Generic type for extracting database composite types
 * Provides type safety for composite type values in database operations
 * @template PublicCompositeTypeNameOrOptions - Composite type name or schema options
 * @template CompositeTypeName - Specific composite type name (inferred from options)
 * @returns The composite type for the specified composite type
 */
export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

/**
 * Database constants and metadata
 * Contains static information about the database schema
 */
export const Constants = {
  /** Public schema constants */
  public: {
    /** Available enums in the public schema (currently empty) */
    Enums: {},
  },
} as const

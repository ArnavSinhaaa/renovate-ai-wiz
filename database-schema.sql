-- Fixfy Database Schema
-- This file contains the SQL schema for the Fixfy application database

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table for basic user management
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    session_id TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_images table for storing uploaded images
CREATE TABLE IF NOT EXISTS user_images (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    image_name TEXT NOT NULL,
    image_size INTEGER NOT NULL,
    image_type TEXT NOT NULL,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processed BOOLEAN DEFAULT FALSE
);

-- Create analysis_results table for storing AI analysis data
CREATE TABLE IF NOT EXISTS analysis_results (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    image_id UUID REFERENCES user_images(id) ON DELETE CASCADE,
    detected_objects JSONB NOT NULL DEFAULT '[]',
    analysis_confidence DECIMAL(3,2) DEFAULT 0.0,
    room_type TEXT,
    budget_range TEXT,
    analysis_completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create renovation_suggestions table for storing AI-generated suggestions
CREATE TABLE IF NOT EXISTS renovation_suggestions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    analysis_id UUID REFERENCES analysis_results(id) ON DELETE CASCADE,
    suggestion_text TEXT NOT NULL,
    suggestion_type TEXT NOT NULL,
    estimated_cost DECIMAL(10,2),
    priority_score INTEGER DEFAULT 0,
    is_selected BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_sessions table for tracking user activity
CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    session_data JSONB DEFAULT '{}',
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_images_user_id ON user_images(user_id);
CREATE INDEX IF NOT EXISTS idx_user_images_uploaded_at ON user_images(uploaded_at);
CREATE INDEX IF NOT EXISTS idx_analysis_results_user_id ON analysis_results(user_id);
CREATE INDEX IF NOT EXISTS idx_analysis_results_image_id ON analysis_results(image_id);
CREATE INDEX IF NOT EXISTS idx_renovation_suggestions_analysis_id ON renovation_suggestions(analysis_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE analysis_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE renovation_suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for anonymous access (since we're using session-based auth)
-- Users can only access their own data based on session_id

-- Users table policies
CREATE POLICY "Users can view their own data" ON users
    FOR SELECT USING (session_id = current_setting('request.jwt.claims', true)::json->>'session_id');

CREATE POLICY "Users can insert their own data" ON users
    FOR INSERT WITH CHECK (session_id = current_setting('request.jwt.claims', true)::json->>'session_id');

-- User images table policies
CREATE POLICY "Users can view their own images" ON user_images
    FOR SELECT USING (
        user_id IN (
            SELECT id FROM users 
            WHERE session_id = current_setting('request.jwt.claims', true)::json->>'session_id'
        )
    );

CREATE POLICY "Users can insert their own images" ON user_images
    FOR INSERT WITH CHECK (
        user_id IN (
            SELECT id FROM users 
            WHERE session_id = current_setting('request.jwt.claims', true)::json->>'session_id'
        )
    );

-- Analysis results table policies
CREATE POLICY "Users can view their own analysis results" ON analysis_results
    FOR SELECT USING (
        user_id IN (
            SELECT id FROM users 
            WHERE session_id = current_setting('request.jwt.claims', true)::json->>'session_id'
        )
    );

CREATE POLICY "Users can insert their own analysis results" ON analysis_results
    FOR INSERT WITH CHECK (
        user_id IN (
            SELECT id FROM users 
            WHERE session_id = current_setting('request.jwt.claims', true)::json->>'session_id'
        )
    );

-- Renovation suggestions table policies
CREATE POLICY "Users can view their own renovation suggestions" ON renovation_suggestions
    FOR SELECT USING (
        analysis_id IN (
            SELECT ar.id FROM analysis_results ar
            JOIN users u ON ar.user_id = u.id
            WHERE u.session_id = current_setting('request.jwt.claims', true)::json->>'session_id'
        )
    );

CREATE POLICY "Users can insert their own renovation suggestions" ON renovation_suggestions
    FOR INSERT WITH CHECK (
        analysis_id IN (
            SELECT ar.id FROM analysis_results ar
            JOIN users u ON ar.user_id = u.id
            WHERE u.session_id = current_setting('request.jwt.claims', true)::json->>'session_id'
        )
    );

-- User sessions table policies
CREATE POLICY "Users can view their own sessions" ON user_sessions
    FOR SELECT USING (
        user_id IN (
            SELECT id FROM users 
            WHERE session_id = current_setting('request.jwt.claims', true)::json->>'session_id'
        )
    );

CREATE POLICY "Users can insert their own sessions" ON user_sessions
    FOR INSERT WITH CHECK (
        user_id IN (
            SELECT id FROM users 
            WHERE session_id = current_setting('request.jwt.claims', true)::json->>'session_id'
        )
    );

-- Create functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create a function to get or create user by session
CREATE OR REPLACE FUNCTION get_or_create_user(session_id_param TEXT)
RETURNS UUID AS $$
DECLARE
    user_id UUID;
BEGIN
    -- Try to get existing user
    SELECT id INTO user_id FROM users WHERE session_id = session_id_param;
    
    -- If user doesn't exist, create one
    IF user_id IS NULL THEN
        INSERT INTO users (session_id) VALUES (session_id_param) RETURNING id INTO user_id;
    END IF;
    
    RETURN user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


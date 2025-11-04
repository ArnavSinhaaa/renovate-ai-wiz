-- Create user_photos table for storing uploaded room photos
CREATE TABLE IF NOT EXISTS public.user_photos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  room_type TEXT,
  image_url TEXT NOT NULL,
  upload_timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.user_photos ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own photos" 
ON public.user_photos 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own photos" 
ON public.user_photos 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own photos" 
ON public.user_photos 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create storage bucket for room photos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'room-photos',
  'room-photos',
  true,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for room photos
CREATE POLICY "Users can view their own room photos" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'room-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload their own room photos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'room-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own room photos" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'room-photos' AND auth.uid()::text = (storage.foldername(name))[1]);
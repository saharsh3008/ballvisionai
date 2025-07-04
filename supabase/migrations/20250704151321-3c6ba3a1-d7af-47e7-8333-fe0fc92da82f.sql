
-- Create table for storing video uploads and analysis results
CREATE TABLE public.video_analyses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  video_name TEXT NOT NULL,
  video_size BIGINT NOT NULL,
  video_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  
  -- Analysis results
  total_bounces INTEGER,
  average_speed DECIMAL(8,2),
  max_speed DECIMAL(8,2),
  min_speed DECIMAL(8,2),
  trajectory_data JSONB,
  
  -- Metadata
  processing_time_seconds INTEGER,
  frames_analyzed INTEGER,
  ball_detection_confidence DECIMAL(3,2),
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create storage bucket for video files
INSERT INTO storage.buckets (id, name, public) 
VALUES ('tennis-videos', 'tennis-videos', true);

-- Create policy for video bucket - allow public access for now
CREATE POLICY "Public Access" ON storage.objects 
FOR ALL USING (bucket_id = 'tennis-videos');

-- Add Row Level Security
ALTER TABLE public.video_analyses ENABLE ROW LEVEL SECURITY;

-- Create policy for public access to video analyses (modify later for user-specific access)
CREATE POLICY "Public can view video analyses" 
  ON public.video_analyses 
  FOR SELECT 
  USING (true);

CREATE POLICY "Public can insert video analyses" 
  ON public.video_analyses 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Public can update video analyses" 
  ON public.video_analyses 
  FOR UPDATE 
  USING (true);

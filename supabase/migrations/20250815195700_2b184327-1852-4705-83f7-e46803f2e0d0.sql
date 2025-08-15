-- Add video type column to youtube_videos table
ALTER TABLE public.youtube_videos 
ADD COLUMN video_type TEXT DEFAULT 'regular';

-- Add index for video type for better performance
CREATE INDEX idx_youtube_videos_type ON public.youtube_videos(video_type);

-- Add constraint to ensure valid video types
ALTER TABLE public.youtube_videos 
ADD CONSTRAINT valid_video_type 
CHECK (video_type IN ('regular', 'short', 'live'));
-- Create YouTube channels table
CREATE TABLE public.youtube_channels (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  channel_id TEXT NOT NULL UNIQUE,
  channel_title TEXT NOT NULL,
  channel_description TEXT,
  subscriber_count INTEGER,
  video_count INTEGER,
  view_count BIGINT,
  thumbnail_url TEXT,
  custom_url TEXT,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create YouTube videos table
CREATE TABLE public.youtube_videos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  video_id TEXT NOT NULL UNIQUE,
  channel_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  thumbnail_default TEXT,
  thumbnail_medium TEXT,
  thumbnail_high TEXT,
  thumbnail_standard TEXT,
  thumbnail_maxres TEXT,
  published_at TIMESTAMP WITH TIME ZONE NOT NULL,
  duration TEXT,
  view_count BIGINT,
  like_count INTEGER,
  comment_count INTEGER,
  category_name TEXT,
  tags TEXT[],
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.youtube_channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.youtube_videos ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access since this is a public website
CREATE POLICY "YouTube channels are publicly visible" 
ON public.youtube_channels 
FOR SELECT 
USING (true);

CREATE POLICY "YouTube videos are publicly visible" 
ON public.youtube_videos 
FOR SELECT 
USING (true);

-- Create policies for authenticated users to manage content
CREATE POLICY "Authenticated users can manage channels" 
ON public.youtube_channels 
FOR ALL 
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can manage videos" 
ON public.youtube_videos 
FOR ALL 
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- Create updated_at triggers
CREATE TRIGGER update_youtube_channels_updated_at
BEFORE UPDATE ON public.youtube_channels
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_youtube_videos_updated_at
BEFORE UPDATE ON public.youtube_videos
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_youtube_videos_channel_id ON public.youtube_videos(channel_id);
CREATE INDEX idx_youtube_videos_published_at ON public.youtube_videos(published_at DESC);
CREATE INDEX idx_youtube_videos_view_count ON public.youtube_videos(view_count DESC);
CREATE INDEX idx_youtube_videos_is_featured ON public.youtube_videos(is_featured);
CREATE INDEX idx_youtube_videos_category ON public.youtube_videos(category_name);
-- Create draft history table for autosave functionality
CREATE TABLE IF NOT EXISTS public.cms_blog_post_drafts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES public.cms_blog_posts(id) ON DELETE CASCADE,
  content JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.cms_blog_post_drafts ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users to manage drafts
CREATE POLICY "Authenticated users can manage drafts"
ON public.cms_blog_post_drafts
FOR ALL
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- Create index for faster queries
CREATE INDEX idx_blog_post_drafts_post_id ON public.cms_blog_post_drafts(post_id);
CREATE INDEX idx_blog_post_drafts_created_at ON public.cms_blog_post_drafts(created_at DESC);
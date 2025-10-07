-- Create comments table with spam prevention
CREATE TABLE IF NOT EXISTS public.blog_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.cms_blog_posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  author_name TEXT NOT NULL,
  author_email TEXT NOT NULL,
  content TEXT NOT NULL,
  parent_comment_id UUID REFERENCES public.blog_comments(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'spam', 'rejected')),
  ip_address TEXT,
  user_agent TEXT,
  spam_score NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create comment likes table
CREATE TABLE IF NOT EXISTS public.blog_comment_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  comment_id UUID NOT NULL REFERENCES public.blog_comments(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(comment_id, user_id),
  UNIQUE(comment_id, ip_address)
);

-- Create comment reports table
CREATE TABLE IF NOT EXISTS public.blog_comment_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  comment_id UUID NOT NULL REFERENCES public.blog_comments(id) ON DELETE CASCADE,
  reporter_email TEXT NOT NULL,
  reason TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.blog_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_comment_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_comment_reports ENABLE ROW LEVEL SECURITY;

-- RLS Policies for blog_comments
CREATE POLICY "Anyone can view approved comments"
  ON public.blog_comments
  FOR SELECT
  USING (status = 'approved');

CREATE POLICY "Anyone can insert comments"
  ON public.blog_comments
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update their own comments"
  ON public.blog_comments
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all comments"
  ON public.blog_comments
  FOR ALL
  USING (auth.uid() IS NOT NULL);

-- RLS Policies for blog_comment_likes
CREATE POLICY "Anyone can view likes"
  ON public.blog_comment_likes
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert likes"
  ON public.blog_comment_likes
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can delete their own likes"
  ON public.blog_comment_likes
  FOR DELETE
  USING (auth.uid() = user_id OR ip_address = current_setting('request.headers')::json->>'x-forwarded-for');

-- RLS Policies for blog_comment_reports
CREATE POLICY "Anyone can insert reports"
  ON public.blog_comment_reports
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view reports"
  ON public.blog_comment_reports
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Create indexes for performance
CREATE INDEX idx_blog_comments_post_id ON public.blog_comments(post_id);
CREATE INDEX idx_blog_comments_status ON public.blog_comments(status);
CREATE INDEX idx_blog_comments_parent_id ON public.blog_comments(parent_comment_id);
CREATE INDEX idx_blog_comment_likes_comment_id ON public.blog_comment_likes(comment_id);

-- Create trigger for updated_at
CREATE TRIGGER update_blog_comments_updated_at
  BEFORE UPDATE ON public.blog_comments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_cms_updated_at_column();
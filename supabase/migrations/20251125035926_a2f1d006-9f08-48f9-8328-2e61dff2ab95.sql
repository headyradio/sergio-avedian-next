-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

-- Only admins can manage roles
CREATE POLICY "Admins can manage all roles"
ON public.user_roles
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Update CMS Authors policies
DROP POLICY IF EXISTS "Authenticated users can manage authors" ON public.cms_authors;
CREATE POLICY "Admins can manage authors"
ON public.cms_authors
FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Update CMS Blog Posts policies
DROP POLICY IF EXISTS "Authenticated users can manage blog posts" ON public.cms_blog_posts;
CREATE POLICY "Admins can manage blog posts"
ON public.cms_blog_posts
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Update CMS Categories policies
DROP POLICY IF EXISTS "Authenticated users can manage categories" ON public.cms_categories;
CREATE POLICY "Admins can manage categories"
ON public.cms_categories
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Update CMS Newsletters policies
DROP POLICY IF EXISTS "Authenticated users can manage newsletters" ON public.cms_newsletters;
CREATE POLICY "Admins can manage newsletters"
ON public.cms_newsletters
FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Authenticated users can view newsletters" ON public.cms_newsletters;
CREATE POLICY "Admins can view newsletters"
ON public.cms_newsletters
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Update CMS Homepage Content policies
DROP POLICY IF EXISTS "Authenticated users can manage homepage content" ON public.cms_homepage_content;
CREATE POLICY "Admins can manage homepage content"
ON public.cms_homepage_content
FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Update CMS Footer Content policies
DROP POLICY IF EXISTS "Authenticated users can manage footer content" ON public.cms_footer_content;
CREATE POLICY "Admins can manage footer content"
ON public.cms_footer_content
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Update CMS Global Settings policies
DROP POLICY IF EXISTS "Authenticated users can manage global settings" ON public.cms_global_settings;
CREATE POLICY "Admins can manage global settings"
ON public.cms_global_settings
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Update CMS Navigation Items policies
DROP POLICY IF EXISTS "Authenticated users can manage navigation items" ON public.cms_navigation_items;
CREATE POLICY "Admins can manage navigation items"
ON public.cms_navigation_items
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Update CMS Blog Email Queue policies
DROP POLICY IF EXISTS "Authenticated users can manage email queue" ON public.cms_blog_email_queue;
CREATE POLICY "Admins can manage email queue"
ON public.cms_blog_email_queue
FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Update CMS Blog Post Drafts policies
DROP POLICY IF EXISTS "Authenticated users can manage drafts" ON public.cms_blog_post_drafts;
CREATE POLICY "Admins can manage drafts"
ON public.cms_blog_post_drafts
FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Update Blog Comment Reports policies
DROP POLICY IF EXISTS "Admins can view reports" ON public.blog_comment_reports;
CREATE POLICY "Admins can view reports"
ON public.blog_comment_reports
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Update Blog Comments admin policy
DROP POLICY IF EXISTS "Admins can manage all comments" ON public.blog_comments;
CREATE POLICY "Admins can manage all comments"
ON public.blog_comments
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Only authenticated users can view comments with PII" ON public.blog_comments;
CREATE POLICY "Admins can view comments with PII"
ON public.blog_comments
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Update YouTube Channels policies
DROP POLICY IF EXISTS "Authenticated users can manage channels" ON public.youtube_channels;
CREATE POLICY "Admins can manage channels"
ON public.youtube_channels
FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Update YouTube Videos policies
DROP POLICY IF EXISTS "Authenticated users can manage videos" ON public.youtube_videos;
CREATE POLICY "Admins can manage videos"
ON public.youtube_videos
FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Update Contact Submissions policy
DROP POLICY IF EXISTS "Only authenticated admin users can view contact submissions" ON public.contact_submissions;
CREATE POLICY "Admins can view contact submissions"
ON public.contact_submissions
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));
-- Create Authors/People Table
CREATE TABLE public.cms_authors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  email TEXT,
  bio TEXT,
  avatar_url TEXT,
  social_links JSONB DEFAULT '{}',
  position TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.cms_authors ENABLE ROW LEVEL SECURITY;

-- Create policies for authors
CREATE POLICY "Public can view authors" 
ON public.cms_authors 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can manage authors" 
ON public.cms_authors 
FOR ALL 
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- Add author_id to blog posts
ALTER TABLE public.cms_blog_posts 
ADD COLUMN author_id UUID REFERENCES public.cms_authors(id);

-- Create Newsletters Sync Table
CREATE TABLE public.cms_newsletters (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  kit_broadcast_id TEXT UNIQUE NOT NULL,
  subject TEXT NOT NULL,
  preview_text TEXT,
  status TEXT NOT NULL,
  scheduled_for TIMESTAMP WITH TIME ZONE,
  sent_at TIMESTAMP WITH TIME ZONE,
  recipient_count INTEGER DEFAULT 0,
  open_rate NUMERIC(5,2),
  click_rate NUMERIC(5,2),
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  synced_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  blog_post_id UUID REFERENCES public.cms_blog_posts(id)
);

-- Enable RLS
ALTER TABLE public.cms_newsletters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view newsletters" 
ON public.cms_newsletters 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can manage newsletters" 
ON public.cms_newsletters 
FOR ALL 
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- Add triggers for updated_at
CREATE TRIGGER update_cms_authors_updated_at
BEFORE UPDATE ON public.cms_authors
FOR EACH ROW
EXECUTE FUNCTION public.update_cms_updated_at_column();

CREATE TRIGGER update_cms_newsletters_updated_at
BEFORE UPDATE ON public.cms_newsletters
FOR EACH ROW
EXECUTE FUNCTION public.update_cms_updated_at_column();
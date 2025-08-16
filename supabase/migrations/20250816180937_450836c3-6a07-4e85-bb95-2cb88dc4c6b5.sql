-- Create storage bucket for CMS media uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('cms-media', 'cms-media', true);

-- Create categories table for organizing blog content
CREATE TABLE public.cms_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  color TEXT DEFAULT '#3b82f6',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create blog posts table
CREATE TABLE public.cms_blog_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT,
  author TEXT NOT NULL,
  category_id UUID REFERENCES public.cms_categories(id) ON DELETE SET NULL,
  cover_image_url TEXT,
  cover_image_alt TEXT,
  seo_title TEXT,
  seo_description TEXT,
  seo_keywords TEXT[],
  featured BOOLEAN DEFAULT false,
  published BOOLEAN DEFAULT false,
  read_time TEXT,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create homepage content table
CREATE TABLE public.cms_homepage_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  hero_title TEXT NOT NULL,
  hero_description TEXT NOT NULL,
  hero_cta_primary TEXT NOT NULL,
  hero_cta_secondary TEXT NOT NULL,
  stats_subscribers TEXT,
  stats_newsletter TEXT,
  stats_videos TEXT,
  hero_image_url TEXT,
  hero_image_alt TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create navigation items table
CREATE TABLE public.cms_navigation_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  label TEXT NOT NULL,
  href TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create footer content table
CREATE TABLE public.cms_footer_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  description TEXT NOT NULL,
  newsletter_title TEXT NOT NULL,
  newsletter_description TEXT NOT NULL,
  copyright_text TEXT NOT NULL,
  youtube_url TEXT,
  twitter_url TEXT,
  linkedin_url TEXT,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create global settings table
CREATE TABLE public.cms_global_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  site_name TEXT NOT NULL,
  site_description TEXT NOT NULL,
  logo_url TEXT,
  favicon_url TEXT,
  primary_color TEXT DEFAULT '#3b82f6',
  secondary_color TEXT DEFAULT '#1e40af',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.cms_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_homepage_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_navigation_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_footer_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_global_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for public read access
CREATE POLICY "Public can view published blog posts" ON public.cms_blog_posts FOR SELECT USING (published = true);
CREATE POLICY "Public can view categories" ON public.cms_categories FOR SELECT USING (true);
CREATE POLICY "Public can view homepage content" ON public.cms_homepage_content FOR SELECT USING (true);
CREATE POLICY "Public can view navigation items" ON public.cms_navigation_items FOR SELECT USING (true);
CREATE POLICY "Public can view footer content" ON public.cms_footer_content FOR SELECT USING (true);
CREATE POLICY "Public can view global settings" ON public.cms_global_settings FOR SELECT USING (true);

-- Create RLS policies for authenticated users (admins) to manage content
CREATE POLICY "Authenticated users can manage categories" ON public.cms_categories FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can manage blog posts" ON public.cms_blog_posts FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can manage homepage content" ON public.cms_homepage_content FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can manage navigation items" ON public.cms_navigation_items FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can manage footer content" ON public.cms_footer_content FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can manage global settings" ON public.cms_global_settings FOR ALL USING (auth.uid() IS NOT NULL);

-- Create storage policies for CMS media
CREATE POLICY "CMS media is publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'cms-media');
CREATE POLICY "Authenticated users can upload CMS media" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'cms-media' AND auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can update CMS media" ON storage.objects FOR UPDATE USING (bucket_id = 'cms-media' AND auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can delete CMS media" ON storage.objects FOR DELETE USING (bucket_id = 'cms-media' AND auth.uid() IS NOT NULL);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_cms_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_cms_categories_updated_at BEFORE UPDATE ON public.cms_categories FOR EACH ROW EXECUTE FUNCTION public.update_cms_updated_at_column();
CREATE TRIGGER update_cms_blog_posts_updated_at BEFORE UPDATE ON public.cms_blog_posts FOR EACH ROW EXECUTE FUNCTION public.update_cms_updated_at_column();
CREATE TRIGGER update_cms_homepage_content_updated_at BEFORE UPDATE ON public.cms_homepage_content FOR EACH ROW EXECUTE FUNCTION public.update_cms_updated_at_column();
CREATE TRIGGER update_cms_navigation_items_updated_at BEFORE UPDATE ON public.cms_navigation_items FOR EACH ROW EXECUTE FUNCTION public.update_cms_updated_at_column();
CREATE TRIGGER update_cms_footer_content_updated_at BEFORE UPDATE ON public.cms_footer_content FOR EACH ROW EXECUTE FUNCTION public.update_cms_updated_at_column();
CREATE TRIGGER update_cms_global_settings_updated_at BEFORE UPDATE ON public.cms_global_settings FOR EACH ROW EXECUTE FUNCTION public.update_cms_updated_at_column();

-- Insert default data
INSERT INTO public.cms_categories (name, slug, description) VALUES 
  ('Technology', 'technology', 'Posts about technology and innovation'),
  ('Business', 'business', 'Business insights and strategies'),
  ('Lifestyle', 'lifestyle', 'Lifestyle and personal development');

INSERT INTO public.cms_homepage_content (hero_title, hero_description, hero_cta_primary, hero_cta_secondary, stats_subscribers, stats_newsletter, stats_videos) VALUES 
  ('Welcome to Our Platform', 'Discover amazing content and connect with our community', 'Get Started', 'Learn More', '10K+', '5K+', '100+');

INSERT INTO public.cms_navigation_items (label, href, order_index) VALUES 
  ('Home', '/', 0),
  ('Blog', '/blog', 1),
  ('About', '/about', 2),
  ('Contact', '/contact', 3);

INSERT INTO public.cms_footer_content (description, newsletter_title, newsletter_description, copyright_text, email) VALUES 
  ('Stay connected with our latest updates and insights.', 'Subscribe to our newsletter', 'Get weekly updates delivered to your inbox', '© 2024 Your Company. All rights reserved.', 'hello@yourcompany.com');

INSERT INTO public.cms_global_settings (site_name, site_description) VALUES 
  ('Your Site Name', 'Your site description for SEO purposes');
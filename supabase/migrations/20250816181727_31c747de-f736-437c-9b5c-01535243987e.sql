-- Insert sample blog posts for testing
INSERT INTO public.cms_blog_posts (title, slug, excerpt, content, author, category_id, featured, published, read_time, published_at) 
SELECT 
  'Getting Started with the Gig Economy',
  'getting-started-gig-economy',
  'Learn the fundamentals of starting your journey in the gig economy with practical tips and strategies.',
  'The gig economy offers unprecedented opportunities for flexible work and income generation. Whether you''re looking to supplement your income or make it your primary source of earnings, understanding the basics is crucial for success...',
  'Sergio Avedian',
  c.id,
  true,
  true,
  '8 min read',
  now()
FROM cms_categories c WHERE c.slug = 'business' LIMIT 1;

INSERT INTO public.cms_blog_posts (title, slug, excerpt, content, author, category_id, featured, published, read_time, published_at)
SELECT 
  'Latest Rideshare Trends 2024',
  'rideshare-trends-2024',
  'Discover the emerging trends shaping the rideshare industry and how they impact drivers.',
  'The rideshare industry continues to evolve rapidly in 2024, with new technologies, regulations, and market dynamics reshaping the landscape for drivers and passengers alike...',
  'Sergio Avedian',
  c.id,
  false,
  true,
  '6 min read',
  now() - interval '1 day'
FROM cms_categories c WHERE c.slug = 'technology' LIMIT 1;
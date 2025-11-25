-- Create a public-safe view of blog comments that excludes sensitive PII
CREATE OR REPLACE VIEW public.blog_comments_public AS
SELECT 
  id,
  post_id,
  author_name,
  content,
  parent_comment_id,
  status,
  created_at,
  updated_at,
  user_id
FROM public.blog_comments
WHERE status = 'approved';

-- Grant SELECT access to the view for anonymous and authenticated users
GRANT SELECT ON public.blog_comments_public TO anon, authenticated;

-- Add comment for documentation
COMMENT ON VIEW public.blog_comments_public IS 'Public-safe view of blog comments that excludes PII (email, IP address, user agent, spam score)';

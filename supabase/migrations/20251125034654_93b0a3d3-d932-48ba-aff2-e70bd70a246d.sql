-- Drop the public read policy on blog_comments table
DROP POLICY IF EXISTS "Anyone can view approved comments" ON public.blog_comments;

-- Create a more restrictive policy: only authenticated admin users can view all comments
CREATE POLICY "Only authenticated users can view comments with PII"
ON public.blog_comments
FOR SELECT
TO authenticated
USING (auth.uid() IS NOT NULL);

-- The public will use the blog_comments_public view instead, which excludes PII
-- This view was created in the previous migration and is already accessible
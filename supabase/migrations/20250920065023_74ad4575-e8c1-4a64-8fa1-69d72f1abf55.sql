-- Fix RLS policies for cms_homepage_content to allow updates
-- First, let's check if the policy allows updates properly

-- Drop existing policy and recreate it with proper permissions
DROP POLICY IF EXISTS "Authenticated users can manage homepage content" ON cms_homepage_content;

-- Create a more specific policy for authenticated users
CREATE POLICY "Authenticated users can manage homepage content" 
ON cms_homepage_content 
FOR ALL 
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- Also ensure the update trigger is working properly
DROP TRIGGER IF EXISTS update_cms_homepage_content_updated_at ON cms_homepage_content;
CREATE TRIGGER update_cms_homepage_content_updated_at
    BEFORE UPDATE ON cms_homepage_content
    FOR EACH ROW
    EXECUTE FUNCTION update_cms_updated_at_column();
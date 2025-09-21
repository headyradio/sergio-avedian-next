-- Update blog post cover image URLs to use correct public paths
UPDATE blog_posts 
SET cover_image_url = REPLACE(cover_image_url, '/src/assets/', '/assets/blog/')
WHERE cover_image_url LIKE '%/src/assets/%';

UPDATE blog_posts 
SET cover_image_url = REPLACE(cover_image_url, 'src/assets/', '/assets/blog/')
WHERE cover_image_url LIKE '%src/assets/%' AND cover_image_url NOT LIKE '/%';
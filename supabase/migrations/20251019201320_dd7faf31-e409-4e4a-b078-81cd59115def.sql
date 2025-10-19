-- Add ConvertKit V4 API tracking columns to cms_blog_posts
ALTER TABLE cms_blog_posts
ADD COLUMN IF NOT EXISTS kit_broadcast_id TEXT,
ADD COLUMN IF NOT EXISTS kit_send_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS kit_status TEXT DEFAULT 'not_sent',
ADD COLUMN IF NOT EXISTS sent_to_kit BOOLEAN DEFAULT FALSE;

-- Add Newsletter Composer columns to cms_blog_posts
ALTER TABLE cms_blog_posts
ADD COLUMN IF NOT EXISTS newsletter_subject TEXT,
ADD COLUMN IF NOT EXISTS newsletter_content TEXT,
ADD COLUMN IF NOT EXISTS newsletter_preview_text TEXT,
ADD COLUMN IF NOT EXISTS email_template_id TEXT DEFAULT '4692916',
ADD COLUMN IF NOT EXISTS subscriber_filter JSONB DEFAULT '{"all": true}'::jsonb;

-- Add comment for documentation
COMMENT ON COLUMN cms_blog_posts.kit_broadcast_id IS 'ConvertKit broadcast ID from V4 API';
COMMENT ON COLUMN cms_blog_posts.kit_status IS 'Status: not_sent, draft, scheduled, sent';
COMMENT ON COLUMN cms_blog_posts.newsletter_subject IS 'Custom email subject line (defaults to post title if null)';
COMMENT ON COLUMN cms_blog_posts.newsletter_content IS 'Custom email HTML content (auto-generated if null)';
COMMENT ON COLUMN cms_blog_posts.email_template_id IS 'ConvertKit email template ID';
COMMENT ON COLUMN cms_blog_posts.subscriber_filter IS 'Audience filter: {"all": true} or {"segment_id": "123"}';
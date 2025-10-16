-- Create cms_blog_email_queue table for tracking newsletters
CREATE TABLE cms_blog_email_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES cms_blog_posts(id) ON DELETE CASCADE,
  scheduled_for TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  broadcast_id TEXT,
  sent_at TIMESTAMP WITH TIME ZONE,
  recipients_count INTEGER DEFAULT 0,
  error_message TEXT,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX idx_email_queue_pending ON cms_blog_email_queue(status, scheduled_for) 
WHERE status = 'pending';

ALTER TABLE cms_blog_email_queue ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can manage email queue"
  ON cms_blog_email_queue
  FOR ALL
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE TRIGGER update_cms_blog_email_queue_updated_at
  BEFORE UPDATE ON cms_blog_email_queue
  FOR EACH ROW
  EXECUTE FUNCTION update_cms_updated_at_column();

-- Update cms_blog_posts trigger for auto-setting published_at
DROP TRIGGER IF EXISTS set_published_at_trigger ON cms_blog_posts;

CREATE OR REPLACE FUNCTION auto_set_published_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.published = true AND (OLD.published = false OR OLD.published IS NULL) AND NEW.published_at IS NULL THEN
    NEW.published_at = now();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_published_at_trigger
  BEFORE UPDATE ON cms_blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION auto_set_published_at();
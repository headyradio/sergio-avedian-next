-- Enable required extensions for cron jobs
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Grant permissions to run cron jobs
GRANT USAGE ON SCHEMA cron TO postgres;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA cron TO postgres;

-- Schedule auto-publish to run daily at 6 AM UTC
SELECT cron.schedule(
  'auto-publish-scheduled-posts-daily',
  '0 6 * * *', -- 6:00 AM UTC every day
  $$
  SELECT
    net.http_post(
        url:='https://fkafzarnschmdbxevicb.supabase.co/functions/v1/auto-publish-scheduled-posts',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZrYWZ6YXJuc2NobWRieGV2aWNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk3Njc0MTcsImV4cCI6MjA1NTM0MzQxN30.-anwBXJ_B9tfTl0PqtUt_YtmrA07MuHawP65CTVBb5M"}'::jsonb,
        body:='{}'::jsonb
    ) as request_id;
  $$
);
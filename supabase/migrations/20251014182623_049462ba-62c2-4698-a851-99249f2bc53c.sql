-- Recategorize all YouTube videos based on their actual duration
-- This fixes videos that were incorrectly categorized as 'live' when they should be 'short'

UPDATE youtube_videos
SET video_type = CASE
  -- Videos 2 minutes or less should be shorts
  WHEN duration ~ 'PT[0-9]*S$' THEN 'short'  -- Only seconds (e.g., PT23S, PT59S)
  WHEN duration ~ 'PT1M[0-9]*S$' THEN 'short'  -- 1 minute + seconds (e.g., PT1M30S)
  -- Keep live designation for videos that are actually live streams (usually longer)
  WHEN title ILIKE '%power hour%' OR title ILIKE '%trading with sergio%' THEN 'live'
  -- Everything else that's not a short is regular
  ELSE 'regular'
END
WHERE video_type = 'live';

-- Log the changes
DO $$
DECLARE
  shorts_count INTEGER;
  live_count INTEGER;
  regular_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO shorts_count FROM youtube_videos WHERE video_type = 'short';
  SELECT COUNT(*) INTO live_count FROM youtube_videos WHERE video_type = 'live';
  SELECT COUNT(*) INTO regular_count FROM youtube_videos WHERE video_type = 'regular';
  
  RAISE NOTICE 'Video categorization updated:';
  RAISE NOTICE 'Shorts: %', shorts_count;
  RAISE NOTICE 'Live: %', live_count;
  RAISE NOTICE 'Regular: %', regular_count;
END $$;
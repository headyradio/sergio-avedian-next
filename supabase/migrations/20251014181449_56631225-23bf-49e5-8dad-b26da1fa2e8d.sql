-- Update blog post published dates to late September/early October 2025
UPDATE cms_blog_posts 
SET published_at = CASE
  WHEN title = 'Options Trading: A Powerful Tool for Investors' THEN '2025-09-23 10:00:00+00'::timestamptz
  WHEN title = 'Why 90% of Traders Lose Money and What You Can Learn From It' THEN '2025-09-30 10:00:00+00'::timestamptz
  WHEN title = 'Active vs. Passive Investing: Which Strategy Is Right for You?' THEN '2025-10-07 10:00:00+00'::timestamptz
  WHEN title = 'The Advantages of Long-Term Investing: Why Patience Pays Off' THEN '2025-10-14 10:00:00+00'::timestamptz
  ELSE published_at
END
WHERE title IN (
  'Options Trading: A Powerful Tool for Investors',
  'Why 90% of Traders Lose Money and What You Can Learn From It',
  'Active vs. Passive Investing: Which Strategy Is Right for You?',
  'The Advantages of Long-Term Investing: Why Patience Pays Off'
);
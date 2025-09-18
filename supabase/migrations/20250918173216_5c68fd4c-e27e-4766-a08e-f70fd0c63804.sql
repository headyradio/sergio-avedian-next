-- Add main hero section fields to cms_homepage_content table
ALTER TABLE cms_homepage_content 
ADD COLUMN IF NOT EXISTS main_hero_title TEXT,
ADD COLUMN IF NOT EXISTS main_hero_subtitle TEXT,
ADD COLUMN IF NOT EXISTS main_hero_description TEXT,
ADD COLUMN IF NOT EXISTS main_hero_motto TEXT,
ADD COLUMN IF NOT EXISTS main_hero_cta_primary TEXT,
ADD COLUMN IF NOT EXISTS main_hero_cta_secondary TEXT,
ADD COLUMN IF NOT EXISTS main_hero_years_experience TEXT,
ADD COLUMN IF NOT EXISTS main_hero_market_crises TEXT,
ADD COLUMN IF NOT EXISTS main_hero_lives_impacted TEXT;

-- Update existing row with default values if it exists
UPDATE cms_homepage_content 
SET 
  main_hero_title = COALESCE(main_hero_title, '30+ Years of'),
  main_hero_subtitle = COALESCE(main_hero_subtitle, 'Trading Experience'),
  main_hero_description = COALESCE(main_hero_description, 'With over 30 years on Wall Street, I''ve braved market turbulence, adapting my strategies through crises like the dot-com bubble, housing crash, COVID and today''s volatility. Discipline and patience are paramount. Continuous learning is essential in an ever-changing market.'),
  main_hero_motto = COALESCE(main_hero_motto, 'Patience. Position. Planning.'),
  main_hero_cta_primary = COALESCE(main_hero_cta_primary, 'Start Learning Today'),
  main_hero_cta_secondary = COALESCE(main_hero_cta_secondary, 'View Track Record'),
  main_hero_years_experience = COALESCE(main_hero_years_experience, '30+'),
  main_hero_market_crises = COALESCE(main_hero_market_crises, '5'),
  main_hero_lives_impacted = COALESCE(main_hero_lives_impacted, '1M+')
WHERE id IS NOT NULL;

-- Insert default row if none exists
INSERT INTO cms_homepage_content (
  hero_title,
  hero_description, 
  hero_cta_primary,
  hero_cta_secondary,
  main_hero_title,
  main_hero_subtitle,
  main_hero_description,
  main_hero_motto,
  main_hero_cta_primary,
  main_hero_cta_secondary,
  main_hero_years_experience,
  main_hero_market_crises,
  main_hero_lives_impacted
)
SELECT 
  'Navigating the Gig Economy Revolution',
  'Expert insights on rideshare, delivery, regulation, and financial strategies for gig workers. Join thousands who trust Sergio''s analysis.',
  'Watch Latest Video',
  'Get Weekly Insights',
  '30+ Years of',
  'Trading Experience',
  'With over 30 years on Wall Street, I''ve braved market turbulence, adapting my strategies through crises like the dot-com bubble, housing crash, COVID and today''s volatility. Discipline and patience are paramount. Continuous learning is essential in an ever-changing market.',
  'Patience. Position. Planning.',
  'Start Learning Today',
  'View Track Record',
  '30+',
  '5',
  '1M+'
WHERE NOT EXISTS (SELECT 1 FROM cms_homepage_content);
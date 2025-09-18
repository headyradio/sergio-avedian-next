import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useHomepageContent, useUpdateHomepageContent } from '@/hooks/useSupabaseCMS';

const HomepageManager = () => {
  const { data: homepageContent, isLoading } = useHomepageContent();
  const updateHomepageContent = useUpdateHomepageContent();

  const [formData, setFormData] = useState({
    hero_title: '',
    hero_description: '',
    hero_cta_primary: '',
    hero_cta_secondary: '',
    stats_subscribers: '',
    stats_newsletter: '',
    stats_videos: '',
    hero_image_url: '',
    hero_image_alt: '',
    // Main hero section fields
    main_hero_title: '',
    main_hero_subtitle: '',
    main_hero_description: '',
    main_hero_motto: '',
    main_hero_cta_primary: '',
    main_hero_cta_secondary: '',
    main_hero_years_experience: '',
    main_hero_market_crises: '',
    main_hero_lives_impacted: '',
  });

  useEffect(() => {
    if (homepageContent) {
      setFormData({
        hero_title: homepageContent.hero_title || '',
        hero_description: homepageContent.hero_description || '',
        hero_cta_primary: homepageContent.hero_cta_primary || '',
        hero_cta_secondary: homepageContent.hero_cta_secondary || '',
        stats_subscribers: homepageContent.stats_subscribers || '',
        stats_newsletter: homepageContent.stats_newsletter || '',
        stats_videos: homepageContent.stats_videos || '',
        hero_image_url: homepageContent.hero_image_url || '',
        hero_image_alt: homepageContent.hero_image_alt || '',
        // Main hero section fields
        main_hero_title: homepageContent.main_hero_title || '',
        main_hero_subtitle: homepageContent.main_hero_subtitle || '',
        main_hero_description: homepageContent.main_hero_description || '',
        main_hero_motto: homepageContent.main_hero_motto || '',
        main_hero_cta_primary: homepageContent.main_hero_cta_primary || '',
        main_hero_cta_secondary: homepageContent.main_hero_cta_secondary || '',
        main_hero_years_experience: homepageContent.main_hero_years_experience || '',
        main_hero_market_crises: homepageContent.main_hero_market_crises || '',
        main_hero_lives_impacted: homepageContent.main_hero_lives_impacted || '',
      });
    }
  }, [homepageContent]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (homepageContent) {
      await updateHomepageContent.mutateAsync({
        id: homepageContent.id,
        ...formData,
      });
    }
  };

  if (isLoading) {
    return <div>Loading homepage content...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Homepage Content</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Main Hero Section */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold border-b pb-2">Main Hero Section</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="main-hero-title">Main Hero Title</Label>
                <Input
                  id="main-hero-title"
                  value={formData.main_hero_title}
                  onChange={(e) => setFormData({ ...formData, main_hero_title: e.target.value })}
                  placeholder="30+ Years of"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="main-hero-subtitle">Main Hero Subtitle</Label>
                <Input
                  id="main-hero-subtitle"
                  value={formData.main_hero_subtitle}
                  onChange={(e) => setFormData({ ...formData, main_hero_subtitle: e.target.value })}
                  placeholder="Trading Experience"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="main-hero-description">Main Hero Description</Label>
              <Textarea
                id="main-hero-description"
                value={formData.main_hero_description}
                onChange={(e) => setFormData({ ...formData, main_hero_description: e.target.value })}
                rows={4}
                placeholder="With over 30 years on Wall Street..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="main-hero-motto">Sergio's Motto</Label>
              <Input
                id="main-hero-motto"
                value={formData.main_hero_motto}
                onChange={(e) => setFormData({ ...formData, main_hero_motto: e.target.value })}
                placeholder="Patience. Position. Planning."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="main-hero-cta-primary">Primary CTA</Label>
                <Input
                  id="main-hero-cta-primary"
                  value={formData.main_hero_cta_primary}
                  onChange={(e) => setFormData({ ...formData, main_hero_cta_primary: e.target.value })}
                  placeholder="Start Learning Today"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="main-hero-cta-secondary">Secondary CTA</Label>
                <Input
                  id="main-hero-cta-secondary"
                  value={formData.main_hero_cta_secondary}
                  onChange={(e) => setFormData({ ...formData, main_hero_cta_secondary: e.target.value })}
                  placeholder="View Track Record"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="main-hero-years">Years Experience</Label>
                <Input
                  id="main-hero-years"
                  value={formData.main_hero_years_experience}
                  onChange={(e) => setFormData({ ...formData, main_hero_years_experience: e.target.value })}
                  placeholder="30+"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="main-hero-crises">Market Crises</Label>
                <Input
                  id="main-hero-crises"
                  value={formData.main_hero_market_crises}
                  onChange={(e) => setFormData({ ...formData, main_hero_market_crises: e.target.value })}
                  placeholder="5"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="main-hero-lives">Lives Impacted</Label>
                <Input
                  id="main-hero-lives"
                  value={formData.main_hero_lives_impacted}
                  onChange={(e) => setFormData({ ...formData, main_hero_lives_impacted: e.target.value })}
                  placeholder="1M+"
                />
              </div>
            </div>
          </div>

          {/* Latest Episode Hero Section */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold border-b pb-2">Latest Episode Section</h3>
            
            <div className="space-y-2">
              <Label htmlFor="hero-title">Hero Title</Label>
              <Input
                id="hero-title"
                value={formData.hero_title}
                onChange={(e) => setFormData({ ...formData, hero_title: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hero-description">Hero Description</Label>
              <Textarea
                id="hero-description"
                value={formData.hero_description}
                onChange={(e) => setFormData({ ...formData, hero_description: e.target.value })}
                rows={3}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cta-primary">Primary CTA</Label>
                <Input
                  id="cta-primary"
                  value={formData.hero_cta_primary}
                  onChange={(e) => setFormData({ ...formData, hero_cta_primary: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cta-secondary">Secondary CTA</Label>
                <Input
                  id="cta-secondary"
                  value={formData.hero_cta_secondary}
                  onChange={(e) => setFormData({ ...formData, hero_cta_secondary: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Statistics</h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="stats-subscribers">Subscribers</Label>
                  <Input
                    id="stats-subscribers"
                    value={formData.stats_subscribers}
                    onChange={(e) => setFormData({ ...formData, stats_subscribers: e.target.value })}
                    placeholder="10K+"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stats-newsletter">Newsletter</Label>
                  <Input
                    id="stats-newsletter"
                    value={formData.stats_newsletter}
                    onChange={(e) => setFormData({ ...formData, stats_newsletter: e.target.value })}
                    placeholder="5K+"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stats-videos">Videos</Label>
                  <Input
                    id="stats-videos"
                    value={formData.stats_videos}
                    onChange={(e) => setFormData({ ...formData, stats_videos: e.target.value })}
                    placeholder="100+"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Hero Image</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hero-image-url">Image URL</Label>
                  <Input
                    id="hero-image-url"
                    value={formData.hero_image_url}
                    onChange={(e) => setFormData({ ...formData, hero_image_url: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hero-image-alt">Image Alt Text</Label>
                  <Input
                    id="hero-image-alt"
                    value={formData.hero_image_alt}
                    onChange={(e) => setFormData({ ...formData, hero_image_alt: e.target.value })}
                    placeholder="Descriptive alt text"
                  />
                </div>
              </div>
            </div>
          </div>

          <Button type="submit" disabled={updateHomepageContent.isPending}>
            {updateHomepageContent.isPending ? 'Updating...' : 'Update Homepage'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default HomepageManager;
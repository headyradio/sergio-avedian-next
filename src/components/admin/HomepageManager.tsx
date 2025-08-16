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
        <form onSubmit={handleSubmit} className="space-y-6">
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
            <h3 className="text-lg font-semibold">Statistics</h3>
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
            <h3 className="text-lg font-semibold">Hero Image</h3>
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

          <Button type="submit" disabled={updateHomepageContent.isPending}>
            {updateHomepageContent.isPending ? 'Updating...' : 'Update Homepage'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default HomepageManager;
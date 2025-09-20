import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Save, Eye, Loader2 } from 'lucide-react';
import { useHomepageContent, useUpdateHomepageContent } from '@/hooks/useSupabaseCMS';
import { toast } from 'sonner';

const HomepageManager = () => {
  const { data: homepageContent, isLoading, error } = useHomepageContent();
  const updateHomepageContent = useUpdateHomepageContent();
  const [hasChanges, setHasChanges] = useState(false);

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
      const newFormData = {
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
      };
      setFormData(newFormData);
      setHasChanges(false);
      console.log('Homepage content loaded:', homepageContent);
    }
  }, [homepageContent]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!homepageContent?.id) {
      toast.error('No homepage content found to update');
      console.error('No homepage content ID found');
      return;
    }

    try {
      console.log('Updating homepage content with ID:', homepageContent.id);
      console.log('Form data being sent:', formData);
      
      await updateHomepageContent.mutateAsync({
        id: homepageContent.id,
        ...formData,
      });
      
      setHasChanges(false);
      toast.success('Homepage content updated successfully!');
    } catch (error) {
      console.error('Update failed:', error);
      toast.error(`Failed to update: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center space-x-3">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="text-muted-foreground">Loading homepage content...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center space-x-3 text-destructive">
          <AlertCircle className="h-6 w-6" />
          <span>Error loading homepage content: {error.message}</span>
        </div>
      </div>
    );
  }

  if (!homepageContent) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-4">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto" />
          <div>
            <h3 className="text-lg font-semibold">No homepage content found</h3>
            <p className="text-muted-foreground">Please create homepage content first.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Save Button */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">Homepage Content</h2>
          <p className="text-muted-foreground">Manage your homepage hero sections and content</p>
        </div>
        <div className="flex items-center space-x-3">
          {hasChanges && (
            <Badge variant="secondary" className="flex items-center space-x-1">
              <AlertCircle className="h-3 w-3" />
              <span>Unsaved changes</span>
            </Badge>
          )}
          <Button 
            onClick={handleSubmit} 
            disabled={!hasChanges || updateHomepageContent.isPending}
            className="flex items-center space-x-2"
          >
            {updateHomepageContent.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            <span>{updateHomepageContent.isPending ? 'Saving...' : 'Save Changes'}</span>
          </Button>
        </div>
      </div>

      <Separator />

      {/* Tabbed Content */}
      <Tabs defaultValue="main-hero" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="main-hero" className="flex items-center space-x-2">
            <Eye className="h-4 w-4" />
            <span>Main Hero Section</span>
          </TabsTrigger>
          <TabsTrigger value="episode-hero" className="flex items-center space-x-2">
            <Eye className="h-4 w-4" />
            <span>Latest Episode Section</span>
          </TabsTrigger>
        </TabsList>

        {/* Main Hero Tab */}
        <TabsContent value="main-hero">
          <Card>
            <CardHeader>
              <CardTitle>Main Hero Section</CardTitle>
              <p className="text-sm text-muted-foreground">This is the primary hero section with Sergio's image and credentials</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="main-hero-title">Title</Label>
                  <Input
                    id="main-hero-title"
                    value={formData.main_hero_title}
                    onChange={(e) => handleInputChange('main_hero_title', e.target.value)}
                    placeholder="30+ Years of"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="main-hero-subtitle">Subtitle</Label>
                  <Input
                    id="main-hero-subtitle"
                    value={formData.main_hero_subtitle}
                    onChange={(e) => handleInputChange('main_hero_subtitle', e.target.value)}
                    placeholder="Trading Experience"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="main-hero-description">Description</Label>
                <Textarea
                  id="main-hero-description"
                  value={formData.main_hero_description}
                  onChange={(e) => handleInputChange('main_hero_description', e.target.value)}
                  rows={4}
                  placeholder="With over 30 years on Wall Street..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="main-hero-motto">Sergio's Motto</Label>
                <Input
                  id="main-hero-motto"
                  value={formData.main_hero_motto}
                  onChange={(e) => handleInputChange('main_hero_motto', e.target.value)}
                  placeholder="Patience. Position. Planning."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="main-hero-cta-primary">Primary CTA</Label>
                  <Input
                    id="main-hero-cta-primary"
                    value={formData.main_hero_cta_primary}
                    onChange={(e) => handleInputChange('main_hero_cta_primary', e.target.value)}
                    placeholder="Start Learning Today"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="main-hero-cta-secondary">Secondary CTA</Label>
                  <Input
                    id="main-hero-cta-secondary"
                    value={formData.main_hero_cta_secondary}
                    onChange={(e) => handleInputChange('main_hero_cta_secondary', e.target.value)}
                    placeholder="View Track Record"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-lg font-semibold">Experience Statistics</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="main-hero-years">Years Experience</Label>
                    <Input
                      id="main-hero-years"
                      value={formData.main_hero_years_experience}
                      onChange={(e) => handleInputChange('main_hero_years_experience', e.target.value)}
                      placeholder="30+"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="main-hero-crises">Market Crises</Label>
                    <Input
                      id="main-hero-crises"
                      value={formData.main_hero_market_crises}
                      onChange={(e) => handleInputChange('main_hero_market_crises', e.target.value)}
                      placeholder="5"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="main-hero-lives">Lives Impacted</Label>
                    <Input
                      id="main-hero-lives"
                      value={formData.main_hero_lives_impacted}
                      onChange={(e) => handleInputChange('main_hero_lives_impacted', e.target.value)}
                      placeholder="1M+"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Episode Hero Tab */}
        <TabsContent value="episode-hero">
          <Card>
            <CardHeader>
              <CardTitle>Latest Episode Section</CardTitle>
              <p className="text-sm text-muted-foreground">Secondary hero section for promoting latest content</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="hero-title">Title</Label>
                <Input
                  id="hero-title"
                  value={formData.hero_title}
                  onChange={(e) => handleInputChange('hero_title', e.target.value)}
                  placeholder="Welcome to Our Platform"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hero-description">Description</Label>
                <Textarea
                  id="hero-description"
                  value={formData.hero_description}
                  onChange={(e) => handleInputChange('hero_description', e.target.value)}
                  rows={3}
                  placeholder="Discover amazing content..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="cta-primary">Primary CTA</Label>
                  <Input
                    id="cta-primary"
                    value={formData.hero_cta_primary}
                    onChange={(e) => handleInputChange('hero_cta_primary', e.target.value)}
                    placeholder="Get Started"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cta-secondary">Secondary CTA</Label>
                  <Input
                    id="cta-secondary"
                    value={formData.hero_cta_secondary}
                    onChange={(e) => handleInputChange('hero_cta_secondary', e.target.value)}
                    placeholder="Learn More"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-lg font-semibold">Statistics</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="stats-subscribers">Subscribers</Label>
                    <Input
                      id="stats-subscribers"
                      value={formData.stats_subscribers}
                      onChange={(e) => handleInputChange('stats_subscribers', e.target.value)}
                      placeholder="10K+"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stats-newsletter">Newsletter</Label>
                    <Input
                      id="stats-newsletter"
                      value={formData.stats_newsletter}
                      onChange={(e) => handleInputChange('stats_newsletter', e.target.value)}
                      placeholder="5K+"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stats-videos">Videos</Label>
                    <Input
                      id="stats-videos"
                      value={formData.stats_videos}
                      onChange={(e) => handleInputChange('stats_videos', e.target.value)}
                      placeholder="100+"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-lg font-semibold">Hero Image</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="hero-image-url">Image URL</Label>
                    <Input
                      id="hero-image-url"
                      value={formData.hero_image_url}
                      onChange={(e) => handleInputChange('hero_image_url', e.target.value)}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hero-image-alt">Image Alt Text</Label>
                    <Input
                      id="hero-image-alt"
                      value={formData.hero_image_alt}
                      onChange={(e) => handleInputChange('hero_image_alt', e.target.value)}
                      placeholder="Descriptive alt text"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HomepageManager;
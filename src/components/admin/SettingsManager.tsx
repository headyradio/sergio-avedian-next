import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Save, Loader2 } from 'lucide-react';
import { useGlobalSettings, useUpdateGlobalSettings, useFooterContent, useUpdateFooterContent, CMSFooterContent } from '@/hooks/useSupabaseCMS';
import { Skeleton } from '@/components/ui/skeleton';

interface CMSGlobalSettings {
  id: string;
  site_name: string;
  site_description: string;
  logo_url?: string;
  favicon_url?: string;
  primary_color?: string;
  secondary_color?: string;
}

const SettingsManager = () => {
  const { data: globalSettings, isLoading: isLoadingGlobal } = useGlobalSettings();
  const { data: footerContent, isLoading: isLoadingFooter } = useFooterContent();
  const updateGlobalSettings = useUpdateGlobalSettings();
  const updateFooterContent = useUpdateFooterContent();

  const [hasChanges, setHasChanges] = useState(false);
  const [globalForm, setGlobalForm] = useState<Partial<CMSGlobalSettings>>({});
  const [footerForm, setFooterForm] = useState<Partial<CMSFooterContent>>({});

  useEffect(() => {
    if (globalSettings) {
      setGlobalForm(globalSettings);
    }
  }, [globalSettings]);

  useEffect(() => {
    if (footerContent) {
      setFooterForm(footerContent);
    }
  }, [footerContent]);

  const handleGlobalChange = (field: keyof CMSGlobalSettings, value: string) => {
    setGlobalForm(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleFooterChange = (field: keyof CMSFooterContent, value: string) => {
    setFooterForm(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    try {
      if (globalForm.id) {
        await updateGlobalSettings.mutateAsync(globalForm as CMSGlobalSettings);
      }
      if (footerForm.id) {
        await updateFooterContent.mutateAsync(footerForm as CMSFooterContent);
      }
      setHasChanges(false);
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  if (isLoadingGlobal || isLoadingFooter) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Unsaved Changes Badge */}
      {hasChanges && (
        <div className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-yellow-100">Unsaved Changes</Badge>
            <span className="text-sm text-yellow-800">You have unsaved changes</span>
          </div>
          <Button onClick={handleSave} disabled={updateGlobalSettings.isPending || updateFooterContent.isPending}>
            {(updateGlobalSettings.isPending || updateFooterContent.isPending) ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save All Changes
              </>
            )}
          </Button>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Site Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="site-name">Site Name</Label>
            <Input 
              id="site-name" 
              placeholder="Your Site Name"
              value={globalForm.site_name || ''}
              onChange={(e) => handleGlobalChange('site_name', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="site-description">Site Description</Label>
            <Textarea 
              id="site-description" 
              placeholder="Site description for SEO"
              value={globalForm.site_description || ''}
              onChange={(e) => handleGlobalChange('site_description', e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="logo-url">Logo URL</Label>
              <Input 
                id="logo-url" 
                placeholder="https://example.com/logo.png"
                value={globalForm.logo_url || ''}
                onChange={(e) => handleGlobalChange('logo_url', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="favicon-url">Favicon URL</Label>
              <Input 
                id="favicon-url" 
                placeholder="https://example.com/favicon.ico"
                value={globalForm.favicon_url || ''}
                onChange={(e) => handleGlobalChange('favicon_url', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Theme Colors</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="primary-color">Primary Color</Label>
              <Input 
                id="primary-color" 
                type="color"
                value={globalForm.primary_color || '#3b82f6'}
                onChange={(e) => handleGlobalChange('primary_color', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="secondary-color">Secondary Color</Label>
              <Input 
                id="secondary-color" 
                type="color"
                value={globalForm.secondary_color || '#1e40af'}
                onChange={(e) => handleGlobalChange('secondary_color', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Footer Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="footer-description">Footer Description</Label>
            <Textarea 
              id="footer-description" 
              placeholder="Footer description text"
              value={footerForm.description || ''}
              onChange={(e) => handleFooterChange('description', e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="newsletter-title">Newsletter Title</Label>
              <Input 
                id="newsletter-title" 
                placeholder="Subscribe to our newsletter"
                value={footerForm.newsletter_title || ''}
                onChange={(e) => handleFooterChange('newsletter_title', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newsletter-description">Newsletter Description</Label>
              <Input 
                id="newsletter-description" 
                placeholder="Get weekly updates"
                value={footerForm.newsletter_description || ''}
                onChange={(e) => handleFooterChange('newsletter_description', e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="copyright-text">Copyright Text</Label>
            <Input 
              id="copyright-text" 
              placeholder="© 2024 Your Company. All rights reserved."
              value={footerForm.copyright_text || ''}
              onChange={(e) => handleFooterChange('copyright_text', e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Social Media Links</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="youtube-url">YouTube URL</Label>
              <Input 
                id="youtube-url" 
                placeholder="https://youtube.com/channel/..."
                value={footerForm.youtube_url || ''}
                onChange={(e) => handleFooterChange('youtube_url', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="twitter-url">Twitter URL</Label>
              <Input 
                id="twitter-url" 
                placeholder="https://twitter.com/..."
                value={footerForm.twitter_url || ''}
                onChange={(e) => handleFooterChange('twitter_url', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="linkedin-url">LinkedIn URL</Label>
              <Input 
                id="linkedin-url" 
                placeholder="https://linkedin.com/in/..."
                value={footerForm.linkedin_url || ''}
                onChange={(e) => handleFooterChange('linkedin_url', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Contact Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="hello@yourcompany.com"
                value={footerForm.email || ''}
                onChange={(e) => handleFooterChange('email', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Button 
        onClick={handleSave} 
        disabled={!hasChanges || updateGlobalSettings.isPending || updateFooterContent.isPending}
        className="w-full"
      >
        {(updateGlobalSettings.isPending || updateFooterContent.isPending) ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Saving Changes...
          </>
        ) : (
          <>
            <Save className="h-4 w-4 mr-2" />
            Save All Settings
          </>
        )}
      </Button>
    </div>
  );
};

export default SettingsManager;

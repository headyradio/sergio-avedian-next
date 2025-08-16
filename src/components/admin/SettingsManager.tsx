import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const SettingsManager = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Site Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="site-name">Site Name</Label>
            <Input id="site-name" placeholder="Your Site Name" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="site-description">Site Description</Label>
            <Textarea id="site-description" placeholder="Site description for SEO" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="logo-url">Logo URL</Label>
              <Input id="logo-url" placeholder="https://example.com/logo.png" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="favicon-url">Favicon URL</Label>
              <Input id="favicon-url" placeholder="https://example.com/favicon.ico" />
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
              <Input id="primary-color" type="color" defaultValue="#3b82f6" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="secondary-color">Secondary Color</Label>
              <Input id="secondary-color" type="color" defaultValue="#1e40af" />
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
            <Textarea id="footer-description" placeholder="Footer description text" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="newsletter-title">Newsletter Title</Label>
              <Input id="newsletter-title" placeholder="Subscribe to our newsletter" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newsletter-description">Newsletter Description</Label>
              <Input id="newsletter-description" placeholder="Get weekly updates" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="copyright-text">Copyright Text</Label>
            <Input id="copyright-text" placeholder="© 2024 Your Company. All rights reserved." />
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
              <Input id="youtube-url" placeholder="https://youtube.com/channel/..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="twitter-url">Twitter URL</Label>
              <Input id="twitter-url" placeholder="https://twitter.com/..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="linkedin-url">LinkedIn URL</Label>
              <Input id="linkedin-url" placeholder="https://linkedin.com/in/..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Contact Email</Label>
              <Input id="email" type="email" placeholder="hello@yourcompany.com" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Button>Save Settings</Button>
    </div>
  );
};

export default SettingsManager;
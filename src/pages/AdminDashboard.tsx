import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import BlogPostManager from '@/components/admin/BlogPostManager';
import HomepageManager from '@/components/admin/HomepageManager';
import NavigationManager from '@/components/admin/NavigationManager';
import SettingsManager from '@/components/admin/SettingsManager';
import NewsletterManager from '@/components/admin/NewsletterManager';
import { AuthorsManager } from '@/components/admin/AuthorsManager';

const AdminDashboard = () => {
  const [activeContent, setActiveContent] = useState('blog-posts');

  const renderContent = () => {
    switch (activeContent) {
      case 'blog-posts':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Blog Post Management</CardTitle>
              <CardDescription>
                Create, edit, and manage your blog posts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BlogPostManager />
            </CardContent>
          </Card>
        );

      case 'newsletters':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Newsletter Management</CardTitle>
              <CardDescription>
                View and manage newsletters synced from ConvertKit
              </CardDescription>
            </CardHeader>
            <CardContent>
              <NewsletterManager />
            </CardContent>
          </Card>
        );

      case 'authors':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Authors Management</CardTitle>
              <CardDescription>
                Manage author profiles for blog posts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AuthorsManager />
            </CardContent>
          </Card>
        );

      case 'categories':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Categories Management</CardTitle>
              <CardDescription>
                Organize blog posts with categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Categories manager coming soon...</p>
            </CardContent>
          </Card>
        );

      case 'homepage':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Homepage Content</CardTitle>
              <CardDescription>
                Manage your homepage hero section and content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <HomepageManager />
            </CardContent>
          </Card>
        );

      case 'navigation':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Navigation Management</CardTitle>
              <CardDescription>
                Manage site navigation links and menu items
              </CardDescription>
            </CardHeader>
            <CardContent>
              <NavigationManager />
            </CardContent>
          </Card>
        );

      case 'global-settings':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Global Settings</CardTitle>
              <CardDescription>
                Configure site-wide settings and preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SettingsManager />
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <AdminLayout activeContent={activeContent} onContentChange={setActiveContent}>
      {renderContent()}
    </AdminLayout>
  );
};

export default AdminDashboard;
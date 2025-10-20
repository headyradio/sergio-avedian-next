import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogOut, Home } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { AdminSidebar } from './AdminSidebar';
import { useBlogPosts, useAuthors, useCategories, useNewsletters } from '@/hooks/useSupabaseCMS';

interface AdminLayoutProps {
  children: ReactNode;
  activeContent: string;
  onContentChange: (contentId: string) => void;
}

export const AdminLayout = ({ children, activeContent, onContentChange }: AdminLayoutProps) => {
  const navigate = useNavigate();
  
  // Fetch counts for sidebar
  const { data: blogPosts } = useBlogPosts(1000, 0, false);
  const { data: authors } = useAuthors();
  const { data: categories } = useCategories();
  const { data: newsletters } = useNewsletters();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const counts = {
    blogPosts: blogPosts?.length || 0,
    authors: authors?.length || 0,
    categories: categories?.length || 0,
    newsletters: newsletters?.length || 0,
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-foreground">CMS Dashboard</h1>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={() => navigate('/')}>
                <Home className="w-4 h-4 mr-2" />
                View Site
              </Button>
              <Button variant="outline" onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Layout with Sidebar */}
      <div className="flex flex-1 overflow-hidden">
        <AdminSidebar 
          activeContent={activeContent} 
          onContentChange={onContentChange}
          counts={counts}
        />
        
        {/* Content Area */}
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-6 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

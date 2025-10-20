import { FileText, Mail, Users, Tag, Home, Navigation, Settings, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

interface SidebarItem {
  id: string;
  label: string;
  icon: any;
  count?: number;
}

interface SidebarSection {
  section: string;
  items: SidebarItem[];
}

interface AdminSidebarProps {
  activeContent: string;
  onContentChange: (contentId: string) => void;
  counts?: {
    blogPosts?: number;
    newsletters?: number;
    authors?: number;
    categories?: number;
  };
}

export const AdminSidebar = ({ activeContent, onContentChange, counts = {} }: AdminSidebarProps) => {
  const [expandedSections, setExpandedSections] = useState<string[]>(['Content', 'Settings']);

  const sections: SidebarSection[] = [
    {
      section: 'Content',
      items: [
        { id: 'blog-posts', label: 'Blog Posts', icon: FileText, count: counts.blogPosts },
        { id: 'newsletters', label: 'Newsletters', icon: Mail, count: counts.newsletters },
        { id: 'authors', label: 'Authors', icon: Users, count: counts.authors },
        { id: 'categories', label: 'Categories', icon: Tag, count: counts.categories },
      ],
    },
    {
      section: 'Settings',
      items: [
        { id: 'homepage', label: 'Homepage', icon: Home },
        { id: 'navigation', label: 'Navigation', icon: Navigation },
        { id: 'global-settings', label: 'Global Settings', icon: Settings },
      ],
    },
  ];

  const toggleSection = (sectionName: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionName)
        ? prev.filter((s) => s !== sectionName)
        : [...prev, sectionName]
    );
  };

  return (
    <div className="w-64 border-r border-border bg-card flex flex-col">
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground">Content Management</h2>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-3 space-y-1">
          {sections.map((section) => {
            const isExpanded = expandedSections.includes(section.section);

            return (
              <div key={section.section} className="mb-2">
                <button
                  onClick={() => toggleSection(section.section)}
                  className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
                >
                  <span>{section.section}</span>
                  <ChevronRight
                    className={cn(
                      'w-4 h-4 transition-transform',
                      isExpanded && 'rotate-90'
                    )}
                  />
                </button>

                {isExpanded && (
                  <div className="mt-1 space-y-1">
                    {section.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = activeContent === item.id;

                      return (
                        <button
                          key={item.id}
                          onClick={() => onContentChange(item.id)}
                          className={cn(
                            'w-full flex items-center justify-between px-3 py-2 text-sm rounded-md transition-colors',
                            isActive
                              ? 'bg-primary text-primary-foreground font-medium'
                              : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                          )}
                        >
                          <div className="flex items-center space-x-2">
                            <Icon className="w-4 h-4" />
                            <span>{item.label}</span>
                          </div>
                          {item.count !== undefined && (
                            <span
                              className={cn(
                                'text-xs px-2 py-0.5 rounded-full',
                                isActive
                                  ? 'bg-primary-foreground/20 text-primary-foreground'
                                  : 'bg-muted text-muted-foreground'
                              )}
                            >
                              {item.count}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};

import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { AlertCircle } from 'lucide-react';

interface BlogPostPreviewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  post: {
    title: string;
    content?: string;
    cover_image_url?: string;
    cover_image_alt?: string;
    author: string;
    published_at?: string;
    category?: {
      name: string;
      color: string;
    };
    read_time?: string;
  };
}

export const BlogPostPreview = ({ open, onOpenChange, post }: BlogPostPreviewProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        {/* Preview Banner */}
        <div className="sticky top-0 z-10 bg-amber-500 text-white px-6 py-3 flex items-center gap-2 shadow-md">
          <AlertCircle className="h-5 w-5" />
          <span className="font-semibold">Preview Mode</span>
          <span className="text-sm opacity-90">This is how your post will appear</span>
        </div>

        {/* Blog Post Content */}
        <article className="p-8">
          {/* Cover Image */}
          {post.cover_image_url && (
            <img
              src={post.cover_image_url}
              alt={post.cover_image_alt || post.title}
              className="w-full h-96 object-cover rounded-lg mb-8"
            />
          )}

          {/* Category Badge */}
          {post.category && (
            <Badge 
              className="mb-4"
              style={{ 
                backgroundColor: post.category.color,
                color: '#ffffff'
              }}
            >
              {post.category.name}
            </Badge>
          )}

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            {post.title}
          </h1>

          {/* Meta Info */}
          <div className="flex items-center gap-4 text-muted-foreground mb-8 text-sm">
            <span>By {post.author}</span>
            <span>•</span>
            <span>
              {post.published_at 
                ? new Date(post.published_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })
                : 'Not published yet'}
            </span>
            {post.read_time && (
              <>
                <span>•</span>
                <span>{post.read_time}</span>
              </>
            )}
          </div>

          {/* Content */}
          <div 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content || '<p>No content yet</p>' }}
          />
        </article>
      </DialogContent>
    </Dialog>
  );
};

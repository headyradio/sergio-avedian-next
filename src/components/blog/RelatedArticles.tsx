import { Link } from "react-router-dom";
import { Clock, ArrowRight } from "lucide-react";
import { OptimizedImage } from "@/components/OptimizedImage";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface RelatedArticlesProps {
  currentPostId: string;
  categoryId?: string;
}

export const RelatedArticles = ({ currentPostId, categoryId }: RelatedArticlesProps) => {
  const { data: relatedPosts, isLoading } = useQuery({
    queryKey: ['related-posts', currentPostId, categoryId],
    queryFn: async () => {
      let query = supabase
        .from('cms_blog_posts')
        .select('*, category:category_id(name, color)')
        .eq('published', true)
        .neq('id', currentPostId)
        .order('published_at', { ascending: false })
        .limit(3);

      if (categoryId) {
        query = query.eq('category_id', categoryId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    }
  });

  if (isLoading || !relatedPosts || relatedPosts.length === 0) {
    return null;
  }

  return (
    <section className="py-16 border-t border-border">
      <div className="editorial-container max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl lg:text-4xl font-bold text-text-primary mb-4">
            Continue Reading
          </h2>
          <p className="text-lg text-text-muted">
            More insights from Sergio Avedian
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {relatedPosts.map((post) => (
            <Link key={post.id} to={`/blog/${post.slug}`} className="group">
              <Card className="h-full overflow-hidden border border-border hover:shadow-lg transition-all duration-300">
                {post.cover_image_url && (
                  <div className="aspect-[16/9] overflow-hidden">
                    <OptimizedImage
                      src={post.cover_image_url}
                      alt={post.cover_image_alt || post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="p-5">
                  {post.category && (
                    <Badge 
                      variant="outline" 
                      className="mb-3"
                      style={{ borderColor: post.category.color }}
                    >
                      {post.category.name}
                    </Badge>
                  )}
                  <h3 className="font-display text-lg font-bold text-text-primary mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  {post.excerpt && (
                    <p className="text-sm text-text-muted mb-3 line-clamp-2">
                      {post.excerpt}
                    </p>
                  )}
                  <div className="flex items-center justify-between text-xs text-text-muted">
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {post.read_time || '5 min'}
                    </div>
                    <div className="flex items-center text-primary group-hover:translate-x-1 transition-transform">
                      Read <ArrowRight className="h-3 w-3 ml-1" />
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
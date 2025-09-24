import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CMSBlogPost } from './useSupabaseCMS';

export interface HomepageBlogData {
  featuredPost: CMSBlogPost | null;
  regularPosts: CMSBlogPost[];
  hasMorePosts: boolean;
  totalPosts: number;
}

export const useHomepageBlogPosts = () => {
  return useQuery({
    queryKey: ['homepage-blog-posts'],
    queryFn: async (): Promise<HomepageBlogData> => {
      // First, get the total count of published posts
      const { count: totalCount } = await supabase
        .from('cms_blog_posts')
        .select('*', { count: 'exact', head: true })
        .eq('published', true);

      // Get the most recent featured post
      const { data: featuredPosts } = await supabase
        .from('cms_blog_posts')
        .select(`
          *,
          category:cms_categories(*)
        `)
        .eq('published', true)
        .eq('featured', true)
        .order('published_at', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(1);

      const featuredPost = featuredPosts?.[0] || null;

      // Get regular posts, excluding the featured post if it exists
      let regularPostsQuery = supabase
        .from('cms_blog_posts')
        .select(`
          *,
          category:cms_categories(*)
        `)
        .eq('published', true)
        .order('published_at', { ascending: false })
        .order('created_at', { ascending: false });

      // If we have a featured post, exclude it from regular posts
      if (featuredPost) {
        regularPostsQuery = regularPostsQuery.neq('id', featuredPost.id);
      }

      const { data: regularPosts } = await regularPostsQuery.limit(6);

      return {
        featuredPost,
        regularPosts: regularPosts || [],
        hasMorePosts: (totalCount || 0) > 7,
        totalPosts: totalCount || 0
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
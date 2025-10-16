import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Types for our CMS data
export interface CMSBlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  author: string;
  category_id?: string;
  cover_image_url?: string;
  cover_image_alt?: string;
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string[];
  featured: boolean;
  published: boolean;
  read_time?: string;
  published_at?: string;
  created_at: string;
  updated_at: string;
  category?: CMSCategory;
}

export interface CMSCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color: string;
  created_at: string;
  updated_at: string;
}

export interface CMSHomepageContent {
  id: string;
  hero_title: string;
  hero_description: string;
  hero_cta_primary: string;
  hero_cta_secondary: string;
  stats_subscribers?: string;
  stats_newsletter?: string;
  stats_videos?: string;
  hero_image_url?: string;
  hero_image_alt?: string;
  // Main hero section fields
  main_hero_title?: string;
  main_hero_subtitle?: string;
  main_hero_description?: string;
  main_hero_motto?: string;
  main_hero_cta_primary?: string;
  main_hero_cta_secondary?: string;
  main_hero_years_experience?: string;
  main_hero_market_crises?: string;
  main_hero_lives_impacted?: string;
  created_at: string;
  updated_at: string;
}

export interface CMSNavigationItem {
  id: string;
  label: string;
  href: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface CMSFooterContent {
  id: string;
  description: string;
  newsletter_title: string;
  newsletter_description: string;
  copyright_text: string;
  youtube_url?: string;
  twitter_url?: string;
  linkedin_url?: string;
  email?: string;
  created_at: string;
  updated_at: string;
}

// Blog Posts Hooks
export const useBlogPosts = (first = 10, skip = 0, published = true) => {
  return useQuery({
    queryKey: ['cms-blog-posts', first, skip, published],
    queryFn: async () => {
      let query = supabase
        .from('cms_blog_posts')
        .select(`
          *,
          category:cms_categories(*)
        `)
        .order('created_at', { ascending: false })
        .range(skip, skip + first - 1);

      if (published) {
        query = query.eq('published', true);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as CMSBlogPost[];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useFeaturedBlogPosts = () => {
  return useQuery({
    queryKey: ['cms-featured-blog-posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cms_blog_posts')
        .select(`
          *,
          category:cms_categories(*)
        `)
        .eq('featured', true)
        .eq('published', true)
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) throw error;
      return data as CMSBlogPost[];
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const useBlogPost = (slug: string) => {
  return useQuery({
    queryKey: ['cms-blog-post', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cms_blog_posts')
        .select(`
          *,
          category:cms_categories(*)
        `)
        .eq('slug', slug)
        .eq('published', true)
        .single();

      if (error) throw error;
      return data as CMSBlogPost;
    },
    staleTime: 1000 * 60 * 5,
  });
};

// Homepage Content Hook
export const useHomepageContent = () => {
  return useQuery({
    queryKey: ['cms-homepage-content'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cms_homepage_content')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data as CMSHomepageContent | null;
    },
    staleTime: 1000 * 60 * 5,
  });
};

// Navigation Items Hook
export const useNavigationItems = () => {
  return useQuery({
    queryKey: ['cms-navigation-items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cms_navigation_items')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) throw error;
      return data as CMSNavigationItem[];
    },
    staleTime: 1000 * 60 * 5,
  });
};

// Footer Content Hook
export const useFooterContent = () => {
  return useQuery({
    queryKey: ['cms-footer-content'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cms_footer_content')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) throw error;
      return data as CMSFooterContent;
    },
    staleTime: 1000 * 60 * 5,
  });
};

// Categories Hook
export const useCategories = () => {
  return useQuery({
    queryKey: ['cms-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cms_categories')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      return data as CMSCategory[];
    },
    staleTime: 1000 * 60 * 5,
  });
};

// Mutations for Admin Interface
export const useCreateBlogPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (blogPost: Omit<CMSBlogPost, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('cms_blog_posts')
        .insert(blogPost)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cms-blog-posts'] });
      toast.success('Blog post created successfully');
    },
    onError: (error) => {
      toast.error('Failed to create blog post: ' + error.message);
    },
  });
};

export const useUpdateBlogPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...blogPost }: Partial<CMSBlogPost> & { id: string }) => {
      const { data, error } = await supabase
        .from('cms_blog_posts')
        .update(blogPost)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cms-blog-posts'] });
      toast.success('Blog post updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update blog post: ' + error.message);
    },
  });
};

export const useDeleteBlogPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('cms_blog_posts')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cms-blog-posts'] });
      toast.success('Blog post deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete blog post: ' + error.message);
    },
  });
};

export const useUpdateHomepageContent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...content }: Partial<CMSHomepageContent> & { id: string }) => {
      console.log('🚀 Starting homepage update mutation');
      console.log('🔑 Update ID:', id);
      console.log('📝 Content to update:', content);
      
      const { data, error, count } = await supabase
        .from('cms_homepage_content')
        .update(content)
        .eq('id', id)
        .select()
        .maybeSingle();

      console.log('📊 Supabase response:', { data, error, count });
      
      if (error) {
        console.error('❌ Supabase error:', error);
        throw error;
      }
      
      console.log('✅ Update successful:', data);
      return data;
    },
    onSuccess: (data) => {
      console.log('🎉 Mutation success callback triggered:', data);
      queryClient.invalidateQueries({ queryKey: ['cms-homepage-content'] });
      toast.success('Homepage content updated successfully!');
    },
    onError: (error) => {
      console.error('💥 Mutation error callback triggered:', error);
      toast.error('Failed to update homepage content: ' + error.message);
    },
  });
};

// Newsletter Management Hooks
export const useQueueNewsletter = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      postId, 
      scheduledFor 
    }: { 
      postId: string; 
      scheduledFor: string;
    }) => {
      const { data, error } = await supabase
        .from('cms_blog_email_queue')
        .insert({
          post_id: postId,
          scheduled_for: scheduledFor,
          status: 'pending',
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['newsletter-queue'] });
      toast.success('Newsletter scheduled successfully');
    },
    onError: (error) => {
      toast.error('Failed to schedule newsletter: ' + error.message);
    },
  });
};

export const useSendNewsletterNow = () => {
  return useMutation({
    mutationFn: async (postId: string) => {
      const { data, error } = await supabase.functions.invoke(
        'send-blog-newsletter',
        {
          body: { post_id: postId },
        }
      );

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success('Newsletter sent successfully!');
    },
    onError: (error) => {
      toast.error('Failed to send newsletter: ' + error.message);
    },
  });
};

export const useNewsletterQueue = (postId: string) => {
  return useQuery({
    queryKey: ['newsletter-queue', postId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cms_blog_email_queue')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!postId,
  });
};

export const useAllNewsletterQueue = () => {
  return useQuery({
    queryKey: ['all-newsletter-queue'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cms_blog_email_queue')
        .select(`
          *,
          post:cms_blog_posts(title, slug, author)
        `)
        .order('scheduled_for', { ascending: false });

      if (error) throw error;
      return data;
    },
  });
};

export const useCancelNewsletter = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (queueId: string) => {
      const { error } = await supabase
        .from('cms_blog_email_queue')
        .update({ status: 'cancelled' })
        .eq('id', queueId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['newsletter-queue'] });
      toast.success('Newsletter cancelled');
    },
    onError: (error) => {
      toast.error('Failed to cancel newsletter: ' + error.message);
    },
  });
};

// Global Settings Hooks
export interface CMSGlobalSettings {
  id: string;
  site_name: string;
  site_description: string;
  logo_url?: string;
  favicon_url?: string;
  primary_color?: string;
  secondary_color?: string;
  created_at: string;
  updated_at: string;
}

export const useGlobalSettings = () => {
  return useQuery({
    queryKey: ['global-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cms_global_settings')
        .select('*')
        .limit(1)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
  });
};

export const useUpdateGlobalSettings = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (settings: Partial<CMSGlobalSettings>) => {
      const { data, error } = await supabase
        .from('cms_global_settings')
        .update(settings)
        .eq('id', settings.id!)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['global-settings'] });
      toast.success('Settings updated successfully');
    },
    onError: (error: any) => {
      toast.error('Failed to update settings: ' + error.message);
    },
  });
};

export const useUpdateFooterContent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (content: Partial<CMSFooterContent>) => {
      const { data, error } = await supabase
        .from('cms_footer_content')
        .update(content)
        .eq('id', content.id!)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['footer-content'] });
      toast.success('Footer content updated successfully');
    },
    onError: (error: any) => {
      toast.error('Failed to update footer content: ' + error.message);
    },
  });
};
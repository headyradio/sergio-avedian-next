import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch categories
    const { data: categories, error: catError } = await supabase
      .from("cms_categories")
      .select("*")
      .order("name");

    if (catError) throw catError;

    // Fetch all blog posts with category info
    const { data: posts, error: postsError } = await supabase
      .from("cms_blog_posts")
      .select(`
        *,
        category:cms_categories(id, name, slug, color, description)
      `)
      .order("created_at", { ascending: false });

    if (postsError) throw postsError;

    // Build export object
    const exportData = {
      exported_at: new Date().toISOString(),
      supabase_project: {
        url: "https://fkafzarnschmdbxevicb.supabase.co",
        anon_key: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZrYWZ6YXJuc2NobWRieGV2aWNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk3Njc0MTcsImV4cCI6MjA1NTM0MzQxN30.-anwBXJ_B9tfTl0PqtUt_YtmrA07MuHawP65CTVBb5M",
        tables: {
          blog_posts: "cms_blog_posts",
          categories: "cms_categories",
          authors: "cms_authors"
        }
      },
      stats: {
        total_posts: posts?.length || 0,
        published_posts: posts?.filter(p => p.published).length || 0,
        draft_posts: posts?.filter(p => !p.published).length || 0,
        featured_posts: posts?.filter(p => p.featured).length || 0,
        total_categories: categories?.length || 0
      },
      categories: categories || [],
      blog_posts: posts?.map(post => ({
        id: post.id,
        title: post.title,
        slug: post.slug,
        author: post.author,
        author_id: post.author_id,
        excerpt: post.excerpt,
        content: post.content,
        published: post.published,
        featured: post.featured,
        published_at: post.published_at,
        created_at: post.created_at,
        updated_at: post.updated_at,
        category_id: post.category_id,
        category: post.category,
        cover_image_url: post.cover_image_url,
        cover_image_alt: post.cover_image_alt,
        read_time: post.read_time,
        seo_title: post.seo_title,
        seo_description: post.seo_description,
        seo_keywords: post.seo_keywords,
        newsletter_subject: post.newsletter_subject,
        newsletter_content: post.newsletter_content,
        newsletter_preview_text: post.newsletter_preview_text
      })) || []
    };

    const jsonString = JSON.stringify(exportData, null, 2);

    return new Response(jsonString, {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="blog-export-${new Date().toISOString().split('T')[0]}.json"`
      },
    });
  } catch (error: any) {
    console.error("Export error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

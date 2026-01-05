import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const postData = await req.json();
    
    console.log('Inserting blog post:', postData.title);

    const { data, error } = await supabase
      .from('cms_blog_posts')
      .insert({
        title: postData.title,
        slug: postData.slug,
        author: postData.author || 'Sergio Avedian',
        category_id: postData.category_id,
        excerpt: postData.excerpt,
        content: postData.content,
        seo_title: postData.seo_title,
        seo_description: postData.seo_description,
        seo_keywords: postData.seo_keywords,
        cover_image_url: postData.cover_image_url,
        cover_image_alt: postData.cover_image_alt,
        read_time: postData.read_time || '5 min read',
        published: postData.published ?? true,
        published_at: postData.published ? new Date().toISOString() : null,
        featured: postData.featured ?? false,
      })
      .select()
      .single();

    if (error) {
      console.error('Insert error:', error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Successfully inserted post:', data.id);

    return new Response(JSON.stringify({ success: true, post: data }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in admin-insert-post:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

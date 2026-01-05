import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { post_id, updates } = await req.json();
    
    if (!post_id || !updates) {
      throw new Error('post_id and updates are required');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('Updating post:', post_id, 'with:', updates);

    const { data, error } = await supabase
      .from('cms_blog_posts')
      .update(updates)
      .eq('id', post_id)
      .select()
      .single();

    if (error) {
      console.error('Update error:', error);
      throw new Error(`Update failed: ${error.message}`);
    }

    console.log('Post updated successfully:', data.id);

    return new Response(JSON.stringify({ 
      success: true, 
      post: data 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

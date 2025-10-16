import { serve } from 'https://deno.land/std@0.190.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req) => {
  try {
    console.log('Checking for scheduled posts to publish...');
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Find posts scheduled to be published
    const { data: scheduledPosts, error } = await supabaseClient
      .from('cms_blog_posts')
      .select('*')
      .eq('published', false)
      .not('published_at', 'is', null)
      .lte('published_at', new Date().toISOString());

    if (error) throw error;

    console.log(`Found ${scheduledPosts?.length || 0} posts to publish`);

    for (const post of scheduledPosts || []) {
      console.log('Publishing post:', post.title);
      
      await supabaseClient
        .from('cms_blog_posts')
        .update({ published: true })
        .eq('id', post.id);
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        published: scheduledPosts?.length || 0,
      }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Auto-publish error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});

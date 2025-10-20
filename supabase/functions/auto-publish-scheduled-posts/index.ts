import { serve } from 'https://deno.land/std@0.190.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req) => {
  try {
    const now = new Date().toISOString();
    console.log(`[${now}] Checking for scheduled posts to publish...`);
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Find posts scheduled to be published
    const { data: scheduledPosts, error } = await supabaseClient
      .from('cms_blog_posts')
      .select('id, title, slug, published_at')
      .eq('published', false)
      .not('published_at', 'is', null)
      .lte('published_at', now);

    if (error) {
      console.error('Database query error:', error);
      throw error;
    }

    const count = scheduledPosts?.length || 0;
    console.log(`Found ${count} post(s) to publish`);

    const published = [];
    const failed = [];

    for (const post of scheduledPosts || []) {
      try {
        console.log(`Publishing: "${post.title}" (${post.slug})`);
        
        const { error: updateError } = await supabaseClient
          .from('cms_blog_posts')
          .update({ published: true })
          .eq('id', post.id);

        if (updateError) {
          console.error(`Failed to publish "${post.title}":`, updateError);
          failed.push({ title: post.title, error: updateError.message });
        } else {
          console.log(`✓ Published: "${post.title}"`);
          published.push(post.title);
        }
      } catch (postError: any) {
        console.error(`Exception publishing "${post.title}":`, postError);
        failed.push({ title: post.title, error: postError.message });
      }
    }

    console.log(`Auto-publish complete: ${published.length} published, ${failed.length} failed`);

    return new Response(
      JSON.stringify({ 
        success: true,
        timestamp: now,
        checked: count,
        published: published.length,
        failed: failed.length,
        details: {
          published,
          failed,
        }
      }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Auto-publish fatal error:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});

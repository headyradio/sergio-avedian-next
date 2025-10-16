import { serve } from 'https://deno.land/std@0.190.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NewsletterRequest {
  post_id?: string;
  queue_id?: string;
  to?: string;
  blogPost?: any;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { post_id, queue_id, to, blogPost: directBlogPost } = await req.json() as NewsletterRequest;
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    let post: any;
    let isTestEmail = !!to;

    if (directBlogPost) {
      post = directBlogPost;
    } else if (post_id) {
      const { data: fetchedPost, error: postError } = await supabaseClient
        .from('cms_blog_posts')
        .select('*')
        .eq('id', post_id)
        .single();

      if (postError || !fetchedPost) {
        throw new Error('Post not found');
      }
      post = fetchedPost;
    } else {
      throw new Error('Either post_id or blogPost must be provided');
    }

    console.log('Processing newsletter for post:', post.title);

    const emailContent = generateEmailContent(post);

    const CONVERTKIT_API_SECRET = Deno.env.get('CONVERTKIT_API_SECRET');
    const TEMPLATE_ID = '4692916';

    if (!CONVERTKIT_API_SECRET) {
      throw new Error('ConvertKit API Secret not configured');
    }

    if (isTestEmail && to) {
      console.log('Sending test email to:', to);
      
      const broadcastData = {
        api_secret: CONVERTKIT_API_SECRET,
        subject: `[TEST] ${post.title}`,
        description: emailContent,
        email_template_id: TEMPLATE_ID,
        public: false,
        subscriber_filter: {
          email_address: to,
        },
      };

      const response = await fetch('https://api.convertkit.com/v3/broadcasts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(broadcastData),
      });

      const result = await response.json();
      
      if (!response.ok) {
        console.error('ConvertKit API error:', result);
        throw new Error(result.message || 'Failed to create broadcast');
      }

      console.log('Test broadcast created:', result.broadcast.id);

      // Publish the test broadcast immediately so it actually sends
      const publishResponse = await fetch(
        `https://api.convertkit.com/v3/broadcasts/${result.broadcast.id}/publish`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ api_secret: CONVERTKIT_API_SECRET }),
        }
      );

      const publishResult = await publishResponse.json();
      
      if (!publishResponse.ok) {
        console.error('Failed to publish test broadcast:', publishResult);
        throw new Error('Test broadcast created but failed to publish');
      }

      console.log('Test broadcast published and sent to:', to);

      return new Response(
        JSON.stringify({
          success: true,
          message: 'Test email sent successfully',
          broadcast_id: result.broadcast.id,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Creating broadcast for all subscribers');

    let queueRecord: any = null;
    if (queue_id) {
      const { data } = await supabaseClient
        .from('cms_blog_email_queue')
        .select('*')
        .eq('id', queue_id)
        .single();
      queueRecord = data;
    }

    const broadcastData: any = {
      api_secret: CONVERTKIT_API_SECRET,
      subject: post.title,
      description: emailContent,
      email_template_id: TEMPLATE_ID,
      public: true,
    };

    if (queueRecord && queueRecord.scheduled_for) {
      const scheduledTime = new Date(queueRecord.scheduled_for);
      if (scheduledTime > new Date()) {
        broadcastData.send_at = scheduledTime.toISOString();
        console.log('Scheduling broadcast for:', scheduledTime.toISOString());
      }
    }

    const response = await fetch('https://api.convertkit.com/v3/broadcasts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(broadcastData),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('ConvertKit API error:', result);
      
      if (queue_id) {
        await supabaseClient
          .from('cms_blog_email_queue')
          .update({
            status: 'failed',
            error_message: result.message || 'Failed to create broadcast',
          })
          .eq('id', queue_id);
      }

      throw new Error(result.message || 'Failed to create broadcast');
    }

    console.log('Broadcast created:', result.broadcast.id);

    // Auto-publish if sending immediately (no schedule)
    if (!broadcastData.send_at) {
      console.log('Publishing broadcast immediately...');
      
      const publishResponse = await fetch(
        `https://api.convertkit.com/v3/broadcasts/${result.broadcast.id}/publish`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ api_secret: CONVERTKIT_API_SECRET }),
        }
      );

      const publishResult = await publishResponse.json();
      
      if (!publishResponse.ok) {
        console.error('Failed to publish broadcast:', publishResult);
        throw new Error('Broadcast created but failed to publish');
      }

      console.log('Broadcast published and sent!');
    } else {
      console.log('Broadcast scheduled for:', broadcastData.send_at);
    }

    if (queue_id) {
      const updateData: any = {
        broadcast_id: result.broadcast.id,
      };

      if (broadcastData.send_at) {
        updateData.status = 'pending';
      } else {
        updateData.status = 'sent';
        updateData.sent_at = new Date().toISOString();
      }

      await supabaseClient
        .from('cms_blog_email_queue')
        .update(updateData)
        .eq('id', queue_id);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Newsletter broadcast created successfully',
        broadcast_id: result.broadcast.id,
        scheduled: !!broadcastData.send_at,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error in send-blog-newsletter:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

function generateEmailContent(post: any): string {
  const domain = 'https://sergioavedian.com';
  const postUrl = `${domain}/blog/${post.slug}`;
  
  const stripHtml = (html: string) => {
    return html.replace(/<[^>]*>/g, '').substring(0, 300) + '...';
  };

  const excerpt = post.excerpt || (post.content ? stripHtml(post.content) : '');
  const publishDate = new Date(post.published_at || new Date()).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return `
    ${post.cover_image_url ? `
    <div style="margin-bottom: 24px;">
      <img src="${post.cover_image_url}" alt="${post.title}" style="width: 100%; max-width: 600px; height: auto; border-radius: 8px; display: block;" />
    </div>
    ` : ''}

    <h2 style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; font-size: 32px; color: #1a202c; font-weight: 700; margin: 0 0 16px 0; letter-spacing: -0.8px; line-height: 1.2;">
      ${post.title}
    </h2>

    <p style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; font-size: 15px; color: #718096; margin: 0 0 24px 0;">
      By ${post.author} • ${publishDate}
    </p>

    <p style="font-family: Georgia, 'Times New Roman', serif; font-size: 18px; line-height: 1.7; color: #2d3748; margin: 0 0 28px 0;">
      ${excerpt}
    </p>

    <div style="margin: 32px 0; text-align: center;">
      <a href="${postUrl}" style="display: inline-block; background: #2c5282; color: #ffffff; padding: 16px 42px; text-decoration: none; border-radius: 6px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; font-weight: 600; font-size: 16px; letter-spacing: 0.3px;">
        Read Full Article →
      </a>
    </div>

    <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 32px 0;" />

    <p style="font-family: Georgia, 'Times New Roman', serif; font-size: 17px; line-height: 1.7; color: #4a5568; margin: 0; font-style: italic;">
      As always, remember: <strong>Patience. Position. Planning.</strong>
    </p>
  `;
}

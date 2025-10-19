import { serve } from 'https://deno.land/std@0.190.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NewsletterRequest {
  post_id?: string;
  mode?: 'draft' | 'schedule' | 'send_now';
  send_at?: string | null;
  to?: string; // For test emails
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { post_id, mode = 'draft', send_at, to } = await req.json() as NewsletterRequest;
    
    if (!post_id) {
      throw new Error('post_id is required');
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Fetch post with all newsletter fields
    const { data: post, error: postError } = await supabaseClient
      .from('cms_blog_posts')
      .select('*')
      .eq('id', post_id)
      .single();

    if (postError || !post) {
      throw new Error('Post not found');
    }

    console.log('Processing newsletter for post:', post.title, 'Mode:', mode);

    const CONVERTKIT_API_KEY = Deno.env.get('CONVERTKIT_API_KEY_V4');
    
    if (!CONVERTKIT_API_KEY) {
      throw new Error('ConvertKit API Key (V4) not configured. Please add CONVERTKIT_API_KEY_V4 secret.');
    }

    // Determine email content - use custom or auto-generated
    const emailContent = post.newsletter_content || generateEmailContent(post);
    const emailSubject = post.newsletter_subject || post.title;
    const previewText = post.newsletter_preview_text || post.excerpt || '';
    const emailTemplateId = post.email_template_id || '4692916';
    
    // Convert subscriber_filter to array format for ConvertKit V4 API
    let subscriberFilter: any[] = [];
    if (post.subscriber_filter && typeof post.subscriber_filter === 'object') {
      // If it's {all: true}, send empty array (means all subscribers in ConvertKit)
      if (!post.subscriber_filter.all) {
        // If specific filters exist, convert to array format
        // For now, we only support "all subscribers"
        subscriberFilter = [];
      }
    }

    // Handle test emails
    if (to) {
      console.log('Sending test email to:', to);
      
      const testBroadcastData = {
        subject: `[TEST] ${emailSubject}`,
        content: emailContent,
        description: `Test email for: ${post.title}`,
        preview_text: previewText,
        email_template_id: emailTemplateId,
        send_at: new Date().toISOString(), // Send immediately
        subscriber_filter: [
          { email_address: to }
        ],
      };

      const response = await fetch('https://api.kit.com/v4/broadcasts', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-Kit-Api-Key': CONVERTKIT_API_KEY,
        },
        body: JSON.stringify(testBroadcastData),
      });

      const result = await response.json();
      
      if (!response.ok) {
        console.error('ConvertKit V4 API error:', result);
        throw new Error(result.message || 'Failed to send test email');
      }

      console.log('Test broadcast sent:', result.id);

      return new Response(
        JSON.stringify({
          success: true,
          message: 'Test email sent successfully',
          broadcast_id: result.id,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Build broadcast data for V4 API
    const broadcastData: any = {
      subject: emailSubject,
      content: emailContent,
      description: `Blog post: ${post.title}`,
      preview_text: previewText,
      email_template_id: emailTemplateId,
    };

    // Only add subscriber_filter if not empty (empty = all subscribers)
    if (subscriberFilter.length > 0) {
      broadcastData.subscriber_filter = subscriberFilter;
    }

    // Handle send_at based on mode
    if (mode === 'draft') {
      // Don't set send_at - creates draft in ConvertKit
      broadcastData.send_at = null;
      console.log('Creating draft broadcast (no send_at)');
    } else if (mode === 'schedule' && send_at) {
      // Schedule for specific time
      broadcastData.send_at = send_at;
      console.log('Scheduling broadcast for:', send_at);
    } else if (mode === 'send_now') {
      // Send immediately
      broadcastData.send_at = new Date().toISOString();
      console.log('Sending broadcast immediately');
    } else {
      // Fallback to draft
      broadcastData.send_at = null;
      console.log('No valid mode/time, creating draft');
    }

    // Create broadcast using ConvertKit V4 API
    const response = await fetch('https://api.kit.com/v4/broadcasts', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'X-Kit-Api-Key': CONVERTKIT_API_KEY,
      },
      body: JSON.stringify(broadcastData),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('ConvertKit V4 API error:', result);
      
      // Map common error codes to friendly messages
      const errorMessages: Record<string, string> = {
        'invalid_template': 'Email template not found. Please check template ID in post settings.',
        'invalid_api_key': 'ConvertKit API key is invalid. Please update CONVERTKIT_API_KEY_V4.',
        'rate_limited': 'Too many requests to ConvertKit. Please wait a moment and try again.',
      };
      
      const friendlyMessage = errorMessages[result.error] || result.message || 'Failed to create broadcast';
      throw new Error(friendlyMessage);
    }

    console.log('Broadcast created successfully:', result.id);

    // Determine Kit status
    let kitStatus = 'draft';
    if (mode === 'send_now') {
      kitStatus = 'sent';
    } else if (mode === 'schedule' && send_at) {
      kitStatus = 'scheduled';
    }

    // Update post with ConvertKit broadcast data
    const { error: updateError } = await supabaseClient
      .from('cms_blog_posts')
      .update({
        kit_broadcast_id: result.id,
        kit_send_at: broadcastData.send_at,
        kit_status: kitStatus,
        sent_to_kit: true,
      })
      .eq('id', post_id);

    if (updateError) {
      console.error('Failed to update post with Kit data:', updateError);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: mode === 'draft' 
          ? 'Draft saved to ConvertKit' 
          : mode === 'schedule' 
          ? 'Newsletter scheduled in ConvertKit' 
          : 'Newsletter sent successfully!',
        broadcast_id: result.id,
        kit_status: kitStatus,
        send_at: broadcastData.send_at,
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

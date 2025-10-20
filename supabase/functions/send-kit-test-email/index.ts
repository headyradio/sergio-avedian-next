import { serve } from 'https://deno.land/std@0.190.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

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
    const { post_id, test_email } = await req.json();
    console.log('Sending test email for post:', post_id, 'to:', test_email);

    if (!post_id || !test_email) {
      throw new Error('post_id and test_email are required');
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Fetch the post
    const { data: post, error: postError } = await supabaseClient
      .from('cms_blog_posts')
      .select('*')
      .eq('id', post_id)
      .single();

    if (postError) throw postError;
    if (!post) throw new Error('Post not found');

    // Generate email HTML content
    const emailHtml = generateEmailContent(post);
    
    const convertKitApiKey = Deno.env.get('CONVERTKIT_API_KEY_V4');
    if (!convertKitApiKey) {
      throw new Error('ConvertKit API key not configured');
    }

    // Send test email using ConvertKit V4 API
    const response = await fetch('https://api.convertkit.com/v4/broadcasts/test', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${convertKitApiKey}`,
      },
      body: JSON.stringify({
        subject: post.newsletter_subject || post.title,
        preview_text: post.newsletter_preview_text || post.excerpt || '',
        content: emailHtml,
        email_addresses: [test_email],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('ConvertKit API error:', errorText);
      throw new Error(`ConvertKit API error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log('Test email sent successfully:', result);

    return new Response(
      JSON.stringify({ 
        success: true,
        message: `Test email sent to ${test_email}`,
        data: result 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error: any) {
    console.error('Error sending test email:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});

function generateEmailContent(post: any): string {
  const domain = 'https://sergioavedian.com';
  const postUrl = `${domain}/blog/${post.slug}`;
  
  const publishDate = new Date(post.published_at || new Date()).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const processContentForEmail = (content: string): string => {
    if (!content) return '';
    
    let emailHtml = content
      .replace(/<h1[^>]*>/g, '<h1 style="font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Helvetica, Arial, sans-serif; font-size: 28px; color: #1a202c; font-weight: 700; margin: 32px 0 16px 0; line-height: 1.3;">')
      .replace(/<h2[^>]*>/g, '<h2 style="font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Helvetica, Arial, sans-serif; font-size: 24px; color: #1a202c; font-weight: 700; margin: 28px 0 14px 0; line-height: 1.3;">')
      .replace(/<h3[^>]*>/g, '<h3 style="font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Helvetica, Arial, sans-serif; font-size: 20px; color: #1a202c; font-weight: 600; margin: 24px 0 12px 0; line-height: 1.4;">')
      .replace(/<p[^>]*>/g, '<p style="font-family: Georgia, \'Times New Roman\', serif; font-size: 17px; line-height: 1.7; color: #2d3748; margin: 0 0 18px 0;">')
      .replace(/<ul[^>]*>/g, '<ul style="font-family: Georgia, \'Times New Roman\', serif; font-size: 17px; line-height: 1.7; color: #2d3748; margin: 16px 0; padding-left: 24px;">')
      .replace(/<ol[^>]*>/g, '<ol style="font-family: Georgia, \'Times New Roman\', serif; font-size: 17px; line-height: 1.7; color: #2d3748; margin: 16px 0; padding-left: 24px;">')
      .replace(/<li[^>]*>/g, '<li style="margin-bottom: 8px;">')
      .replace(/<strong[^>]*>/g, '<strong style="font-weight: 600;">')
      .replace(/<em[^>]*>/g, '<em style="font-style: italic;">')
      .replace(/<a\s+([^>]*href="[^"]*"[^>]*)>/g, '<a $1 style="color: #2c5282; text-decoration: underline;">')
      .replace(/<img\s+([^>]*)>/g, '<img $1 style="max-width: 100%; height: auto; margin: 20px 0; border-radius: 6px; display: block;">');
    
    return emailHtml;
  };

  const fullContent = post.content ? processContentForEmail(post.content) : '';

  return `
    ${post.cover_image_url ? `
      <img src="${post.cover_image_url}" alt="${post.cover_image_alt || post.title}" style="width: 100%; max-width: 600px; height: auto; margin: 0 0 32px 0; border-radius: 8px; display: block;" />
    ` : ''}

    <h2 style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; font-size: 32px; color: #1a202c; font-weight: 700; line-height: 1.2; margin: 0 0 16px 0;">
      ${post.title}
    </h2>

    <p style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; font-size: 15px; color: #718096; margin: 0 0 32px 0;">
      By ${post.author} • ${publishDate}
    </p>

    <div style="font-family: Georgia, 'Times New Roman', serif; font-size: 17px; line-height: 1.7; color: #2d3748;">
      ${fullContent}
    </div>

    <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 40px 0 32px 0;" />

    <div style="margin: 24px 0; text-align: center;">
      <a href="${postUrl}" style="display: inline-block; background: #2c5282; color: #ffffff; padding: 14px 36px; text-decoration: none; border-radius: 6px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; font-weight: 600; font-size: 15px; letter-spacing: 0.3px;">
        Read on Website →
      </a>
    </div>

    <p style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; font-size: 15px; line-height: 1.6; color: #4a5568; margin: 32px 0 0 0; text-align: center;">
      Best regards,<br/>
      <strong>${post.author}</strong>
    </p>
  `;
}

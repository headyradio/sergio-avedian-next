import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface BlogPost {
  title: string;
  excerpt?: string;
  content?: string;
  cover_image_url?: string;
  slug: string;
  author: string;
  published_at?: string;
}

interface NewsletterRequest {
  to: string;
  blogPost: BlogPost;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Blog newsletter function called');
    
    const { to, blogPost }: NewsletterRequest = await req.json();

    if (!to || !blogPost) {
      return new Response(
        JSON.stringify({ error: 'Email address and blog post data are required' }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log(`Sending blog newsletter to: ${to}`);

    // Create HTML email content
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 0;
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 40px 20px;
              text-align: center;
            }
            .header h1 {
              margin: 0;
              font-size: 28px;
              font-weight: bold;
            }
            .content {
              padding: 30px 20px;
            }
            .cover-image {
              width: 100%;
              height: auto;
              border-radius: 8px;
              margin-bottom: 20px;
            }
            h2 {
              color: #1a202c;
              font-size: 24px;
              margin-top: 0;
            }
            .excerpt {
              color: #4a5568;
              font-size: 16px;
              margin: 15px 0;
            }
            .meta {
              color: #718096;
              font-size: 14px;
              margin: 10px 0 20px;
            }
            .cta-button {
              display: inline-block;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              text-decoration: none;
              padding: 14px 32px;
              border-radius: 6px;
              font-weight: 600;
              font-size: 16px;
              margin: 20px 0;
            }
            .footer {
              background: #f7fafc;
              padding: 30px 20px;
              text-align: center;
              font-size: 12px;
              color: #718096;
            }
            .footer a {
              color: #667eea;
              text-decoration: none;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>New Blog Post from Sergio Avedian</h1>
          </div>
          
          <div class="content">
            ${blogPost.cover_image_url ? `<img src="${blogPost.cover_image_url}" alt="${blogPost.title}" class="cover-image">` : ''}
            
            <h2>${blogPost.title}</h2>
            
            ${blogPost.excerpt ? `<p class="excerpt">${blogPost.excerpt}</p>` : ''}
            
            <p class="meta">
              By ${blogPost.author} • ${new Date(blogPost.published_at || new Date()).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            
            <a href="https://yourdomain.com/blog/${blogPost.slug}" class="cta-button">
              Read Full Article
            </a>
          </div>
          
          <div class="footer">
            <p>You're receiving this because you subscribed to Sergio Avedian's newsletter</p>
            <p>
              <a href="https://yourdomain.com">Visit our website</a> • 
              <a href="#">Unsubscribe</a>
            </p>
          </div>
        </body>
      </html>
    `;

    const emailResponse = await resend.emails.send({
      from: "Sergio Avedian <onboarding@resend.dev>",
      to: [to],
      subject: `New Post: ${blogPost.title}`,
      html: emailHtml,
    });

    console.log('Email sent successfully:', emailResponse);

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Email sent successfully',
        data: emailResponse
      }), 
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in send-blog-newsletter function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

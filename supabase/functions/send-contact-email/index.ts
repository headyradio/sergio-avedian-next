import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ContactRequest {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Contact form submission received');
    
    // Get environment variables
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!resendApiKey) {
      console.error('RESEND_API_KEY not found');
      return new Response(
        JSON.stringify({ error: 'Email service not configured' }), 
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Parse request body
    const { name, email, phone, subject, message }: ContactRequest = await req.json();

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log(`Processing contact form for: ${name} (${email})`);

    // Store submission in database if Supabase is configured
    if (supabaseUrl && supabaseServiceKey) {
      try {
        const supabase = createClient(supabaseUrl, supabaseServiceKey);
        
        const { error: dbError } = await supabase
          .from('contact_submissions')
          .insert({
            name,
            email,
            phone: phone || null,
            subject,
            message,
            status: 'new'
          });

        if (dbError) {
          console.error('Database insertion error:', dbError);
          // Continue with email sending even if DB fails
        } else {
          console.log('Contact submission stored in database');
        }
      } catch (dbError) {
        console.error('Database error:', dbError);
        // Continue with email sending even if DB fails
      }
    }

    // Send emails using Resend API directly via fetch
    const notificationEmailData = {
      from: 'Contact Form <noreply@lovable.app>',
      to: ['sergio@sergioavedian.com'],
      subject: `New Contact Form Submission: ${subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
          <p><strong>Subject:</strong> ${subject}</p>
        </div>
        <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #3b82f6;">
          <h3>Message:</h3>
          <p style="white-space: pre-wrap; line-height: 1.6;">${message}</p>
        </div>
        <div style="margin-top: 20px; padding: 10px; background: #e5f3ff; border-radius: 4px; font-size: 12px; color: #666;">
          <p>This message was sent through the contact form on your website.</p>
        </div>
      `
    };

    console.log('Sending notification email...');
    const notificationResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(notificationEmailData),
    });

    if (!notificationResponse.ok) {
      const errorText = await notificationResponse.text();
      console.error('Notification email failed:', errorText);
      throw new Error('Failed to send notification email');
    }

    // Send confirmation email to user
    const confirmationEmailData = {
      from: 'Sergio Avedian <noreply@lovable.app>',
      to: [email],
      subject: 'Thank you for reaching out!',
      html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          <div style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); color: white; padding: 40px 20px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0; font-size: 28px; font-weight: bold;">Thank You, ${name}!</h1>
            <p style="margin: 16px 0 0 0; font-size: 18px; opacity: 0.9;">Your message has been received</p>
          </div>
          
          <div style="background: white; padding: 40px 20px; border-radius: 0 0 8px 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
            <p style="font-size: 16px; line-height: 1.6; color: #374151; margin: 0 0 20px 0;">
              Thank you for reaching out! I appreciate your interest in my trading and investment guidance.
            </p>
            
            <div style="background: #f8fafc; padding: 20px; border-radius: 6px; border-left: 4px solid #3b82f6; margin: 20px 0;">
              <p style="margin: 0; font-size: 14px; color: #6b7280;"><strong>Your message summary:</strong></p>
              <p style="margin: 8px 0 0 0; font-weight: 500; color: #1f2937;">${subject}</p>
            </div>
            
            <p style="font-size: 16px; line-height: 1.6; color: #374151; margin: 20px 0;">
              I personally review every message and will respond within 24-48 hours. In the meantime, feel free to explore my educational content and trading insights.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://sergioavedian.com" style="background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500; display: inline-block;">
                Visit My Website
              </a>
            </div>
            
            <p style="font-size: 14px; color: #6b7280; text-align: center; margin: 30px 0 0 0; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              Best regards,<br>
              <strong style="color: #1f2937;">Sergio Avedian</strong><br>
              <span style="font-size: 12px;">Wall Street Professional & Trading Mentor</span>
            </p>
          </div>
        </div>
      `
    };

    console.log('Sending confirmation email...');
    const confirmationResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(confirmationEmailData),
    });

    // Don't fail if confirmation email fails
    if (!confirmationResponse.ok) {
      const errorText = await confirmationResponse.text();
      console.error('Confirmation email failed:', errorText);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Message sent successfully!',
      }), 
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in send-contact-email function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to send message', 
        details: error.message 
      }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
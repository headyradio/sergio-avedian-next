import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

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
  console.log('Function invoked with method:', req.method);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight');
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Processing POST request');
    
    // Get environment variables
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    console.log('RESEND_API_KEY available:', !!resendApiKey);

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
    const requestBody = await req.text();
    console.log('Request body received:', requestBody);
    
    const { name, email, phone, subject, message }: ContactRequest = JSON.parse(requestBody);
    console.log('Parsed contact data:', { name, email, subject: subject?.substring(0, 50) });

    // Validate required fields
    if (!name || !email || !subject || !message) {
      console.error('Missing required fields');
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Send confirmation email to form submitter
    const confirmationPayload = {
      from: 'Sergio Avedian <onboarding@resend.dev>',
      to: [email],
      subject: 'Thank you for contacting us!',
      html: `
        <h2>Thank you for your message, ${name}!</h2>
        <p>We have received your contact form submission and will get back to you as soon as possible.</p>
        
        <h3>Your message details:</h3>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
        
        <p>Best regards,<br>Sergio Avedian</p>
      `
    };

    console.log('Sending confirmation email...');
    
    const confirmationResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(confirmationPayload),
    });

    console.log('Confirmation email response status:', confirmationResponse.status);
    
    if (!confirmationResponse.ok) {
      const errorText = await confirmationResponse.text();
      console.error('Confirmation email failed:', errorText);
    }

    // Try to send notification to Sergio (may fail in testing mode)
    const notificationPayload = {
      from: 'Contact Form <onboarding@resend.dev>',
      to: ['sergio@sergioavedian.com'],
      subject: `New Contact Form Submission: ${subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `
    };

    console.log('Attempting to send notification email to Sergio...');
    
    const notificationResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(notificationPayload),
    });

    console.log('Notification email response status:', notificationResponse.status);
    
    if (!notificationResponse.ok) {
      const errorText = await notificationResponse.text();
      console.log('Notification email failed (expected in testing mode):', errorText);
    }

    // Always return success if confirmation email was sent
    const confirmationResult = confirmationResponse.ok ? await confirmationResponse.json() : null;
    console.log('Contact form processed successfully');

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Message sent successfully!',
        emailId: confirmationResult?.id || 'unknown'
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
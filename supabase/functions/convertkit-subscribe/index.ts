import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.55.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SubscribeRequest {
  email: string;
  firstName?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('ConvertKit Subscribe function called');
    
    // Get environment variables
    const convertKitApiKey = Deno.env.get('CONVERTKIT_API_KEY');
    const convertKitApiSecret = Deno.env.get('CONVERTKIT_API_SECRET');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!convertKitApiKey || !convertKitApiSecret) {
      console.error('ConvertKit API credentials not found');
      return new Response(
        JSON.stringify({ error: 'ConvertKit API credentials not configured' }), 
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Supabase credentials not found');
      return new Response(
        JSON.stringify({ error: 'Database credentials not configured' }), 
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Parse request body
    const { email, firstName }: SubscribeRequest = await req.json();

    if (!email) {
      return new Response(
        JSON.stringify({ error: 'Email is required' }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log(`Processing subscription for: ${email}`);

    // Check if email already exists in local database
    const { data: existingSubscriber } = await supabase
      .from('newsletter_subscribers')
      .select('*')
      .eq('email', email.toLowerCase())
      .maybeSingle();

    if (existingSubscriber) {
      console.log(`Email ${email} already subscribed`);
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Already subscribed',
          subscriber: existingSubscriber 
        }), 
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Subscribe to ConvertKit using general subscribers endpoint
    const convertKitData = {
      api_key: convertKitApiKey,
      email: email.toLowerCase(),
      ...(firstName && { first_name: firstName })
    };

    console.log('Subscribing to ConvertKit...');
    const convertKitResponse = await fetch('https://api.convertkit.com/v3/subscribers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(convertKitData),
    });

    const convertKitResult = await convertKitResponse.json();
    console.log('ConvertKit response:', convertKitResponse.status, convertKitResult);

    let convertKitSubscriberId = null;
    let subscriptionStatus = 'pending';

    if (convertKitResponse.ok) {
      convertKitSubscriberId = convertKitResult.subscription?.subscriber?.id || null;
      subscriptionStatus = 'active';
      console.log(`Successfully subscribed to ConvertKit with ID: ${convertKitSubscriberId}`);
    } else {
      console.error('ConvertKit subscription failed:', convertKitResult);
      // Continue with local storage even if ConvertKit fails
      subscriptionStatus = 'convertkit_failed';
    }

    // Store in local database regardless of ConvertKit success
    const { data: newSubscriber, error: dbError } = await supabase
      .from('newsletter_subscribers')
      .insert({
        email: email.toLowerCase(),
        convertkit_subscriber_id: convertKitSubscriberId,
        subscription_status: subscriptionStatus,
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database insertion failed:', dbError);
      return new Response(
        JSON.stringify({ 
          error: 'Failed to store subscription', 
          details: dbError.message 
        }), 
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log(`Successfully stored subscription in database:`, newSubscriber);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Successfully subscribed!',
        subscriber: newSubscriber,
        convertkit_success: convertKitResponse.ok
      }), 
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in convertkit-subscribe function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        details: error.message 
      }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
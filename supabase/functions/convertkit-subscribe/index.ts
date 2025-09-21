import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    const convertKitFormId = Deno.env.get('CONVERTKIT_FORM_ID');

    if (!convertKitApiKey) {
      console.error('ConvertKit API key not found');
      return new Response(
        JSON.stringify({ error: 'ConvertKit API key not configured' }), 
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    if (!convertKitFormId) {
      console.error('ConvertKit Form ID not found');
      return new Response(
        JSON.stringify({ error: 'ConvertKit Form ID not configured' }), 
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

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

    // Subscribe to ConvertKit using forms endpoint
    const convertKitData = {
      api_key: convertKitApiKey,
      email: email.toLowerCase(),
      ...(firstName && { first_name: firstName })
    };

    console.log('Subscribing to ConvertKit form...');
    const convertKitResponse = await fetch(`https://api.convertkit.com/v3/forms/${convertKitFormId}/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(convertKitData),
    });

    const convertKitResult = await convertKitResponse.json();
    console.log('ConvertKit response:', convertKitResponse.status, convertKitResult);

    if (convertKitResponse.ok) {
      console.log(`Successfully subscribed to ConvertKit form ${convertKitFormId}`);
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Successfully subscribed!',
          subscriber: convertKitResult.subscription || convertKitResult
        }), 
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    } else {
      console.error('ConvertKit subscription failed:', convertKitResult);
      
      // Return error response from ConvertKit
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Subscription failed', 
          details: convertKitResult.message || convertKitResult.error || 'Unknown error from ConvertKit'
        }), 
        { 
          status: convertKitResponse.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

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
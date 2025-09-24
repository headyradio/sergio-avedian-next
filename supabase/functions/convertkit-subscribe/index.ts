import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SubscribeRequest {
  email: string;
  firstName?: string;
  lastName?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('ConvertKit Subscribe function called');
    
    // Get environment variables
    const convertKitApiKey = Deno.env.get('CONVERTKIT_API_KEY_V4');

    if (!convertKitApiKey) {
      console.error('ConvertKit API V4 key not found');
      return new Response(
        JSON.stringify({ error: 'ConvertKit API V4 key not configured' }), 
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Parse request body
    const { email, firstName, lastName }: SubscribeRequest = await req.json();

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

    // Create subscriber directly in ConvertKit using V4 API (no form required)
    const convertKitData = {
      email_address: email.toLowerCase(),
      state: 'active',
      ...(firstName && { first_name: firstName }),
      ...(lastName && { last_name: lastName })
    };

    console.log('Creating subscriber in ConvertKit V4...');
    const convertKitResponse = await fetch(`https://api.kit.com/v4/subscribers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Kit-Api-Key': convertKitApiKey,
      },
      body: JSON.stringify(convertKitData),
    });

    const convertKitResult = await convertKitResponse.json();
    console.log('ConvertKit V4 response:', convertKitResponse.status, convertKitResult);

    if (convertKitResponse.ok) {
      console.log(`Successfully created subscriber in ConvertKit`);
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Successfully subscribed!',
          subscriber: convertKitResult.subscriber || convertKitResult
        }), 
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    } else {
      console.error('ConvertKit V4 subscriber creation failed:', convertKitResult);
      
      // Handle V4 error format with consistent errors array
      const errorMessage = convertKitResult.errors 
        ? convertKitResult.errors.join(', ')
        : convertKitResult.message || convertKitResult.error || 'Unknown error from ConvertKit';
      
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Subscription failed', 
          details: errorMessage
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
        details: error instanceof Error ? error.message : 'Unknown error' 
      }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const HYGRAPH_ENDPOINT = 'https://ap-south-1.cdn.hygraph.com/content/cmebfl0oe02kv07utjwx0hlht/master';

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, variables = {} } = await req.json();
    
    // Debug: Log all available environment variables
    console.log('Available environment variables:', Object.keys(Deno.env.toObject()));
    
    // Try multiple possible secret names
    const hygraphApiKey = Deno.env.get('HYGRAPH_API_KEY') || 
                         Deno.env.get('HYGRAPH_API_TOKEN') || 
                         Deno.env.get('HYGRAPH_TOKEN');

    console.log('Checking for HYGRAPH_API_KEY:', !!Deno.env.get('HYGRAPH_API_KEY'));
    console.log('Checking for HYGRAPH_API_TOKEN:', !!Deno.env.get('HYGRAPH_API_TOKEN'));
    console.log('Checking for HYGRAPH_TOKEN:', !!Deno.env.get('HYGRAPH_TOKEN'));
    console.log('Final hygraphApiKey found:', !!hygraphApiKey);

    if (!hygraphApiKey) {
      console.error('No Hygraph API key found in any expected environment variable');
      console.error('Available env vars:', Object.keys(Deno.env.toObject()));
      return new Response(
        JSON.stringify({ 
          error: 'Hygraph API key not configured',
          debug: {
            availableEnvVars: Object.keys(Deno.env.toObject()),
            expectedKeys: ['HYGRAPH_API_KEY', 'HYGRAPH_API_TOKEN', 'HYGRAPH_TOKEN']
          }
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('Making request to Hygraph with query:', query);
    console.log('Variables:', variables);

    const response = await fetch(HYGRAPH_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${hygraphApiKey}`,
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    console.log('Hygraph response status:', response.status);
    console.log('Hygraph response ok:', response.ok);

    if (!response.ok) {
      console.error('Hygraph API response not ok:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('Error response body:', errorText);
      return new Response(
        JSON.stringify({ 
          error: `Hygraph API error: ${response.status}`,
          details: errorText,
          endpoint: HYGRAPH_ENDPOINT
        }),
        { 
          status: response.status, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const data = await response.json();
    console.log('Hygraph response data:', data);

    if (data.errors) {
      console.error('GraphQL errors:', data.errors);
      return new Response(
        JSON.stringify({ error: 'GraphQL errors', details: data.errors }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('Success! Returning data to client');
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in hygraph-proxy function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        stack: error.stack,
        type: 'function_error'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
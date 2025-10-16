import { serve } from 'https://deno.land/std@0.190.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const CONVERTKIT_API_SECRET = Deno.env.get('CONVERTKIT_API_SECRET');
    
    if (!CONVERTKIT_API_SECRET) {
      throw new Error('ConvertKit API Secret not configured');
    }

    console.log('Fetching subscriber count from ConvertKit...');

    // Fetch subscribers from ConvertKit API
    const response = await fetch(
      `https://api.convertkit.com/v3/subscribers?api_secret=${CONVERTKIT_API_SECRET}`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      console.error('ConvertKit API error:', error);
      throw new Error('Failed to fetch subscribers');
    }

    const data = await response.json();
    const activeSubscribers = data.subscribers?.filter(
      (sub: any) => sub.state === 'active'
    ) || [];

    console.log(`Found ${activeSubscribers.length} active subscribers`);

    return new Response(
      JSON.stringify({
        success: true,
        count: activeSubscribers.length,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Error fetching subscriber count:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false,
        count: 0,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

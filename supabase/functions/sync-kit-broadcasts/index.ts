import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.55.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ConvertKitBroadcast {
  id: number;
  created_at: string;
  subject: string;
  preview_text?: string;
  public_url?: string;
  thumbnail_url?: string;
  thumbnail_alt?: string;
  email_layout_template?: string;
  email_template_id?: string;
  published?: boolean;
  send_at?: string | null;
}

interface ConvertKitStats {
  broadcast: {
    id: number;
    subject: string;
    recipients?: {
      count: number;
    };
    stats?: {
      open_rate: number;
      click_rate: number;
    };
  };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const convertKitApiKey = Deno.env.get('CONVERTKIT_API_KEY_V4')!;

    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Fetching broadcasts from ConvertKit V4 API...');

    // Fetch all broadcasts from ConvertKit
    const broadcastsResponse = await fetch(
      `https://api.kit.com/v4/broadcasts`,
      {
        headers: {
          'X-Kit-Api-Key': convertKitApiKey,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!broadcastsResponse.ok) {
      const errorText = await broadcastsResponse.text();
      throw new Error(`ConvertKit API error: ${broadcastsResponse.status} - ${errorText}`);
    }

    const broadcastsData = await broadcastsResponse.json();
    const broadcasts = broadcastsData.broadcasts || [];

    console.log(`Found ${broadcasts.length} broadcasts`);

    let syncedCount = 0;
    let errorCount = 0;

    // Process each broadcast
    for (const broadcast of broadcasts) {
      try {
        // Determine status
        let status = 'draft';
        let sentAt = null;
        let scheduledFor = null;

        if (broadcast.published) {
          if (broadcast.send_at) {
            const sendDate = new Date(broadcast.send_at);
            const now = new Date();
            
            if (sendDate > now) {
              status = 'scheduled';
              scheduledFor = sendDate.toISOString();
            } else {
              status = 'sent';
              sentAt = sendDate.toISOString();
            }
          } else {
            // If published but no send_at, assume it was sent
            status = 'sent';
            sentAt = broadcast.created_at;
          }
        }

        // Prepare broadcast data
        const broadcastData: any = {
          kit_broadcast_id: broadcast.id.toString(),
          subject: broadcast.subject,
          preview_text: broadcast.preview_text || null,
          status,
          scheduled_for: scheduledFor,
          sent_at: sentAt,
          synced_at: new Date().toISOString(),
        };

        // If broadcast was sent, try to fetch stats
        if (status === 'sent') {
          try {
            const statsResponse = await fetch(
              `https://api.kit.com/v4/broadcasts/${broadcast.id}/stats`,
              {
                headers: {
                  'X-Kit-Api-Key': convertKitApiKey,
                  'Content-Type': 'application/json',
                },
              }
            );

            if (statsResponse.ok) {
              const statsData: ConvertKitStats = await statsResponse.json();
              
              broadcastData.recipient_count = statsData.broadcast.recipients?.count || 0;
              broadcastData.open_rate = statsData.broadcast.stats?.open_rate || 0;
              broadcastData.click_rate = statsData.broadcast.stats?.click_rate || 0;
            }
          } catch (statsError) {
            console.warn(`Could not fetch stats for broadcast ${broadcast.id}:`, statsError);
          }
        }

        // Upsert to database
        const { error } = await supabase
          .from('cms_newsletters')
          .upsert(broadcastData, {
            onConflict: 'kit_broadcast_id',
          });

        if (error) {
          console.error(`Error syncing broadcast ${broadcast.id}:`, error);
          errorCount++;
        } else {
          syncedCount++;
        }
      } catch (broadcastError) {
        console.error(`Error processing broadcast ${broadcast.id}:`, broadcastError);
        errorCount++;
      }
    }

    const result = {
      success: true,
      synced: syncedCount,
      errors: errorCount,
      total: broadcasts.length,
      timestamp: new Date().toISOString(),
    };

    console.log('Sync complete:', result);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error syncing broadcasts:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

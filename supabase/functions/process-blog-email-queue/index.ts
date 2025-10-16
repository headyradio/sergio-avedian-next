import { serve } from 'https://deno.land/std@0.190.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req) => {
  try {
    console.log('Processing blog email queue...');
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Find pending emails that should be sent now
    const { data: pendingEmails, error } = await supabaseClient
      .from('cms_blog_email_queue')
      .select('*')
      .eq('status', 'pending')
      .lte('scheduled_for', new Date().toISOString())
      .limit(10);

    if (error) throw error;

    console.log(`Found ${pendingEmails?.length || 0} pending emails`);

    for (const email of pendingEmails || []) {
      try {
        console.log('Processing email queue item:', email.id);

        // Update status to sending
        await supabaseClient
          .from('cms_blog_email_queue')
          .update({ status: 'sending' })
          .eq('id', email.id);

        // Call send-blog-newsletter function
        const { data: result, error: sendError } = await supabaseClient.functions.invoke(
          'send-blog-newsletter',
          {
            body: {
              post_id: email.post_id,
              queue_id: email.id,
            },
          }
        );

        if (sendError) {
          console.error('Send error:', sendError);
          await supabaseClient
            .from('cms_blog_email_queue')
            .update({
              status: 'failed',
              error_message: sendError.message,
            })
            .eq('id', email.id);
        } else {
          console.log('Email sent successfully:', result);
        }
      } catch (error: any) {
        console.error('Error processing email:', email.id, error);
        await supabaseClient
          .from('cms_blog_email_queue')
          .update({
            status: 'failed',
            error_message: error.message,
          })
          .eq('id', email.id);
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        processed: pendingEmails?.length || 0,
      }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Cron job error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { post_id, image_url } = await req.json();
    
    if (!post_id || !image_url) {
      throw new Error('post_id and image_url are required');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('Fetching image from:', image_url);

    // Fetch the image
    const imageResponse = await fetch(image_url);
    if (!imageResponse.ok) {
      throw new Error(`Failed to fetch image: ${imageResponse.status}`);
    }

    const imageBlob = await imageResponse.blob();
    const contentType = imageResponse.headers.get('content-type') || 'image/png';
    
    // Generate filename from post_id
    const extension = contentType.includes('jpeg') || contentType.includes('jpg') ? 'jpg' : 'png';
    const filename = `blog-covers/${post_id}.${extension}`;

    console.log('Uploading to storage:', filename);

    // Upload to Supabase storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('cms-media')
      .upload(filename, imageBlob, {
        contentType,
        upsert: true,
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw new Error(`Upload failed: ${uploadError.message}`);
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('cms-media')
      .getPublicUrl(filename);

    const publicUrl = urlData.publicUrl;
    console.log('Public URL:', publicUrl);

    // Update the post with the new URL
    const { error: updateError } = await supabase
      .from('cms_blog_posts')
      .update({ cover_image_url: publicUrl })
      .eq('id', post_id);

    if (updateError) {
      console.error('Update error:', updateError);
      throw new Error(`Failed to update post: ${updateError.message}`);
    }

    console.log('Post updated successfully');

    return new Response(JSON.stringify({ 
      success: true, 
      public_url: publicUrl 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

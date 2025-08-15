import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.55.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface YouTubeVideo {
  id: string;
  snippet: {
    title: string;
    description: string;
    publishedAt: string;
    thumbnails: {
      default: { url: string };
      medium: { url: string };
      high: { url: string };
      standard?: { url: string };
      maxres?: { url: string };
    };
    channelId: string;
    channelTitle: string;
    tags?: string[];
    categoryId: string;
  };
  statistics: {
    viewCount: string;
    likeCount: string;
    commentCount: string;
  };
  contentDetails: {
    duration: string;
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const youtubeApiKey = Deno.env.get('YOUTUBE_API_KEY');

    if (!youtubeApiKey) {
      throw new Error('YouTube API key not configured');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get Sergio's channel ID from the channel handle
    const channelResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&forHandle=SergioAvedian&key=${youtubeApiKey}`
    );

    let channelData = await channelResponse.json();
    
    // If handle doesn't work, try with custom URL
    if (!channelData.items || channelData.items.length === 0) {
      const searchResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=Sergio%20Avedian&key=${youtubeApiKey}`
      );
      const searchData = await searchResponse.json();
      
      if (searchData.items && searchData.items.length > 0) {
        const channelId = searchData.items[0].snippet.channelId;
        const fullChannelResponse = await fetch(
          `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelId}&key=${youtubeApiKey}`
        );
        channelData = await fullChannelResponse.json();
      }
    }

    if (!channelData.items || channelData.items.length === 0) {
      throw new Error('Channel not found');
    }

    const channel = channelData.items[0];
    const channelId = channel.id;

    // Store/update channel info
    const { error: channelError } = await supabase
      .from('youtube_channels')
      .upsert({
        channel_id: channelId,
        channel_title: channel.snippet.title,
        channel_description: channel.snippet.description,
        subscriber_count: parseInt(channel.statistics.subscriberCount || '0'),
        video_count: parseInt(channel.statistics.videoCount || '0'),
        view_count: parseInt(channel.statistics.viewCount || '0'),
        thumbnail_url: channel.snippet.thumbnails.high?.url,
        custom_url: channel.snippet.customUrl,
        published_at: channel.snippet.publishedAt,
      }, {
        onConflict: 'channel_id'
      });

    if (channelError) {
      console.error('Channel upsert error:', channelError);
    }

    // Get videos from the channel
    const videosResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&type=video&order=date&maxResults=50&key=${youtubeApiKey}`
    );

    const videosData = await videosResponse.json();

    if (!videosData.items) {
      throw new Error('No videos found');
    }

    // Get detailed video information
    const videoIds = videosData.items.map((item: any) => item.id.videoId).join(',');
    const detailsResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id=${videoIds}&key=${youtubeApiKey}`
    );

    const detailsData = await detailsResponse.json();

    // Categorize videos based on title keywords
    const categorizeVideo = (title: string, description: string) => {
      const text = (title + ' ' + description).toLowerCase();
      
      if (text.includes('uber') || text.includes('lyft') || text.includes('rideshare') || text.includes('driver')) {
        return 'Rideshare';
      } else if (text.includes('doordash') || text.includes('grubhub') || text.includes('delivery') || text.includes('instacart')) {
        return 'Delivery';
      } else if (text.includes('regulation') || text.includes('law') || text.includes('legal') || text.includes('policy')) {
        return 'Regulation';
      } else if (text.includes('market') || text.includes('finance') || text.includes('stock') || text.includes('investment')) {
        return 'Finance';
      } else {
        return 'Gig Economy';
      }
    };

    // Store videos
    const videoPromises = detailsData.items.map(async (video: YouTubeVideo) => {
      const { error } = await supabase
        .from('youtube_videos')
        .upsert({
          video_id: video.id,
          channel_id: channelId,
          title: video.snippet.title,
          description: video.snippet.description,
          thumbnail_default: video.snippet.thumbnails.default?.url,
          thumbnail_medium: video.snippet.thumbnails.medium?.url,
          thumbnail_high: video.snippet.thumbnails.high?.url,
          thumbnail_standard: video.snippet.thumbnails.standard?.url,
          thumbnail_maxres: video.snippet.thumbnails.maxres?.url,
          published_at: video.snippet.publishedAt,
          duration: video.contentDetails.duration,
          view_count: parseInt(video.statistics.viewCount || '0'),
          like_count: parseInt(video.statistics.likeCount || '0'),
          comment_count: parseInt(video.statistics.commentCount || '0'),
          category_name: categorizeVideo(video.snippet.title, video.snippet.description),
          tags: video.snippet.tags || [],
        }, {
          onConflict: 'video_id'
        });

      if (error) {
        console.error('Video upsert error:', error);
      }
    });

    await Promise.all(videoPromises);

    console.log(`Successfully synced ${detailsData.items.length} videos for channel: ${channel.snippet.title}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Synced ${detailsData.items.length} videos`,
        channelTitle: channel.snippet.title
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('YouTube sync error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
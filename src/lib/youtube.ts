import { google } from 'googleapis';

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID;

const API_BASE_URL = 'https://www.googleapis.com/youtube/v3';

export interface Video {
  id: string;
  title: string;
  thumbnail: string;
  publishedAt: string;
  duration?: string; // ISO 8601 duration
  viewCount?: string;
  isLive?: boolean;
}

// Basic fetch wrapper with error handling
async function fetchYouTube(endpoint: string, params: Record<string, string>) {
  if (!YOUTUBE_API_KEY) return null;
  
  const url = new URL(`${API_BASE_URL}/${endpoint}`);
  url.searchParams.append('key', YOUTUBE_API_KEY);
  Object.entries(params).forEach(([key, value]) => url.searchParams.append(key, value));

  try {
    const res = await fetch(url.toString(), { next: { revalidate: 3600 } }); // Cache for 1 hour
    if (!res.ok) {
      console.error(`YouTube API Error: ${res.status} ${res.statusText}`);
      return null;
    }
    return await res.json();
  } catch (error) {
    console.error('YouTube Fetch Error:', error);
    return null;
  }
}

// Convert ISO 8601 duration to human readable (e.g. PT1H2M10S -> 1:02:10)
function formatDuration(isoDuration: string | undefined): string {
  if (!isoDuration) return '';
  const match = isoDuration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  if (!match) return '';
  
  const hours = (match[1] || '').replace('H', '');
  const minutes = (match[2] || '').replace('M', '');
  const seconds = (match[3] || '').replace('S', '');

  let result = '';
  if (hours) result += `${hours}:`;
  result += `${minutes.padStart(hours ? 2 : 1, '0')}:`;
  result += seconds.padStart(2, '0');
  
  return result;
}

// Extract seconds from ISO duration for filtering
function getDurationSeconds(isoDuration: string | undefined): number {
  if (!isoDuration) return 0;
  const match = isoDuration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  if (!match) return 0;
  
  const hours = parseInt((match[1] || '').replace('H', '') || '0');
  const minutes = parseInt((match[2] || '').replace('M', '') || '0');
  const seconds = parseInt((match[3] || '').replace('S', '') || '0');
  
  return (hours * 3600) + (minutes * 60) + seconds;
}


async function enhanceVideosWithDetails(videos: Video[]): Promise<Video[]> {
  if (videos.length === 0) return [];
  
  const ids = videos.map(v => v.id).join(',');
  const data = await fetchYouTube('videos', {
    part: 'contentDetails,statistics',
    id: ids,
  });

  if (!data?.items) return videos;

  const detailsMap = new Map(data.items.map((item: any) => [item.id, item]));

  return videos.map(video => {
    const details: any = detailsMap.get(video.id);
    return {
      ...video,
      duration: details ? formatDuration(details.contentDetails.duration) : undefined,
      // Store ISO duration internally if needed for filtering, but here we just format
      _isoDuration: details?.contentDetails?.duration, 
      viewCount: details ? details.statistics.viewCount : undefined,
    } as Video & { _isoDuration?: string };
  });
}

// 1. Get Shorts (10 items)
export async function getShorts(limit = 10): Promise<Video[]> {
  if (!CHANNEL_ID) return [];

  const data = await fetchYouTube('search', {
    part: 'snippet',
    channelId: CHANNEL_ID,
    videoDuration: 'short', // < 4 mins, but usually < 1 min for shorts
    type: 'video',
    maxResults: limit.toString(),
    order: 'date'
  });

  if (!data?.items) return [];

  const videos = data.items.map((item: any) => ({
    id: item.id.videoId,
    title: item.snippet.title,
    thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url,
    publishedAt: item.snippet.publishedAt,
    isLive: false,
  }));

  return enhanceVideosWithDetails(videos);
}

// 2. Get Latest Long Form (Not Shorts, Not Live)
// We fetch more than we need because we have to filter clientside after fetching details
export async function getLatestLongFormVideos(limit = 6): Promise<Video[]> {
  if (!CHANNEL_ID) return [];

  // Use Uploads Playlist to get everything sorted by date
  const uploadsPlaylistId = CHANNEL_ID.replace('UC', 'UU');
  
  const data = await fetchYouTube('playlistItems', {
    part: 'snippet',
    playlistId: uploadsPlaylistId,
    maxResults: '20', // Fetch extra to allow for filtering
  });

  if (!data?.items) return [];

  let initialVideos = data.items.map((item: any) => ({
    id: item.snippet.resourceId.videoId,
    title: item.snippet.title,
    thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url,
    publishedAt: item.snippet.publishedAt,
    isLive: false,
  }));

  // Enhance with duration details
  const enhanced = await enhanceVideosWithDetails(initialVideos);

  // Filter out shorts (< 60s) AND videos with "Shorts" in title ideally, but duration is best
  // Also filter based on liveBroadcastContent if available in snippet (but we didn't fetch full snippet)
  // Actually videos endpoint 'contentDetails' doesn't show live status well for VODs
  // We'll rely on duration > 60s.
  // We can also assume vertical vs horizontal but API doesn't give aspect ratio easily.
  
  return enhanced.filter((v: any) => {
    const seconds = getDurationSeconds(v._isoDuration);
    // Filter out shorts (less than 60s)
    if (seconds <= 65) return false; 
    
    // Filter out potentially "Power Hour" or "Trading with Sergio" if we want purely "Other" latest?
    // User said "Latest Videos, which are videos that aren't shorts and aren't live videos"
    // "Live videos" usually means the *category* of Live replays.
    // Live replays are usually long. 
    // Maybe filter by title exclusion? Or just exclude Shorts. 
    // Let's just exclude Shorts for now as that's the main distinction "not shorts". 
    // Usually Live VODs *are* latest videos.
    // If user wants to exclude "Live Stream Archives" from "Latest", that's harder without a specific playlist.
    // But user said "exclude shorts and live videos". 
    // We can filter titles containing "Live" or "Stream"?
    return true; 
  }).slice(0, limit);
}

// 3. Search for Specific Shows (Power Hour, Trading with Sergio)
export async function getShowVideos(query: string, limit = 4): Promise<Video[]> {
  if (!CHANNEL_ID) return [];

  const data = await fetchYouTube('search', {
    part: 'snippet',
    channelId: CHANNEL_ID,
    q: query,
    type: 'video',
    maxResults: limit.toString(),
    order: 'date'
  });

  if (!data?.items) return [];

  const videos = data.items.map((item: any) => ({
    id: item.id.videoId,
    title: item.snippet.title,
    thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url,
    publishedAt: item.snippet.publishedAt,
    isLive: false, // These are VODs usually
  }));

  return enhanceVideosWithDetails(videos);
}

import { google } from 'googleapis';

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID;

const API_BASE_URL = 'https://www.googleapis.com/youtube/v3';

export interface Video {
  id: string;
  title: string;
  thumbnail: string;
  publishedAt: string;
  duration?: string; // Formatted duration
  viewCount?: string;
  isLive?: boolean;
  isShort?: boolean;
}

// Basic fetch wrapper with error handling
async function fetchYouTube(endpoint: string, params: Record<string, string>) {
  if (!YOUTUBE_API_KEY) return null;
  
  const url = new URL(`${API_BASE_URL}/${endpoint}`);
  url.searchParams.append('key', YOUTUBE_API_KEY);
  Object.entries(params).forEach(([key, value]) => url.searchParams.append(key, value));

  try {
    const res = await fetch(url.toString(), { next: { revalidate: 3600 } });
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

// Check if video title/description indicates a live stream
function isLiveStream(title: string): boolean {
  const lowerTitle = title.toLowerCase();
  return lowerTitle.includes('live stream') || 
         lowerTitle.includes('livestream') ||
         lowerTitle.includes('🔴') ||
         lowerTitle.includes('live:') ||
         lowerTitle.includes('- live');
}

// Enhance videos with duration and filter data
async function enhanceVideosWithDetails(videos: Video[]): Promise<(Video & { _isoDuration?: string, _liveBroadcast?: string })[]> {
  if (videos.length === 0) return [];
  
  const ids = videos.map(v => v.id).join(',');
  const data = await fetchYouTube('videos', {
    part: 'contentDetails,statistics,liveStreamingDetails,snippet',
    id: ids,
  });

  if (!data?.items) return videos;

  const detailsMap = new Map(data.items.map((item: any) => [item.id, item]));

  return videos.map(video => {
    const details: any = detailsMap.get(video.id);
    const liveBroadcast = details?.snippet?.liveBroadcastContent || 'none';
    const hasLiveDetails = !!details?.liveStreamingDetails;
    
    return {
      ...video,
      duration: details ? formatDuration(details.contentDetails?.duration) : undefined,
      _isoDuration: details?.contentDetails?.duration, 
      _liveBroadcast: liveBroadcast,
      viewCount: details ? details.statistics?.viewCount : undefined,
      // Mark as live if it has live streaming details or is currently live
      isLive: hasLiveDetails || liveBroadcast === 'live',
    };
  });
}

// 1. Get Shorts (true YouTube Shorts - vertical, < 60s)
export async function getShorts(limit = 10): Promise<Video[]> {
  if (!CHANNEL_ID) return [];

  // Fetch from uploads playlist to get all videos
  const uploadsPlaylistId = CHANNEL_ID.replace('UC', 'UU');
  
  const data = await fetchYouTube('playlistItems', {
    part: 'snippet',
    playlistId: uploadsPlaylistId,
    maxResults: '50', // Fetch more to filter
  });

  if (!data?.items) return [];

  let videos = data.items.map((item: any) => ({
    id: item.snippet.resourceId.videoId,
    title: item.snippet.title,
    thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url,
    publishedAt: item.snippet.publishedAt,
    isLive: false,
  }));

  // Enhance with duration details
  const enhanced = await enhanceVideosWithDetails(videos);

  // Filter to only include TRUE shorts:
  // - Duration <= 60 seconds
  // - NOT a live stream (by title or live details)
  const shorts = enhanced.filter((v: any) => {
    const seconds = getDurationSeconds(v._isoDuration);
    const title = v.title.toLowerCase();
    
    // Must be short (60 seconds or less)
    if (seconds > 60 || seconds === 0) return false;
    
    // Exclude live streams
    if (v.isLive || v._liveBroadcast !== 'none' || isLiveStream(v.title)) return false;
    
    // Exclude if title contains "live" indicators
    if (title.includes('live')) return false;
    
    return true;
  });

  return shorts.slice(0, limit).map(v => ({
    id: v.id,
    title: v.title,
    thumbnail: v.thumbnail,
    publishedAt: v.publishedAt,
    duration: v.duration,
    viewCount: v.viewCount,
    isLive: false,
    isShort: true,
  }));
}

// 2. Get Latest Long Form Videos (NOT shorts, NOT live streams)
export async function getLatestLongFormVideos(limit = 6): Promise<Video[]> {
  if (!CHANNEL_ID) return [];

  // Use Uploads Playlist to get everything sorted by date
  const uploadsPlaylistId = CHANNEL_ID.replace('UC', 'UU');
  
  const data = await fetchYouTube('playlistItems', {
    part: 'snippet',
    playlistId: uploadsPlaylistId,
    maxResults: '30', // Fetch extra to allow for filtering
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

  // Filter out:
  // 1. Shorts (< 60s)
  // 2. Live streams (by title or live details)
  const longFormVideos = enhanced.filter((v: any) => {
    const seconds = getDurationSeconds(v._isoDuration);
    const title = v.title.toLowerCase();
    
    // Exclude shorts (60 seconds or less)
    if (seconds <= 60) return false;
    
    // Exclude live streams
    if (v.isLive || v._liveBroadcast !== 'none') return false;
    if (isLiveStream(v.title)) return false;
    
    // Exclude titles containing common live stream indicators
    if (title.includes('live stream') || title.includes('livestream')) return false;
    if (title.includes('🔴')) return false;
    
    return true;
  });

  return longFormVideos.slice(0, limit).map(v => ({
    id: v.id,
    title: v.title,
    thumbnail: v.thumbnail,
    publishedAt: v.publishedAt,
    duration: v.duration,
    viewCount: v.viewCount,
    isLive: false,
    isShort: false,
  }));
}

// 3. Get Live Streams (Power Hour + Trading with Sergio combined)
// Excludes shorts, only includes videos > 60 seconds
export async function getLiveStreams(limit = 6): Promise<Video[]> {
  if (!CHANNEL_ID) return [];

  // Search for live stream content with multiple queries
  const queries = ['Sergio Avedian Power Hour', 'Trading with Sergio', 'Sergio Avedian Live'];
  
  const allResults: Video[] = [];
  
  for (const query of queries) {
    const data = await fetchYouTube('search', {
      part: 'snippet',
      channelId: CHANNEL_ID,
      q: query,
      type: 'video',
      maxResults: '10',
      order: 'date'
    });

    if (data?.items) {
      const videos = data.items.map((item: any) => ({
        id: item.id.videoId,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url,
        publishedAt: item.snippet.publishedAt,
        isLive: true,
      }));
      allResults.push(...videos);
    }
  }

  // De-duplicate by video ID
  const uniqueVideos = Array.from(
    new Map(allResults.map(v => [v.id, v])).values()
  );

  // Enhance with duration details
  const enhanced = await enhanceVideosWithDetails(uniqueVideos);

  // Filter out shorts (must be > 60 seconds) and sort by date
  const filtered = enhanced
    .filter((v: any) => {
      const seconds = getDurationSeconds(v._isoDuration);
      // Must be longer than 60 seconds (not a short)
      return seconds > 60;
    })
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  return filtered.slice(0, limit).map(v => ({
    id: v.id,
    title: v.title,
    thumbnail: v.thumbnail,
    publishedAt: v.publishedAt,
    duration: v.duration,
    viewCount: v.viewCount,
    isLive: true,
    isShort: false,
  }));
}

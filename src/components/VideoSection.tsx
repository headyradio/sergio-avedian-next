import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import VideoCarousel from "./VideoCarousel";
import ShortsPlayer from "./ShortsPlayer";

import SubscribeDropdown from "./SubscribeDropdown";
import { Card, CardContent } from "@/components/ui/card";
import { Play, Clock, Eye } from "lucide-react";
import { formatDuration, formatViews, formatDate } from "@/utils/videoHelpers";

interface Video {
  id: string;
  video_id: string;
  title: string;
  description: string;
  thumbnail_high: string;
  thumbnail_medium: string;
  published_at: string;
  duration: string;
  view_count: number;
  category_name: string;
  video_type: string;
}

const VideoSection = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [selectedShort, setSelectedShort] = useState<Video | null>(null);


  const syncVideos = async () => {
    setSyncing(true);
    try {
      const { data: result, error } = await supabase.functions.invoke('youtube-sync');
      if (error) throw error;
      
      // Refresh videos after sync
      fetchVideos();
    } catch (error) {
      console.error('Sync error:', error);
    } finally {
      setSyncing(false);
    }
  };

  const fetchVideos = async () => {
    try {
      const { data, error } = await supabase
        .from('youtube_videos')
        .select('*')
        .order('published_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error fetching videos:', error);
        return;
      }

      setVideos(data || []);
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
    
    // Auto-sync logic: sync if no videos exist or if last sync was over 6 hours ago
    const autoSync = async () => {
      const { data: videoData } = await supabase
        .from('youtube_videos')
        .select('id, created_at')
        .order('created_at', { ascending: false })
        .limit(1);
      
      const shouldSync = !videoData || videoData.length === 0 || 
        (videoData[0] && new Date().getTime() - new Date(videoData[0].created_at).getTime() > 6 * 60 * 60 * 1000);
      
      if (shouldSync) {
        syncVideos();
      }
    };
    
    autoSync();
  }, []);

  const getPowerHourVideos = () => {
    return videos.filter(video => 
      video.title.toLowerCase().includes('power hour') && video.video_type === 'live'
    ).slice(0, 10);
  };

  const getTradingWithSergioVideos = () => {
    return videos.filter(video => 
      video.title.toLowerCase().includes('trading with sergio') && video.video_type === 'live'
    ).slice(0, 10);
  };

  const getShortsVideos = () => {
    return videos.filter(video => {
      // Explicitly exclude live videos from shorts section
      if (video.video_type === 'live') return false;
      
      if (video.video_type === 'short') return true;
      
      // Additional check for videos under 2 minutes that might be shorts
      if (video.duration) {
        const match = video.duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
        const hours = parseInt((match?.[1] || '').replace('H', '')) || 0;
        const minutes = parseInt((match?.[2] || '').replace('M', '')) || 0;
        const seconds = parseInt((match?.[3] || '').replace('S', '')) || 0;
        const totalSeconds = hours * 3600 + minutes * 60 + seconds;
        
        if (totalSeconds <= 120) return true;
      }
      
      return false;
    }).slice(0, 15);
  };

  const getRegularVideos = () => {
    return videos.filter(video => {
      // Exclude shorts (including those under 2 minutes)
      if (video.video_type === 'short') return false;
      
      // Check duration to exclude short videos
      if (video.duration) {
        const match = video.duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
        const hours = parseInt((match?.[1] || '').replace('H', '')) || 0;
        const minutes = parseInt((match?.[2] || '').replace('M', '')) || 0;
        const seconds = parseInt((match?.[3] || '').replace('S', '')) || 0;
        const totalSeconds = hours * 3600 + minutes * 60 + seconds;
        
        if (totalSeconds <= 120) return false;
      }
      
      return video.video_type === 'regular' || 
        (video.video_type === 'live' && 
          !video.title.toLowerCase().includes('power hour') && 
          !video.title.toLowerCase().includes('trading with sergio'));
    }).slice(0, 9);
  };

  const handleVideoClick = (video: Video) => {
    const shortsVideos = getShortsVideos();
    const isShort = shortsVideos.some(short => short.id === video.id);
    
    if (isShort) {
      setSelectedShort(video);
    } else {
      window.open(`https://youtube.com/watch?v=${video.video_id}`, '_blank');
    }
  };

  return (
    <section id="videos" className="pt-8 pb-20 lg:pt-12 lg:pb-32 relative -mt-16 z-10">
      <div className="editorial-container">

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-12">
          <div>
            <h2 className="text-4xl lg:text-5xl font-black text-gradient mb-6">
              Latest Videos
            </h2>
            <p className="text-xl text-text-secondary prose-modern">
              Stay informed with expert analysis on financial markets
            </p>
          </div>
        </div>

        {loading ? (
          <div className="space-y-12">
            {/* Loading state for carousels */}
            {[...Array(4)].map((_, sectionIndex) => (
              <div key={sectionIndex} className="space-y-6">
                <div className="h-8 loading-shimmer rounded w-48"></div>
                <div className="flex gap-4 overflow-hidden">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="shrink-0 w-80">
                      <div className="aspect-video loading-shimmer rounded-lg"></div>
                      <div className="p-3 space-y-2">
                        <div className="h-4 loading-shimmer rounded"></div>
                        <div className="h-3 loading-shimmer rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-12">
            {/* LATEST SHORTS Section */}
            <VideoCarousel
              videos={getShortsVideos()}
              title="LATEST SHORTS"
              variant="vertical"
              onVideoClick={handleVideoClick}
            />

            {/* LATEST VIDEOS Section */}
            {getRegularVideos().length > 0 && (
              <>
                <VideoCarousel
                  videos={getRegularVideos()}
                  title="LATEST VIDEOS"
                  variant="horizontal"
                  onVideoClick={handleVideoClick}
                />
                <div className="flex justify-center mt-8">
                  <Button 
                    variant="secondary" 
                    size="lg"
                    onClick={() => window.open('https://www.youtube.com/@SergioAvedian/', '_blank')}
                    className="font-semibold"
                  >
                    View More Videos
                  </Button>
                </div>
              </>
            )}


            {/* POWER HOUR Section */}
            <VideoCarousel
              videos={getPowerHourVideos()}
              title="POWER HOUR"
              variant="horizontal"
              onVideoClick={handleVideoClick}
            />

            {/* TRADING WITH SERGIO Section */}
            <VideoCarousel
              videos={getTradingWithSergioVideos()}
              title="TRADING WITH SERGIO"
              variant="horizontal"
              onVideoClick={handleVideoClick}
            />
          </div>
        )}

        {/* Shorts Player Modal */}
        <ShortsPlayer
          isOpen={!!selectedShort}
          onClose={() => setSelectedShort(null)}
          videos={getShortsVideos()}
          currentVideo={selectedShort}
        />

        {/* Subscribe CTA */}
        <div className="mt-16 bg-gradient-to-r from-cta/10 to-primary/10 border border-cta/20 rounded-2xl p-8 lg:p-12 text-center">
          <h3 className="text-2xl lg:text-3xl font-bold text-text-primary mb-4">
            Stay Connected
          </h3>
          <p className="text-lg text-text-secondary mb-8 max-w-2xl mx-auto">
            Never miss expert trading insights and market analysis. Choose your preferred way to stay updated.
          </p>
          <div className="flex justify-center">
            <SubscribeDropdown variant="cta" size="lg" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoSection;
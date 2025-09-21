import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import VideoCarousel from "./VideoCarousel";
import ShortsPlayer from "./ShortsPlayer";
import GoldSubscriptionSection from "./GoldSubscriptionSection";
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
    }).slice(0, 12);
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


  const RegularVideosGrid = ({ videos }: { videos: Video[] }) => (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {videos.map((video) => (
        <Card
          key={video.id}
          className="group cursor-pointer overflow-hidden hover:shadow-lg transition-all duration-300"
          onClick={() => handleVideoClick(video)}
        >
          <CardContent className="p-0">
            <div className="relative aspect-video bg-surface overflow-hidden">
              <img
                src={video.thumbnail_high || video.thumbnail_medium || '/placeholder.svg'}
                alt={video.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="bg-primary text-primary-foreground w-16 h-16 rounded-full flex items-center justify-center">
                  <Play className="h-6 w-6 ml-1" />
                </div>
              </div>
              <div className="absolute bottom-3 right-3 bg-black/75 text-white px-2 py-1 rounded text-sm font-medium flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {formatDuration(video.duration)}
              </div>
            </div>

            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-cta/10 text-cta">
                  {video.category_name}
                </span>
                <div className="flex items-center text-text-secondary text-sm">
                  <Eye className="h-3 w-3 mr-1" />
                  {formatViews(video.view_count)}
                </div>
              </div>

              <h3 className="text-lg font-semibold text-text-primary mb-2 group-hover:text-primary transition-colors line-clamp-2">
                {video.title}
              </h3>

              <div className="flex items-center justify-between text-sm text-text-muted">
                <span>{formatDate(video.published_at)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <section className="pt-8 pb-20 lg:pt-12 lg:pb-32 relative -mt-16 z-10">
      <div className="editorial-container">
        {/* Section Intro */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <span className="text-sm font-medium text-primary">Fresh Content</span>
          </div>
        </div>

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-12">
          <div>
            <h2 className="text-4xl lg:text-5xl font-black text-gradient mb-6">
              Latest Videos
            </h2>
            <p className="text-xl text-text-secondary prose-modern">
              Stay informed with expert analysis on the gig economy
            </p>
          </div>
          <Button 
            variant="secondary" 
            size="lg"
            onClick={syncVideos}
            disabled={syncing}
            className="glass-card"
          >
            {syncing ? 'Syncing...' : 'Sync Videos'}
          </Button>
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
              <div>
                <h3 className="text-2xl font-bold text-text-primary mb-6">LATEST VIDEOS</h3>
                <RegularVideosGrid videos={getRegularVideos()} />
              </div>
            )}

            {/* GOLD SUBSCRIPTION Section */}
            <GoldSubscriptionSection />

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
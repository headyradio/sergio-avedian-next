import { Button } from "@/components/ui/button";
import { Play, Clock, Eye } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import SubscribeDropdown from "@/components/SubscribeDropdown";

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
}

const VideoGrid = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  const formatDuration = (isoDuration: string) => {
    if (!isoDuration) return '0:00';
    const match = isoDuration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    const hours = (match?.[1] || '').replace('H', '');
    const minutes = (match?.[2] || '').replace('M', '');
    const seconds = (match?.[3] || '').replace('S', '');
    
    if (hours) {
      return `${hours}:${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`;
    }
    return `${minutes || '0'}:${seconds.padStart(2, '0')}`;
  };

  const formatViews = (views: number) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  };

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const { data, error } = await supabase
          .from('youtube_videos')
          .select('*')
          .order('published_at', { ascending: false })
          .limit(12);

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

    fetchVideos();
  }, []);

  const categoryColors = {
    Rideshare: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300",
    Delivery: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300",
    Regulation: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300",
    Finance: "bg-cta/10 text-cta",
    Markets: "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300"
  };

  return (
    <section className="py-16 lg:py-24 bg-surface">
      <div className="editorial-container">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-12">
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold text-text-primary mb-4">
              Latest Videos
            </h2>
            <p className="text-lg text-text-secondary">
              Stay informed with expert analysis on financial markets
            </p>
          </div>
          <Button variant="editorial" size="lg">
            View All Videos
          </Button>
        </div>

        {/* Video Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-card border border-card-border rounded-2xl overflow-hidden animate-pulse">
                <div className="aspect-video bg-surface"></div>
                <div className="p-6 space-y-4">
                  <div className="flex justify-between">
                    <div className="h-6 bg-surface rounded w-20"></div>
                    <div className="h-4 bg-surface rounded w-12"></div>
                  </div>
                  <div className="h-6 bg-surface rounded"></div>
                  <div className="h-4 bg-surface rounded"></div>
                  <div className="flex justify-between">
                    <div className="h-4 bg-surface rounded w-16"></div>
                    <div className="h-8 bg-surface rounded w-20"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : videos.length === 0 ? (
          <div className="text-center py-12 space-y-4">
            <p className="text-text-secondary text-lg">No videos found. Sync YouTube data first.</p>
            <Button 
              onClick={async () => {
                setLoading(true);
                try {
                  const { data: result, error } = await supabase.functions.invoke('youtube-sync');
                  if (error) throw error;
                  
                  // Refresh videos after sync
                  const { data } = await supabase
                    .from('youtube_videos')
                    .select('*')
                    .order('published_at', { ascending: false })
                    .limit(12);
                  setVideos(data || []);
                } catch (error) {
                  console.error('Sync error:', error);
                } finally {
                  setLoading(false);
                }
              }}
              variant="cta"
              size="lg"
            >
              Sync YouTube Videos
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {videos.map((video) => (
              <article
                key={video.id}
                className="group bg-card border border-card-border rounded-2xl overflow-hidden shadow-subtle hover:shadow-large transition-all duration-300 cursor-pointer"
                onClick={() => window.open(`https://youtube.com/watch?v=${video.video_id}`, '_blank')}
              >
                {/* Thumbnail */}
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

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        video.category_name === 'Rideshare' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300' :
                        video.category_name === 'Delivery' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' :
                        video.category_name === 'Regulation' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300' :
                        video.category_name === 'Finance' ? 'bg-cta/10 text-cta' :
                        'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300'
                      }`}
                    >
                      {video.category_name}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-text-primary mb-3 group-hover:text-primary transition-colors line-clamp-2">
                    {video.title}
                  </h3>

                  <p className="text-text-secondary mb-4 line-clamp-2 leading-relaxed">
                    {video.description?.substring(0, 150)}...
                  </p>

                  <div className="flex items-center justify-between text-sm text-text-muted">
                    <span>{formatDate(video.published_at)}</span>
                    <Button variant="ghost" size="sm" className="text-primary hover:text-primary-hover">
                      Watch now
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Newsletter CTA */}
        <div className="mt-16 bg-gradient-to-r from-cta/10 to-primary/10 border border-cta/20 rounded-2xl p-8 lg:p-12 text-center">
          <h3 className="text-2xl lg:text-3xl font-bold text-text-primary mb-4">
            Never Miss a Video
          </h3>
          <p className="text-lg text-text-secondary mb-8 max-w-2xl mx-auto">
            Get notified when new videos drop. Join thousands of investors who stay ahead of the curve.
          </p>
          <div className="flex justify-center">
            <SubscribeDropdown 
              variant="cta" 
              size="lg" 
              className="text-lg px-8 py-4"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoGrid;
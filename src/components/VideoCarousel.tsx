import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Play, Clock, Eye, Radio, Zap } from "lucide-react";
import { useRef } from "react";
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

interface VideoCarouselProps {
  videos: Video[];
  title: string;
  variant?: 'horizontal' | 'vertical';
  onVideoClick: (video: Video) => void;
}

const VideoCarousel = ({ videos, title, variant = 'horizontal', onVideoClick }: VideoCarouselProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);


  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = variant === 'vertical' ? 200 : 320;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (videos.length === 0) {
    return null;
  }

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-text-primary">{title}</h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll('left')}
            className="h-8 w-8"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll('right')}
            className="h-8 w-8"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {videos.map((video) => (
          <Card
            key={video.id}
            className={`group cursor-pointer shrink-0 overflow-hidden hover:shadow-lg transition-all duration-300 ${
              variant === 'vertical' ? 'w-48' : 'w-80'
            }`}
            onClick={() => onVideoClick(video)}
          >
            <CardContent className="p-0">
              <div className={`relative bg-surface overflow-hidden ${
                variant === 'vertical' ? 'aspect-[9/16]' : 'aspect-video'
              }`}>
                <img
                  src={video.thumbnail_high || video.thumbnail_medium || '/placeholder.svg'}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="bg-primary text-primary-foreground w-12 h-12 rounded-full flex items-center justify-center">
                    <Play className="h-5 w-5 ml-0.5" />
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 bg-black/75 text-white px-1.5 py-0.5 rounded text-xs font-medium flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {formatDuration(video.duration)}
                </div>
                
                {/* Video type indicator */}
                {video.video_type === 'live' && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white px-1.5 py-0.5 rounded text-xs font-medium flex items-center">
                    <Radio className="h-3 w-3 mr-1" />
                    LIVE
                  </div>
                )}
                {video.video_type === 'short' && (
                  <div className="absolute top-2 left-2 bg-yellow-500 text-white px-1.5 py-0.5 rounded text-xs font-medium flex items-center">
                    <Zap className="h-3 w-3 mr-1" />
                    SHORT
                  </div>
                )}
              </div>

              <div className="p-3">
                <h4 className={`font-semibold text-text-primary group-hover:text-primary transition-colors line-clamp-2 ${
                  variant === 'vertical' ? 'text-sm' : 'text-base'
                }`}>
                  {video.title}
                </h4>
                
                <div className="flex items-center justify-end mt-2 text-xs text-text-secondary">
                  <span>{formatDate(video.published_at)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default VideoCarousel;
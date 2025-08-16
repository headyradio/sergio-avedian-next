import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { X, ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";

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

interface ShortsPlayerProps {
  isOpen: boolean;
  onClose: () => void;
  videos: Video[];
  currentVideo: Video | null;
}

const ShortsPlayer = ({ isOpen, onClose, videos, currentVideo }: ShortsPlayerProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [startY, setStartY] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentVideo && videos.length > 0) {
      const index = videos.findIndex(video => video.id === currentVideo.id);
      setCurrentIndex(index >= 0 ? index : 0);
    }
  }, [currentVideo, videos]);

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const goToNext = () => {
    if (currentIndex < videos.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartY(e.touches[0].clientY);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const endY = e.changedTouches[0].clientY;
    const diff = startY - endY;
    
    // Swipe up (next video) - threshold of 50px
    if (diff > 50 && currentIndex < videos.length - 1) {
      goToNext();
    }
    // Swipe down (previous video) - threshold of 50px
    else if (diff < -50 && currentIndex > 0) {
      goToPrevious();
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!isOpen) return;
    
    if (e.key === 'ArrowUp' && currentIndex > 0) {
      e.preventDefault();
      goToPrevious();
    } else if (e.key === 'ArrowDown' && currentIndex < videos.length - 1) {
      e.preventDefault();
      goToNext();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, currentIndex, videos.length]);

  if (!videos[currentIndex]) return null;

  const video = videos[currentIndex];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-0 bg-black border-none overflow-hidden">
        <DialogHeader className="absolute top-4 left-4 right-4 z-10">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-white text-sm font-medium truncate pr-4">
              {video.title}
            </DialogTitle>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-white/60 text-xs">
                {currentIndex + 1} / {videos.length}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-white hover:bg-white/20"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>
        
        <div 
          ref={containerRef}
          className="aspect-[9/16] w-full relative"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <iframe
            key={video.video_id}
            src={`https://www.youtube.com/embed/${video.video_id}?autoplay=1&modestbranding=1&rel=0`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
          
          {/* Navigation arrows */}
          {currentIndex > 0 && (
            <Button
              variant="ghost"
              size="icon"
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20 z-10"
            >
              <ChevronUp className="h-6 w-6" />
            </Button>
          )}
          
          {currentIndex < videos.length - 1 && (
            <Button
              variant="ghost"
              size="icon"
              onClick={goToNext}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20 z-10"
            >
              <ChevronDown className="h-6 w-6" />
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShortsPlayer;
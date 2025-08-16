import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { X, ChevronUp, ChevronDown, Info } from "lucide-react";
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
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const currentIndexRef = useRef(currentIndex);
  const videosRef = useRef(videos);

  // Keep refs in sync with state
  useEffect(() => {
    currentIndexRef.current = currentIndex;
    videosRef.current = videos;
  }, [currentIndex, videos]);

  useEffect(() => {
    if (currentVideo && videos.length > 0) {
      const index = videos.findIndex(video => video.id === currentVideo.id);
      setCurrentIndex(index >= 0 ? index : 0);
    }
  }, [currentVideo, videos]);

  const goToPrevious = () => {
    const newIndex = currentIndexRef.current - 1;
    if (newIndex >= 0) {
      setCurrentIndex(newIndex);
    }
  };

  const goToNext = () => {
    const newIndex = currentIndexRef.current + 1;
    if (newIndex < videosRef.current.length) {
      setCurrentIndex(newIndex);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartY(e.touches[0].clientY);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const endY = e.changedTouches[0].clientY;
    const diff = startY - endY;
    
    // Swipe up (next video) - threshold of 50px
    if (diff > 50) {
      goToNext();
    }
    // Swipe down (previous video) - threshold of 50px
    else if (diff < -50) {
      goToPrevious();
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!isOpen) return;
    
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      goToPrevious();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      goToNext();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen]);

  // Auto-play next video functionality with multiple detection methods
  useEffect(() => {
    if (!isOpen) return;

    let videoEndTimeout: NodeJS.Timeout;
    
    const handleMessage = (event: MessageEvent) => {
      // Only listen to YouTube messages
      if (event.origin !== 'https://www.youtube.com') return;
      
      console.log('YouTube message received:', event.data);
      
      // Handle different YouTube message formats
      if (typeof event.data === 'string') {
        let shouldAdvance = false;
        
        try {
          const data = JSON.parse(event.data);
          console.log('Parsed YouTube data:', data);
          
          // Multiple ways to detect video end
          if (
            (data.event === 'video-data-change' && data.info?.playerState === 0) ||
            (data.event === 'onStateChange' && data.info === 0) ||
            (data.info && data.info.playerState === 0) ||
            (data.playerState === 0)
          ) {
            shouldAdvance = true;
            console.log('Video ended detected via JSON data');
          }
        } catch (e) {
          // Handle non-JSON string messages
          if (
            event.data.includes('"playerState":0') ||
            event.data.includes('playerState=0') ||
            event.data.includes('"event":"video-data-change"') ||
            event.data.includes('ended')
          ) {
            shouldAdvance = true;
            console.log('Video ended detected from string message');
          }
        }
        
        if (shouldAdvance && currentIndexRef.current < videosRef.current.length - 1) {
          console.log('Advancing to next video...');
          clearTimeout(videoEndTimeout);
          videoEndTimeout = setTimeout(() => {
            goToNext();
          }, 500);
        }
      }
    };

    // Fallback timer for video duration (for shorts, usually 60 seconds max)
    const currentVideo = videosRef.current[currentIndexRef.current];
    if (currentVideo) {
      clearTimeout(videoEndTimeout);
      // Set a generous timeout as fallback (90 seconds for shorts)
      videoEndTimeout = setTimeout(() => {
        console.log('Fallback timeout triggered, checking if should advance...');
        if (currentIndexRef.current < videosRef.current.length - 1) {
          goToNext();
        }
      }, 90000);
    }

    window.addEventListener('message', handleMessage);
    
    return () => {
      window.removeEventListener('message', handleMessage);
      clearTimeout(videoEndTimeout);
    };
  }, [isOpen]);

  if (!videos[currentIndex]) return null;

  const video = videos[currentIndex];

  return (
    <TooltipProvider>
      <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-0 bg-black border-none overflow-hidden">
        <DialogDescription className="sr-only">
          YouTube Shorts player with navigation controls
        </DialogDescription>
        <DialogHeader className="absolute top-4 left-4 right-4 z-10">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-white text-sm font-medium truncate pr-4">
              {video.title}
            </DialogTitle>
            <div className="flex items-center gap-2 shrink-0">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/20"
                  >
                    <Info className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-xs">
                  <p className="text-sm">Use ↑↓ arrow keys or swipe up/down to navigate between shorts</p>
                </TooltipContent>
              </Tooltip>
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
            ref={iframeRef}
            key={video.video_id}
            src={`https://www.youtube.com/embed/${video.video_id}?autoplay=1&modestbranding=1&rel=0&enablejsapi=1&origin=${window.location.origin}`}
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
    </TooltipProvider>
  );
};

export default ShortsPlayer;
"use client";

import { useEffect, useRef, useState } from "react";
import { X, ChevronUp, ChevronDown, Play, Pause, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Video } from "@/lib/youtube";

interface ShortsModalProps {
  videos: Video[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function ShortsModal({ videos, initialIndex, isOpen, onClose }: ShortsModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isPlaying, setIsPlaying] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollTimeout = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, initialIndex]);

  useEffect(() => {
    // Scroll to current index when it changes
    if (containerRef.current && isOpen) {
        const el = containerRef.current.children[currentIndex] as HTMLElement;
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
        }
    }
  }, [currentIndex, isOpen]);


  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    // Simple debounce to handle snap scrolling detection if needed
    // But CSS snap-y usually handles the UI. we just need to update index.
  };

  const handleNext = () => {
    if (currentIndex < videos.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!isOpen) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      handleNext();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      handlePrev();
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, currentIndex]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center">
      {/* Close Button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4 text-white z-50 hover:bg-white/10"
        onClick={onClose}
      >
        <X className="w-8 h-8" />
      </Button>

      {/* Navigation Helpers (Desktop) */}
      <div className="hidden lg:flex flex-col gap-4 absolute right-12 top-1/2 -translate-y-1/2 z-40">
         <Button 
            variant="ghost" 
            size="icon" 
            onClick={handlePrev} 
            disabled={currentIndex === 0}
            className="text-white hover:bg-white/10 disabled:opacity-30 rounded-full w-12 h-12"
         >
            <ChevronUp className="w-8 h-8" />
         </Button>
         <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleNext} 
            disabled={currentIndex === videos.length - 1}
            className="text-white hover:bg-white/10 disabled:opacity-30 rounded-full w-12 h-12"
         >
            <ChevronDown className="w-8 h-8" />
         </Button>
      </div>


      {/* Main Container */}
      <div 
        className="w-full h-full md:w-[450px] md:h-[800px] md:max-h-[90vh] bg-black md:rounded-2xl overflow-hidden relative shadow-2xl border border-white/10"
      >
        {/* Helper text */}
        <div className="absolute top-4 left-0 right-0 text-center z-10 pointer-events-none opacity-0 animate-fade-in-out">
            <span className="bg-black/50 text-white text-xs px-3 py-1 rounded-full backdrop-blur-md">
                Swipe or use arrow keys
            </span>
        </div>

        {/* Video Slider */}
        <div 
            ref={containerRef}
            className="w-full h-full overflow-y-auto snap-y snap-mandatory scrollbar-hide"
            style={{ scrollBehavior: 'smooth' }}
        >
            {videos.map((video, idx) => (
                <div 
                    key={video.id} 
                    className="w-full h-full snap-start snap-always relative flex items-center justify-center bg-black"
                >
                    {idx === currentIndex ? (
                        <iframe
                            className="w-full h-full"
                            src={`https://www.youtube.com/embed/${video.id}?autoplay=1&controls=1&rel=0&loop=1&playlist=${video.id}&modestbranding=1&playsinline=1`}
                            title={video.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    ) : (
                         // Placeholder for off-screen slides
                        <div 
                            className="w-full h-full bg-cover bg-center opacity-30 blur-sm"
                            style={{ backgroundImage: `url(${video.thumbnail})` }} 
                        />
                    )}
                    
                    {/* Info Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/60 to-transparent p-6 pointer-events-none">
                        <h3 className="text-white font-bold text-lg leading-tight line-clamp-2 mb-2">
                            {video.title}
                        </h3>
                        <div className="flex items-center justify-between text-white/80 text-sm">
                            <span>{new Date(video.publishedAt).toLocaleDateString()}</span>
                             <a 
                                href={`https://www.youtube.com/watch?v=${video.id}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 hover:text-red-500 transition-colors pointer-events-auto"
                            >
                                Open in YouTube <ExternalLink className="w-3 h-3" />
                            </a>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
}

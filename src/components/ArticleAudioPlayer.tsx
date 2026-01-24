'use client';

import { useState, useRef } from 'react';
import { Play, Pause, Loader2, Headphones } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface ArticleAudioPlayerProps {
  slug: string;
  title: string;
  plainText: string; // The full text content to speak
}

export default function ArticleAudioPlayer({ slug, title, plainText }: ArticleAudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleTogglePlay = async () => {
    // Case 1: Audio is already loaded/ready
    if (audioRef.current && audioUrl) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      return;
    }

    // Case 2: Need to fetch/generate audio
    try {
      setIsLoading(true);
      
      const response = await fetch('/api/generate-audio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          slug,
          text: plainText,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate audio');
      }

      // Check content type to see if we got JSON (URL) or Blob (Audio)
      const contentType = response.headers.get('content-type');
      let src = '';

      if (contentType && contentType.includes('application/json')) {
         const data = await response.json();
         if (data.audioUrl) {
            src = data.audioUrl;
         }
      } else {
         // Received raw audio blob
         const blob = await response.blob();
         src = URL.createObjectURL(blob);
      }

      if (src) {
          setAudioUrl(src);
          // Wait for state update to reflect in ref, or just set it directly on new audio obj if ref is null
          // Use timeout to allow render cycle to attach src to <audio> logic if needed, 
          // or just assume <audio src={audioUrl}> handles it.
          // Better: setAudioUrl triggers re-render. We can auto-play in useEffect or just assume user clicks again?
          // Let's trying setting it and playing.
      } else {
          throw new Error("No audio source returned");
      }

    } catch (error) {
      console.error("Audio playback error:", error);
      toast.error("Could not load audio for this article.");
      setIsLoading(false);
    }
  };

  // Effect to autoplay once URL is loaded from a user click action
  // (Browser requires user interaction, which we have from the click)
  const onLoadedData = () => {
     if (audioRef.current && !isPlaying) {
        audioRef.current.play().catch(e => console.warn("Autoplay blocked", e));
     }
  };

  return (
    <div className="flex items-center gap-4 my-6 p-4 rounded-lg bg-surface border border-border/50 shadow-sm max-w-2xl">
        <div className="flex-shrink-0 bg-primary/10 p-3 rounded-full">
            <Headphones className="w-6 h-6 text-primary" />
        </div>
        
        <div className="flex-grow min-w-0">
            <p className="text-sm font-medium text-text-secondary uppercase tracking-wider mb-1">
                Listen to this article
            </p>
            <p className="text-xs text-text-muted truncate">
                {title}
            </p>
        </div>

        <div className="flex-shrink-0">
             <Button 
                onClick={handleTogglePlay}
                disabled={isLoading}
                variant="outline"
                size="sm"
                className={cn(
                    "min-w-[120px] gap-2 transition-all",
                    isPlaying ? "border-primary text-primary" : "hover:border-primary/50"
                )}
             >
                {isLoading ? (
                    <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Loading...</span>
                    </>
                ) : isPlaying ? (
                    <>
                        <Pause className="w-4 h-4 fill-current" />
                        <span>Pause</span>
                    </>
                ) : (
                    <>
                        <Play className="w-4 h-4 fill-current" />
                        <span>Listen</span>
                    </>
                )}
             </Button>
        </div>

      <audio
        ref={audioRef}
        src={audioUrl || undefined}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
        onError={() => setIsLoading(false)}
        onLoadedMetadata={() => {
          if (isLoading) {
            setIsLoading(false);
            audioRef.current?.play().catch(() => {});
          }
        }}
      />

      {/* Floating Player - Visible when audio is ready */}
      {audioUrl && (
        <div className={cn(
          "fixed bottom-6 right-6 z-50 flex items-center gap-3 p-3 rounded-full bg-surface border border-border/50 shadow-elegant backdrop-blur-md transition-all duration-500 ease-out transform",
          isPlaying ? "translate-y-0 opacity-100" : "translate-y-24 opacity-0 pointer-events-none group-hover:translate-y-0 group-hover:opacity-100"
        )}>
          {/* We actually want it persistent if audio is loaded, maybe just check audioUrl. 
              Let's make it always visible if audioUrl exists, effectively acting as "Now Playing" 
          */}
        </div>
      )}
      
      {/* Revised Floating Player Logic */}
      {audioUrl && (
         <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-10 fade-in duration-300">
            <div className="flex items-center gap-3 p-2 pr-4 pl-2 rounded-full bg-background/80 backdrop-blur-lg border border-primary/20 shadow-lg shadow-primary/5">
                <div className="relative">
                   <div className={cn("absolute inset-0 rounded-full bg-primary/20 animate-ping", isPlaying ? "opacity-75" : "opacity-0")} />
                   <Button
                      onClick={handleTogglePlay}
                      size="icon"
                      className="rounded-full h-10 w-10 bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm relative z-10"
                      aria-label={isPlaying ? "Pause audio" : "Play audio"}
                   >
                      {isPlaying ? <Pause className="h-4 w-4 fill-current" /> : <Play className="h-4 w-4 fill-current pl-0.5" />}
                   </Button>
                </div>
                
                <div className="flex flex-col mr-2">
                    <span className="text-[10px] font-semibold text-primary uppercase tracking-wider">Now Playing</span>
                    <span className="text-xs font-medium text-foreground max-w-[120px] truncate leading-tight">{title}</span>
                </div>

                <Button
                   variant="ghost"
                   size="icon"
                   className="h-6 w-6 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/50 -mr-1"
                   onClick={() => {
                       if (audioRef.current) {
                           audioRef.current.pause();
                           audioRef.current.currentTime = 0;
                           setIsPlaying(false);
                           // Effectively closes/hides if we clear audioUrl, but maybe user just wants to close the floater?
                           // For now, let's just stop. To close fully we need to clear audioUrl.
                           setAudioUrl(null);
                       }
                   }}
                >
                    <span className="sr-only">Close</span>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </Button>
            </div>
         </div>
      )}
    </div>
  );
}

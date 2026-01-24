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
            <h4 className="text-sm font-medium text-text-secondary uppercase tracking-wider mb-1">
                Listen to this article
            </h4>
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
            // Once URL is set from the fetch, this attempts to play
             // But we need to be careful about not autoplaying on mount if url persistence was added later
             // For now, simple logic:
             onLoadedMetadata={() => {
                 if(isLoading) {
                      setIsLoading(false); 
                      audioRef.current?.play().catch(() => {});
                 }
             }}
        />
    </div>
  );
}

'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Loader2, Headphones } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useWeglotLanguage } from '@/components/WeglotLanguageProvider';

interface ArticleAudioPlayerProps {
  slug: string;
  title: string;
  plainText: string; // The full text content to speak (English source)
}

const UI_STRINGS: Record<string, { listen: string; loading: string; pause: string; nowPlaying: string; error: string }> = {
  en: { listen: 'Listen', loading: 'Loading...', pause: 'Pause', nowPlaying: 'Now Playing', error: 'Could not load audio for this article.' },
  es: { listen: 'Escuchar', loading: 'Cargando...', pause: 'Pausar', nowPlaying: 'Reproduciendo', error: 'No se pudo cargar el audio de este artículo.' },
};

export default function ArticleAudioPlayer({ slug, title, plainText }: ArticleAudioPlayerProps) {
  const { lang } = useWeglotLanguage();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const ui = UI_STRINGS[lang] ?? UI_STRINGS['en'];

  // Reset audio when language changes so the correct language version is fetched on next play
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setAudioUrl(null);
    setIsLoading(false);
  }, [lang]);

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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, text: plainText, lang }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate audio');
      }

      const contentType = response.headers.get('content-type');
      let src = '';

      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        if (data.audioUrl) src = data.audioUrl;
      } else {
        const blob = await response.blob();
        src = URL.createObjectURL(blob);
      }

      if (src) {
        setAudioUrl(src);
      } else {
        throw new Error('No audio source returned');
      }
    } catch (error) {
      console.error('Audio playback error:', error);
      toast.error(ui.error);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-4 my-6 p-4 rounded-lg bg-surface border border-border/50 shadow-sm max-w-2xl">
      <div className="flex-shrink-0 bg-primary/10 p-3 rounded-full">
        <Headphones className="w-6 h-6 text-primary" />
      </div>

      <div className="flex-grow min-w-0">
        <p className="text-sm font-medium text-text-secondary uppercase tracking-wider mb-1">
          {lang === 'es' ? 'Escucha este artículo' : 'Listen to this article'}
        </p>
        <p className="text-xs text-text-secondary truncate">{title}</p>
      </div>

      <div className="flex-shrink-0">
        <Button
          onClick={handleTogglePlay}
          disabled={isLoading}
          variant="outline"
          size="sm"
          className={cn(
            'min-w-[120px] gap-2 transition-all',
            isPlaying ? 'border-primary text-primary' : 'hover:border-primary/50'
          )}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>{ui.loading}</span>
            </>
          ) : isPlaying ? (
            <>
              <Pause className="w-4 h-4 fill-current" />
              <span>{ui.pause}</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>{ui.listen}</span>
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

      {/* Floating Now Playing widget */}
      {audioUrl && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-10 fade-in duration-300">
          <div className="flex items-center gap-3 p-2 pr-4 pl-2 rounded-full bg-background/80 backdrop-blur-lg border border-primary/20 shadow-lg shadow-primary/5">
            <div className="relative">
              <div className={cn('absolute inset-0 rounded-full bg-primary/20 animate-ping', isPlaying ? 'opacity-75' : 'opacity-0')} />
              <Button
                onClick={handleTogglePlay}
                size="icon"
                className="rounded-full h-10 w-10 bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm relative z-10"
                aria-label={isPlaying ? ui.pause : ui.listen}
              >
                {isPlaying ? <Pause className="h-4 w-4 fill-current" /> : <Play className="h-4 w-4 fill-current pl-0.5" />}
              </Button>
            </div>

            <div className="flex flex-col mr-2">
              <span className="text-[10px] font-semibold text-primary uppercase tracking-wider">{ui.nowPlaying}</span>
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
                  setAudioUrl(null);
                }
              }}
            >
              <span className="sr-only">Close</span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

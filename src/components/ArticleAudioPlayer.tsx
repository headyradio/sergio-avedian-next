'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Loader2, Headphones } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useWeglotLanguage } from '@/components/WeglotLanguageProvider';

interface ArticleAudioPlayerProps {
  slug: string;
  title: string;
  audioUrls: { en: string | null; es: string | null };
}

const UI_STRINGS: Record<string, { listen: string; loading: string; pause: string; nowPlaying: string }> = {
  en: { listen: 'Listen', loading: 'Loading…', pause: 'Pause', nowPlaying: 'Now Playing' },
  es: { listen: 'Escuchar', loading: 'Cargando…', pause: 'Pausar', nowPlaying: 'Reproduciendo' },
};

export default function ArticleAudioPlayer({ slug, title, audioUrls }: ArticleAudioPlayerProps) {
  const { lang } = useWeglotLanguage();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const ui = UI_STRINGS[lang] ?? UI_STRINGS['en'];
  // Pre-generated CDN URL for the active language (falls back to English audio).
  const prefetchedUrl = (lang === 'es' ? audioUrls.es : audioUrls.en) ?? audioUrls.en;
  const [audioUrl, setAudioUrl] = useState<string | null>(prefetchedUrl);

  // Reset to the correct pre-generated URL when the language changes.
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setIsLoading(false);
    setAudioUrl(prefetchedUrl);
  }, [lang, prefetchedUrl]);

  const handleTogglePlay = async () => {
    // Audio already resolved — just toggle playback.
    if (audioUrl) {
      if (!audioRef.current) return;
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(() => {});
      }
      return;
    }

    // No pre-generated audio — generate it on demand (first play).
    if (isLoading) return;
    try {
      setIsLoading(true);
      const res = await fetch('/api/generate-audio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, lang }),
      });
      if (!res.ok) throw new Error('Failed to generate audio');

      const contentType = res.headers.get('content-type') || '';
      let src = '';
      if (contentType.includes('application/json')) {
        const data = await res.json();
        src = data.audioUrl || '';
      } else {
        src = URL.createObjectURL(await res.blob());
      }
      if (!src) throw new Error('No audio source returned');

      setAudioUrl(src);
      // Wait for the <audio> src to apply before playing.
      requestAnimationFrame(() => audioRef.current?.play().catch(() => {}));
    } catch (err) {
      console.error('[ArticleAudioPlayer] On-demand audio failed:', err);
    } finally {
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
        src={audioUrl ?? undefined}
        preload="none"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
      />

      {/* Floating Now Playing widget */}
      {isPlaying && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-10 fade-in duration-300">
          <div className="flex items-center gap-3 p-2 pr-4 pl-2 rounded-full bg-background/80 backdrop-blur-lg border border-primary/20 shadow-lg shadow-primary/5">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping opacity-75" />
              <Button
                onClick={handleTogglePlay}
                size="icon"
                className="rounded-full h-10 w-10 bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm relative z-10"
                aria-label={ui.pause}
              >
                <Pause className="h-4 w-4 fill-current" />
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

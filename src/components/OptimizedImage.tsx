import React, { useState, useEffect, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

// Detect Safari browser
const isSafari = () => {
  if (typeof window === 'undefined') return false;
  const ua = window.navigator.userAgent.toLowerCase();
  return ua.indexOf('safari') > -1 && ua.indexOf('chrome') === -1;
};

interface OptimizedImageProps {
  src?: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  aspectRatio?: 'square' | 'video' | 'portrait' | 'auto';
  priority?: boolean;
}

// Utility function to transform old asset URLs to correct public paths
const transformImageUrl = (url: string): string => {
  if (!url) return '';
  
  // Handle old src/assets paths and convert to public/assets
  if (url.startsWith('/src/assets/') || url.startsWith('src/assets/')) {
    const filename = url.split('/').pop();
    return `/assets/blog/${filename}`;
  }
  
  // Handle relative paths without leading slash
  if (url.startsWith('assets/')) {
    return `/${url}`;
  }
  
  return url;
};

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className,
  fallbackSrc = '/placeholder.svg',
  aspectRatio = 'auto',
  priority = false,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [imageKey, setImageKey] = useState(0);
  
  // Detect if Safari for special handling
  const isSafariBrowser = useMemo(() => isSafari(), []);
  
  // Transform the URL immediately
  const transformedSrc = useMemo(() => {
    return src ? transformImageUrl(src) : null;
  }, [src]);
  
  // Set initial src immediately
  const [currentSrc, setCurrentSrc] = useState(() => transformedSrc || fallbackSrc);

  // Reset state when src prop changes
  useEffect(() => {
    if (transformedSrc) {
      setCurrentSrc(transformedSrc);
      setIsLoading(true);
      setHasError(false);
      setImageKey(prev => prev + 1);
    } else {
      setCurrentSrc(fallbackSrc);
      setIsLoading(false);
      setHasError(false);
    }
  }, [transformedSrc, fallbackSrc]);

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleError = () => {
    console.log(`Image load failed for: ${currentSrc}`);
    
    setIsLoading(false);
    setHasError(true);
    
    // Try fallback if we haven't already
    if (currentSrc !== fallbackSrc && transformedSrc) {
      console.log(`Trying fallback: ${fallbackSrc}`);
      setCurrentSrc(fallbackSrc);
      setImageKey(prev => prev + 1);
    }
  };

  // Preload critical images
  useEffect(() => {
    if (priority && transformedSrc) {
      const img = new Image();
      img.src = transformedSrc;
    }
  }, [priority, transformedSrc]);

  const aspectRatioClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    portrait: 'aspect-[3/4]',
    auto: '',
  };

  return (
    <div className={cn('relative overflow-hidden', aspectRatioClasses[aspectRatio], className)}>
      {isLoading && (
        <Skeleton className="absolute inset-0 w-full h-full" />
      )}
      <img
        key={imageKey}
        src={currentSrc}
        alt={alt}
        className={cn(
          'w-full h-full object-cover transition-opacity duration-300',
          isLoading ? 'opacity-0' : 'opacity-100'
        )}
        onLoad={handleLoad}
        onError={handleError}
        loading={priority || isSafariBrowser ? 'eager' : 'lazy'}
        crossOrigin="anonymous"
      />
      {hasError && currentSrc === fallbackSrc && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
          <p className="text-muted-foreground text-sm">Image not available</p>
        </div>
      )}
    </div>
  );
};
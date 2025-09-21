import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

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
  const [retryCount, setRetryCount] = useState(0);
  const [currentSrc, setCurrentSrc] = useState('');

  const maxRetries = 2;
  const transformedSrc = src ? transformImageUrl(src) : null;

  // Reset state when src prop changes
  useEffect(() => {
    if (transformedSrc) {
      setCurrentSrc(transformedSrc);
      setIsLoading(true);
      setHasError(false);
      setRetryCount(0);
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
    console.log(`Image load failed for: ${currentSrc}, retry count: ${retryCount}`);
    
    if (retryCount < maxRetries && transformedSrc && currentSrc === transformedSrc) {
      // Retry with a slight delay
      setRetryCount(prev => prev + 1);
      setTimeout(() => {
        const retryUrl = `${transformedSrc}?retry=${retryCount + 1}`;
        setCurrentSrc(retryUrl);
      }, 500);
      return;
    }
    
    setIsLoading(false);
    setHasError(true);
    
    // If we haven't tried the fallback yet, try it
    if (currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      setRetryCount(0); // Reset retry count for fallback
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
        src={currentSrc}
        alt={alt}
        className={cn(
          'w-full h-full object-cover transition-opacity duration-300',
          isLoading ? 'opacity-0' : 'opacity-100'
        )}
        onLoad={handleLoad}
        onError={handleError}
        loading={priority ? 'eager' : 'lazy'}
      />
      {hasError && currentSrc === fallbackSrc && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
          <p className="text-muted-foreground text-sm">Image not available</p>
        </div>
      )}
    </div>
  );
};
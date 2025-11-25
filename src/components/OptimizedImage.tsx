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
  width?: number;
  height?: number;
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
  width,
  height,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState<string>('');

  useEffect(() => {
    const transformedSrc = src ? transformImageUrl(src) : fallbackSrc;
    setCurrentSrc(transformedSrc);
    setIsLoading(true);
    setHasError(false);
  }, [src, fallbackSrc]);

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleError = () => {
    setIsLoading(false);
    
    // Try fallback if we haven't already
    if (currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      setHasError(false);
    } else {
      setHasError(true);
    }
  };

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
        width={width}
        height={height}
        className={cn(
          'w-full h-full object-cover transition-opacity duration-300',
          isLoading ? 'opacity-0' : 'opacity-100'
        )}
        onLoad={handleLoad}
        onError={handleError}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
      />
      
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
          <p className="text-muted-foreground text-sm">Image not available</p>
        </div>
      )}
    </div>
  );
};
import React, { useState, useEffect, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

// Detect Safari browser
const isSafari = () => {
  if (typeof window === 'undefined') return false;
  const ua = window.navigator.userAgent.toLowerCase();
  return ua.indexOf('safari') > -1 && ua.indexOf('chrome') === -1;
};

// Check AVIF support
const supportsAvif = async (): Promise<boolean> => {
  if (typeof window === 'undefined') return false;
  if (!window.createImageBitmap) return false;
  
  const avifData = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgANogQEAwgMg8f8D///8WfhwB8+ErK42A=';
  
  try {
    const blob = await fetch(avifData).then(r => r.blob());
    return await createImageBitmap(blob).then(() => true, () => false);
  } catch {
    return false;
  }
};

interface OptimizedImageProps {
  src?: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  aspectRatio?: 'square' | 'video' | 'portrait' | 'auto';
  priority?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
  fetchPriority?: 'high' | 'low' | 'auto';
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

// Generate modern format URLs (WebP, AVIF)
const getModernFormatUrl = (url: string, format: 'webp' | 'avif'): string => {
  if (!url || url.startsWith('data:') || url.startsWith('http')) return url;
  return url.replace(/\.(jpg|jpeg|png)$/i, `.${format}`);
};

// Generate srcset for responsive images
const generateSrcSet = (url: string, format?: 'webp' | 'avif'): string => {
  if (!url || url.startsWith('data:') || url.startsWith('http')) return '';
  
  const baseUrl = format ? getModernFormatUrl(url, format) : url;
  const widths = [640, 750, 828, 1080, 1200, 1920];
  
  // For now, return single source until we have multiple sizes
  // In production, you'd generate multiple image sizes at build time
  return `${baseUrl} 1x`;
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
  sizes = '100vw',
  fetchPriority = 'auto',
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [imageKey, setImageKey] = useState(0);
  const [avifSupported, setAvifSupported] = useState<boolean | null>(null);
  
  // Detect if Safari for special handling
  const isSafariBrowser = useMemo(() => isSafari(), []);
  
  // Check AVIF support once
  useEffect(() => {
    supportsAvif().then(setAvifSupported);
  }, []);
  
  // Transform the URL immediately
  const transformedSrc = useMemo(() => {
    return src ? transformImageUrl(src) : null;
  }, [src]);
  
  // Generate format URLs
  const webpSrc = useMemo(() => transformedSrc ? getModernFormatUrl(transformedSrc, 'webp') : null, [transformedSrc]);
  const avifSrc = useMemo(() => transformedSrc ? getModernFormatUrl(transformedSrc, 'avif') : null, [transformedSrc]);
  
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
    console.error('OptimizedImage Error:', {
      currentSrc,
      originalSrc: src,
      transformedSrc,
      fallbackSrc,
      isSafari: isSafariBrowser
    });
    
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
      
      {/* Use picture element for modern format support with fallbacks */}
      {transformedSrc && !hasError ? (
        <picture>
          {/* AVIF - best compression, modern browsers */}
          {avifSupported && avifSrc && (
            <source
              type="image/avif"
              srcSet={generateSrcSet(transformedSrc, 'avif')}
              sizes={sizes}
            />
          )}
          
          {/* WebP - good compression, wide support */}
          {webpSrc && (
            <source
              type="image/webp"
              srcSet={generateSrcSet(transformedSrc, 'webp')}
              sizes={sizes}
            />
          )}
          
          {/* Original format - fallback for older browsers */}
          <img
            key={imageKey}
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
            loading={priority || isSafariBrowser ? 'eager' : 'lazy'}
            fetchPriority={priority ? 'high' : fetchPriority}
            decoding={priority ? 'sync' : 'async'}
          />
        </picture>
      ) : (
        <img
          key={imageKey}
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
          loading={priority || isSafariBrowser ? 'eager' : 'lazy'}
        />
      )}
      
      {hasError && currentSrc === fallbackSrc && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
          <p className="text-muted-foreground text-sm">Image not available</p>
        </div>
      )}
    </div>
  );
};
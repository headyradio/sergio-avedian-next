"use client";

import { cn } from "@/lib/utils";
import { OptimizedImage } from "./OptimizedImage";
import { urlForImage } from "@/lib/sanity/client";

interface GalleryProps {
  value: {
    images: any[];
    display?: 'grid' | 'carousel';
  };
}

export function Gallery({ value }: GalleryProps) {
  const { images, display = 'grid' } = value;

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div className="my-8">
      <div className={cn(
        "grid gap-4",
        display === 'grid' 
          ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
          : "flex overflow-x-auto snap-x snap-mandatory pb-4"
      )}>
        {images.map((image: any, index: number) => (
          <div 
            key={image._key || index} 
            className={cn(
              "relative overflow-hidden rounded-lg bg-surface-secondary",
              display === 'carousel' && "min-w-[80%] md:min-w-[60%] lg:min-w-[40%] snap-center"
            )}
          >
            <div className="aspect-[4/3] relative">
               <OptimizedImage
                  src={urlForImage(image).url()}
                  alt={image.alt || `Gallery image ${index + 1}`}
                  className="object-cover transition-transform duration-300 hover:scale-105"
                  aspectRatio="auto"
                />
            </div>
            {image.caption && (
              <p className="mt-2 text-sm text-text-secondary italic text-center">
                {image.caption}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

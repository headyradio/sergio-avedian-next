"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, Youtube, Clock, ChevronRight, Video as VideoIcon } from "lucide-react";
import Link from "next/link";
import type { Video } from "@/lib/youtube";
import ShortsModal from "./ShortsModal";

interface VideoSectionProps {
  latestVideos: Video[];
  powerHourVideos: Video[];
  tradingVideos: Video[];
  shorts: Video[];
}

const VideoCard = ({ video, showDuration = true }: { video: Video; showDuration?: boolean }) => (
  <a
    href={`https://www.youtube.com/watch?v=${video.id}`}
    target="_blank"
    rel="noopener noreferrer"
    className="group block h-full"
  >
    <div className="card-modern rounded-xl overflow-hidden h-full flex flex-col bg-card border border-border/50 hover:border-primary/50 transition-colors">
      <div className="relative aspect-video bg-muted overflow-hidden">
        {/* Thumbnail */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
          style={{ backgroundImage: `url(${video.thumbnail})` }}
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />

        {/* Play Button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-12 h-12 rounded-full bg-red-600/90 flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
            <Play className="w-5 h-5 text-white ml-1" />
          </div>
        </div>

        {/* Duration */}
        {showDuration && video.duration && (
          <div className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
            {video.duration}
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-semibold text-text-primary text-sm leading-snug group-hover:text-primary transition-colors line-clamp-2 mb-2">
          {video.title}
        </h3>
        <p className="text-xs text-text-secondary mt-auto">
          {new Date(video.publishedAt).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })}
        </p>
      </div>
    </div>
  </a>
);

export default function VideoSection({ 
    latestVideos = [], 
    powerHourVideos = [], 
    tradingVideos = [], 
    shorts = [] 
}: VideoSectionProps) {
  const [selectedShortIndex, setSelectedShortIndex] = useState<number | null>(null);

  const openShort = (index: number) => setSelectedShortIndex(index);
  const closeShort = () => setSelectedShortIndex(null);

  // Filter out shorts/live from latest if needed client-side, 
  // though we handled most in lib/youtube.ts
  
  return (
    <section id="videos" className="py-20 bg-background border-t border-border/40">
      <div className="editorial-container space-y-20">
        
        {/* Header - Minimalist */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-border/40">
          <h2 className="text-3xl font-bold tracking-tight text-text-primary">
            Videos
          </h2>
          <Link
              href="https://www.youtube.com/@sergioavedian/videos"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-text-secondary hover:text-primary transition-colors flex items-center gap-1"
            >
              View on YouTube <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 1. Shorts Section */}
        {shorts.length > 0 && (
          <div className="relative">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold flex items-center gap-2">
                    <span className="w-1 h-5 bg-red-500 rounded-full"></span>
                    Shorts
                </h3>
                 <Link
                    href="https://www.youtube.com/@sergioavedian/shorts"
                    target="_blank"
                    className="text-xs font-semibold text-red-500 hover:text-red-400 border border-red-500/30 px-3 py-1 rounded-full bg-red-500/5 hover:bg-red-500/10 transition-colors"
                  >
                    See all
                  </Link>
            </div>
            
            {/* Horizontal Scroller */}
            <div className="flex overflow-x-auto gap-4 pb-6 snap-x scrollbar-hide -mx-4 px-4 lg:mx-0 lg:px-0">
                {shorts.map((video, idx) => (
                    <div 
                        key={video.id} 
                        onClick={() => openShort(idx)}
                        className="flex-shrink-0 w-[140px] md:w-[160px] snap-start cursor-pointer group relative rounded-xl overflow-hidden aspect-[9/16] bg-muted border border-border/50 hover:border-red-500/50 transition-all hover:shadow-xl"
                    >
                        {/* Thumbnail */}
                        <div 
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                            style={{ backgroundImage: `url(${video.thumbnail})` }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/80" />
                        
                        <div className="absolute bottom-3 left-3 right-3">
                            <h4 className="text-white text-xs font-bold leading-tight line-clamp-2 drop-shadow-md">
                                {video.title}
                            </h4>
                        </div>
                        
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Play className="w-8 h-8 text-white drop-shadow-lg" fill="currentColor" />
                        </div>
                    </div>
                ))}
                
                {/* See All Card at End */}
                <Link 
                    href="https://www.youtube.com/@sergioavedian/shorts" 
                    target="_blank"
                    className="flex-shrink-0 w-[140px] md:w-[160px] snap-start flex flex-col items-center justify-center bg-card border border-dashed border-border rounded-xl hover:bg-accent/50 transition-colors gap-2 text-text-secondary hover:text-primary"
                >
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                        <ChevronRight className="w-6 h-6" />
                    </div>
                    <span className="text-sm font-medium">See All Shorts</span>
                </Link>
            </div>
          </div>
        )}

        {/* 2. Latest Videos (No Shorts, No Live) */}
        {latestVideos.length > 0 && (
          <div>
            <h3 className="text-xl font-bold flex items-center gap-2 mb-6">
                 <span className="w-1 h-5 bg-primary rounded-full"></span>
                Latest Videos
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {latestVideos.map((video) => (
                    <VideoCard key={video.id} video={video} />
                ))}
            </div>
          </div>
        )}

        {/* 3. Power Hour */}
        {powerHourVideos.length > 0 && (
          <div>
             <h3 className="text-xl font-bold flex items-center gap-2 mb-6 text-emerald-500">
                 <span className="w-1 h-5 bg-emerald-500 rounded-full"></span>
                Power Hour Sessions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {powerHourVideos.map((video) => (
                    <VideoCard key={video.id} video={video} />
                ))}
                <Link
                    href="https://www.youtube.com/results?search_query=sergio+avedian+power+hour"
                    target="_blank"
                    className="group flex flex-col items-center justify-center bg-card border border-border rounded-xl aspect-video hover:bg-muted/50 transition-colors"
                >
                    <span className="text-sm font-medium text-text-secondary group-hover:text-primary flex items-center gap-1">
                        View Archive <ChevronRight className="w-4 h-4" />
                    </span>
                </Link>
            </div>
          </div>
        )}

        {/* 4. Trading with Sergio */}
        {tradingVideos.length > 0 && (
          <div>
             <h3 className="text-xl font-bold flex items-center gap-2 mb-6 text-blue-500">
                 <span className="w-1 h-5 bg-blue-500 rounded-full"></span>
                Trading with Sergio
            </h3>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {tradingVideos.map((video) => (
                    <VideoCard key={video.id} video={video} />
                ))}
                 <Link
                    href="https://www.youtube.com/results?search_query=trading+with+sergio+avedian"
                    target="_blank"
                    className="group flex flex-col items-center justify-center bg-card border border-border rounded-xl aspect-video hover:bg-muted/50 transition-colors"
                >
                    <span className="text-sm font-medium text-text-secondary group-hover:text-primary flex items-center gap-1">
                        View Archive <ChevronRight className="w-4 h-4" />
                    </span>
                </Link>
            </div>
          </div>
        )}

        {/* Shorts Modal */}
        <ShortsModal 
            isOpen={selectedShortIndex !== null} 
            initialIndex={selectedShortIndex || 0}
            videos={shorts}
            onClose={closeShort}
        />

      </div>
    </section>
  );
}
"use client";

import { useState } from "react";
import { Play, ChevronRight, Radio, ArrowRight } from "lucide-react";
import Link from "next/link";
import type { Video } from "@/lib/youtube";
import ShortsModal from "./ShortsModal";

interface VideoSectionProps {
  latestVideos: Video[];
  liveStreams: Video[];
  shorts: Video[];
}

const VideoCard = ({ video, showDuration = true }: { video: Video; showDuration?: boolean }) => (
  <a
    href={`https://www.youtube.com/watch?v=${video.id}`}
    target="_blank"
    rel="noopener noreferrer"
    className="group block h-full"
  >
    <div className="rounded-lg overflow-hidden h-full flex flex-col bg-surface border border-border/30 hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-large">
      <div className="relative aspect-video bg-surface-secondary overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
          style={{ backgroundImage: `url(${video.thumbnail})` }}
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />

        {/* Play Button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center shadow-lg">
            <Play className="w-5 h-5 text-white ml-0.5" fill="currentColor" />
          </div>
        </div>

        {/* Duration Badge */}
        {showDuration && video.duration && (
          <div className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
            {video.duration}
          </div>
        )}

        {/* Live Badge */}
        {video.isLive && (
          <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
            <Radio className="w-3 h-3" />
            LIVE
          </div>
        )}
      </div>
      
      <div className="p-3 flex flex-col flex-grow">
        <h3 className="font-medium text-text-primary text-sm leading-snug group-hover:text-primary transition-colors line-clamp-2">
          {video.title}
        </h3>
        <p className="text-xs text-text-muted mt-auto pt-2">
          {new Date(video.publishedAt).toLocaleDateString(undefined, {
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
  liveStreams = [], 
  shorts = [] 
}: VideoSectionProps) {
  const [selectedShortIndex, setSelectedShortIndex] = useState<number | null>(null);

  const openShort = (index: number) => setSelectedShortIndex(index);
  const closeShort = () => setSelectedShortIndex(null);
  
  return (
    <section id="videos" className="py-16 bg-background">
      <div className="editorial-container space-y-12">
        
        {/* Section Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl md:text-3xl font-bold text-text-primary">
            Videos
          </h2>
          <Link
            href="https://www.youtube.com/@sergioavedian/videos"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-primary hover:text-primary-hover transition-colors flex items-center gap-1"
          >
            YouTube <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Shorts - Horizontal Scroll */}
        {shorts.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2 text-text-primary">
                <span className="w-1 h-4 bg-red-500 rounded-full" />
                Shorts
              </h3>
              <Link
                href="https://www.youtube.com/@sergioavedian/shorts"
                target="_blank"
                className="text-xs font-medium text-red-500 hover:text-red-400 transition-colors"
              >
                See all →
              </Link>
            </div>
            
            <div className="flex overflow-x-auto gap-3 pb-4 snap-x scrollbar-hide -mx-4 px-4 lg:mx-0 lg:px-0">
              {shorts.map((video, idx) => (
                <div 
                  key={video.id} 
                  onClick={() => openShort(idx)}
                  className="flex-shrink-0 w-[120px] md:w-[140px] snap-start cursor-pointer group relative rounded-lg overflow-hidden aspect-[9/16] bg-surface border border-border/30 hover:border-red-500/50 transition-all"
                >
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                    style={{ backgroundImage: `url(${video.thumbnail})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/70" />
                  
                  <div className="absolute bottom-2 left-2 right-2">
                    <h4 className="text-white text-xs font-medium leading-tight line-clamp-2 drop-shadow-md">
                      {video.title}
                    </h4>
                  </div>
                  
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play className="w-8 h-8 text-white drop-shadow-lg" fill="currentColor" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Latest Videos Grid */}
        {latestVideos.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2 text-text-primary">
                <span className="w-1 h-4 bg-primary rounded-full" />
                Latest Videos
              </h3>
              <Link
                href="https://www.youtube.com/@sergioavedian/videos"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-primary hover:text-primary-hover transition-colors flex items-center gap-1"
              >
                See all <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {latestVideos.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          </div>
        )}

        {/* Live Streams (Consolidated Power Hour + Trading with Sergio) */}
        {liveStreams.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2 text-text-primary">
                <span className="w-1 h-4 bg-red-600 rounded-full" />
                Live Streams
              </h3>
              <Link
                href="https://www.youtube.com/@sergioavedian/streams"
                target="_blank"
                className="text-xs font-medium text-red-500 hover:text-red-400 transition-colors"
              >
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {liveStreams.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
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
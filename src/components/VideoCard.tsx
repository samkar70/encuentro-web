'use client';

import React from 'react';
import { Play, Smartphone } from 'lucide-react';
import { MediaItem } from '@/types';

interface VideoCardProps {
  video: MediaItem;
  isVertical?: boolean;
  onPlay?: (video: MediaItem) => void; // Nueva función para abrir el video
}

export const VideoCard: React.FC<VideoCardProps> = ({ video, isVertical = false, onPlay }) => {
  return (
    <div 
      onClick={() => onPlay?.(video)}
      className="group cursor-pointer bg-slate-900/40 rounded-xl overflow-hidden border border-white/5 hover:border-amber-500/50 transition-all duration-500 shadow-lg"
    >
      <div className={`relative ${isVertical ? 'aspect-[9/16]' : 'aspect-video'} overflow-hidden`}>
        <img 
          src={video.thumbnail} 
          alt={video.title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100" 
        />
        
        {isVertical && (
          <div className="absolute top-3 left-3 px-2 py-1 bg-red-600 text-[10px] text-white font-black rounded flex items-center gap-1 z-10">
            <Smartphone className="w-3 h-3" /> SHORT
          </div>
        )}

        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/40 transition-all">
          <div className="bg-amber-500 p-4 rounded-full shadow-2xl transform scale-75 group-hover:scale-100 transition-transform">
            <Play className="text-black w-8 h-8" fill="currentColor" />
          </div>
        </div>
      </div>
      
      <div className="p-4 bg-gradient-to-b from-transparent to-black/20">
        <h3 className="font-bold text-white line-clamp-2 text-sm leading-tight group-hover:text-amber-400 transition-colors">
          {video.title}
        </h3>
        <p className="text-[10px] text-amber-500/70 mt-2 uppercase tracking-widest font-bold">
          {video.artist}
        </p>
      </div>
    </div>
  );
};
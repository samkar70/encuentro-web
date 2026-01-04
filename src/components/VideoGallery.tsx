'use client';

import React, { useState, useMemo } from 'react';
import { ContentRow } from './ContentRow';
import { MoodSelector } from './MoodSelector';
import { VideoModal } from './VideoModal';
import { MediaItem } from '@/types';

interface VideoGalleryProps {
  videos: MediaItem[];
}

export const VideoGallery: React.FC<VideoGalleryProps> = ({ videos }) => {
  const [selectedVideo, setSelectedVideo] = useState<MediaItem | null>(null);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  // Lógica de filtrado inteligente
  const filteredVideos = useMemo(() => {
    if (!activeFilter) return videos;
    return videos.filter(video => video.category === activeFilter);
  }, [activeFilter, videos]);

  // Función para resetear el filtro
  const resetFilter = () => setActiveFilter(null);

  return (
    <div className="max-w-7xl mx-auto space-y-24">
      {/* Selector de Estado de Ánimo */}
      <MoodSelector onSelect={(category) => {
        // Si ya está seleccionado, lo quitamos, si no, filtramos
        setActiveFilter(activeFilter === category ? null : category);
      }} />

      {/* Botón para ver todo (solo aparece si hay un filtro activo) */}
      {activeFilter && (
        <div className="flex justify-center -mt-10">
          <button 
            onClick={resetFilter}
            className="text-amber-500 hover:text-white border border-amber-500/30 px-4 py-1 rounded-full text-xs uppercase tracking-widest transition-all"
          >
            ✕ Ver todo el contenido
          </button>
        </div>
      )}

      {/* Filas de Contenido Dinámicas */}
      <div className="space-y-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <ContentRow 
          title="🎙️ Entrevistas" 
          category="Entrevistas" 
          items={filteredVideos} 
          onPlay={setSelectedVideo} 
        />
        
        <ContentRow 
          title="📱 Shorts de Bendición" 
          category="Short" 
          items={filteredVideos} 
          isVertical={true} 
          onPlay={setSelectedVideo}
        />
        
        <ContentRow 
          title="🎵 Alabanzas" 
          category="Musica" 
          items={filteredVideos} 
          onPlay={setSelectedVideo}
        />
      </div>

      {/* Mensaje si no hay resultados en el filtro */}
      {filteredVideos.length === 0 && (
        <div className="text-center py-20">
          <p className="text-slate-500 italic">No encontramos contenido en esta categoría por ahora...</p>
        </div>
      )}

      {/* Reproductor Maestro */}
      {selectedVideo && (
        <VideoModal
          isOpen={!!selectedVideo}
          onClose={() => setSelectedVideo(null)}
          videoUrl={selectedVideo.url}
          title={selectedVideo.title}
        />
      )}
    </div>
  );
};
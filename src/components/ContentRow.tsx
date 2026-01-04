'use client';

import React from 'react';
import { VideoCard } from './VideoCard';
import { MediaItem } from '@/types';

interface ContentRowProps {
  title: string;
  category: string;
  items: MediaItem[];
  isVertical?: boolean;
  onPlay?: (video: MediaItem) => void; // Esta es la conexión para el reproductor
}

export const ContentRow: React.FC<ContentRowProps> = ({ title, category, items, isVertical = false, onPlay }) => {
  // Filtramos los videos según la categoría de la base de datos Turso
  const categoryItems = items.filter(item => item.category === category);

  // Si no hay contenido en esta categoría, no mostramos nada
  if (categoryItems.length === 0) return null;

  return (
    <section className="mb-20 px-4 md:px-0">
      {/* Encabezado con el diseño premium de Encuentro */}
      <div className="flex items-center justify-between mb-10 border-l-4 border-amber-600 pl-4">
        <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter">
          {title}
        </h2>
        
        {/* Contador de videos estilizado */}
        <span className="px-3 py-1 text-[10px] font-black text-amber-500 bg-amber-500/10 border border-amber-500/20 rounded-full uppercase tracking-widest shadow-[0_0_15px_rgba(245,158,11,0.1)]">
          {categoryItems.length} Contenidos
        </span>
      </div>

      {/* Rejilla de videos (Grid) */}
      <div className={`grid gap-8 ${
        isVertical 
          ? 'grid-cols-2 sm:grid-cols-4 lg:grid-cols-6' // Formato vertical para Shorts
          : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' // Formato horizontal para Entrevistas
      }`}>
        {categoryItems.map((item) => (
          <VideoCard 
            key={item.id} 
            video={item} 
            isVertical={isVertical} 
            onPlay={onPlay} // Pasamos la acción de reproducir a cada tarjeta
          />
        ))}
      </div>
    </section>
  );
};
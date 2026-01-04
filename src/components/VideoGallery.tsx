'use client';

import React, { useState } from 'react';
import { MediaItem } from '@/types';
import { Play, Share2, Heart, Shield, Music } from 'lucide-react';

interface Props {
  videos: MediaItem[];
}

export function VideoGallery({ videos }: Props) {
  const [activeCategory, setActiveCategory] = useState('Entrevistas');

  const handleShare = async (video: MediaItem) => {
    const shareData = {
      title: video.title,
      text: `Te comparto este mensaje de bendición de Karla Perdomo: "${video.title}"`,
      url: video.url,
    };
    try {
      if (navigator.share) await navigator.share(shareData);
      else {
        await navigator.clipboard.writeText(video.url);
        alert('¡Enlace copiado!');
      }
    } catch (err) { console.log('Error al compartir'); }
  };

  const categories = [
    { id: 'Entrevistas', label: 'Busco Paz', color: 'bg-blue-600', icon: <Heart size={16} /> },
    { id: 'Short', label: 'Necesito Fortaleza', color: 'bg-orange-600', icon: <Shield size={16} /> },
    { id: 'Musica', label: 'Quiero Adorar', color: 'bg-red-600', icon: <Music size={16} /> },
  ];

  const filteredVideos = videos.filter(v => v.category === activeCategory);
  
  // Detectamos si estamos viendo la sección de Shorts
  const isShortsView = activeCategory === 'Short';

  return (
    <div className="space-y-12">
      {/* Filtros de Categoría */}
      <div className="flex flex-wrap justify-center gap-4 mb-16">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
              activeCategory === cat.id 
              ? `${cat.color} text-white shadow-lg` 
              : 'bg-slate-900 text-slate-500 hover:bg-slate-800'
            }`}
          >
            {cat.icon}
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid Dinámico: Si son Shorts, mostramos más por fila como en YouTube */}
      <div className={`grid gap-6 ${
        isShortsView 
        ? 'grid-cols-2 md:grid-cols-4 lg:grid-cols-5' // Formato vertical (Shorts)
        : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' // Formato horizontal (Videos/Música)
      }`}>
        {filteredVideos.map((video) => (
          <div 
            key={video.id} 
            className="group bg-slate-900/40 rounded-[1.5rem] overflow-hidden border border-white/5 hover:border-amber-500/30 transition-all duration-500"
          >
            {/* Contenedor de Imagen Dinámico */}
            <div className={`relative overflow-hidden ${
              isShortsView ? 'aspect-[9/16]' : 'aspect-video'
            }`}>
              <img 
                src={video.thumbnail} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-90 group-hover:opacity-100" 
                alt={video.title} 
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <a 
                  href={video.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-amber-500 p-3 rounded-full text-black hover:scale-110 transition-transform"
                >
                  <Play fill="currentColor" size={isShortsView ? 18 : 24} />
                </a>
              </div>
            </div>

            {/* Información del Video */}
            <div className="p-4">
              <div className="flex justify-between items-start gap-2">
                <h3 className={`font-bold leading-tight line-clamp-2 group-hover:text-amber-400 transition-colors ${
                  isShortsView ? 'text-xs' : 'text-sm'
                }`}>
                  {video.title}
                </h3>
                <button 
                  onClick={() => handleShare(video)}
                  className="p-2 text-slate-500 hover:text-amber-500 transition-all"
                >
                  <Share2 size={16} />
                </button>
              </div>
              <p className="text-[8px] text-amber-600 font-black uppercase tracking-widest mt-2">
                {video.artist}
              </p>
            </div>
          </div>
        ))}
      </div>

      {filteredVideos.length === 0 && (
        <div className="text-center py-20 opacity-40 italic text-sm">
          No hay contenido disponible en esta categoría.
        </div>
      )}
    </div>
  );
}
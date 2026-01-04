'use client';

import React, { useState } from 'react';
import { MediaItem } from '@/types';
import { Play, Share2, Heart, Shield, Music } from 'lucide-react';

interface Props {
  videos: MediaItem[];
}

export function VideoGallery({ videos }: Props) {
  const [activeCategory, setActiveCategory] = useState('Entrevistas');

  // Función para compartir el mensaje
  const handleShare = async (video: MediaItem) => {
    const shareData = {
      title: video.title,
      text: `Te comparto este mensaje de bendición de Karla Perdomo: "${video.title}"`,
      url: video.url,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(video.url);
        alert('¡Enlace copiado al portapapeles!');
      }
    } catch (err) {
      console.log('Error al compartir');
    }
  };

  const categories = [
    { id: 'Entrevistas', label: 'Busco Paz', color: 'bg-blue-600', icon: <Heart size={16} /> },
    { id: 'Short', label: 'Necesito Fortaleza', color: 'bg-orange-600', icon: <Shield size={16} /> },
    { id: 'Musica', label: 'Quiero Adorar', color: 'bg-red-600', icon: <Music size={16} /> },
  ];

  const filteredVideos = videos.filter(v => v.category === activeCategory);

  return (
    <div className="space-y-12">
      {/* Filtros de Categoría Estilo Premium */}
      <div className="flex flex-wrap justify-center gap-4 mb-16">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all active:scale-95 ${
              activeCategory === cat.id 
              ? `${cat.color} text-white shadow-lg shadow-${cat.color.split('-')[1]}-900/40` 
              : 'bg-slate-900 text-slate-500 hover:bg-slate-800 border border-white/5'
            }`}
          >
            {cat.icon}
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid de Contenido */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredVideos.map((video) => (
          <div 
            key={video.id} 
            className="group bg-slate-900/40 rounded-[2rem] overflow-hidden border border-white/5 hover:border-amber-500/30 transition-all duration-500"
          >
            {/* Miniatura con botón de Play */}
            <div className="relative aspect-video overflow-hidden">
              <img 
                src={video.thumbnail} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100" 
                alt={video.title} 
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <a 
                  href={video.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-amber-500 p-4 rounded-full text-black hover:scale-110 transition-transform"
                >
                  <Play fill="currentColor" size={24} />
                </a>
              </div>
            </div>

            {/* Información del Video */}
            <div className="p-6">
              <div className="flex justify-between items-start gap-4 mb-2">
                <h3 className="font-bold text-sm line-clamp-2 group-hover:text-amber-400 transition-colors">
                  {video.title}
                </h3>
                <button 
                  onClick={() => handleShare(video)}
                  className="p-2 text-slate-500 hover:text-amber-500 hover:bg-amber-500/10 rounded-xl transition-all"
                >
                  <Share2 size={18} />
                </button>
              </div>
              <p className="text-[10px] text-amber-600 font-black uppercase tracking-[0.2em]">
                {video.artist}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Mensaje cuando no hay videos */}
      {filteredVideos.length === 0 && (
        <div className="text-center py-20 opacity-40 italic text-sm">
          Estamos preparando nuevos mensajes para esta categoría...
        </div>
      )}
    </div>
  );
}
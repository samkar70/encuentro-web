'use client';

import React, { useState } from 'react';
import { MediaItem } from '@/types';
import { Play, Share2, Heart, Shield, Music } from 'lucide-react';

interface Props {
  videos: MediaItem[];
}

export function VideoGallery({ videos }: Props) {
  const [activeCategory, setActiveCategory] = useState('Entrevistas');

  // FUNCIÓN PARA REPRODUCIR Y PAUSAR RADIO
  const handlePlayVideo = (url: string) => {
    // 1. Enviamos la orden de "pausa" a la radio
    window.dispatchEvent(new CustomEvent('pause-radio'));
    
    // 2. Abrimos el video
    window.open(url, '_blank');
  };

  const handleShare = async (video: MediaItem) => {
    const shareData = {
      title: video.title,
      text: `Te comparto este mensaje de Karla Perdomo: "${video.title}"`,
      url: video.url,
    };
    try {
      if (navigator.share) await navigator.share(shareData);
      else {
        await navigator.clipboard.writeText(video.url);
        alert('Enlace copiado');
      }
    } catch (err) { console.log('Error'); }
  };

  const categories = [
    { id: 'Entrevistas', label: 'Busco Paz', color: 'bg-blue-600', icon: <Heart size={16} /> },
    { id: 'Short', label: 'Necesito Fortaleza', color: 'bg-orange-600', icon: <Shield size={16} /> },
    { id: 'Musica', label: 'Quiero Adorar', color: 'bg-red-600', icon: <Music size={16} /> },
  ];

  const filteredVideos = videos.filter(v => v.category === activeCategory);
  const isShortsView = activeCategory === 'Short';

  return (
    <div className="space-y-12">
      <div className="flex flex-wrap justify-center gap-4 mb-16">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
              activeCategory === cat.id ? `${cat.color} text-white shadow-lg` : 'bg-slate-900 text-slate-500'
            }`}
          >
            {cat.icon} {cat.label}
          </button>
        ))}
      </div>

      <div className={`grid gap-6 ${isShortsView ? 'grid-cols-2 md:grid-cols-4 lg:grid-cols-5' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'}`}>
        {filteredVideos.map((video) => (
          <div key={video.id} className="group bg-slate-900/40 rounded-[1.5rem] overflow-hidden border border-white/5 transition-all">
            <div className={`relative overflow-hidden ${isShortsView ? 'aspect-[9/16]' : 'aspect-video'}`}>
              <img src={video.thumbnail} className="w-full h-full object-cover opacity-90" alt={video.title} />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                {/* CAMBIO: Ahora usamos onClick para pausar la radio antes de abrir el video */}
                <button 
                  onClick={() => handlePlayVideo(video.url)}
                  className="bg-amber-500 p-3 rounded-full text-black hover:scale-110 transition-transform"
                >
                  <Play fill="currentColor" size={24} />
                </button>
              </div>
            </div>

            <div className="p-4">
              <div className="flex justify-between items-start gap-2">
                <h3 className="text-sm font-bold leading-tight line-clamp-2">{video.title}</h3>
                <button onClick={() => handleShare(video)} className="text-slate-500 hover:text-amber-500"><Share2 size={16} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
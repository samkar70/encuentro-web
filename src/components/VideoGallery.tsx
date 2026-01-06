'use client';

import React, { useState, useEffect } from 'react';

export function VideoGallery() {
  const [videos, setVideos] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/videos') 
      .then(res => res.json())
      .then(data => setVideos(data))
      .catch(err => console.error("Error cargando videos", err));
  }, []);

  return (
    // Cambiamos a 4 o 5 columnas para que los videos verticales no se vean gigantes
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {videos.length > 0 ? videos.map((video) => (
        <div key={video.id} className="bg-slate-900/40 border border-white/5 rounded-[2rem] overflow-hidden group hover:border-amber-500/30 transition-all shadow-xl">
          {/* Ajuste de Proporción a Vertical (9:16) */}
          <div className="relative aspect-[9/16] overflow-hidden">
            <img 
              src={video.thumbnail} 
              alt={video.title} 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-4 opacity-100">
               <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-white text-[10px] shadow-lg">▶</div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/70">Short</span>
               </div>
               <h3 className="text-white font-medium text-xs leading-snug line-clamp-2">{video.title}</h3>
            </div>
          </div>
        </div>
      )) : (
        <div className="col-span-full py-20 text-center text-slate-700 italic font-serif">
          Cargando momentos de fe...
        </div>
      )}
    </div>
  );
}
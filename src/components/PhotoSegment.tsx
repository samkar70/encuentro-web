'use client';

import React, { useEffect, useState } from 'react';

interface PhotoSegmentProps {
  sectionName: string;
}

export function PhotoSegment({ sectionName }: PhotoSegmentProps) {
  const [photo, setPhoto] = useState<{url: string, title: string} | null>(null);

  useEffect(() => {
    fetch('/api/photos')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const found = data.find(f => f.seccion === sectionName);
          if (found) {
            setPhoto({ url: found.url_foto, title: found.titulo });
          }
        }
      });
  }, [sectionName]);

  if (!photo) return null;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 my-20 group">
      <div className="relative h-[350px] md:h-[500px] rounded-[3.5rem] overflow-hidden border border-white/10 shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] bg-slate-900">
        
        {/* Imagen con efecto Zoom */}
        <img 
          src={photo.url} 
          alt={`Identidad ${sectionName}`} 
          className="w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-[2000ms] ease-out"
        />

        {/* Capas de degradado cinemático */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-[#020617]/40 opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#020617]/20 via-transparent to-[#020617]/20" />

        {/* Título de la foto (si existe) */}
        {photo.title && (
          <div className="absolute bottom-12 left-12 right-12">
            <h3 className="text-2xl md:text-4xl font-serif italic text-white/90 tracking-tight drop-shadow-lg">
              {photo.title}
            </h3>
            <div className="w-12 h-[1px] bg-amber-500/50 mt-4 group-hover:w-24 transition-all duration-700" />
          </div>
        )}

        {/* Badge de sección (esquina superior) */}
        <div className="absolute top-8 right-8">
          <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/30 border border-white/10 px-4 py-2 rounded-full backdrop-blur-md">
            Identidad • {sectionName}
          </span>
        </div>

      </div>
    </div>
  );
}
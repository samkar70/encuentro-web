'use client';

import React, { useEffect, useState } from 'react';

interface PhotoData {
  url_foto: string;
  seccion: string;
  titulo?: string;
}

export function PhotoSegment({ sectionName }: { sectionName: string }) {
  const [media, setMedia] = useState<PhotoData | null>(null);

  useEffect(() => {
    fetch('/api/photos')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          // Búsqueda flexible (independiente de mayúsculas)
          const found = data.find(
            (item) => item.seccion.toLowerCase() === sectionName.toLowerCase()
          );
          if (found) setMedia(found);
        }
      })
      .catch(err => console.error("Error cargando medios:", err));
  }, [sectionName]);

  if (!media) return null;

  // Detección de video: busca extensiones comunes
  const isVideo = /\.(mp4|webm|mov|ogg)($|\?)/i.test(media.url_foto);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 my-20 group">
      {/* Contenedor con bordes redondeados según tu diseño image_d58506.jpg */}
      <div className="relative h-[350px] md:h-[500px] rounded-[3.5rem] overflow-hidden border border-white/10 shadow-2xl bg-slate-900">
        
        {/* MODO DUAL: Muestra video si detecta la extensión, de lo contrario imagen */}
        {isVideo ? (
          <video
            src={media.url_foto}
            autoPlay loop muted playsInline
            className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-all duration-1000"
          />
        ) : (
          <img 
            src={media.url_foto} 
            alt={`Identidad ${sectionName}`} 
            className="w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-[2000ms]"
          />
        )}

        {/* Degradados cinemáticos */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-[#020617]/40 opacity-80" />

        {/* Badge de sección (esquina superior derecha) */}
        <div className="absolute top-8 right-8">
          <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/30 border border-white/10 px-4 py-2 rounded-full backdrop-blur-md">
            Identidad • {sectionName.toUpperCase()}
          </span>
        </div>

        [cite_start]{/* Título dinámico desde la DB [cite: 4] */}
        {media.titulo && (
          <div className="absolute bottom-12 left-12 right-12">
            <h3 className="text-2xl md:text-4xl font-serif italic text-white/90 tracking-tight drop-shadow-lg">
              {media.titulo}
            </h3>
            <div className="w-12 h-[1px] bg-amber-500/50 mt-4 group-hover:w-24 transition-all duration-700" />
          </div>
        )}
      </div>
    </div>
  );
}
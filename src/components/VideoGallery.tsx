'use client';

import React, { useEffect, useState } from 'react';

export function VideoGallery() {
  const [videos, setVideos] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/videos')
      .then((res) => res.json())
      .then((data) => setVideos(Array.isArray(data) ? data : []));
  }, []);

  // Función vital para transformar el link de YouTube al formato correcto
  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    let videoId = '';
    if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1].split('?')[0];
    } else if (url.includes('v=')) {
      videoId = url.split('v=')[1].split('&')[0];
    }
    return `https://www.youtube.com/embed/${videoId}`;
  };

  if (videos.length === 0) {
    return <p className="text-slate-500 italic py-10">Cargando momentos inspiradores...</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
      {videos.map((video) => (
        <div key={video.id} className="group relative">
          <div className="aspect-video rounded-[2rem] overflow-hidden bg-black border border-white/5 shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]">
            <iframe
              width="100%"
              height="100%"
              src={getEmbedUrl(video.url_video)} // Usamos url_video de tu DB
              title={video.titulo}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="opacity-80 group-hover:opacity-100 transition-opacity"
            ></iframe>
          </div>
          <div className="mt-6 text-left px-4">
            <h3 className="text-lg font-serif italic text-white/90">{video.titulo}</h3>
            <p className="text-[10px] text-amber-500/50 uppercase tracking-widest mt-1">{video.categoria}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
'use client';

import React, { useEffect, useState } from 'react';
import { Play } from 'lucide-react'; // Importamos el icono de Play

export function VideoGallery() {
  const [videos, setVideos] = useState<any[]>([]);
  // Estado para saber qué videos se están reproduciendo
  const [playingId, setPlayingId] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/videos')
      .then((res) => res.json())
      .then((data) => setVideos(Array.isArray(data) ? data : []));
  }, []);

  // Extrae el ID de YouTube para la miniatura y el embed
  const getYouTubeInfo = (url: string) => {
    if (!url) return { id: '', embed: '', thumb: '' };
    let videoId = '';
    if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1].split('?')[0];
    } else if (url.includes('v=')) {
      videoId = url.split('v=')[1].split('&')[0];
    }
    return {
      id: videoId,
      embed: `https://www.youtube.com/embed/${videoId}?autoplay=1`,
      thumb: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
    };
  };

  // FUNCIÓN IGUAL A MOODBIBLE
  const handlePlayVideo = (id: number) => {
    // 1. ENVIAR SEÑAL DE PAUSA A LA RADIO
    window.dispatchEvent(new Event('pause-radio'));
    
    // 2. ACTIVAR EL VIDEO
    setPlayingId(id);
  };

  if (videos.length === 0) {
    return <p className="text-slate-500 italic py-10">Cargando momentos inspiradores...</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
      {videos.map((video) => {
        const yt = getYouTubeInfo(video.url_video);
        const isPlaying = playingId === video.id;

        return (
          <div key={video.id} className="group relative">
            <div className="aspect-video rounded-[2rem] overflow-hidden bg-black border border-white/5 shadow-2xl transition-all duration-500 relative">
              
              {isPlaying ? (
                /* Video en reproducción */
                <iframe
                  width="100%"
                  height="100%"
                  src={yt.embed}
                  title={video.titulo}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              ) : (
                /* PORTADA CON BOTÓN (Captura el clic para pausar la radio) */
                <div 
                  className="absolute inset-0 z-10 cursor-pointer group"
                  onClick={() => handlePlayVideo(video.id)}
                >
                  {/* Miniatura del video de YouTube */}
                  <img 
                    src={yt.thumb} 
                    alt={video.titulo}
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-500"
                  />
                  {/* Botón Play central */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-amber-500 text-black flex items-center justify-center shadow-2xl transform transition-all duration-500 group-hover:scale-110 group-hover:bg-amber-400">
                      <Play size={32} fill="currentColor" className="ml-1" />
                    </div>
                  </div>
                  {/* Degradado inferior */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                </div>
              )}
              
            </div>
            
            <div className="mt-6 text-left px-2">
              <h4 className="text-white font-serif italic text-xl group-hover:text-amber-500 transition-colors">
                {video.titulo}
              </h4>
            </div>
          </div>
        );
      })}
    </div>
  );
}
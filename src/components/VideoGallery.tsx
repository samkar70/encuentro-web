'use client';

import React, { useState, useEffect } from 'react';
import { VideoCard } from './VideoCard';

export function VideoGallery() {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // La galería ahora busca sus propios datos de la API
    async function loadVideos() {
      try {
        const res = await fetch('/api/videos');
        const data = await res.json();
        setVideos(data);
      } catch (error) {
        console.error("Error cargando videos:", error);
      } finally {
        setLoading(false);
      }
    }
    loadVideos();
  }, []);

  if (loading) return <div className="text-center py-20 text-slate-500 uppercase text-[10px] tracking-widest">Cargando inspiración...</div>;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
      {videos.map((video) => (
        <VideoCard key={video.id} video={video} />
      ))}
    </div>
  );
}
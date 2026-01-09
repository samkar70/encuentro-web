'use client';

import React, { useEffect, useState } from 'react';
import { DailyVerse } from '@/components/DailyVerse';
import { PsalmsMastery } from '@/components/PsalmsMastery';
import { DiscipleshipJourney } from '@/components/DiscipleshipJourney';
import { MoodBible } from '@/components/MoodBible';
import { VideoGallery } from '@/components/VideoGallery';
import { PhotoSegment } from '@/components/PhotoSegment';

export default function Home() {
  const [heroPhoto, setHeroPhoto] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/photos')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          // Búsqueda flexible para la sección 'hero'
          const hero = data.find((f: any) => f.seccion.toLowerCase() === 'hero');
          if (hero) setHeroPhoto(hero.url_foto); // Usamos url_foto de la DB
        }
      })
      .catch(err => console.error("Error cargando Hero:", err));
  }, []);

  // Lógica de detección de video para el Hero (igual a PhotoSegment)
  const isHeroVideo = heroPhoto ? /\.(mp4|webm|mov|ogg)($|\?)/i.test(heroPhoto) : false;

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex flex-col items-center relative overflow-x-hidden">
      
      {/* HERO - Adaptable a Foto o Video */}
      <header className="w-full relative h-[50vh] md:h-[70vh] flex flex-col items-center justify-center overflow-hidden">
        {heroPhoto && (
          <>
            {isHeroVideo ? (
              <video 
                src={heroPhoto} 
                autoPlay loop muted playsInline 
                className="absolute inset-0 w-full h-full object-cover opacity-40" 
              />
            ) : (
              <img 
                src={heroPhoto} 
                alt="Encuentro Hero" 
                className="absolute inset-0 w-full h-full object-cover opacity-40" 
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/10 via-[#020617]/60 to-[#020617]" />
          </>
        )}
        <div className="relative z-10 text-center px-6">
          <h1 className="text-5xl md:text-9xl font-serif italic text-white mb-2 tracking-tighter drop-shadow-2xl">
            Encuentro
          </h1>
          <p className="text-amber-500/80 text-[8px] md:text-xs font-black uppercase tracking-[0.3em] md:tracking-[0.6em] opacity-90">
            Karla Perdomo • Palabra y Vida
          </p>
        </div>
      </header>

      <main className="w-full relative z-10 flex flex-col gap-6 md:gap-12 pb-20 -mt-10 md:-mt-20">
        <DailyVerse />
        
        <PhotoSegment sectionName="psalms" />
        <PsalmsMastery />

        <PhotoSegment sectionName="discipleship" />
        <DiscipleshipJourney />

        <section id="moods" className="py-6 md:py-10">
          <MoodBible />
        </section>

        <PhotoSegment sectionName="moods" />
        
        <section id="videos" className="py-16 md:py-24 bg-black/40 backdrop-blur-sm border-y border-white/5">
          <div className="max-w-6xl mx-auto px-4 text-center">
             <VideoGallery />
          </div>
        </section>
      </main>
    </div>
  );
}
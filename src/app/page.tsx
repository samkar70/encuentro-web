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
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const hero = data.find(f => f.seccion === 'hero');
          if (hero) setHeroPhoto(hero.url_foto);
        }
      });
  }, []);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex flex-col items-center relative overflow-x-hidden">
      
      {/* 1. HERO - IDENTIDAD VISUAL */}
      <header className="w-full relative h-[70vh] flex flex-col items-center justify-center overflow-hidden">
        {heroPhoto && (
          <>
            <img src={heroPhoto} alt="Hero" className="absolute inset-0 w-full h-full object-cover opacity-40" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/10 via-[#020617]/60 to-[#020617]" />
          </>
        )}
        <div className="relative z-10 text-center px-4">
          <h1 className="text-7xl md:text-9xl font-serif italic text-white mb-4 tracking-tighter drop-shadow-2xl">
            Encuentro
          </h1>
          <p className="text-amber-500/80 text-[10px] md:text-xs font-black uppercase tracking-[0.6em] opacity-90">
            Karla Perdomo • Palabra y Vida
          </p>
        </div>
      </header>

      <main className="w-full relative z-10 flex flex-col gap-12 pb-32 -mt-20">
        
        {/* 2. REFLEXIÓN DIARIA */}
        <DailyVerse />
        
        <PhotoSegment sectionName="psalms" />
        
        {/* 3. TABLERO DE SALMOS */}
        <PsalmsMastery />

        <PhotoSegment sectionName="discipleship" />
        
        {/* 4. CAMINO DEL DISCÍPULO */}
        <DiscipleshipJourney />

        {/* 5. CENTRO DE CONSUELO (MoodBible) */}
        <section id="moods" className="py-10">
          <MoodBible />
        </section>

        {/* SECCIÓN ELIMINADA: GENERADOR DE POSTALES/SOCIAL GENERATOR */}

        <PhotoSegment sectionName="moods" />
        
        {/* 6. GALERÍA DE VIDEOS */}
        <section id="videos" className="py-24 bg-black/40 backdrop-blur-sm border-y border-white/5">
          <div className="max-w-6xl mx-auto px-4 text-center">
             <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-500 mb-16">
               Momentos en Video
             </h2>
             <VideoGallery />
          </div>
        </section>
      </main>
    </div>
  );
}
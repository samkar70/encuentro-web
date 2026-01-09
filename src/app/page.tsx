'use client';

import React, { useEffect, useState } from 'react';
import { DailyVerse } from '@/components/DailyVerse';
import { PsalmsMastery } from '@/components/PsalmsMastery';
import { DiscipleshipJourney } from '@/components/DiscipleshipJourney';
import { MoodBible } from '@/components/MoodBible';
import { VideoGallery } from '@/components/VideoGallery';
import { PhotoSegment } from '@/components/PhotoSegment';
import { RadioPlayer } from '@/components/RadioPlayer'; // Importamos la Radio

export default function Home() {
  const [heroMedia, setHeroMedia] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/photos')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const hero = data.find((f: any) => f.seccion.toLowerCase() === 'hero');
          if (hero) setHeroMedia(hero.url_foto);
        }
      })
      .catch(err => console.error("Error al cargar Hero:", err));
  }, []);

  const isHeroVideo = heroMedia ? /\.(mp4|webm|mov|ogg)($|\?)/i.test(heroMedia) : false;

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex flex-col items-center relative overflow-x-hidden">
      
      {/* 1. HERO DINÁMICO */}
      <header className="w-full relative h-[50vh] md:h-[70vh] flex flex-col items-center justify-center overflow-hidden">
        {heroMedia && (
          <>
            {isHeroVideo ? (
              <video 
                src={heroMedia} 
                autoPlay loop muted playsInline 
                className="absolute inset-0 w-full h-full object-cover opacity-40" 
              />
            ) : (
              <img 
                src={heroMedia} 
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

      {/* CONTENIDO PRINCIPAL */}
      <main className="w-full relative z-10 flex flex-col gap-8 md:gap-16 pb-20 -mt-10 md:-mt-20">
        <DailyVerse />
        
        <PhotoSegment sectionName="psalms" />
        <PsalmsMastery />

        <PhotoSegment sectionName="discipleship" />
        <DiscipleshipJourney />

        <MoodBible />

        <PhotoSegment sectionName="moods" />
        
        <section id="videos" className="py-16 md:py-24 bg-black/40 backdrop-blur-sm border-y border-white/5">
          <div className="max-w-6xl mx-auto px-4 text-center">
             <VideoGallery />
          </div>
        </section>
      </main>

      {/* RADIO PLAYER FLOTANTE */}
      <RadioPlayer />

      <footer className="w-full py-10 text-center border-t border-white/5 opacity-30">
        <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">
          Encuentro © {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}
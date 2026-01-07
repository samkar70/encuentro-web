'use client';

import React from 'react';
import { DailyVerse } from '@/components/DailyVerse';
import { PsalmsMastery } from '@/components/PsalmsMastery'; // Recreado abajo
import { DiscipleshipJourney } from '@/components/DiscipleshipJourney';
import { BibleSearch } from '@/components/BibleSearch';
import { BibleExplorer } from '@/components/BibleExplorer';
import { MoodBible } from '@/components/MoodBible';
import { SocialGenerator } from '@/components/SocialGenerator';
import { VideoGallery } from '@/components/VideoGallery';
import { FavoritesPanel } from '@/components/FavoritesPanel';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex flex-col items-center relative overflow-x-hidden">
      
      {/* Fondos decorativos originales recuperados */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 blur-[180px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-[500px] h-[500px] bg-amber-600/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-purple-600/10 blur-[150px] rounded-full pointer-events-none" />

      <header className="max-w-4xl w-full text-center pt-24 pb-16 relative z-10 px-4">
        <h1 className="text-7xl md:text-9xl font-bold font-serif mb-6 tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-slate-600 animate-in fade-in duration-1000">
          Encuentro
        </h1>
        <p className="text-amber-500/60 text-[10px] md:text-xs font-black uppercase tracking-[0.6em] mb-20 opacity-80">
          Karla Perdomo • Palabra y Vida
        </p>
      </header>

      <main className="w-full relative z-10 flex flex-col gap-24 pb-32">
        <section id="daily"><DailyVerse /></section>

        {/* --- NUEVO TABLERO DE CONTROL ESPIRITUAL --- */}
        <section id="spiritual-dashboard">
           <PsalmsMastery />
        </section>

        <section id="discipleship" className="py-10"><DiscipleshipJourney /></section>
        <section id="search"><BibleSearch /></section>
        <section id="explore" className="py-20 bg-white/[0.01] border-y border-white/5"><BibleExplorer /></section>
        <section id="moods" className="py-10"><MoodBible /></section>
        <section id="generator"><SocialGenerator /></section>

        <section id="videos" className="py-24 bg-black/40 backdrop-blur-sm border-y border-white/5">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-500 mb-16">Momentos en Video</h2>
            <VideoGallery />
          </div>
        </section>
      </main>

      <footer className="w-full py-20 text-slate-800 text-[10px] tracking-[1em] uppercase text-center border-t border-white/5 bg-slate-950/50">
        Encuentro • Karla Perdomo • 2026
      </footer>

      <FavoritesPanel />
    </div>
  );
}
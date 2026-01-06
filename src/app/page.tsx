import React from 'react';
import { DailyVerse } from '@/components/DailyVerse';
import { BibleSearch } from '@/components/BibleSearch';
import { BibleExplorer } from '@/components/BibleExplorer';
import { BiblePlans } from '@/components/BiblePlans';
import { MoodBible } from '@/components/MoodBible';
import { SocialGenerator } from '@/components/SocialGenerator';
import { VideoGallery } from '@/components/VideoGallery';
import { FavoritesPanel } from '@/components/FavoritesPanel';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex flex-col items-center relative overflow-x-hidden">
      
      {/* Fondos decorativos de luz (Estilo Pan de Vida) */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 blur-[180px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-[500px] h-[500px] bg-amber-600/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-purple-600/10 blur-[150px] rounded-full pointer-events-none" />

      {/* Header con identidad visual */}
      <header className="max-w-4xl w-full text-center pt-24 pb-16 relative z-10 px-4">
        <h1 className="text-7xl md:text-9xl font-bold font-serif mb-6 tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-slate-600 animate-in fade-in duration-1000">
          Encuentro
        </h1>
        <p className="text-amber-500/60 text-[10px] md:text-xs font-black uppercase tracking-[0.6em] mb-20 opacity-80">
          Karla Perdomo • Palabra y Vida
        </p>
      </header>

      <main className="w-full relative z-10 flex flex-col gap-24 pb-32">
        
        {/* 1. Versículo y Reflexión del Día (Impacto inicial) */}
        <section id="daily">
          <DailyVerse />
        </section>

        {/* 2. Buscador de Reflexiones con Voz */}
        <section id="search">
          <BibleSearch />
        </section>

        {/* 3. Explorador de Temas y Personajes (Mapa Temático) */}
        <section id="explore" className="py-20 bg-white/[0.01] border-y border-white/5">
           <BibleExplorer />
        </section>

        {/* 4. Planes de Lectura Dinámicos */}
        <section id="plans">
          <BiblePlans />
        </section>

        {/* 5. Selector de Sentimientos (Cómo está tu corazón) */}
        <section id="moods" className="py-20 bg-gradient-to-b from-transparent via-slate-900/20 to-transparent">
          <div className="text-center mb-12">
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">¿Cómo está tu corazón?</h2>
          </div>
          <MoodBible />
        </section>

        {/* 6. Diseñador de Postales para Redes Sociales */}
        <section id="generator">
          <SocialGenerator />
        </section>

        {/* 7. Galería de Videos de Karla (Shorts Verticales) */}
        <section id="videos" className="py-24 bg-black/40 backdrop-blur-sm border-y border-white/5">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex flex-col items-center mb-16">
              <div className="h-[1px] w-24 bg-amber-500/30 mb-8"></div>
              <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-500">Momentos de Inspiración</h2>
            </div>
            <VideoGallery />
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="w-full py-20 text-slate-800 text-[10px] tracking-[1em] uppercase text-center select-none border-t border-white/5 bg-slate-950/50">
        Encuentro • Karla Perdomo • 2026
      </footer>

      {/* Panel Flotante de Tesoros (Favoritos) */}
      <FavoritesPanel />

      {/* Estilos para Scroll y Animaciones */}
      <style dangerouslySetInnerHTML={{ __html: `
        html { scroll-behavior: smooth; }
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #020617; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #d97706; }
      `}} />
    </div>
  );
}
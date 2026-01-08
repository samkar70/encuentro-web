'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Play, Pause, Share2, Sparkles } from 'lucide-react';

export function DailyVerse() {
  const [verseData, setVerseData] = useState<any>(null);
  const [siteUrl, setSiteUrl] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const synth = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    fetch('/api/daily-verse').then(res => res.json()).then(data => setVerseData(data));
    fetch('/api/setup').then(res => res.json()).then(data => setSiteUrl(data?.url_sitio || ''));
    if (typeof window !== 'undefined') synth.current = window.speechSynthesis;
  }, []);

  const toggleSpeech = () => {
    if (!synth.current || !verseData) return;
    if (isPlaying) {
      synth.current.cancel();
      setIsPlaying(false);
    } else {
      const text = `${verseData.verse_text}. ${verseData.reflection}`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-ES';
      utterance.rate = 0.85; // Un poco más lento para mayor paz
      utterance.onend = () => setIsPlaying(false);
      synth.current.speak(utterance);
      setIsPlaying(true);
    }
  };

  const handleShare = async () => {
    const shareText = `✨ *Encuentro - Palabra y Vida* ✨\n\n"${verseData.verse_text}"\n— ${verseData.reference}\n\n🕊️ Mira la reflexión completa aquí:`;
    if (navigator.share) {
      await navigator.share({ title: 'Encuentro', text: shareText, url: siteUrl });
    }
  };

  if (!verseData) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 relative group">
      {/* Resplandor de fondo para estética de ensueño */}
      <div className="absolute inset-0 bg-amber-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative bg-[#0F172A]/40 border border-white/10 rounded-[3.5rem] overflow-hidden backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition-all duration-700 hover:border-amber-500/20">
        
        <div className="p-10 md:p-16">
          
          {/* Botones de control en la esquina superior */}
          <div className="flex justify-end gap-3 mb-12">
            <button onClick={toggleSpeech} className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500 ${isPlaying ? 'bg-amber-500 text-black shadow-[0_0_25px_rgba(245,158,11,0.4)]' : 'bg-white/5 text-amber-500 border border-white/10 hover:bg-white/10'}`}>
              {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
            </button>
            <button onClick={handleShare} className="w-14 h-14 rounded-full bg-white/5 text-slate-400 border border-white/10 flex items-center justify-center hover:bg-amber-500 hover:text-black transition-all duration-500">
              <Share2 size={22} />
            </button>
          </div>

          <div className="flex flex-col items-center text-center">
            {/* El Versículo */}
            <h2 className="text-3xl md:text-5xl font-serif italic text-white leading-[1.3] mb-6 drop-shadow-sm">
              "{verseData.verse_text}"
            </h2>
            
            {/* La Referencia */}
            <p className="text-amber-500 font-bold tracking-[0.3em] text-[11px] uppercase mb-10">
              — {verseData.reference}
            </p>

            {/* Título de Reflexión (INTERCAMBIADO AQUÍ) */}
            <div className="flex items-center gap-4 mb-8 w-full">
              <div className="h-[1px] flex-grow bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/20 bg-amber-500/5">
                <Sparkles size={12} className="text-amber-500/50" />
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-amber-500/70">Reflexión del Día</span>
              </div>
              <div className="h-[1px] flex-grow bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            </div>

            {/* La Reflexión de Karla */}
            <p className="text-xl md:text-2xl text-slate-300/90 font-serif italic leading-relaxed max-w-2xl">
              {verseData.reflection}
            </p>
            
            <div className="mt-12 opacity-30">
              <p className="text-[10px] uppercase tracking-[0.5em] text-slate-500">Karla Perdomo</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
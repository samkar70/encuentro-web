'use client';

import React from 'react';
import { Play, Pause } from 'lucide-react';

interface RadioPlayerProps {
  isPlaying: boolean;
  onToggle: () => void;
  visible: boolean;
}

// Mini-player flotante: aparece solo cuando el usuario sale del hero
export function RadioPlayer({ isPlaying, onToggle, visible }: RadioPlayerProps) {
  return (
    <div
      className={`fixed bottom-8 left-8 z-50 transition-all duration-500 ${
        visible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-6 pointer-events-none'
      }`}
    >
      <div className="bg-slate-900/80 backdrop-blur-2xl border border-white/10 p-2 rounded-full shadow-2xl flex items-center gap-4 pr-6">
        <button
          onClick={onToggle}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
            isPlaying
              ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
              : 'bg-slate-800 text-amber-500 hover:bg-slate-700'
          }`}
        >
          {isPlaying
            ? <Pause size={20} fill="currentColor" />
            : <Play size={20} fill="currentColor" className="ml-1" />}
        </button>

        <div className="flex flex-col leading-tight">
          <div className="flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${isPlaying ? 'bg-red-500 animate-pulse' : 'bg-slate-600'}`} />
            <span className="text-[10px] font-black uppercase tracking-widest text-white/90">
              {isPlaying ? 'En Vivo' : 'Radio'}
            </span>
          </div>
          <span className="text-[8px] uppercase tracking-[0.2em] text-amber-500/60 font-bold">
            Palabra y Vida
          </span>
        </div>
      </div>
    </div>
  );
}
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Radio, Play, Pause } from 'lucide-react';

export function RadioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // ESCUCHADOR DE PAUSA: Se activa cuando empieza un video
  useEffect(() => {
    const handlePauseRadio = () => {
      if (audioRef.current && isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    };

    window.addEventListener('pause-radio', handlePauseRadio);
    return () => window.removeEventListener('pause-radio', handlePauseRadio);
  }, [isPlaying]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="fixed bottom-8 left-8 z-50 animate-in slide-in-from-left-10 duration-1000">
      <div className="bg-slate-900/80 backdrop-blur-2xl border border-white/10 p-2 rounded-full shadow-2xl flex items-center gap-4 pr-6">
        <button 
          onClick={togglePlay}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
            isPlaying ? 'bg-amber-500 text-black animate-pulse' : 'bg-slate-800 text-amber-500 hover:bg-slate-700'
          }`}
        >
          {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
        </button>
        
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className={`relative inline-flex rounded-full h-2 w-2 ${isPlaying ? 'bg-red-500' : 'bg-slate-600'}`}></span>
            <p className="text-[10px] font-black uppercase tracking-widest text-white">Radio Encuentro</p>
          </div>
          <p className="text-[9px] text-slate-500 font-bold uppercase">En vivo • 24/7</p>
        </div>

        <audio ref={audioRef} src="https://stream.zeno.fm/akg9jodmss3uv" preload="none" />
      </div>
    </div>
  );
}
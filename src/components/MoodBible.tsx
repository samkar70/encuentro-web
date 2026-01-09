'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Sun, Shield, Users, DollarSign, Brain, Anchor, Heart, Leaf, 
  Flame, Compass, Sparkles, CloudRain, Star, Play, Pause, Share2, Infinity
} from 'lucide-react';

interface MoodOption { id: string; label: string; icon: React.ReactNode; }

const MOOD_OPTIONS: MoodOption[] = [
  { id: 'PROPOSITO', label: 'Propósito', icon: <Compass size={24} /> },
  { id: 'PAZ', label: 'Paz', icon: <Sun size={24} /> },
  { id: 'FORTALEZA', label: 'Fortaleza', icon: <Shield size={24} /> },
  { id: 'FAMILIA', label: 'Familia', icon: <Users size={24} /> },
  { id: 'FINANZAS', label: 'Finanzas', icon: <DollarSign size={24} /> },
  { id: 'SABIDURIA', label: 'Sabiduría', icon: <Brain size={24} /> },
  { id: 'ESPERANZA', label: 'Esperanza', icon: <Anchor size={24} /> },
  { id: 'AMOR', label: 'Amor', icon: <Heart size={24} /> },
  { id: 'DESCANSO', label: 'Descanso', icon: <Leaf size={24} /> },
  { id: 'SANIDAD', label: 'Sanidad', icon: <Flame size={24} /> },
  { id: 'PERDON', label: 'Perdón', icon: <Sparkles size={24} /> },
  { id: 'ANSIEDAD', label: 'Ansiedad', icon: <CloudRain size={24} /> },
  { id: 'ALEGRIA', label: 'Alegría', icon: <Star size={24} /> },
  { id: 'AZAR', label: 'Sorpréndeme', icon: <Infinity size={24} className="animate-pulse" /> },
];

export function MoodBible() {
  const [selectedMood, setSelectedMood] = useState<string>('PROPOSITO');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const synth = useRef<SpeechSynthesis | null>(null);

  const fetchWord = async (moodId: string) => {
    setLoading(true);
    const res = await fetch(`/api/moods?mood=${moodId}`);
    const json = await res.json();
    setData(json);
    setLoading(false);
    if (isPlaying) {
      synth.current?.cancel();
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') synth.current = window.speechSynthesis;
    fetchWord('PROPOSITO');
  }, []);

  const toggleSpeech = () => {
    if (!synth.current || !data) return;

    if (isPlaying) {
      synth.current.cancel();
      setIsPlaying(false);
    } else {
      // LA ORDEN DE PAUSA: Enviamos el evento que la radio está esperando
      window.dispatchEvent(new CustomEvent('pause-radio'));

      const utterance = new SpeechSynthesisUtterance(`${data.verse_text}. ${data.reflection}`);
      utterance.lang = 'es-ES';
      utterance.onend = () => setIsPlaying(false);
      synth.current.speak(utterance);
      setIsPlaying(true);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <div className="text-center mb-16">
        <h3 className="text-3xl md:text-5xl font-serif italic text-white/90 leading-tight">¿Qué busca tu alma hoy?</h3>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-6 mb-24">
        {MOOD_OPTIONS.map((mood) => (
          <button
            key={mood.id}
            onClick={() => { setSelectedMood(mood.id); fetchWord(mood.id); }}
            className={`flex flex-col items-center justify-center gap-4 aspect-square rounded-[2.5rem] border transition-all duration-700 ${
              selectedMood === mood.id ? 'bg-amber-500 border-amber-500 text-black scale-105' : 'bg-white/[0.03] border-white/5 text-slate-400'
            }`}
          >
            <div className={selectedMood === mood.id ? 'text-black' : 'text-amber-500/50'}>{mood.icon}</div>
            <span className="text-[10px] font-black uppercase tracking-widest">{mood.label}</span>
          </button>
        ))}
      </div>

      <div className="min-h-[500px] flex items-center justify-center">
        {loading ? (
          <div className="text-white/20 animate-pulse">Buscando...</div>
        ) : data && (
          <div className="bg-[#0F172A]/60 border border-white/10 rounded-[4rem] p-12 md:p-20 text-center backdrop-blur-3xl relative max-w-4xl w-full mx-4">
            <div className="absolute top-8 right-8 md:top-12 md:right-12">
              <button 
                onClick={toggleSpeech}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                  isPlaying ? 'bg-amber-500 text-black' : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
              </button>
            </div>
            <h2 className="text-2xl md:text-5xl font-serif italic text-white leading-tight mb-8">"{data.verse_text}"</h2>
            <p className="text-amber-500 font-bold tracking-[0.4em] text-[10px] uppercase mb-12">— {data.reference}</p>
            <p className="text-xl md:text-2xl text-slate-300 font-serif italic leading-relaxed">{data.reflection}</p>
          </div>
        )}
      </div>
    </div>
  );
}
'use client';

import React, { useState } from 'react';
import { Heart, Shield, Sparkles, BookOpen } from 'lucide-react';

// Definimos los sentimientos base que coinciden con tu base de datos
const MOODS_DATA = [
  { id: '1', name: 'Busco Paz', icon: <Heart size={20} />, color: 'bg-blue-500/10 text-blue-500' },
  { id: '2', name: 'Fortaleza', icon: <Shield size={20} />, color: 'bg-orange-500/10 text-orange-500' },
  { id: '3', name: 'Sabiduría', icon: <Sparkles size={20} />, color: 'bg-amber-500/10 text-amber-500' }
];

export function MoodBible() {
  const [selectedResult, setSelectedResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSelection = async (moodName: string) => {
    setLoading(true);
    try {
      // Llamamos a una API que crearemos para consultar el archivo local
      const res = await fetch(`/api/bible/mood?q=${moodName}`);
      const data = await res.json();
      setSelectedResult(data);
    } catch (error) {
      console.error("Error al buscar sentimiento:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6">
      <h3 className="text-center text-slate-500 text-[10px] uppercase font-black tracking-[0.4em] mb-10">
        ¿Cómo está tu corazón hoy?
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
        {MOODS_DATA.map((mood) => (
          <button
            key={mood.id}
            onClick={() => handleSelection(mood.name)}
            className={`flex items-center justify-center gap-3 p-6 rounded-[2rem] border border-white/5 bg-slate-900/40 hover:scale-105 transition-all active:scale-95 group`}
          >
            <span className={mood.color}>{mood.icon}</span>
            <span className="text-[11px] font-black uppercase tracking-widest">{mood.name}</span>
          </button>
        ))}
      </div>

      {loading && (
        <div className="text-center text-amber-500 text-[10px] font-black animate-pulse">
          Sincronizando con la fuente...
        </div>
      )}

      {selectedResult && (
        <div className="bg-slate-900/60 border border-amber-500/20 p-10 rounded-[3rem] animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex justify-between items-center mb-6">
            <span className="text-amber-500 text-[10px] font-black uppercase tracking-widest">
              {selectedResult.reference}
            </span>
            <BookOpen size={16} className="text-slate-600" />
          </div>
          <h4 className="text-2xl font-serif italic mb-4 text-slate-100">
            "{selectedResult.verse_text}"
          </h4>
          <p className="text-slate-400 text-sm leading-relaxed mb-6">
            {selectedResult.reflection}
          </p>
          <div className="pt-6 border-t border-white/5">
            <p className="text-[10px] text-slate-500 leading-relaxed uppercase tracking-tight">
              {selectedResult.full_content.substring(0, 150)}...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
'use client';

import React, { useState } from 'react';
import { Heart, Shield, Sun, Sparkles } from 'lucide-react';

// IDs de versículos reales para la Biblia RVR1960
const MOOD_VERSES: Record<string, string> = {
  paz: "JHN.14.27",      // Juan 14:27
  fortaleza: "ISA.41.10", // Isaías 41:10
  sabiduria: "JAM.1.5"    // Santiago 1:5
};

export function MoodBible() {
  const [verse, setVerse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchVerse = async (mood: string) => {
    setVerse(null); // Limpiamos el texto anterior para confirmar el cambio visual inmediato
    setLoading(true);
    
    try {
      // Llamada a la API de la Biblia con 'no-store' para evitar respuestas repetidas del caché
      const res = await fetch(`https://api.scripture.api.bible/v1/bibles/59242f386144598d-01/verses/${MOOD_VERSES[mood]}?content-type=text`, {
        headers: { 'api-key': process.env.NEXT_PUBLIC_BIBLE_API_KEY || '' },
        cache: 'no-store' 
      });
      
      const data = await res.json();
      
      if (data.data && data.data.content) {
        // Limpiamos códigos de versículo como [1] que a veces devuelve la API
        const cleanText = data.data.content.replace(/\[\d+\]/g, '').trim();
        setVerse(cleanText);
      } else {
        throw new Error("Sin datos");
      }
    } catch (e) {
      // Fallbacks específicos para cada sentimiento en caso de error de red o API
      const fallbacks: Record<string, string> = {
        paz: "La paz os dejo, mi paz os doy; no como el mundo la da yo os la doy. No se turbe vuestro corazón, ni tenga miedo. (Juan 14:27)",
        fortaleza: "No temas, porque yo estoy contigo; no desmayes, porque yo soy tu Dios que te esfuerzo; siempre te ayudaré. (Isaías 41:10)",
        sabiduria: "Y si alguno de vosotros tiene falta de sabiduría, pídala a Dios, el cual da a todos abundantemente. (Santiago 1:5)"
      };
      setVerse(fallbacks[mood]);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <h2 className="text-center text-slate-500 text-[10px] uppercase font-bold tracking-[0.5em] mb-8">
        ¿Cómo está tu corazón hoy?
      </h2>
      
      {/* Grid de Botones de Sentimiento */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
        <button 
          onClick={() => fetchVerse('paz')} 
          className="flex items-center justify-center gap-3 bg-blue-600/10 border border-blue-500/20 p-6 rounded-[2rem] hover:bg-blue-600/20 transition-all group"
        >
          <Heart className="text-blue-500 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-black uppercase tracking-widest text-blue-100">Busco Paz</span>
        </button>
        
        <button 
          onClick={() => fetchVerse('fortaleza')} 
          className="flex items-center justify-center gap-3 bg-orange-600/10 border border-orange-500/20 p-6 rounded-[2rem] hover:bg-orange-600/20 transition-all group"
        >
          <Shield className="text-orange-500 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-black uppercase tracking-widest text-orange-100">Necesito Fortaleza</span>
        </button>
        
        <button 
          onClick={() => fetchVerse('sabiduria')} 
          className="flex items-center justify-center gap-3 bg-amber-600/10 border border-amber-500/20 p-6 rounded-[2rem] hover:bg-amber-600/20 transition-all group"
        >
          <Sun className="text-amber-500 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-black uppercase tracking-widest text-amber-100">Busco Sabiduría</span>
        </button>
      </div>

      {/* Estado de Carga */}
      {loading && (
        <div className="text-center animate-pulse text-amber-500 uppercase text-[10px] font-bold tracking-widest">
          Buscando una palabra para ti...
        </div>
      )}
      
      {/* Despliegue del Versículo */}
      {verse && !loading && (
        <div className="bg-slate-900/40 border border-white/5 p-8 rounded-[2.5rem] text-center animate-in fade-in slide-in-from-bottom-4 duration-700 shadow-2xl">
          <Sparkles className="text-amber-500/30 mx-auto mb-4" size={32} />
          <p className="text-xl md:text-2xl font-medium italic text-slate-200 leading-relaxed">
            "{verse}"
          </p>
          <div className="mt-6 inline-block px-4 py-1 bg-amber-500/10 text-amber-500 text-[10px] font-bold uppercase rounded-full border border-amber-500/20">
            Biblia RVR1960
          </div>
        </div>
      )}
    </div>
  );
}
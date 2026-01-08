'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Book, Heart, Star, Shield, Sun, Coffee, Play, Pause, Music } from 'lucide-react';

interface Psalm {
  id: number;
  numero_salmo: number;
  titulo_occidental: string;
  genero_gunkel: string;
  analisis_psychologico: string;
  clave_cristologica: string;
  texto_clave: string;
  url_audio: string;
}

export function PsalmsMastery() {
  const [psalms, setPsalms] = useState<Psalm[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // --- NUEVO ESTADO PARA EL AUDIO ---
  // Guarda el ID del salmo que se está reproduciendo actualmente. Null si ninguno.
  const [playingPsalmId, setPlayingPsalmId] = useState<number | null>(null);
  // Referencia para controlar los elementos de audio HTML ocultos
  const audioRefs = useRef<Map<number, HTMLAudioElement>>(new Map());

  useEffect(() => {
    fetch('/api/psalms')
      .then(res => res.json())
      .then(data => setPsalms(Array.isArray(data) ? data : []));
  }, []);

  // Lógica de filtrado (Se mantiene igual)
  const matchCategory = (genre: string, selected: string) => {
    if (!genre || !selected) return false;
    const normalized = genre.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    if (selected === 'ALABANZA') return normalized.includes('ALABANZA') || normalized.includes('SION');
    if (selected === 'CONFIANZA') return normalized.includes('CONFIANZA');
    if (selected === 'LAMENTO') return normalized.includes('LAMENTO') || normalized.includes('PENITENCIAL');
    if (selected === 'SAPIENCIAL') return normalized.includes('SAPIENCIAL') || normalized.includes('DIDACTICO');
    return normalized.includes(selected);
  };

  const filteredPsalms = psalms.filter(p => matchCategory(p.genero_gunkel, selectedCategory || ""));

  // --- NUEVA FUNCIÓN: CONTROL DE PLAY/PAUSE ---
  const toggleAudio = (id: number) => {
    const currentAudio = audioRefs.current.get(id);
    
    // Si el que clicamos ya está sonando, lo pausamos.
    if (playingPsalmId === id) {
      currentAudio?.pause();
      setPlayingPsalmId(null);
    } else {
      // Si había otro sonando, lo pausamos primero.
      if (playingPsalmId !== null) {
        audioRefs.current.get(playingPsalmId)?.pause();
      }
      // Reproducimos el nuevo.
      currentAudio?.play();
      setPlayingPsalmId(id);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-amber-500/60 mb-4">Tablero de Control Espiritual</h2>
        <h3 className="text-3xl md:text-5xl font-serif italic text-white/90">Salmos para cada estación</h3>
      </div>

      {/* FILTROS (Se mantienen igual) */}
      <div className="flex flex-wrap justify-center gap-4 mb-16">
        {['ALABANZA', 'CONFIANZA', 'LAMENTO', 'SAPIENCIAL'].map((id) => (
          <button
            key={id}
            onClick={() => setSelectedCategory(id === selectedCategory ? null : id)}
            className={`px-6 py-3 rounded-full border text-xs uppercase tracking-widest transition-all duration-500 ${
              selectedCategory === id ? 'bg-amber-500 border-amber-500 text-black font-bold scale-105' : 'bg-white/5 border-white/10 text-slate-400'
            }`}
          >
            {id}
          </button>
        ))}
      </div>

      <div className="min-h-[400px]">
        {selectedCategory ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            {filteredPsalms.map((psalm) => {
              // Verificamos si ESTA tarjeta es la que está sonando
              const isPlaying = playingPsalmId === psalm.id;

              return (
                <div key={psalm.id} className={`bg-white/[0.03] border rounded-[2.5rem] p-10 flex flex-col h-full transition-all group duration-500 ${
                    isPlaying ? 'border-amber-500/40 shadow-[0_0_30px_-5px_rgba(245,158,11,0.15)]' : 'border-white/5 hover:bg-white/[0.05]'
                  }`}>
                  
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <span className={`text-6xl font-serif italic transition-colors duration-500 ${
                        isPlaying ? 'text-amber-500' : 'text-amber-500/20 group-hover:text-amber-500/40'
                      }`}>
                        {psalm.numero_salmo}
                      </span>
                      <h4 className="text-xl font-serif italic text-white/90 mt-2">{psalm.titulo_occidental}</h4>
                    </div>
                    
                    {/* --- REPRODUCTOR PERSONALIZADO --- */}
                    {psalm.url_audio && (
                      <div className="flex flex-col items-center gap-2">
                        {/* Elemento de audio OCULTO (sin controls) */}
                        <audio
                          ref={(el) => { if (el) audioRefs.current.set(psalm.id, el); }}
                          src={psalm.url_audio}
                          onEnded={() => setPlayingPsalmId(null)} // Cuando termina, resetea el icono
                        />
                        
                        {/* BOTÓN PLAY/PAUSE RESALTADO */}
                        <button
                          onClick={() => toggleAudio(psalm.id)}
                          className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 ${
                            isPlaying 
                              ? 'bg-amber-500 text-black shadow-[0_0_20px_rgba(245,158,11,0.5)] scale-110' // Estilo ACTIVO (Resaltado)
                              : 'bg-black/40 text-amber-500 border border-amber-500/30 hover:bg-amber-500 hover:text-black hover:scale-105' // Estilo INACTIVO
                          }`}
                        >
                          {isPlaying ? (
                            <Pause className="w-6 h-6 fill-current" />
                          ) : (
                            <Play className="w-6 h-6 fill-current ml-1" /> // ml-1 para centrar visualmente el triángulo
                          )}
                        </button>
                        <span className={`text-[9px] uppercase tracking-widest font-bold transition-colors ${isPlaying ? 'text-amber-500' : 'text-amber-500/50'}`}>
                          {isPlaying ? 'Escuchando' : 'Audio'}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* TEXTO BÍBLICO CLAVE */}
                  {psalm.texto_clave && (
                    <div className={`mb-8 p-6 rounded-3xl border-l transition-all duration-500 ${
                      isPlaying ? 'bg-amber-500/10 border-amber-500' : 'bg-amber-500/[0.03] border-amber-500/30'
                    }`}>
                      <p className="text-sm text-slate-300 italic font-serif leading-relaxed line-clamp-3">
                        "{psalm.texto_clave}"
                      </p>
                    </div>
                  )}

                  {/* ANÁLISIS PSICOLÓGICO */}
                  <div className="mb-8 flex-grow">
                    <p className="text-[10px] text-amber-500/50 uppercase tracking-widest mb-3">Mapa del Éxito</p>
                    <p className="text-sm text-slate-400 leading-relaxed">{psalm.analisis_psychologico}</p>
                  </div>

                  {/* CLAVE CRISTOLÓGICA */}
                  <div className="mt-auto pt-8 border-t border-white/5 bg-gradient-to-b from-transparent to-blue-500/[0.02] rounded-b-[2.5rem]">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_10px_blue]" />
                      <p className="text-[10px] font-black uppercase tracking-widest text-blue-400/80">Revelación de Cristo</p>
                    </div>
                    <p className="text-sm text-blue-100/60 font-serif italic leading-relaxed">
                      {psalm.clave_cristologica || "Contemplando la gloria del Mesías..."}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 opacity-20 animate-pulse">
            <Music className="w-12 h-12 mb-6" />
            <p className="text-center font-serif italic text-xl">Selecciona una categoría para escuchar y meditar...</p>
          </div>
        )}
      </div>
    </div>
  );
}
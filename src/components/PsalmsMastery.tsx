'use client';

import React, { useState, useEffect } from 'react';
// IMPORTACIÓN CORREGIDA: Se añadió Hash y los demás iconos necesarios
import { 
  X, 
  ChevronRight, 
  Brain, 
  Crown, 
  Heart, 
  Sparkles, 
  BookOpen, 
  ShieldCheck, 
  Layout, 
  Info, 
  Anchor, 
  Loader2,
  Hash 
} from 'lucide-react';

const EMOTIONS = [
  { id: 'traicion', label: 'Traición', salmos: [3, 41, 22] },
  { id: 'estres', label: 'Estrés / Insomnio', salmos: [3, 4] },
  { id: 'miedo', label: 'Miedo / Pánico', salmos: [27, 23, 16] },
  { id: 'culpa', label: 'Culpa / Perdón', salmos: [32] },
  { id: 'proposito', label: 'Propósito', salmos: [8, 15, 19] }
];

export function PsalmsMastery() {
  const [libroInfo, setLibroInfo] = useState<any>(null);
  const [psalmsData, setPsalmsData] = useState<any[]>([]);
  const [selectedPsalm, setSelectedPsalm] = useState<any>(null);
  const [filter, setFilter] = useState<number[] | null>(null);
  const [showSummary, setShowSummary] = useState(false);
  const [mode, setMode] = useState<'therapeutic' | 'master'>('therapeutic');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [infoRes, psalmsRes] = await Promise.all([
          fetch('/api/bible/books-info?name=Salmos'),
          fetch('/api/bible/psalms')
        ]);
        
        const info = await infoRes.json();
        const psalms = await psalmsRes.json();
        
        setLibroInfo(info);
        setPsalmsData(Array.isArray(psalms) ? psalms : []);
      } catch (e) {
        console.error("Error cargando el tablero:", e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredData = filter 
    ? psalmsData.filter(p => filter.includes(p.numero_salmo))
    : psalmsData;

  if (loading) return (
    <div className="flex flex-col items-center py-20 text-amber-500/50">
      <Loader2 className="animate-spin mb-4" size={40} />
      <p className="font-serif italic">Sincronizando Tablero Espiritual...</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      
      {/* 1. DASHBOARD DE EMOCIONES */}
      <div className="bg-[#0f172a] rounded-[2.5rem] border border-white/5 p-8 mb-10 shadow-2xl relative overflow-hidden">
        <button 
          onClick={() => setShowSummary(true)}
          className="absolute top-6 right-8 flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-full text-[9px] font-bold text-amber-500 uppercase tracking-[0.3em] hover:bg-amber-500 hover:text-white transition-all z-10 group"
        >
          <BookOpen size={12} className="group-hover:rotate-12 transition-transform" />
          Revelación de los Salmos
        </button>

        <header className="text-center mb-10">
          <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-500/60 mb-3">Tablero de Control Espiritual</h2>
          <h3 className="text-3xl text-white font-serif italic max-w-md mx-auto">¿Qué necesita tu alma hoy?</h3>
        </header>

        <div className="flex flex-wrap justify-center gap-2">
          {EMOTIONS.map(e => (
            <button 
              key={e.id}
              onClick={() => setFilter(filter === e.salmos ? null : e.salmos)}
              className={`px-4 py-2.5 rounded-xl border text-[10px] font-bold uppercase transition-all ${
                filter === e.salmos ? 'bg-amber-600 border-amber-500 text-white shadow-lg' : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'
              }`}
            >
              {e.label}
            </button>
          ))}
          {filter && <button onClick={() => setFilter(null)} className="p-2 text-slate-500 hover:text-white transition-colors"><X size={16}/></button>}
        </div>
      </div>

      {/* 2. GRILLA DE COLUMNAS DETALLADAS (3 COLUMNAS) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        {filteredData.length > 0 ? (
          filteredData.map((p) => (
            <button 
              key={p.numero_salmo}
              onClick={() => setSelectedPsalm(p)}
              className="flex flex-col gap-4 p-6 rounded-[2rem] bg-[#0f172a]/40 border border-white/5 hover:border-amber-500/40 transition-all text-left group relative h-full"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-amber-600 text-white font-bold text-xl shadow-lg group-hover:scale-110 transition-transform">
                  {p.numero_salmo}
                </div>
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-600 group-hover:text-amber-500/50 transition-colors">
                  {p.genero_gunkel}
                </span>
              </div>
              
              <div className="flex-1">
                <h4 className="text-white font-serif italic text-xl mb-3 leading-tight group-hover:text-amber-500 transition-colors line-clamp-2">
                  {p.titulo_occidental}
                </h4>
                <p className="text-slate-400 text-xs leading-relaxed line-clamp-3 italic opacity-60">
                  {p.analisis_psychologico}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-2">
                 <span className="text-[8px] font-bold uppercase text-slate-500 tracking-[0.2em] flex items-center gap-1">
                   <Brain size={10}/> Ver Análisis
                 </span>
                 <ChevronRight size={16} className="text-slate-700 group-hover:text-amber-500 transition-transform group-hover:translate-x-1" />
              </div>
            </button>
          ))
        ) : (
          <div className="col-span-full text-center py-20 text-slate-600 font-serif italic border border-dashed border-white/5 rounded-[2rem]">
            No se encontraron salmos para esta selección de emociones.
          </div>
        )}
      </div>

      {/* 3. MODAL DE REVELACIÓN (LOS 4 CAMPOS DINÁMICOS) */}
      {showSummary && libroInfo && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="w-full max-w-5xl bg-slate-900 rounded-[3rem] border border-white/10 overflow-hidden flex flex-col h-[85vh] shadow-2xl">
            <div className="p-8 border-b border-white/5 flex items-center justify-between bg-slate-950/40">
              <div className="flex items-center gap-3 text-amber-500">
                <ShieldCheck size={24} />
                <h2 className="text-xl text-white font-serif italic text-left">Identidad de los Salmos</h2>
              </div>
              <button onClick={() => setShowSummary(false)} className="p-2 hover:bg-white/5 rounded-full text-slate-500 hover:text-white transition-colors"><X size={24}/></button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                
                <div className="bg-white/[0.02] border border-white/5 p-8 rounded-[2rem] hover:border-amber-500/20 transition-colors">
                  <div className="flex items-center gap-3 mb-4 text-amber-500">
                    <BookOpen size={20} /> <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Generales</span>
                  </div>
                  <p className="text-slate-300 text-lg leading-relaxed font-serif italic opacity-90">{libroInfo.generales}</p>
                </div>

                <div className="bg-white/[0.02] border border-white/5 p-8 rounded-[2rem] hover:border-blue-500/20 transition-colors">
                  <div className="flex items-center gap-3 mb-4 text-blue-400">
                    <Info size={20} /> <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Datos Importantes</span>
                  </div>
                  <p className="text-slate-300 text-base leading-relaxed italic opacity-90">{libroInfo.datos_importantes}</p>
                </div>

                <div className="bg-white/[0.02] border border-white/5 p-8 rounded-[2rem] hover:border-emerald-500/20 transition-colors">
                  <div className="flex items-center gap-3 mb-4 text-emerald-400">
                    <Layout size={20} /> <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Esquema</span>
                  </div>
                  <p className="text-slate-300 text-base leading-relaxed italic opacity-90">{libroInfo.esquema}</p>
                </div>

                <div className="bg-white/[0.02] border border-white/5 p-8 rounded-[2rem] hover:border-indigo-500/20 transition-colors">
                  <div className="flex items-center gap-3 mb-4 text-indigo-400">
                    <Anchor size={20} /> <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Megatemas</span>
                  </div>
                  <p className="text-slate-300 text-base leading-relaxed italic opacity-90">{libroInfo.megatemas}</p>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. MODAL DE FICHA (MODO DUAL) */}
      {selectedPsalm && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="w-full max-w-4xl bg-[#020617] rounded-[3rem] border border-white/10 overflow-hidden flex flex-col h-[85vh] shadow-2xl relative">
            
            <div className="p-8 border-b border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 bg-slate-900/20">
              <div className="text-left flex items-center gap-4">
                 <div className="w-14 h-14 rounded-2xl bg-amber-600 flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-amber-900/20">
                   {selectedPsalm.numero_salmo}
                 </div>
                 <div>
                    <span className="text-amber-500/60 text-[9px] font-black uppercase tracking-[0.3em] mb-1 flex items-center gap-2">
                      <Hash size={10}/> Análisis de Identidad
                    </span>
                    <h2 className="text-3xl text-white font-serif italic leading-none">{selectedPsalm.titulo_occidental}</h2>
                 </div>
              </div>

              <div className="flex bg-black/40 p-1.5 rounded-2xl border border-white/5">
                <button 
                  onClick={() => setMode('therapeutic')}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase transition-all ${mode === 'therapeutic' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
                >
                  <Brain size={14} /> Terapéutico
                </button>
                <button 
                  onClick={() => setMode('master')}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase transition-all ${mode === 'master' ? 'bg-amber-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
                >
                  <Crown size={14} /> Maestro
                </button>
              </div>
              <button onClick={() => setSelectedPsalm(null)} className="p-2 hover:bg-white/10 rounded-full text-slate-500 hover:text-white transition-colors"><X size={24}/></button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-8 md:p-12">
               <div className="max-w-2xl mx-auto text-left">
                  {mode === 'therapeutic' ? (
                    <div className="animate-in slide-in-from-left-4 duration-500">
                      <div className="flex items-center gap-3 mb-6 text-blue-400">
                        <Heart size={20} />
                        <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Lo que tu mente necesita</span>
                      </div>
                      <p className="text-slate-200 text-2xl leading-[1.6] font-serif italic p-10 bg-blue-500/5 rounded-[2.5rem] border border-blue-500/20 shadow-inner">
                        {selectedPsalm.analisis_psychologico}
                      </p>
                    </div>
                  ) : (
                    <div className="animate-in slide-in-from-right-4 duration-500">
                      <div className="flex items-center gap-3 mb-6 text-amber-500">
                        <Crown size={20} />
                        <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Lo que la Escritura declara</span>
                      </div>
                      <div className="space-y-8">
                        <p className="text-slate-200 text-xl leading-[1.6] font-serif italic p-8 bg-amber-500/5 rounded-[2.5rem] border border-amber-500/20 shadow-inner">
                          {selectedPsalm.eje_teologico_master}
                        </p>
                        <div className="pt-8 border-t border-white/10">
                           <span className="text-[9px] font-black uppercase text-amber-500/50 tracking-[0.3em] mb-4 flex items-center gap-2"><Sparkles size={12}/> Clave Cristológica</span>
                           <p className="text-white text-lg italic pl-6 border-l-2 border-amber-500/30 leading-relaxed">{selectedPsalm.clave_cristologica}</p>
                        </div>
                      </div>
                    </div>
                  )}
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
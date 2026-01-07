'use client';

import React, { useState, useEffect } from 'react';
import { Lock, CheckCircle2, Star, Share2, ArrowRight, X, Sparkles, Trophy, Award, PartyPopper } from 'lucide-react';

export function DiscipleshipJourney() {
  const [currentDay, setCurrentDay] = useState<any>(null);
  const [unlockedDays, setUnlockedDays] = useState<number>(1);
  const [showCommitment, setShowCommitment] = useState(false);
  const [isGraduated, setIsGraduated] = useState(false);

  // Cargamos el progreso guardado en el celular del usuario
  useEffect(() => {
    const saved = localStorage.getItem('encuentro-discipulado-progreso');
    if (saved) setUnlockedDays(parseInt(saved));
  }, []);

  const loadDay = async (day: number) => {
    if (day > unlockedDays) return;
    const res = await fetch(`/api/bible/discipleship?day=${day}`);
    const data = await res.json();
    setCurrentDay(data);
  };

  const completeDay = () => {
    const nextDay = currentDay.day + 1;
    
    // Si terminamos el Día 4, activamos la Graduación
    if (currentDay.day === 4) {
      setIsGraduated(true);
      setUnlockedDays(5); // Marcamos todo como completado
      localStorage.setItem('encuentro-discipulado-progreso', '5');
    } else if (nextDay > unlockedDays && nextDay <= 4) {
      setUnlockedDays(nextDay);
      localStorage.setItem('encuentro-discipulado-progreso', nextDay.toString());
      setShowCommitment(true);
    } else {
      setShowCommitment(true);
    }
  };

  const shareFinalVictory = () => {
    const text = `¡Me gradué del Curso de Discipulado en Encuentro! 🎓 He caminado 4 días profundizando en la fe con Karla Perdomo. ¡Te lo recomiendo!`;
    if (navigator.share) navigator.share({ title: '¡Graduación Encuentro!', text }).catch(console.error);
    else { navigator.clipboard.writeText(text); alert("Copiado al portapapeles"); }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-20 bg-slate-900/20 border-y border-white/5 relative overflow-hidden">
      {/* Adornos de fondo */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none">
        <Sparkles size={400} className="absolute -top-20 -right-20 text-amber-500" />
      </div>

      <div className="text-center mb-16 relative z-10">
        <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-amber-500 mb-4">Camino del Discípulo</h2>
        <p className="text-slate-400 text-xs font-light tracking-widest uppercase">Transformación paso a paso</p>
      </div>

      {/* MAPA DE RUTA INTERACTIVO */}
      <div className="flex justify-between items-center relative mb-24 max-w-2xl mx-auto z-10">
        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/10 -translate-y-1/2 z-0" />
        {[1, 2, 3, 4].map((d) => (
          <button 
            key={d} onClick={() => loadDay(d)}
            className={`relative z-10 w-16 h-16 rounded-full flex items-center justify-center border-2 transition-all duration-700 shadow-xl ${
              d < unlockedDays ? 'bg-amber-500 border-amber-500 text-white scale-110' : 
              d === unlockedDays ? 'bg-slate-900 border-amber-500 text-amber-500 animate-pulse' : 
              'bg-slate-950 border-slate-800 text-slate-700 cursor-not-allowed'
            }`}
          >
            {d < unlockedDays ? <CheckCircle2 size={24} /> : d > unlockedDays ? <Lock size={18} /> : <span className="font-black text-lg">{d}</span>}
            <span className={`absolute -bottom-10 left-1/2 -translate-x-1/2 text-[9px] font-black uppercase tracking-widest whitespace-nowrap transition-opacity ${d <= unlockedDays ? 'opacity-100 text-amber-500/80' : 'opacity-20'}`}>
              Día {d}
            </span>
          </button>
        ))}
      </div>

      {/* CONTENIDO DE LA LECCIÓN */}
      {currentDay && (
        <div className="bg-slate-900/80 backdrop-blur-md p-8 md:p-14 rounded-[4rem] border border-white/10 animate-in slide-in-from-bottom-12 duration-700 shadow-2xl relative z-20">
          <button onClick={() => setCurrentDay(null)} className="absolute top-10 right-10 text-slate-600 hover:text-white transition-colors"><X size={24} /></button>
          
          <div className="flex items-center gap-4 mb-10">
            <div className="p-3 bg-amber-500/20 rounded-2xl text-amber-500"><Sparkles size={20} /></div>
            <h3 className="text-3xl md:text-4xl text-white font-serif italic">{currentDay.title}</h3>
          </div>

          <div className="space-y-10 mb-12">
            <div className="p-8 bg-amber-500/[0.03] rounded-[2.5rem] border border-amber-500/10 shadow-inner">
              <span className="text-[10px] font-black uppercase text-amber-500/60 block mb-4 tracking-[0.2em]">Palabra Clave: {currentDay.verse_key}</span>
              <p className="text-xl md:text-2xl text-slate-200 font-serif italic leading-relaxed">
                "{currentDay.bibleData?.verse_text || "Cargando texto sagrado..."}"
              </p>
            </div>
            
            <div className="text-slate-300 leading-relaxed font-light text-lg space-y-4">
              <p>{currentDay.content}</p>
            </div>
          </div>

          <div className="bg-black/40 p-10 rounded-[3rem] border border-white/5 mb-12">
            <h4 className="text-[10px] font-black text-amber-500 uppercase tracking-[0.4em] mb-8 text-center">Preguntas de Estudio</h4>
            <p className="text-slate-300 italic leading-relaxed text-center font-serif text-lg">
              {currentDay.study_questions}
            </p>
          </div>

          <button 
            onClick={completeDay}
            className="w-full py-7 bg-amber-600 rounded-full text-white font-black text-[11px] uppercase tracking-[0.4em] flex items-center justify-center gap-4 hover:bg-amber-500 transition-all shadow-2xl shadow-amber-900/30 group"
          >
            Completar Día {currentDay.day} <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
          </button>
        </div>
      )}

      {/* MODAL DE GRADUACIÓN (EL GRAN FINAL) */}
      {isGraduated && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-black/98 backdrop-blur-2xl animate-in zoom-in-95 duration-500">
          <div className="w-full max-w-xl bg-gradient-to-b from-slate-900 to-black rounded-[5rem] p-12 md:p-20 text-center border-2 border-amber-500/40 shadow-[0_0_100px_rgba(245,158,11,0.2)] relative overflow-hidden">
            {/* Efectos visuales de fiesta */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <PartyPopper className="absolute top-10 left-10 text-amber-500/40 rotate-12" size={40} />
                <Trophy className="absolute bottom-10 right-10 text-amber-500/40 -rotate-12" size={40} />
            </div>

            <div className="relative z-10">
                <div className="mb-10 flex justify-center">
                    <div className="p-8 bg-amber-500 rounded-full shadow-[0_0_40px_rgba(245,158,11,0.5)]">
                        <Award size={80} className="text-white" />
                    </div>
                </div>

                <h2 className="text-4xl md:text-5xl text-white font-serif italic mb-6">¡Felicidades, Discípulo!</h2>
                <p className="text-slate-400 text-lg font-light mb-12 leading-relaxed">
                    Has completado con éxito tu primer encuentro de 4 días. Tu corazón está ahora más firme en la roca que es Cristo.
                </p>

                <div className="space-y-4">
                    <button 
                        onClick={shareFinalVictory}
                        className="w-full py-6 bg-white text-black rounded-full font-black text-[11px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-amber-100 transition-all shadow-xl"
                    >
                        <Share2 size={18} /> Compartir mi Graduación
                    </button>
                    <button 
                        onClick={() => {setIsGraduated(false); setCurrentDay(null);}}
                        className="w-full py-5 text-slate-500 font-black text-[10px] uppercase tracking-widest hover:text-white transition-colors"
                    >
                        Continuar mi camino
                    </button>
                </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE COMPROMISO INTERMEDIO (DÍAS 1-3) */}
      {showCommitment && !isGraduated && currentDay && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
          <div className="w-full max-w-lg bg-slate-900 rounded-[4rem] p-14 text-center border border-white/10">
            <div className="mb-8 flex justify-center"><Star className="text-amber-500" size={50} fill="currentColor" /></div>
            <h2 className="text-3xl text-white font-serif italic mb-6">Paso Firme</h2>
            <p className="text-slate-400 text-sm mb-10 tracking-wide">Has desbloqueado el siguiente nivel de tu formación.</p>
            
            <button onClick={() => setShowCommitment(false)} className="w-full py-5 bg-amber-600 rounded-full text-white font-black text-[10px] uppercase tracking-widest hover:bg-amber-500 transition-all">
              Continuar al Día {currentDay.day + 1}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
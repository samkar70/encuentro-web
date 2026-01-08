'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Check, Lock, Star, Share2, Medal } from 'lucide-react';

export function DiscipleshipJourney() {
  const [completedDays, setCompletedDays] = useState<number[]>([1]);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [dayData, setDayData] = useState<any>(null);
  const [showPasoFirme, setShowPasoFirme] = useState(false);
  const [showGraduation, setShowGraduation] = useState(false);
  const [siteUrl, setSiteUrl] = useState('');

  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/setup').then(res => res.json()).then(data => setSiteUrl(data?.url_sitio || ''));
  }, []);

  useEffect(() => {
    if (selectedDay) {
      fetch(`/api/discipleship?day=${selectedDay}`)
        .then(res => res.json())
        .then(data => setDayData(data))
        .catch(err => console.error("Error cargando día:", err));
    }
  }, [selectedDay]);

  const handleCompleteDay = () => {
    if (selectedDay === 4) {
      setShowGraduation(true);
    } else {
      setShowPasoFirme(true);
    }
    if (selectedDay && !completedDays.includes(selectedDay + 1)) {
        setCompletedDays([...completedDays, selectedDay + 1]);
    }
  };

  const handleContinue = () => {
    setShowPasoFirme(false);
    setSelectedDay(null);
    // Regreso automático a la sección de círculos naranjas
    timelineRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleShareGraduation = async () => {
    const shareText = `🎓 ¡Felicidades! He completado mis primeros 4 días en el Camino del Discípulo. Mi corazón está firme en la roca.\n\nComienza tu camino aquí:`;
    if (navigator.share) {
      await navigator.share({ title: 'Graduación Encuentro', text: shareText, url: siteUrl });
    }
  };

  if (!selectedDay && !showPasoFirme && !showGraduation) {
    /* VISTA DE LÍNEA DE TIEMPO (Diseño image_b9bb1e.png) */
    return (
      <div id="discipleship-section" ref={timelineRef} className="max-w-4xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-amber-500/60 mb-4">Camino del Discípulo</h2>
          <h3 className="text-xl md:text-2xl font-serif text-white/40 uppercase tracking-widest">Transformación paso a paso</h3>
        </div>

        <div className="flex justify-between items-center relative max-w-2xl mx-auto">
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/10 -z-10" />
          {[1, 2, 3, 4].map((day) => (
            <div key={day} className="flex flex-col items-center gap-4">
              <button
                onClick={() => completedDays.includes(day) && setSelectedDay(day)}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500 ${
                  completedDays.includes(day) 
                    ? 'bg-amber-500 text-black shadow-[0_0_20px_rgba(245,158,11,0.4)]' 
                    : 'bg-slate-900 text-white/20 border border-white/5'
                }`}
              >
                {completedDays.includes(day) ? <Check size={20} strokeWidth={3} /> : <Lock size={18} />}
              </button>
              <span className={`text-[10px] font-black uppercase tracking-widest ${completedDays.includes(day) ? 'text-amber-500' : 'text-white/20'}`}>
                Día {day}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      
      {/* MODAL DE CONTENIDO PRINCIPAL */}
      {selectedDay && dayData && !showPasoFirme && !showGraduation && (
        <div className="bg-[#0F172A] border border-white/10 rounded-[2.5rem] w-full max-w-2xl p-8 md:p-12 relative overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
          <button onClick={() => setSelectedDay(null)} className="absolute top-8 right-8 text-white/40 hover:text-white">✕</button>
          
          <div className="flex items-center gap-3 mb-8">
             <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                <Star className="text-amber-500 w-5 h-5 fill-current" />
             </div>
             <h4 className="text-2xl md:text-4xl font-serif italic text-white">{dayData.title}</h4>
          </div>

          {/* CAJA DE ENSEÑANZA (Se eliminó duplicado de image_ba3ac3.png) */}
          <div className="bg-white/5 border border-white/5 rounded-3xl p-8 mb-10">
            <p className="text-[9px] font-black uppercase tracking-widest text-amber-500/60 mb-4">
              Palabra Clave: {dayData.verse_key}
            </p>
            <p className="text-xl font-serif italic text-white/90 leading-relaxed">
              {dayData.content}
            </p>
          </div>

          <div className="bg-black/40 rounded-3xl p-8 mb-10 border border-white/5">
              <p className="text-center text-[9px] font-black uppercase tracking-widest text-amber-500/60 mb-4">Preguntas de Estudio</p>
              <p className="text-center text-white/80 italic font-serif leading-relaxed">{dayData.study_questions}</p>
          </div>

          <button onClick={handleCompleteDay} className="w-full bg-amber-500 py-5 rounded-2xl text-black font-black uppercase tracking-widest text-xs hover:scale-[1.02] transition-transform flex items-center justify-center gap-2">
            Completar Día {selectedDay} <Check size={16} />
          </button>
        </div>
      )}

      {/* MODAL PASO FIRME */}
      {showPasoFirme && (
        <div className="bg-[#0F172A] border border-white/10 rounded-[3rem] p-16 text-center max-w-md shadow-2xl animate-in fade-in zoom-in duration-300">
          <Star className="w-16 h-16 text-amber-500 fill-current mx-auto mb-8" />
          <h2 className="text-4xl font-serif italic text-white mb-6">Paso Firme</h2>
          <p className="text-slate-400 mb-10 italic">Has desbloqueado el siguiente nivel de tu formación.</p>
          <button onClick={handleContinue} className="w-full bg-amber-500 py-5 rounded-2xl text-black font-black uppercase tracking-widest text-xs">
            Continuar al Día {selectedDay ? selectedDay + 1 : ''}
          </button>
        </div>
      )}

      {/* MODAL GRADUACIÓN */}
      {showGraduation && (
        <div className="bg-[#0F172A] border border-amber-500/30 rounded-[3.5rem] p-16 text-center max-w-md shadow-2xl animate-in fade-in zoom-in duration-300">
          <div className="w-24 h-24 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-10 shadow-[0_0_30px_rgba(245,158,11,0.5)]">
             <Medal className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-5xl font-serif italic text-white mb-6">¡Felicidades, Discípulo!</h2>
          <p className="text-slate-400 mb-12 italic leading-relaxed">Has completado con éxito tu primer encuentro de 4 días. Tu corazón está ahora más firme en la roca que es Cristo.</p>
          <button onClick={handleShareGraduation} className="w-full bg-[#FEF3C7] py-6 rounded-full text-black font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 mb-6">
            <Share2 size={16} /> Compartir mi graduación
          </button>
          <button onClick={() => {setShowGraduation(false); setSelectedDay(null);}} className="text-[9px] uppercase tracking-[0.4em] text-white/30 font-bold hover:text-white">Continuar mi camino</button>
        </div>
      )}
    </div>
  );
}
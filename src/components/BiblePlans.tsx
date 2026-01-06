'use client';

import React, { useState } from 'react';
import { Calendar, CheckCircle2, BookOpen, ChevronRight, X, Share2 } from 'lucide-react';

const PLANS = [
  { id: 'miedo', title: 'Vencer el Miedo', icon: '🛡️' },
  { id: 'ansiedad', title: 'Paz en la Tormenta', icon: '🌊' },
  { id: 'proposito', title: 'Tu Propósito Real', icon: '🎯' }
];

export function BiblePlans() {
  const [planDays, setPlanDays] = useState<any[]>([]);
  const [selectedDay, setSelectedDay] = useState<any>(null);

  const loadPlan = async (topic: string) => {
    const res = await fetch(`/api/bible/plans?topic=${topic}`);
    const data = await res.json();
    setPlanDays(data);
  };

  const handleShare = (item: any) => {
    const text = `Día de mi Plan de Lectura: "${item.reflection || item.verse_text}" — ${item.reference}`;
    if (navigator.share) navigator.share({ text }).catch(console.error);
    else { navigator.clipboard.writeText(text); alert("Copiado"); }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h2 className="text-center text-[10px] font-black uppercase tracking-[0.5em] text-amber-500/50 mb-12">Planes de Crecimiento</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {PLANS.map(p => (
          <button key={p.id} onClick={() => loadPlan(p.id)} className="bg-slate-900/40 border border-white/5 p-8 rounded-[2.5rem] hover:border-amber-500/30 transition-all text-center group">
            <span className="text-4xl block mb-4 group-hover:scale-110 transition-transform">{p.icon}</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">{p.title}</span>
          </button>
        ))}
      </div>

      {planDays.length > 0 && (
        <div className="grid gap-4 animate-in fade-in slide-in-from-bottom-4">
          {planDays.map((day, idx) => (
            <div key={idx} onClick={() => setSelectedDay(day)} className="bg-slate-900/60 border border-white/10 p-6 rounded-[2rem] flex items-center justify-between cursor-pointer hover:bg-amber-500/5">
              <div className="flex items-center gap-6">
                <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-500 font-bold">{idx + 1}</div>
                <p className="text-slate-200 font-serif italic">{day.reference}</p>
              </div>
              <ChevronRight className="text-slate-700" />
            </div>
          ))}
        </div>
      )}

      {selectedDay && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md">
          <div className="w-full max-w-xl bg-slate-900 rounded-[3rem] p-8 md:p-12 border border-white/10 relative">
            <div className="flex justify-between items-center mb-6">
               <span className="text-amber-500 text-[10px] font-black uppercase tracking-widest">Plan de Lectura</span>
               <div className="flex gap-2">
                 <button onClick={() => handleShare(selectedDay)} className="p-2 text-slate-500 hover:text-white"><Share2 size={20} /></button>
                 <button onClick={() => setSelectedDay(null)} className="p-2 text-slate-500 hover:text-white"><X /></button>
               </div>
            </div>
            <p className="text-2xl text-white font-serif italic mb-8">"{selectedDay.reflection || selectedDay.verse_text}"</p>
            <div className="p-6 bg-white/5 rounded-2xl text-slate-300 text-sm leading-relaxed max-h-[40vh] overflow-y-auto">
              {selectedDay.full_content}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
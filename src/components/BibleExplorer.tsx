'use client';

import React, { useState } from 'react';
import { Tag, Users, Sparkles, BookOpen, Volume2, X, Share2 } from 'lucide-react';

const TEMAS = ['Familia', 'Finanzas', 'Sanidad', 'Ansiedad', 'Propósito', 'Perdón'];
const PERSONAJES = ['David', 'Abraham', 'María', 'Pablo', 'Moisés', 'Noé'];

export function BibleExplorer() {
  const [results, setResults] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'temas' | 'personajes'>('temas');
  const [selectedReading, setSelectedReading] = useState<any>(null);

  const explore = async (term: string) => {
    const res = await fetch(`/api/bible/explore?t=${term}`);
    const data = await res.json();
    setResults(data);
  };

  const handleShare = (item: any) => {
    const text = `Encuentro - Reflexión sobre ${activeTab === 'temas' ? 'este tema' : 'este personaje'}: "${item.reflection || item.verse_text}" — ${item.reference}`;
    if (navigator.share) navigator.share({ text }).catch(console.error);
    else { navigator.clipboard.writeText(text); alert("Copiado"); }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex justify-center gap-8 mb-10 border-b border-white/5 pb-6">
        <button onClick={() => setActiveTab('temas')} className={`flex items-center gap-2 text-[10px] font-black tracking-[0.2em] uppercase transition-all ${activeTab === 'temas' ? 'text-amber-500 scale-110' : 'text-slate-600'}`}>
          <Tag size={14} /> Mapa de Temas
        </button>
        <button onClick={() => setActiveTab('personajes')} className={`flex items-center gap-2 text-[10px] font-black tracking-[0.2em] uppercase transition-all ${activeTab === 'personajes' ? 'text-amber-500 scale-110' : 'text-slate-600'}`}>
          <Users size={14} /> Personajes
        </button>
      </div>

      <div className="flex flex-wrap justify-center gap-3 mb-16">
        {(activeTab === 'temas' ? TEMAS : PERSONAJES).map(item => (
          <button key={item} onClick={() => explore(item)} className="px-6 py-3 rounded-full bg-slate-900/60 border border-slate-800 text-slate-300 text-xs hover:border-amber-500/40 hover:text-white transition-all active:scale-95">
            {item}
          </button>
        ))}
      </div>

      <div className="grid gap-8">
        {results.map((item, idx) => (
          <div key={idx} className="bg-slate-900/40 border border-white/5 p-8 rounded-[3rem] animate-fadeIn">
            <div className="flex justify-between items-center mb-6">
              <span className="text-amber-500 font-bold text-[10px] uppercase tracking-widest">{item.reference}</span>
              <div className="flex gap-2">
                <button onClick={() => handleShare(item)} className="p-2.5 text-slate-500 hover:text-white"><Share2 size={16} /></button>
                <div className="flex items-center gap-2 text-amber-500/50">
                  <Sparkles size={12} /> <span className="text-[9px] font-black uppercase">Reflexión</span>
                </div>
              </div>
            </div>
            <p className="text-xl md:text-2xl text-slate-100 font-serif italic mb-8 leading-relaxed">"{item.reflection || item.verse_text}"</p>
            <button onClick={() => setSelectedReading(item)} className="text-[10px] text-amber-500 font-black uppercase tracking-widest hover:underline flex items-center gap-2">
              <BookOpen size={14} /> Ver capítulo completo
            </button>
          </div>
        ))}
      </div>

      {selectedReading && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md">
          <div className="w-full max-w-2xl max-h-[85vh] bg-slate-900 rounded-[3rem] overflow-hidden flex flex-col border border-white/10 shadow-2xl">
            <div className="p-8 border-b border-white/5 flex justify-between items-center">
              <h3 className="text-white text-xl font-serif italic">{selectedReading.reference}</h3>
              <button onClick={() => setSelectedReading(null)} className="p-3 bg-white/5 rounded-full text-slate-400"><X size={20} /></button>
            </div>
            <div className="p-8 md:p-12 overflow-y-auto text-slate-300 text-lg leading-relaxed whitespace-pre-line font-light">
               <div className="mb-8 p-6 bg-white/5 rounded-2xl italic text-xl">"{selectedReading.verse_text}"</div>
               {selectedReading.full_content}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
'use client';

import React, { useState, useEffect } from 'react';
import { Volume2, Heart, Sparkles, BookOpen, X, Square, Share2 } from 'lucide-react';

export function DailyVerse() {
  const [verse, setVerse] = useState<any>(null);
  const [selectedReading, setSelectedReading] = useState<any>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    fetch('/api/bible/daily')
      .then(res => res.json())
      .then(data => { if (data.success) setVerse(data); });
  }, []);

  const handleShare = () => {
    if (!verse) return;
    const text = `Nuestra Reflexión Diaria: "${verse.reflection || verse.verse_text}" — ${verse.reference} (Vía Encuentro)`;
    if (navigator.share) {
      navigator.share({ title: 'Encuentro', text }).catch(console.error);
    } else {
      navigator.clipboard.writeText(text);
      alert("Copiado al portapapeles");
    }
  };

  const speak = (text: string) => {
    if (window.speechSynthesis.speaking) { window.speechSynthesis.cancel(); setIsSpeaking(false); return; }
    const ut = new SpeechSynthesisUtterance(text);
    ut.lang = 'es-MX';
    ut.onstart = () => setIsSpeaking(true);
    ut.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(ut);
  };

  if (!verse) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 mb-16 animate-in fade-in duration-1000">
      <div className="bg-gradient-to-br from-amber-500/10 via-slate-900/40 to-slate-900/60 border border-amber-500/20 p-8 md:p-12 rounded-[3.5rem] shadow-2xl relative overflow-hidden text-center flex flex-col items-center">
        <div className="flex items-center gap-2 mb-6 bg-amber-500/10 px-4 py-1.5 rounded-full border border-amber-500/20">
          <Sparkles size={14} className="text-amber-500" />
          <span className="text-[10px] font-black text-amber-500 uppercase tracking-[0.3em]">Nuestra Reflexión Diaria</span>
        </div>

        <p className="text-2xl md:text-4xl text-white font-serif italic mb-8 leading-tight">
          "{verse.reflection || verse.verse_text}"
        </p>
        
        <div className="flex flex-col items-center gap-4">
          <span className="text-amber-500/60 font-bold text-[10px] uppercase tracking-widest">{verse.reference}</span>
          <div className="flex gap-4">
            <button onClick={() => speak(verse.verse_text)} className="p-4 rounded-full bg-white/5 border border-white/10 text-slate-400 hover:text-white"><Volume2 size={20} /></button>
            {/* Botón Compartir */}
            <button onClick={handleShare} className="p-4 rounded-full bg-white/5 border border-white/10 text-slate-400 hover:text-white"><Share2 size={20} /></button>
            <button onClick={() => setSelectedReading(verse)} className="px-8 py-4 rounded-full bg-amber-600 text-white font-black text-[10px] uppercase tracking-widest hover:bg-amber-500 transition-all flex items-center gap-2">
              <BookOpen size={14} /> Leer más
            </button>
          </div>
        </div>
      </div>

      {selectedReading && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md">
          <div className="w-full max-w-2xl max-h-[85vh] bg-slate-900 rounded-[3rem] overflow-hidden flex flex-col border border-white/10 shadow-2xl">
            <div className="p-8 border-b border-white/5 flex justify-between items-center bg-slate-900/50">
              <h3 className="text-white text-xl font-serif italic">{selectedReading.reference}</h3>
              <button onClick={() => setSelectedReading(null)} className="p-3 bg-white/5 rounded-full text-slate-400"><X size={20} /></button>
            </div>
            <div className="p-8 md:p-12 overflow-y-auto text-slate-300 text-lg leading-relaxed whitespace-pre-line font-light custom-scrollbar">
               <div className="mb-10 p-8 bg-amber-500/5 rounded-[2rem] border border-amber-500/10 italic text-xl text-white">
                 "{selectedReading.verse_text}"
               </div>
               {selectedReading.full_content}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
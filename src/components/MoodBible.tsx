'use client';

import React, { useState, useEffect } from 'react';
import { Volume2, Heart, Wind, Shield, Zap, Sun, X, Square, BookOpen, Sparkles } from 'lucide-react';

const THEMES = [
  { id: 'paz', label: 'PAZ', color: 'from-cyan-600 to-blue-700', icon: Wind },
  { id: 'fortaleza', label: 'FORTALEZA', color: 'from-orange-600 to-red-700', icon: Shield },
  { id: 'sabiduria', label: 'SABIDURÍA', color: 'from-amber-500 to-yellow-600', icon: Zap },
  { id: 'esperanza', label: 'ESPERANZA', color: 'from-purple-600 to-indigo-700', icon: Sun }
];

export function MoodBible() {
  const [verse, setVerse] = useState<any>(null);
  const [selectedReading, setSelectedReading] = useState<any>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [favorites, setFavorites] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('encuentro-favs');
    if (saved) setFavorites(JSON.parse(saved));
  }, []);

  const toggleFavorite = (item: any) => {
    const isFav = favorites.some(f => f.id === item.id);
    const newFavs = isFav ? favorites.filter(f => f.id !== item.id) : [...favorites, item];
    setFavorites(newFavs);
    localStorage.setItem('encuentro-favs', JSON.stringify(newFavs));
    window.dispatchEvent(new Event('favorites-updated'));
  };

  const fetchMood = async (m: string) => {
    setVerse(null);
    try {
      const res = await fetch(`/api/bible/mood?m=${m}`);
      const data = await res.json();
      if (data && data.success) setVerse(data);
    } catch (e) { console.error(e); }
  };

  const speak = (text: string) => {
    if (window.speechSynthesis.speaking) { window.speechSynthesis.cancel(); setIsSpeaking(false); return; }
    const ut = new SpeechSynthesisUtterance(text);
    ut.lang = 'es-MX';
    ut.onstart = () => setIsSpeaking(true);
    ut.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(ut);
  };

  return (
    <div className="py-10 max-w-4xl mx-auto px-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {THEMES.map(t => (
          <button key={t.id} onClick={() => fetchMood(t.id)} className={`p-6 rounded-[2.5rem] bg-slate-900/40 border-2 border-slate-800 hover:bg-gradient-to-br ${t.color} group transition-all`}>
            <t.icon className="w-8 h-8 mb-3 text-slate-600 group-hover:text-white mx-auto" />
            <span className="block text-[10px] font-black text-slate-400 group-hover:text-white uppercase tracking-widest text-center">{t.label}</span>
          </button>
        ))}
      </div>

      {verse && (
        <div className="bg-slate-900/60 p-8 md:p-12 rounded-[3.5rem] border border-white/5 animate-in fade-in slide-in-from-bottom-4 shadow-2xl relative overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <span className="text-amber-500 font-bold text-[10px] uppercase tracking-widest">{verse.reference}</span>
            <div className="flex gap-2">
              <button onClick={() => toggleFavorite(verse)} className={`p-3 rounded-full border ${favorites.some(f => f.id === verse.id) ? 'text-red-500 bg-red-500/10' : 'text-slate-500 border-white/10'}`}>
                <Heart size={18} fill={favorites.some(f => f.id === verse.id) ? "currentColor" : "none"} />
              </button>
              <button onClick={() => speak(verse.verse_text)} className="p-3 rounded-full border border-white/10 text-slate-500 hover:text-white"><Volume2 size={18} /></button>
            </div>
          </div>

          {/* ETIQUETA DE REFLEXIÓN */}
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={14} className="text-amber-500/50" />
            <span className="text-[10px] font-black text-amber-500/50 uppercase tracking-[0.4em]">Nuestra Reflexión</span>
          </div>

          <p className="text-2xl md:text-4xl text-slate-100 font-serif italic mb-10 leading-relaxed">
            "{verse.reflection || verse.verse_text}"
          </p>

          <button onClick={() => setSelectedReading(verse)} className="text-[10px] text-amber-500 font-black uppercase tracking-widest hover:text-amber-400 transition-all flex items-center gap-2">
            <BookOpen size={14} /> Ver capítulo completo
          </button>
        </div>
      )}

      {selectedReading && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md">
          <div className="w-full max-w-2xl max-h-[85vh] bg-slate-900 rounded-[3rem] overflow-hidden flex flex-col border border-white/10 shadow-2xl animate-in zoom-in-95">
            <div className="p-8 border-b border-white/5 flex justify-between items-center bg-slate-900/50">
              <h3 className="text-white text-xl font-serif italic">{selectedReading.reference}</h3>
              <div className="flex gap-2">
                <button onClick={() => speak(selectedReading.full_content)} className={`p-3 rounded-full transition-all ${isSpeaking ? 'bg-red-500/20 text-red-500' : 'bg-amber-500/20 text-amber-500'}`}>{isSpeaking ? <Square size={20} /> : <Volume2 size={20} />}</button>
                <button onClick={() => setSelectedReading(null)} className="p-3 bg-white/5 rounded-full text-slate-400 hover:text-white"><X size={20} /></button>
              </div>
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
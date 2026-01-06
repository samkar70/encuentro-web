'use client';

import React, { useState, useEffect } from 'react';
import { Search, Mic, Heart, Volume2, X, Square, BookOpen, Sparkles, Loader2 } from 'lucide-react';

export function BibleSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [selectedReading, setSelectedReading] = useState<any>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

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

  const executeSearch = async (term: string) => {
    if (term.length < 3) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/bible/search?q=${term}`);
      const data = await res.json();
      setResults(data);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const handleVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return alert('Voz no soportada');
    const recognition = new SpeechRecognition();
    recognition.lang = 'es-ES';
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setQuery(transcript);
      executeSearch(transcript);
    };
    recognition.start();
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
    <div className="max-w-4xl mx-auto px-4">
      <div className="relative mb-12">
        <input 
          type="text" value={query} onChange={(e) => setQuery(e.target.value)} 
          onKeyPress={(e) => e.key === 'Enter' && executeSearch(query)}
          placeholder="Busca una reflexión..." 
          className="w-full bg-slate-900/60 border-2 border-slate-800 rounded-3xl py-5 px-8 text-white outline-none focus:border-amber-500/30" 
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2">
          <button onClick={handleVoiceInput} className={`p-3 rounded-2xl ${isListening ? 'bg-red-500 animate-pulse text-white' : 'bg-slate-800 text-slate-400'}`}><Mic size={20} /></button>
          <button onClick={() => executeSearch(query)} className="p-3 bg-amber-600 rounded-2xl text-white">
            {loading ? <Loader2 size={20} className="animate-spin" /> : <Search size={20} />}
          </button>
        </div>
      </div>

      <div className="grid gap-8">
        {results.map((item, idx) => (
          <div key={idx} className="bg-slate-900/40 border border-white/5 p-8 md:p-10 rounded-[3rem] shadow-2xl animate-fadeIn">
            <div className="flex justify-between items-center mb-6">
              <span className="text-amber-500 font-bold text-[10px] tracking-[0.2em] uppercase">{item.reference}</span>
              <div className="flex gap-2">
                <button onClick={() => toggleFavorite(item)} className={`p-2.5 rounded-full border border-slate-800 ${favorites.some(f => f.id === item.id) ? 'text-red-500 bg-red-500/10' : 'text-slate-500'}`}>
                  <Heart size={16} fill={favorites.some(f => f.id === item.id) ? "currentColor" : "none"} />
                </button>
                <button onClick={() => speak(item.verse_text)} className="p-2.5 rounded-full border border-slate-800 text-slate-500"><Volume2 size={16} /></button>
              </div>
            </div>

            {/* ETIQUETA DE REFLEXIÓN */}
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={12} className="text-amber-500/60" />
              <span className="text-[9px] font-black text-amber-500/60 uppercase tracking-[0.3em]">Nuestra Reflexión</span>
            </div>

            <p className="text-2xl md:text-3xl text-slate-100 font-serif italic mb-10 leading-relaxed cursor-pointer" onClick={() => setSelectedReading(item)}>
              "{item.reflection || item.verse_text}"
            </p>

            <div className="flex justify-between items-center pt-8 border-t border-white/5">
                <div className="flex items-center gap-2 text-[10px] text-slate-600 font-bold uppercase tracking-widest"><BookOpen size={12}/> {item.book_name}</div>
                <button onClick={() => setSelectedReading(item)} className="text-[10px] text-amber-500 font-black uppercase tracking-widest hover:underline">Estudio Completo</button>
            </div>
          </div>
        ))}
      </div>

      {selectedReading && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md">
          <div className="w-full max-w-2xl max-h-[85vh] bg-slate-900 rounded-[3.5rem] overflow-hidden flex flex-col border border-white/10 shadow-2xl animate-in zoom-in-95">
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
'use client';

import React, { useState, useEffect } from 'react';
import { Search, BookOpen, X, Sparkles, ScrollText, Volume2, Square } from 'lucide-react';

// IMPORTANTE: El nombre debe ser BibleSearch y debe tener 'export'
export function BibleSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedReading, setSelectedReading] = useState<any>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Función de Audio
  const speakText = (text: string) => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      if (isSpeaking) return; // Si era para detenerse, paramos aquí
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-MX';
    utterance.rate = 0.9;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (query.length < 3) return;
    
    setLoading(true);
    try {
      const res = await fetch(`/api/bible/search?q=${query}`);
      const data = await res.json();
      setResults(data);
    } catch (error) {
      console.error("Error en búsqueda:", error);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 mb-16">
      {/* Buscador */}
      <form onSubmit={handleSearch} className="relative mb-8 group">
        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500">
          <Search size={18} />
        </div>
        <input 
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Busca: 'Paz', 'Raquel', 'Amor'..."
          className="w-full bg-slate-900/50 border border-white/10 rounded-[2rem] py-4 pl-12 pr-14 outline-none focus:border-amber-500/40 text-white transition-all shadow-2xl"
        />
        {query && (
          <button type="button" onClick={clearSearch} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-slate-500 hover:text-white">
            <X size={18} />
          </button>
        )}
      </form>

      {/* Resultados */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {results.map((item, idx) => (
          <div key={idx} className="bg-gradient-to-br from-slate-900/60 to-slate-900/20 border border-white/5 p-6 rounded-[2.5rem] hover:border-amber-500/30 transition-all">
            <div className="flex justify-between items-start mb-4">
              <span className="bg-amber-500/10 text-amber-500 text-[9px] px-3 py-1 rounded-full font-black uppercase tracking-widest">
                {item.reference}
              </span>
              <button 
                onClick={() => speakText(`${item.reference}. ${item.verse_text}`)}
                className="p-2 bg-amber-500/10 rounded-full text-amber-500 hover:bg-amber-500/30"
              >
                <Volume2 size={14} />
              </button>
            </div>
            <p className="text-slate-200 font-serif italic text-base leading-relaxed mb-4">"{item.verse_text}"</p>
            <div className="flex items-center justify-between pt-4 border-t border-white/5">
              <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase">
                <BookOpen size={12} /> {item.book_name}
              </div>
              <button onClick={() => setSelectedReading(item)} className="text-[10px] text-amber-500/60 font-black uppercase hover:text-amber-500">
                Leer más
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de Lectura Completa */}
      {selectedReading && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
          <div className="relative w-full max-w-2xl max-h-[85vh] bg-slate-900 border border-white/10 rounded-[3rem] shadow-2xl overflow-hidden flex flex-col">
            <div className="p-8 border-b border-white/5 flex justify-between items-center bg-slate-900/50">
              <div>
                <h3 className="text-amber-500 text-[10px] font-black uppercase tracking-widest">{selectedReading.book_name}</h3>
                <p className="text-white text-xl font-serif italic">{selectedReading.reference}</p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => speakText(selectedReading.full_content)}
                  className={`p-3 rounded-full transition-all ${isSpeaking ? 'bg-red-500/20 text-red-500' : 'bg-amber-500/20 text-amber-500'}`}
                >
                  {isSpeaking ? <Square size={20} /> : <Volume2 size={20} />}
                </button>
                <button onClick={() => setSelectedReading(null)} className="p-3 bg-white/5 hover:bg-white/10 rounded-full text-slate-400">
                  <X size={20} />
                </button>
              </div>
            </div>
            <div className="p-8 md:p-12 overflow-y-auto text-slate-300 text-lg leading-[1.8] font-light">
              {selectedReading.full_content}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
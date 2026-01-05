'use client';

import React, { useState } from 'react';
import { Search, BookOpen, X, Sparkles } from 'lucide-react';

export function BibleSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

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
      {/* Formulario de Búsqueda Optimizado */}
      <form onSubmit={handleSearch} className="relative mb-8 group">
        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500">
          <Search size={18} />
        </div>
        <input 
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Busca: 'Paz', 'Hijos', 'Miedo'..."
          className="w-full bg-slate-900/50 border border-white/10 rounded-[2rem] py-4 pl-12 pr-14 outline-none focus:border-amber-500/40 focus:bg-slate-900/80 transition-all text-base font-light placeholder:text-slate-600 shadow-2xl"
        />
        {query && (
          <button 
            type="button"
            onClick={clearSearch}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-slate-500 hover:text-white"
          >
            <X size={18} />
          </button>
        )}
      </form>

      {/* Grid de Resultados Adaptable */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {results.map((item, idx) => (
          <div 
            key={idx} 
            className="bg-gradient-to-br from-slate-900/60 to-slate-900/20 border border-white/5 p-6 rounded-[2.5rem] hover:border-amber-500/30 transition-all group active:scale-[0.98]"
          >
            <div className="flex justify-between items-start mb-4">
              <span className="bg-amber-500/10 text-amber-500 text-[9px] px-3 py-1 rounded-full font-black uppercase tracking-widest">
                {item.reference}
              </span>
              <Sparkles size={14} className="text-amber-500/20 group-hover:text-amber-500/50 transition-colors" />
            </div>
            
            <p className="text-slate-200 font-serif italic text-base leading-relaxed mb-4">
              "{item.verse_text}"
            </p>

            <div className="flex items-center justify-between pt-4 border-t border-white/5">
              <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase">
                <BookOpen size={12} /> {item.book_name}
              </div>
              <button className="text-[10px] text-amber-500/60 font-black uppercase hover:text-amber-500">
                Leer más
              </button>
            </div>
          </div>
        ))}
      </div>

      {loading && (
        <div className="text-center py-10">
          <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-amber-500 border-r-transparent"></div>
        </div>
      )}

      {!loading && results.length === 0 && query.length >= 3 && (
        <p className="text-center text-slate-600 text-xs uppercase font-bold tracking-widest">
          No se encontraron promesas con esa palabra
        </p>
      )}
    </div>
  );
}
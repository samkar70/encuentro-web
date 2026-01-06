'use client';

import React, { useState, useEffect } from 'react';
import { Heart, X, Volume2, Share2, Trash2, BookOpen } from 'lucide-react';

export function FavoritesPanel() {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const loadFavorites = () => {
    const saved = localStorage.getItem('encuentro-favs');
    if (saved) setFavorites(JSON.parse(saved));
  };

  useEffect(() => {
    loadFavorites();
    // Escuchar el evento personalizado para actualizar la lista al instante
    window.addEventListener('favorites-updated', loadFavorites);
    return () => window.removeEventListener('favorites-updated', loadFavorites);
  }, []);

  const removeFavorite = (id: number) => {
    const updated = favorites.filter(f => f.id !== id);
    localStorage.setItem('encuentro-favs', JSON.stringify(updated));
    setFavorites(updated);
    // Avisar a los demás componentes que algo cambió
    window.dispatchEvent(new Event('favorites-updated'));
  };

  const handleShare = (item: any) => {
    const text = `"${item.verse_text}" — ${item.reference}`;
    if (navigator.share) navigator.share({ text });
  };

  const speak = (text: string) => {
    window.speechSynthesis.cancel();
    const ut = new SpeechSynthesisUtterance(text);
    ut.lang = 'es-MX';
    window.speechSynthesis.speak(ut);
  };

  return (
    <>
      {/* Botón Flotante Estilo Pan de Vida */}
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 z-[90] flex items-center gap-3 px-6 py-4 rounded-full bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-2xl hover:scale-110 transition-all active:scale-95 group border border-white/10"
      >
        <Heart size={20} fill="white" className="group-hover:animate-pulse" />
        <span className="font-black text-[10px] tracking-widest uppercase">Mis Tesoros ({favorites.length})</span>
      </button>

      {/* Sidebar de Favoritos */}
      {isOpen && (
        <div className="fixed inset-0 z-[120] flex justify-end animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
          
          <div className="relative w-full max-w-md bg-slate-950 h-full shadow-2xl flex flex-col border-l border-white/10 animate-in slide-in-from-right duration-500">
            <div className="p-8 border-b border-white/5 flex justify-between items-center bg-slate-900/50">
              <div className="flex items-center gap-3">
                <Heart className="text-amber-500" fill="currentColor" size={20} />
                <h2 className="text-2xl font-serif text-white">Mis Tesoros</h2>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/5 rounded-full text-slate-500"><X /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
              {favorites.length > 0 ? (
                favorites.map((v) => (
                  <div key={v.id} className="bg-slate-900/60 border border-white/5 p-6 rounded-3xl group relative hover:border-amber-500/30 transition-all">
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-amber-500 text-[9px] font-black uppercase tracking-widest">{v.reference}</span>
                      <div className="flex gap-2">
                        <button onClick={() => speak(v.verse_text)} className="p-2 text-slate-500 hover:text-white"><Volume2 size={16}/></button>
                        <button onClick={() => handleShare(v)} className="p-2 text-slate-500 hover:text-white"><Share2 size={16}/></button>
                        <button onClick={() => removeFavorite(v.id)} className="p-2 text-slate-500 hover:text-red-500"><Trash2 size={16}/></button>
                      </div>
                    </div>
                    <p className="text-slate-200 italic font-serif text-lg leading-relaxed">"{v.verse_text}"</p>
                  </div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center px-10">
                  <Heart size={48} className="text-slate-800 mb-4" />
                  <p className="text-slate-600 italic font-serif">Aún no has guardado ninguna palabra en tu corazón.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
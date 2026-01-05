'use client';

import React, { useState } from 'react';
import { Sparkles, Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AdminBible() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    mood: '',
    title: '',
    verse_text: '',
    reference: '',
    full_content: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Nota: Aquí llamarías a una Server Action o API Route para guardar en Turso
      const res = await fetch('/api/admin/bible', {
        method: 'POST',
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("¡Palabra guardada con éxito en Turso!");
        setFormData({ mood: '', title: '', verse_text: '', reference: '', full_content: '' });
      }
    } catch (err) {
      alert("Error al guardar. Revisa la conexión.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/admin" className="text-slate-500 hover:text-white flex items-center gap-2 mb-8 text-xs uppercase font-black tracking-widest transition-colors">
          <ArrowLeft size={16} /> Volver al Panel
        </Link>

        <header className="mb-12">
          <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">
            Gestión de <span className="text-amber-500">Tesoros Bíblicos</span>
          </h1>
          <p className="text-slate-500 text-sm">Agrega nuevos sentimientos y versículos para la web de Karla.</p>
        </header>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-900/50 p-10 rounded-[2.5rem] border border-white/5 shadow-2xl">
          <div className="space-y-6">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-amber-500/50 mb-3">Sentimiento (Botón)</label>
              <input 
                required
                className="w-full bg-slate-950 border border-white/10 rounded-2xl p-4 focus:border-amber-500/50 outline-none transition-all"
                placeholder="Ej: Duelo, Alegría, Confusión"
                value={formData.mood}
                onChange={(e) => setFormData({...formData, mood: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-amber-500/50 mb-3">Título del Libro</label>
              <input 
                required
                className="w-full bg-slate-950 border border-white/10 rounded-2xl p-4 focus:border-amber-500/50 outline-none transition-all"
                placeholder="Ej: Salmos 23"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-amber-500/50 mb-3">Cita de Referencia</label>
              <input 
                required
                className="w-full bg-slate-950 border border-white/10 rounded-2xl p-4 focus:border-amber-500/50 outline-none transition-all"
                placeholder="Ej: Salmos 23:1"
                value={formData.reference}
                onChange={(e) => setFormData({...formData, reference: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-amber-500/50 mb-3">Versículo Principal (Resumen)</label>
              <textarea 
                required
                className="w-full bg-slate-950 border border-white/10 rounded-2xl p-4 h-32 focus:border-amber-500/50 outline-none transition-all resize-none"
                placeholder="El texto que aparece al dar clic..."
                value={formData.verse_text}
                onChange={(e) => setFormData({...formData, verse_text: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-amber-500/50 mb-3">Capítulo Completo (HTML)</label>
              <textarea 
                required
                className="w-full bg-slate-950 border border-white/10 rounded-2xl p-4 h-44 focus:border-amber-500/50 outline-none transition-all resize-none font-mono text-xs"
                placeholder="<p>Versículo 1...</p><p>Versículo 2...</p>"
                value={formData.full_content}
                onChange={(e) => setFormData({...formData, full_content: e.target.value})}
              />
            </div>
          </div>

          <button 
            disabled={loading}
            className="md:col-span-2 mt-4 bg-amber-500 hover:bg-amber-400 text-black font-black py-5 rounded-2xl uppercase tracking-widest flex items-center justify-center gap-3 transition-all disabled:opacity-50"
          >
            {loading ? <Sparkles className="animate-spin" /> : <Save size={20} />}
            {loading ? 'Guardando en Turso...' : 'Publicar Tesoro Bíblico'}
          </button>
        </form>
      </div>
    </div>
  );
}
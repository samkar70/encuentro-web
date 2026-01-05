'use client';

import React, { useState } from 'react';
import { Video, Save, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';

export default function AdminVideos() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Mensaje',
    url: '',
    thumbnail: '',
    artist: 'Karla Perdomo'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/admin/videos', {
        method: 'POST',
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        alert("¡Video publicado con éxito!");
        setFormData({ title: '', category: 'Mensaje', url: '', thumbnail: '', artist: 'Karla Perdomo' });
      }
    } catch (err) {
      alert("Error al conectar con Turso");
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
          <h1 className="text-4xl font-black uppercase tracking-tighter">
            Gestión de <span className="text-blue-500">Galería de Videos</span>
          </h1>
        </header>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-slate-900/50 p-10 rounded-[2.5rem] border border-white/5">
          <div className="space-y-6">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-blue-500/50 mb-2">Título del Video</label>
              <input 
                required
                className="w-full bg-slate-950 border border-white/10 rounded-2xl p-4 outline-none focus:border-blue-500/50 transition-all"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-blue-500/50 mb-2">Categoría</label>
              <select 
                className="w-full bg-slate-950 border border-white/10 rounded-2xl p-4 outline-none focus:border-blue-500/50"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              >
                <option value="Mensaje">Mensaje</option>
                <option value="Entrevista">Entrevista</option>
                <option value="Podcast">Podcast</option>
              </select>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-blue-500/50 mb-2">URL de YouTube / Vimeo</label>
              <input 
                required
                className="w-full bg-slate-950 border border-white/10 rounded-2xl p-4 outline-none focus:border-blue-500/50"
                placeholder="https://youtube.com/watch?v=..."
                value={formData.url}
                onChange={(e) => setFormData({...formData, url: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-blue-500/50 mb-2">URL de la Miniatura (Imagen)</label>
              <input 
                required
                className="w-full bg-slate-950 border border-white/10 rounded-2xl p-4 outline-none focus:border-blue-500/50"
                value={formData.thumbnail}
                onChange={(e) => setFormData({...formData, thumbnail: e.target.value})}
              />
            </div>
          </div>

          <button 
            disabled={loading}
            className="md:col-span-2 bg-blue-600 hover:bg-blue-500 text-white font-black py-5 rounded-2xl uppercase tracking-widest flex items-center justify-center gap-3 transition-all"
          >
            {loading ? <Video className="animate-spin" /> : <Save size={20} />}
            {loading ? 'Subiendo a Turso...' : 'Guardar Video en Galería'}
          </button>
        </form>
      </div>
    </div>
  );
}
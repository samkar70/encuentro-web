'use client';

import React, { useState, useEffect } from 'react';
import { addVideoAction, deleteVideoAction } from './actions';
import { getVideos } from '@/lib/db'; // Asegúrate de tener esta función exportada en lib/db.ts
import { Trash2, PlusCircle } from 'lucide-react';

export default function AdminPage() {
  const [videos, setVideos] = useState<any[]>([]);
  const [status, setStatus] = useState({success: false, message: ''});
  const [loading, setLoading] = useState(false);

  // Función para cargar la lista de videos
  const loadVideos = async () => {
    const data = await getVideos();
    setVideos(data);
  };

  useEffect(() => { loadVideos(); }, []);

  async function handleAdd(formData: FormData) {
    setLoading(true);
    const result = await addVideoAction(formData);
    if (result.success) {
      loadVideos();
      (document.getElementById('video-form') as HTMLFormElement).reset();
    }
    setStatus(result);
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (confirm('¿Estás seguro de eliminar este video del ministerio?')) {
      const result = await deleteVideoAction(id);
      if (result.success) loadVideos();
      alert(result.message);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-12">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* Lado Izquierdo: Formulario */}
        <div className="bg-slate-900 p-8 rounded-3xl border border-white/10 shadow-2xl h-fit">
          <h2 className="text-xl font-black text-amber-500 mb-6 flex items-center gap-2">
            <PlusCircle /> NUEVO VIDEO
          </h2>
          <form id="video-form" action={handleAdd} className="space-y-4">
            <input name="title" required className="w-full bg-slate-800 rounded-xl p-4 text-sm outline-none focus:ring-2 focus:ring-amber-500" placeholder="Título del video" />
            <select name="category" className="w-full bg-slate-800 rounded-xl p-4 text-sm outline-none">
              <option value="Entrevistas">🎙️ Entrevistas</option>
              <option value="Short">📱 Shorts</option>
              <option value="Musica">🎵 Alabanzas</option>
            </select>
            <input name="url" required className="w-full bg-slate-800 rounded-xl p-4 text-sm outline-none focus:ring-2 focus:ring-amber-500" placeholder="Link de YouTube" />
            <button disabled={loading} className="w-full bg-amber-500 text-black font-black py-4 rounded-xl hover:bg-amber-400 transition-all">
              {loading ? 'PUBLICANDO...' : 'PUBLICAR AHORA'}
            </button>
          </form>
        </div>

        {/* Lado Derecho: Lista de Gestión */}
        <div className="space-y-4">
          <h2 className="text-xl font-black text-slate-400 mb-6 uppercase tracking-widest">
            Gestionar Contenido ({videos.length})
          </h2>
          <div className="max-h-[600px] overflow-y-auto pr-2 space-y-3 custom-scrollbar">
            {videos.map((v) => (
              <div key={v.id} className="bg-slate-900/50 border border-white/5 p-4 rounded-2xl flex items-center justify-between group hover:border-red-500/30 transition-all">
                <div className="flex items-center gap-4">
                  <img src={v.thumbnail} className="w-16 h-10 object-cover rounded-lg" />
                  <div>
                    <p className="text-sm font-bold line-clamp-1">{v.title}</p>
                    <p className="text-[10px] text-amber-500 uppercase font-black">{v.category}</p>
                  </div>
                </div>
                <button 
                  onClick={() => handleDelete(v.id.toString())}
                  className="p-3 text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
'use client';

import React, { useState } from 'react';
import { addVideoAction } from './actions';

export default function AdminPage() {
  const [status, setStatus] = useState<{success?: boolean, message?: string}>({});
  const [loading, setLoading] = useState(false);

  async function clientAction(formData: FormData) {
    setLoading(true);
    const result = await addVideoAction(formData);
    setStatus(result);
    setLoading(false);
    
    if (result.success) {
      // Limpiar el formulario si todo salió bien
      (document.getElementById('video-form') as HTMLFormElement).reset();
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8 flex flex-col items-center">
      <div className="w-full max-w-md bg-slate-900 p-8 rounded-3xl border border-white/10 shadow-2xl">
        <h1 className="text-2xl font-black text-amber-500 mb-6 uppercase tracking-tight">
          Publicar Nuevo Contenido
        </h1>
        
        <form id="video-form" action={clientAction} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">Título</label>
            <input name="title" required className="w-full bg-slate-800 border-none rounded-xl p-4 text-sm focus:ring-2 focus:ring-amber-500 outline-none" placeholder="Ej: No es con mis fuerzas" />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">Categoría</label>
            <select name="category" className="w-full bg-slate-800 border-none rounded-xl p-4 text-sm outline-none appearance-none cursor-pointer">
              <option value="Entrevistas">🎙️ Entrevistas</option>
              <option value="Short">📱 Shorts de Bendición</option>
              <option value="Musica">🎵 Alabanzas</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">Link de YouTube</label>
            <input name="url" type="url" required className="w-full bg-slate-800 border-none rounded-xl p-4 text-sm focus:ring-2 focus:ring-amber-500 outline-none" placeholder="https://www.youtube.com/watch?v=..." />
          </div>

          <button 
            disabled={loading}
            type="submit" 
            className={`w-full font-black py-4 rounded-xl transition-all active:scale-95 ${loading ? 'bg-slate-700 text-slate-400' : 'bg-amber-500 text-black hover:bg-amber-400'}`}
          >
            {loading ? 'PUBLICANDO...' : 'SUBIR A LA WEB'}
          </button>
        </form>

        {status.message && (
          <p className={`mt-6 text-center text-sm font-bold animate-in fade-in slide-in-from-top-2 ${status.success ? 'text-green-400' : 'text-red-400'}`}>
            {status.message}
          </p>
        )}
      </div>
    </div>
  );
}
'use client';

import React, { useState } from 'react';
import { db } from '@/lib/db'; // Asegúrate de que db esté exportado

export default function AdminPage() {
  const [status, setStatus] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    // Aquí conectaríamos con una Server Action para insertar en Turso
    setStatus('Procesando video para el ministerio...');
    
    // Simulación de guardado exitoso
    setTimeout(() => setStatus('✅ ¡Video de Karla subido con éxito!'), 2000);
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8 flex flex-col items-center">
      <div className="w-full max-w-md bg-slate-900 p-8 rounded-3xl border border-white/10 shadow-2xl">
        <h1 className="text-2xl font-black text-amber-500 mb-6 uppercase tracking-tight">
          Panel de Control
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">Título del Video</label>
            <input name="title" required className="w-full bg-slate-800 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-amber-500 outline-none" placeholder="Ej: Dios es quien te llama" />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">Categoría</label>
            <select name="category" className="w-full bg-slate-800 border-none rounded-xl p-3 text-sm outline-none">
              <option value="Entrevistas">🎙️ Entrevistas</option>
              <option value="Short">📱 Shorts</option>
              <option value="Musica">🎵 Alabanzas</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">URL de YouTube</label>
            <input name="url" required className="w-full bg-slate-800 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-amber-500 outline-none" placeholder="https://youtube.com/watch?v=..." />
          </div>

          <button type="submit" className="w-full bg-amber-600 hover:bg-amber-500 text-black font-black py-4 rounded-xl transition-all active:scale-95">
            PUBLICAR EN LA WEB
          </button>
        </form>

        {status && <p className="mt-6 text-center text-sm font-medium text-amber-200 animate-pulse">{status}</p>}
      </div>
    </div>
  );
}
'use client';

import React, { useState, useEffect } from 'react';
import { addVideoAction, deleteVideoAction, checkPasswordAction } from './actions';
import { Trash2, ListVideo, PlusCircle, Lock, Eye, EyeOff, RefreshCw, ShieldCheck } from 'lucide-react';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [videos, setVideos] = useState<any[]>([]);
  const [status, setStatus] = useState({ success: false, message: '' });
  const [loading, setLoading] = useState(false);

  // --- 1. LÓGICA DE SEGURIDAD ---
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await checkPasswordAction(password);
    if (result.success) {
      setIsAuthenticated(true);
      refreshList();
    } else {
      alert(result.message);
      setPassword('');
    }
  };

  // --- 2. LÓGICA DE GESTIÓN DE CONTENIDO ---
  const refreshList = async () => {
    try {
      const res = await fetch('/api/videos');
      const data = await res.json();
      setVideos(data);
    } catch (error) {
      console.error("Error al refrescar lista:", error);
    }
  };

  async function handleAdd(formData: FormData) {
    setLoading(true);
    const result = await addVideoAction(formData);
    if (result.success) {
      await refreshList();
      (document.getElementById('video-form') as HTMLFormElement).reset();
    }
    setStatus(result);
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (confirm('¿Deseas eliminar este video del sitio de Karla?')) {
      const result = await deleteVideoAction(id);
      if (result.success) await refreshList();
    }
  }

  // --- PANTALLA DE BLOQUEO (Si no ha entrado la clave) ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-slate-900/50 border border-white/10 p-10 rounded-[2.5rem] backdrop-blur-xl text-center shadow-2xl animate-in fade-in zoom-in duration-500">
          <div className="bg-amber-500/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8 border border-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.1)]">
            <Lock className="text-amber-500" size={32} />
          </div>
          <h1 className="text-3xl font-black text-white mb-2 tracking-tighter uppercase">Acceso Privado</h1>
          <p className="text-slate-500 text-sm mb-10 uppercase tracking-widest font-bold">Panel de Control Encuentro</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresa la clave maestra"
                className="w-full bg-slate-800 border-none rounded-2xl p-5 text-center text-white outline-none focus:ring-2 focus:ring-amber-500 transition-all font-mono"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-amber-500 transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <button className="w-full bg-amber-500 text-black font-black py-5 rounded-2xl hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/20 uppercase tracking-widest active:scale-95">
              Entrar al Panel
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- PANEL DE ADMINISTRACIÓN (Acceso concedido) ---
  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-12 animate-in fade-in duration-700">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-12">
          <div className="bg-green-500/20 p-2 rounded-lg border border-green-500/30">
            <ShieldCheck className="text-green-500" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-black uppercase tracking-tighter">Sesión Autorizada</h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em]">Gestión del Ministerio</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* SECCIÓN A: REGISTRO DE VIDEOS */}
          <div className="bg-slate-900/40 p-8 rounded-3xl border border-white/10 backdrop-blur-md shadow-2xl h-fit">
            <h2 className="text-xl font-black text-amber-500 mb-8 flex items-center gap-3">
              <PlusCircle size={20} /> REGISTRAR CONTENIDO
            </h2>
            <form id="video-form" action={handleAdd} className="space-y-6">
              <input name="title" required className="w-full bg-slate-800/50 border border-white/5 rounded-2xl p-4 text-sm outline-none focus:border-amber-500/50 transition-all" placeholder="Título del video" />
              <select name="category" className="w-full bg-slate-800/50 border border-white/5 rounded-2xl p-4 text-sm outline-none cursor-pointer">
                <option value="Entrevistas">🎙️ Entrevistas</option>
                <option value="Short">📱 Shorts de Bendición</option>
                <option value="Musica">🎵 Alabanzas</option>
              </select>
              <input name="url" required className="w-full bg-slate-800/50 border border-white/5 rounded-2xl p-4 text-sm outline-none focus:border-amber-500/50 transition-all" placeholder="Link de YouTube" />
              <button disabled={loading} className="w-full bg-amber-500 text-black font-black py-5 rounded-2xl hover:shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all active:scale-95">
                {loading ? 'PROCESANDO...' : 'PUBLICAR EN LA WEB'}
              </button>
            </form>
            {status.message && <p className={`mt-6 text-center text-xs font-bold ${status.success ? 'text-green-400' : 'text-red-400'}`}>{status.message}</p>}
          </div>

          {/* SECCIÓN B: LISTA DE ELIMINACIÓN */}
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-black text-slate-400 flex items-center gap-3">
                <ListVideo size={20} /> LISTA ACTUAL ({videos.length})
              </h2>
              <button onClick={refreshList} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                <RefreshCw size={18} className="text-slate-500" />
              </button>
            </div>

            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {videos.map((v) => (
                <div key={v.id} className="bg-slate-900/60 border border-white/5 p-4 rounded-2xl flex items-center justify-between group hover:border-red-500/20 transition-all">
                  <div className="flex items-center gap-4">
                    <img src={v.thumbnail} className="w-16 h-10 object-cover rounded-lg bg-slate-800" alt="" />
                    <div>
                      <p className="text-sm font-bold line-clamp-1">{v.title}</p>
                      <p className="text-[9px] text-amber-500/70 font-black uppercase tracking-widest">{v.category}</p>
                    </div>
                  </div>
                  <button onClick={() => handleDelete(v.id.toString())} className="p-3 text-slate-600 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
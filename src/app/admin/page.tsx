'use client';

import React, { useState, useEffect } from 'react';
import { addVideoAction, deleteVideoAction, checkPasswordAction } from './actions';
import { 
  Trash2, ListVideo, PlusCircle, Lock, Eye, EyeOff, 
  RefreshCw, ShieldCheck, Video, AlertCircle 
} from 'lucide-react';

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
    setStatus({ success: false, message: '' });
    const result = await addVideoAction(formData);
    if (result.success) {
      await refreshList();
      (document.getElementById('video-form') as HTMLFormElement).reset();
    }
    setStatus(result);
    setLoading(false);
  }

  // FUNCIÓN DE ELIMINAR REFORZADA
  async function handleDelete(id: string | number) {
    const confirmed = window.confirm('¿Deseas eliminar permanentemente este video de la plataforma?');
    
    if (confirmed) {
      setLoading(true);
      try {
        const result = await deleteVideoAction(id);
        if (result.success) {
          await refreshList(); // Refrescamos la lista inmediatamente
          alert('✅ El video ha sido borrado del sistema.');
        } else {
          alert('❌ ' + result.message);
        }
      } catch (err) {
        alert('❌ Error de comunicación con el servidor.');
      } finally {
        setLoading(false);
      }
    }
  }

  // --- PANTALLA DE BLOQUEO ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-slate-900/50 border border-white/10 p-10 rounded-[2.5rem] backdrop-blur-xl text-center shadow-2xl animate-in fade-in zoom-in duration-500">
          <div className="bg-amber-500/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8 border border-amber-500/20">
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
                placeholder="Clave Maestra"
                className="w-full bg-slate-800 border-none rounded-2xl p-5 text-center text-white outline-none focus:ring-2 focus:ring-amber-500 transition-all"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-amber-500"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <button className="w-full bg-amber-500 text-black font-black py-5 rounded-2xl hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/20 uppercase tracking-widest">
              Entrar al Panel
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- PANEL DE ADMINISTRACIÓN AUTORIZADO ---
  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-12 animate-in fade-in duration-700">
      <div className="max-w-6xl mx-auto">
        
        {/* Banner de Sesión Autorizada */}
        <div className="flex items-center gap-4 mb-12 bg-slate-900/30 p-6 rounded-3xl border border-white/5">
          <div className="bg-green-500/20 p-3 rounded-2xl border border-green-500/30">
            <ShieldCheck className="text-green-500" size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-black uppercase tracking-tighter">Sesión Autorizada</h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em]">Gestión del Ministerio • Karla Perdomo</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* SECCIÓN A: REGISTRO DE VIDEOS */}
          <div className="bg-slate-900/40 p-8 rounded-[2rem] border border-white/10 backdrop-blur-md shadow-2xl h-fit">
            <h2 className="text-xl font-black text-amber-500 mb-8 flex items-center gap-3">
              <PlusCircle size={22} className="text-amber-500" /> REGISTRAR CONTENIDO
            </h2>
            <form id="video-form" action={handleAdd} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-2">Título del Video</label>
                <input name="title" required className="w-full bg-slate-800/50 border border-white/5 rounded-2xl p-4 text-sm outline-none focus:border-amber-500/50 transition-all" placeholder="Ej: No es con mis fuerzas" />
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-2">Categoría</label>
                <select name="category" className="w-full bg-slate-800/50 border border-white/5 rounded-2xl p-4 text-sm outline-none cursor-pointer appearance-none">
                  <option value="Entrevistas">🎙️ Entrevistas</option>
                  <option value="Short">📱 Shorts de Bendición</option>
                  <option value="Musica">🎵 Alabanzas</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-2">Link de YouTube</label>
                <input name="url" required className="w-full bg-slate-800/50 border border-white/5 rounded-2xl p-4 text-sm outline-none focus:border-amber-500/50 transition-all" placeholder="https://www.youtube.com/watch?v=..." />
              </div>

              <button 
                disabled={loading}
                className="w-full bg-gradient-to-r from-amber-600 to-amber-500 text-black font-black py-5 rounded-2xl hover:shadow-[0_0_25px_rgba(245,158,11,0.2)] transition-all active:scale-95 disabled:opacity-50"
              >
                {loading ? 'SINCRONIZANDO...' : 'PUBLICAR EN LA WEB'}
              </button>
            </form>
            {status.message && (
              <div className={`mt-6 p-4 rounded-xl text-center text-xs font-bold flex items-center justify-center gap-2 ${status.success ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                {status.success ? <ShieldCheck size={14} /> : <AlertCircle size={14} />}
                {status.message}
              </div>
            )}
          </div>

          {/* SECCIÓN B: GESTIÓN DE ELIMINACIÓN */}
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-black text-slate-400 flex items-center gap-3">
                <ListVideo size={22} /> LISTA ACTUAL ({videos.length})
              </h2>
              <button onClick={refreshList} className="p-3 hover:bg-white/5 rounded-2xl transition-all text-slate-500 hover:text-amber-500">
                <RefreshCw size={20} />
              </button>
            </div>

            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {videos.map((v) => (
                <div key={v.id} className="bg-slate-900/60 border border-white/5 p-4 rounded-2xl flex items-center justify-between group hover:border-red-500/20 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="relative w-20 h-12 bg-slate-800 rounded-lg overflow-hidden flex items-center justify-center">
                      {v.thumbnail ? (
                        <img src={v.thumbnail} className="w-full h-full object-cover" alt="" />
                      ) : (
                        <Video size={16} className="text-slate-600" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-bold line-clamp-1 group-hover:text-amber-400 transition-colors">{v.title}</p>
                      <p className="text-[9px] text-amber-500/70 font-black uppercase tracking-widest">{v.category}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDelete(v.id)} 
                    disabled={loading}
                    className="p-3 text-slate-600 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all disabled:opacity-30"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
              {videos.length === 0 && (
                <div className="text-center py-20 bg-slate-900/20 rounded-3xl border border-dashed border-white/5">
                  <Video className="mx-auto text-slate-700 mb-4" size={40} />
                  <p className="text-slate-600 italic text-sm">No hay videos registrados aún...</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
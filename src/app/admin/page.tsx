'use client';

import React, { useState, useEffect } from 'react';
import { addVideoAction, deleteVideoAction, checkPasswordAction } from './actions';
import { 
  Trash2, ListVideo, PlusCircle, Lock, Eye, EyeOff, 
  RefreshCw, ShieldCheck, Video, AlertCircle, Loader2 
} from 'lucide-react';

export default function AdminPage() {
  // --- ESTADOS ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [videos, setVideos] = useState<any[]>([]);
  const [status, setStatus] = useState({ success: false, message: '' });
  const [loading, setLoading] = useState(false);

  // --- 1. SEGURIDAD (PASSWORD GATE) ---
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await checkPasswordAction(password);
    if (result.success) {
      setIsAuthenticated(true);
      refreshList();
    } else {
      alert("Contraseña incorrecta. Por seguridad, verifica tus credenciales.");
      setPassword('');
    }
  };

  // --- 2. GESTIÓN DE DATOS ---
  const refreshList = async () => {
    try {
      const res = await fetch('/api/videos');
      const data = await res.json();
      setVideos(data);
    } catch (error) {
      console.error("Error al refrescar lista:", error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) refreshList();
  }, [isAuthenticated]);

  // --- 3. ACCIONES DEL FORMULARIO ---
  async function handleAdd(formData: FormData) {
    setLoading(true);
    setStatus({ success: false, message: '' });
    const result = await addVideoAction(formData);
    
    if (result.success) {
      await refreshList(); // Sincronizamos la lista de inmediato
      (document.getElementById('video-form') as HTMLFormElement).reset();
    }
    
    setStatus(result);
    setLoading(false);
  }

  // FUNCIÓN DE ELIMINAR CORREGIDA
  async function handleDelete(id: string | number) {
    const confirmed = window.confirm('¿Deseas eliminar permanentemente este video? Esta acción no se puede deshacer.');
    
    if (confirmed) {
      setLoading(true);
      try {
        // Enviamos el ID a la Server Action reforzada
        const result = await deleteVideoAction(id);
        
        if (result.success) {
          await refreshList(); // Refresco forzado de la interfaz
          alert('✅ Video eliminado exitosamente.');
        } else {
          // Captura el error visualmente
          alert('❌ ' + result.message);
        }
      } catch (err) {
        alert('❌ Error crítico de conexión.');
      } finally {
        setLoading(false);
      }
    }
  }

  // --- INTERFAZ: PANTALLA DE BLOQUEO ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-slate-900/50 border border-white/10 p-10 rounded-[2.5rem] backdrop-blur-xl text-center shadow-2xl animate-in fade-in zoom-in duration-500">
          <div className="bg-amber-500/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8 border border-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.15)]">
            <Lock className="text-amber-500" size={32} />
          </div>
          <h1 className="text-3xl font-black text-white mb-2 tracking-tighter uppercase">Acceso Privado</h1>
          <p className="text-slate-500 text-sm mb-10 uppercase tracking-widest font-bold">Ministerio Karla Perdomo</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Clave Maestra"
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

  // --- INTERFAZ: PANEL DE CONTROL ---
  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-12 animate-in fade-in duration-700">
      <div className="max-w-6xl mx-auto">
        
        {/* Banner Superior */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 bg-slate-900/30 p-8 rounded-[2rem] border border-white/5 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <div className="bg-green-500/20 p-3 rounded-2xl border border-green-500/30">
              <ShieldCheck className="text-green-500" size={30} />
            </div>
            <div>
              <h1 className="text-2xl font-black uppercase tracking-tighter">Sesión Autorizada</h1>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em]">Gestión del Ministerio • Karla Perdomo</p>
            </div>
          </div>
          {loading && (
            <div className="flex items-center gap-2 text-amber-500 font-bold text-xs uppercase animate-pulse">
              <Loader2 className="animate-spin" size={16} /> Procesando cambios...
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* SECCIÓN: FORMULARIO DE REGISTRO */}
          <div className="bg-slate-900/40 p-8 rounded-[2.5rem] border border-white/10 backdrop-blur-md shadow-2xl h-fit">
            <h2 className="text-xl font-black text-amber-500 mb-8 flex items-center gap-3">
              <PlusCircle size={24} /> REGISTRAR CONTENIDO
            </h2>
            <form id="video-form" action={handleAdd} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-2">Título del Video</label>
                <input name="title" required className="w-full bg-slate-800/50 border border-white/5 rounded-2xl p-4 text-sm outline-none focus:border-amber-500/50 transition-all placeholder:text-slate-600" placeholder="Ej: No es con mis fuerzas" />
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
                <input name="url" required className="w-full bg-slate-800/50 border border-white/5 rounded-2xl p-4 text-sm outline-none focus:border-amber-500/50 transition-all placeholder:text-slate-600" placeholder="https://www.youtube.com/watch?v=..." />
              </div>

              <button 
                disabled={loading}
                className="w-full bg-gradient-to-r from-amber-600 to-amber-500 text-black font-black py-5 rounded-2xl hover:shadow-[0_0_30px_rgba(245,158,11,0.25)] transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest"
              >
                {loading ? 'SINCRONIZANDO...' : 'PUBLICAR EN LA WEB'}
              </button>
            </form>
            
            {status.message && (
              <div className={`mt-6 p-4 rounded-2xl text-center text-xs font-bold flex items-center justify-center gap-3 animate-in slide-in-from-bottom-2 ${status.success ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                {status.success ? <ShieldCheck size={16} /> : <AlertCircle size={16} />}
                {status.message}
              </div>
            )}
          </div>

          {/* SECCIÓN: LISTA DE GESTIÓN (ELIMINAR) */}
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4 px-2">
              <h2 className="text-xl font-black text-slate-400 flex items-center gap-3">
                <ListVideo size={24} /> LISTA ACTUAL ({videos.length})
              </h2>
              <button 
                onClick={refreshList} 
                className="p-3 hover:bg-white/5 rounded-2xl transition-all text-slate-500 hover:text-amber-500 active:rotate-180 duration-500"
              >
                <RefreshCw size={20} />
              </button>
            </div>

            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-3 custom-scrollbar">
              {videos.map((v) => (
                <div key={v.id} className="bg-slate-900/60 border border-white/5 p-4 rounded-3xl flex items-center justify-between group hover:border-red-500/20 transition-all duration-300 backdrop-blur-sm">
                  <div className="flex items-center gap-5">
                    <div className="relative w-24 h-14 bg-slate-800 rounded-xl overflow-hidden shadow-inner flex items-center justify-center">
                      {v.thumbnail ? (
                        <img src={v.thumbnail} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                      ) : (
                        <Video size={20} className="text-slate-700" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-bold line-clamp-1 group-hover:text-amber-400 transition-colors">{v.title}</p>
                      <p className="text-[9px] text-amber-500/70 font-black uppercase tracking-[0.2em] mt-1">{v.category}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDelete(v.id)} 
                    disabled={loading}
                    className="p-4 text-slate-600 hover:text-red-500 hover:bg-red-500/10 rounded-2xl transition-all disabled:opacity-20 shadow-sm"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
              
              {videos.length === 0 && (
                <div className="text-center py-24 bg-slate-900/20 rounded-[2.5rem] border border-dashed border-white/10">
                  <Video className="mx-auto text-slate-800 mb-6 opacity-50" size={48} />
                  <p className="text-slate-600 italic text-sm font-medium">No hay contenido registrado...</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
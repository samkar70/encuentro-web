'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, ShieldCheck, Eye, EyeOff } from 'lucide-react';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(false);

    const res = await fetch('/api/admin/login', {
      method: 'POST',
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      // Guardamos una sesión temporal en el navegador
      sessionStorage.setItem('admin_auth', 'true');
      router.push('/admin/libro'); // Redirigimos al primer módulo
    } else {
      setError(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md animate-in fade-in zoom-in duration-500">
        <div className="bg-white/[0.03] border border-white/10 p-12 rounded-[3rem] backdrop-blur-xl shadow-2xl text-center">
          
          <div className="w-20 h-20 bg-amber-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8 text-amber-500 shadow-inner">
            <Lock size={32} />
          </div>

          <h1 className="text-3xl font-serif italic text-white mb-2">Panel Privado</h1>
          <p className="text-slate-500 text-[10px] uppercase tracking-[0.3em] mb-10">Solo Personal Autorizado</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <input 
                type={showPass ? "text" : "password"}
                placeholder="Introducir Clave de Seguridad"
                className={`w-full bg-black/40 border ${error ? 'border-red-500/50' : 'border-white/10'} rounded-2xl p-5 text-center text-white outline-none focus:border-amber-500 transition-all font-mono tracking-widest`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button 
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-amber-500 transition-colors"
              >
                {showPass ? <EyeOff size={18}/> : <Eye size={18}/>}
              </button>
            </div>

            {error && (
              <p className="text-red-400 text-xs italic animate-bounce">
                Clave incorrecta. Inténtalo de nuevo.
              </p>
            )}

            <button 
              type="submit" 
              className="w-full bg-amber-600 hover:bg-amber-500 text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all shadow-lg shadow-amber-900/20 active:scale-95"
            >
              <ShieldCheck size={20}/> Entrar al Sistema
            </button>
          </form>
        </div>
        
        <p className="mt-8 text-center text-slate-700 text-[10px] uppercase tracking-widest">
          Propiedad de Encuentro • © 2026
        </p>
      </div>
    </div>
  );
}
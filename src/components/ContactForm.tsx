'use client';

import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { sendContactAction } from '@/app/actions';

export function ContactForm() {
  const [status, setStatus] = useState<{ success?: boolean; message?: string } | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setStatus(null);
    const result = await sendContactAction(formData);
    setStatus(result);
    setLoading(false);
    if (result.success) {
      (document.getElementById('contact-form') as HTMLFormElement).reset();
    }
  }

  return (
    <div className="w-full max-w-xl mx-auto bg-slate-900/40 p-10 rounded-[2.5rem] border border-white/5 backdrop-blur-md shadow-2xl">
      <h2 className="text-3xl font-black uppercase tracking-tighter mb-2 text-center text-white">Buzón de Esperanza</h2>
      <p className="text-slate-500 text-[10px] text-center mb-10 tracking-[0.3em] uppercase font-bold">Peticiones de Oración y Contacto</p>
      
      <form id="contact-form" action={handleSubmit} className="space-y-6">
        <input name="name" required placeholder="Tu Nombre completo" className="w-full bg-slate-800/50 border border-white/5 rounded-2xl p-5 text-sm text-white outline-none focus:border-amber-500/50 transition-all" />
        <input name="email" type="email" required placeholder="Correo Electrónico" className="w-full bg-slate-800/50 border border-white/5 rounded-2xl p-5 text-sm text-white outline-none focus:border-amber-500/50 transition-all" />
        <textarea name="message" required placeholder="Escribe tu mensaje o petición de oración..." rows={4} className="w-full bg-slate-800/50 border border-white/5 rounded-2xl p-5 text-sm text-white outline-none focus:border-amber-500/50 transition-all resize-none"></textarea>
        
        <button 
          disabled={loading}
          className="w-full bg-amber-500 text-black font-black py-5 rounded-2xl hover:bg-amber-400 transition-all uppercase tracking-widest flex items-center justify-center gap-3 disabled:opacity-50"
        >
          {loading ? 'ENVIANDO...' : <><Send size={18} /> ENVIAR AL MINISTERIO</>}
        </button>
      </form>

      {status && (
        <div className={`mt-6 p-4 rounded-2xl text-center text-xs font-bold flex items-center justify-center gap-3 animate-in fade-in slide-in-from-bottom-2 ${status.success ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
          {status.success ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          {status.message}
        </div>
      )}
    </div>
  );
}
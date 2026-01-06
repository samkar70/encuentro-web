'use client';

import React, { useRef, useState } from 'react';
import { Download, Camera, Share2, Sparkles, Loader2 } from 'lucide-react';

export function SocialGenerator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [text, setText] = useState('Escribe aquí tu reflexión...');
  const [ref, setRef] = useState('Encuentro | Karla Perdomo');
  const [isGenerating, setIsGenerating] = useState(false);

  // Función para dibujar en el lienzo (Canvas)
  const drawCanvas = (ctx: CanvasRenderingContext2D) => {
    // Fondo: Gradiente profundo
    const grad = ctx.createLinearGradient(0, 0, 0, 1080);
    grad.addColorStop(0, '#0f172a');
    grad.addColorStop(1, '#020617');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1080, 1080);

    // Adorno visual de luz
    ctx.fillStyle = '#f59e0b';
    ctx.globalAlpha = 0.08;
    ctx.beginPath();
    ctx.arc(1080, 0, 500, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1.0;

    // Configuración de texto
    ctx.fillStyle = '#ffffff';
    ctx.font = 'italic 52px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Procesamiento de texto con saltos de línea automáticos
    const words = text.split(' ');
    let line = '';
    let y = 500;
    const maxWidth = 850;
    const lineHeight = 75;

    for(let n = 0; n < words.length; n++) {
      let testLine = line + words[n] + ' ';
      let metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && n > 0) {
        ctx.fillText(line, 540, y);
        line = words[n] + ' ';
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, 540, y);

    // Marca de agua / Referencia
    ctx.fillStyle = '#f59e0b';
    ctx.font = '900 28px Arial';
    ctx.letterSpacing = '12px';
    ctx.fillText(ref.toUpperCase(), 540, 980);
  };

  const handleAction = async (type: 'download' | 'share') => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsGenerating(true);
    drawCanvas(ctx);

    if (type === 'download') {
      const link = document.createElement('a');
      link.download = 'encuentro-reflexion.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
      setIsGenerating(false);
    } else {
      // Compartir como archivo real
      try {
        canvas.toBlob(async (blob) => {
          if (!blob) return;
          const file = new File([blob], 'reflexion.png', { type: 'image/png' });
          
          if (navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({
              files: [file],
              title: 'Reflexión Encuentro',
              text: 'Te comparto esta palabra de bendición.'
            });
          } else {
            // Fallback si el navegador no permite compartir archivos
            const textToShare = `"${text}" — ${ref}`;
            await navigator.share({ text: textToShare });
          }
          setIsGenerating(false);
        }, 'image/png');
      } catch (err) {
        console.error("Error al compartir:", err);
        setIsGenerating(false);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-20 bg-amber-500/[0.02] border-y border-white/5">
      <div className="flex flex-col items-center mb-12">
        <div className="p-3 bg-amber-500/10 rounded-2xl mb-4">
          <Camera className="text-amber-500" size={24} />
        </div>
        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Diseñador de Postales</h2>
      </div>

      <div className="grid md:grid-cols-2 gap-12 items-start">
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase text-slate-600 ml-4 tracking-widest">Contenido de la imagen</label>
            <textarea 
              value={text} onChange={(e) => setText(e.target.value)}
              className="w-full bg-slate-900/60 border border-white/5 rounded-[2rem] p-8 text-white text-lg font-serif italic h-52 outline-none focus:border-amber-500/30 transition-all resize-none"
              placeholder="Pega aquí la reflexión..."
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase text-slate-600 ml-4 tracking-widest">Firma / Referencia</label>
            <input 
              type="text" value={ref} onChange={(e) => setRef(e.target.value)}
              className="w-full bg-slate-900/60 border border-white/5 rounded-full px-8 py-5 text-amber-500 text-xs font-bold uppercase tracking-widest outline-none focus:border-amber-500/30 transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <button 
              onClick={() => handleAction('download')}
              disabled={isGenerating}
              className="py-5 bg-slate-800 rounded-full text-slate-300 font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-slate-700 transition-all disabled:opacity-50"
            >
              <Download size={16} /> Descargar
            </button>
            <button 
              onClick={() => handleAction('share')}
              disabled={isGenerating}
              className="py-5 bg-amber-600 rounded-full text-white font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-amber-500 transition-all shadow-xl shadow-amber-900/20 disabled:opacity-50"
            >
              {isGenerating ? <Loader2 size={16} className="animate-spin" /> : <Share2 size={16} />} 
              Compartir
            </button>
          </div>
        </div>
        
        {/* Previsualización del Canvas */}
        <div className="relative group">
          <canvas 
            ref={canvasRef} 
            width="1080" height="1080" 
            className="w-full aspect-square rounded-[3.5rem] bg-slate-950 border border-white/10 shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]" 
          />
          <div className="absolute inset-0 rounded-[3.5rem] bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
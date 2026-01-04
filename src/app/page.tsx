// FUERZA DINÁMICA: Asegura que el sitio siempre muestre lo más nuevo de Turso y la Radio
export const dynamic = 'force-dynamic';

import { getVideos } from '@/lib/db';
import { VideoGallery } from '@/components/VideoGallery';
import { RadioPlayer } from '@/components/RadioPlayer';
import { ContactForm } from '@/components/ContactForm';
import { MoodBible } from '@/components/MoodBible';
import { MediaItem } from '@/types';
import { Sparkles, Facebook, Youtube, Quote } from 'lucide-react';

export default async function Home() {
  // 1. Obtención de datos desde la base de datos Turso
  const data = await getVideos();
  
  // 2. Formateo de videos para la galería
  const allVideos = data.map(row => ({
    id: String(row.id),
    title: String(row.title),
    category: String(row.category),
    url: String(row.url),
    thumbnail: String(row.thumbnail),
    artist: String(row.artist || 'Karla Perdomo'),
  })) as MediaItem[];

  return (
    <main className="min-h-screen bg-slate-950 text-white selection:bg-amber-500/30 font-sans">
      {/* REPRODUCTOR DE RADIO FLOTANTE (Sintonía Zeno.fm) */}
      <RadioPlayer />

      {/* 1. SECCIÓN HERO: IDENTIDAD VISUAL */}
      <header className="relative pt-24 pb-32 px-6 text-center overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-amber-500/5 blur-[130px] rounded-full -z-10" />
        <div className="max-w-4xl mx-auto animate-in fade-in zoom-in duration-1000">
          <img 
            src="/logo-encuentro.png" 
            alt="Logo Encuentro" 
            className="w-44 h-44 md:w-64 md:h-64 mx-auto mb-12 drop-shadow-[0_0_35px_rgba(245,158,11,0.3)] hover:scale-105 transition-transform duration-500"
          />
          <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-4 leading-tight bg-gradient-to-b from-white via-white to-slate-500 bg-clip-text text-transparent">
            Un Encuentro <br /> <span className="text-amber-500">con la Verdad</span>
          </h1>
          <div className="flex items-center justify-center gap-3 text-[10px] font-bold uppercase tracking-[0.4em] text-amber-500/40">
            <Sparkles size={14} /> Mensajes de Fe y Esperanza <Sparkles size={14} />
          </div>
        </div>
      </header>

      {/* 2. ZONA DE INTERACCIÓN BÍBLICA (Mood Dashboard) */}
      <section className="relative z-10 -mt-10">
        <MoodBible />
      </section>

      {/* 3. GALERÍA DE CONTENIDO (Filtros: Busco Paz, Fortaleza, Adorar) */}
      <section className="max-w-7xl mx-auto px-6 pb-32">
        <VideoGallery videos={allVideos} />
      </section>

      {/* 4. BUZÓN DE ESPERANZA: CONTACTO Y ORACIÓN */}
      <section className="py-32 px-6 bg-slate-900/10 border-t border-white/5">
        <ContactForm />
      </section>

      {/* 5. SECCIÓN SOBRE KARLA: EL PROPÓSITO */}
      <section className="py-32 bg-slate-900/20 border-y border-white/5 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-16">
          <div className="relative group flex-shrink-0">
            <div className="absolute -inset-4 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all"></div>
            <div className="w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-amber-500/20 relative z-10 shadow-2xl">
              <img 
                src="/karla-perdomo.jpg" 
                alt="Karla Perdomo" 
                className="w-full h-full object-cover grayscale-[10%] hover:grayscale-0 transition-all duration-700" 
              />
            </div>
          </div>
          <div className="flex-1 text-center md:text-left">
            <Quote className="text-amber-500/20 mb-6 mx-auto md:mx-0" size={56} />
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-6 text-white">El Propósito</h2>
            <p className="text-slate-400 text-lg md:text-xl italic mb-10 leading-relaxed font-medium">
              "Mi misión es ser un puente de esperanza, llevando un mensaje que restaure corazones y fortalezca la fe de cada persona que nos sintoniza."
            </p>
            <div className="inline-block px-10 py-3 bg-amber-500 text-black text-[11px] font-black uppercase rounded-full tracking-widest shadow-xl shadow-amber-500/10">
              Karla Perdomo • Honduras
            </div>
          </div>
        </div>
      </section>

      {/* 6. FOOTER CON REDES SOCIALES */}
      <footer className="py-24 bg-slate-950 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="text-center md:text-left">
            <h3 className="text-amber-500 font-black text-2xl uppercase tracking-tighter">Encuentro</h3>
            <p className="text-slate-600 text-[10px] font-bold mt-2 uppercase tracking-widest opacity-60">
              © {new Date().getFullYear()} • Karla Perdomo
            </p>
          </div>
          
          <div className="flex items-center gap-10">
            <a 
              href="https://www.facebook.com/profile.php?id=100077372310677&sk=reviews" 
              target="_blank" 
              className="text-slate-400 hover:text-blue-500 transition-all transform hover:-translate-y-1"
            >
              <Facebook size={26} />
            </a>
            <a 
              href="https://www.youtube.com/@EEncuentro" 
              target="_blank" 
              className="text-slate-400 hover:text-red-500 transition-all transform hover:-translate-y-1"
            >
              <Youtube size={26} />
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
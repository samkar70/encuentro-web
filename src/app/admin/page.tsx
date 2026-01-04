import { getVideos } from '@/lib/db';
import { VideoGallery } from '@/components/VideoGallery';
import { MediaItem } from '@/types';
import { Sparkles, Facebook, Youtube, Quote } from 'lucide-react';

export default async function Home() {
  const data = await getVideos();
  
  const allVideos = data.map(row => ({
    id: String(row.id),
    title: String(row.title),
    type: String(row.type),
    category: String(row.category),
    url: String(row.url),
    thumbnail: String(row.thumbnail),
    artist: String(row.artist),
    description: String(row.description || '')
  })) as MediaItem[];

  return (
    <main className="min-h-screen bg-slate-950 text-white selection:bg-amber-500/30">
      
      {/* 1. SECCIÓN HERO */}
      <section className="relative pt-24 pb-32 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-amber-500/5 blur-[130px] rounded-full opacity-60 -z-10" />
        <div className="max-w-6xl mx-auto text-center animate-in fade-in zoom-in duration-1000">
          <img src="/logo-encuentro.png" alt="Logo" className="w-44 h-44 md:w-64 md:h-64 mx-auto mb-12 drop-shadow-[0_0_40px_rgba(245,158,11,0.25)]" />
          <h1 className="text-5xl md:text-8xl font-black bg-gradient-to-b from-white via-white to-slate-500 bg-clip-text text-transparent tracking-tighter uppercase mb-8">
            Un Encuentro <br /> <span className="text-amber-500">con la Verdad</span>
          </h1>
          <p className="max-w-2xl mx-auto text-slate-400 text-sm md:text-lg mb-12">
            🎙️ Un lugar diseñado para encontrar paz y fortaleza junto a <span className="text-white border-b-2 border-amber-500/30">Karla Perdomo</span>.
          </p>
        </div>
      </section>

      {/* 2. GALERÍA DE VIDEOS */}
      <section className="max-w-7xl mx-auto px-6 pb-32">
        <VideoGallery videos={allVideos} />
      </section>

      {/* 3. SECCIÓN SOBRE KARLA (NUEVA) */}
      <section className="py-32 px-6 bg-slate-900/20 border-y border-white/5">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-16">
          <div className="relative group">
            <div className="absolute -inset-4 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all"></div>
            <div className="w-56 h-56 md:w-72 md:h-72 rounded-full overflow-hidden border-4 border-amber-500/20 relative z-10">
              {/* Aquí irá la foto de Karla */}
              <img src="/karla-perdomo.jpg" alt="Karla Perdomo" className="w-full h-full object-cover" />
            </div>
          </div>
          <div className="text-center md:text-left flex-1">
            <Quote className="text-amber-500/20 mb-6 mx-auto md:mx-0" size={48} />
            <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter mb-6">El Propósito detras de la Voz</h2>
            <p className="text-slate-400 text-lg leading-relaxed mb-8 italic">
              "Mi misión es ser un puente de esperanza, llevando un mensaje que restaure corazones y fortalezca la fe de cada persona que nos sintoniza."
            </p>
            <div className="inline-block px-6 py-2 bg-amber-500 text-black text-[10px] font-black uppercase tracking-[0.3em] rounded-full">
              Karla Perdomo • Honduras
            </div>
          </div>
        </div>
      </section>

      {/* 4. FOOTER CON REDES OFICIALES */}
      <footer className="py-24 bg-slate-950">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="text-center md:text-left">
            <h3 className="text-amber-500 font-black text-2xl uppercase tracking-tighter">Encuentro</h3>
            <p className="text-slate-600 text-[10px] uppercase font-bold tracking-widest mt-2">© {new Date().getFullYear()} • Karla Perdomo</p>
          </div>
          
          <div className="flex items-center gap-6">
            <a href="https://www.facebook.com/profile.php?id=100077372310677&sk=reviews" target="_blank" className="bg-slate-900 p-4 rounded-2xl hover:bg-blue-600/20 hover:text-blue-500 transition-all border border-white/5">
              <Facebook size={24} />
            </a>
            <a href="https://www.youtube.com/@EEncuentro" target="_blank" className="bg-slate-900 p-4 rounded-2xl hover:bg-red-600/20 hover:text-red-500 transition-all border border-white/5">
              <Youtube size={24} />
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
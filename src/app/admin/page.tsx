export const dynamic = 'force-dynamic';

import { getVideos } from '@/lib/db';
import { VideoGallery } from '@/components/VideoGallery';
import { MediaItem } from '@/types';
import { Facebook, Youtube, Quote, Sparkles } from 'lucide-react';

export default async function Home() {
  const data = await getVideos();
  
  const allVideos = data.map(row => ({
    id: String(row.id),
    title: String(row.title),
    category: String(row.category),
    url: String(row.url),
    thumbnail: String(row.thumbnail),
    artist: String(row.artist),
  })) as MediaItem[];

  return (
    <main className="min-h-screen bg-slate-950 text-white selection:bg-amber-500/30">
      {/* SECCIÓN HERO CINEMATIC */}
      <section className="relative pt-24 pb-32 px-6 text-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-amber-500/5 blur-[120px] rounded-full -z-10" />
        <img src="/logo-encuentro.png" alt="Logo" className="w-48 h-48 md:w-64 md:h-64 mx-auto mb-12 drop-shadow-[0_0_30px_rgba(245,158,11,0.3)]" />
        <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter mb-8 leading-tight">
          Un Encuentro <br /> <span className="text-amber-500">con la Verdad</span>
        </h1>
        <div className="flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-[0.4em] text-amber-500/40">
          <Sparkles size={14} /> Explora la bendición <Sparkles size={14} />
        </div>
      </section>

      {/* GALERÍA */}
      <section className="max-w-7xl mx-auto px-6 pb-32">
        <VideoGallery videos={allVideos} />
      </section>

      {/* SECCIÓN SOBRE KARLA (LA FOTO) */}
      <section className="py-32 bg-slate-900/20 border-y border-white/5 px-6">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-16">
          <div className="w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-amber-500/20 shadow-2xl flex-shrink-0">
            <img src="/karla-perdomo.jpg" alt="Karla Perdomo" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <Quote className="text-amber-500/20 mb-6 mx-auto md:mx-0" size={48} />
            <h2 className="text-3xl font-black uppercase tracking-tighter mb-6">El Propósito</h2>
            <p className="text-slate-400 text-lg italic mb-8 leading-relaxed">
              "Mi misión es ser un puente de esperanza, llevando un mensaje que restaure corazones y fortalezca la fe."
            </p>
            <div className="inline-block px-6 py-2 bg-amber-500 text-black text-[10px] font-black uppercase rounded-full tracking-widest">
              Karla Perdomo • Honduras
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER CON REDES SOCIALES */}
      <footer className="py-24 bg-slate-950 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="text-center md:text-left">
            <h3 className="text-amber-500 font-black text-2xl uppercase tracking-tighter">Encuentro</h3>
            <p className="text-slate-600 text-[10px] font-bold mt-2 uppercase">© 2026 • Karla Perdomo</p>
          </div>
          <div className="flex items-center gap-8">
            <a href="https://www.facebook.com/profile.php?id=100077372310677&sk=reviews" target="_blank" className="bg-slate-900 p-4 rounded-2xl border border-white/5 hover:text-blue-500 transition-all">
              <Facebook size={24} />
            </a>
            <a href="https://www.youtube.com/@EEncuentro" target="_blank" className="bg-slate-900 p-4 rounded-2xl border border-white/5 hover:text-red-500 transition-all">
              <Youtube size={24} />
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
export const dynamic = 'force-dynamic';

import { getVideos } from '@/lib/db';
import { VideoGallery } from '@/components/VideoGallery';
import { MoodBible } from '@/components/MoodBible';
import { BibleSearch } from '@/components/BibleSearch';

export default async function Home() {
  // Obtenemos los videos de Turso (Nube)
  const videoRows = await getVideos();

  return (
    <main className="min-h-screen bg-slate-950 text-white selection:bg-amber-500/30 pb-20">
      {/* 1. CABECERA */}
      <header className="pt-20 pb-12 text-center">
        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-2">
          Encuentro
        </h1>
        <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.5em]">Karla Perdomo</p>
      </header>

      {/* 2. BUSCADOR DE VIDA (FASE MANANTIAL) */}
      <section className="mb-10">
        <BibleSearch />
      </section>

      {/* 3. SENTIMIENTOS (MOODS) */}
      <section className="mb-24">
        <MoodBible />
      </section>

      {/* 4. GALERÍA MULTIMEDIA (TURSO) */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-4 mb-10">
          <div className="h-[1px] flex-1 bg-white/5"></div>
          <h2 className="text-slate-500 text-[10px] uppercase font-black tracking-[0.4em]">Videos Recientes</h2>
          <div className="h-[1px] flex-1 bg-white/5"></div>
        </div>
        <VideoGallery videos={videoRows} />
      </section>
    </main>
  );
}

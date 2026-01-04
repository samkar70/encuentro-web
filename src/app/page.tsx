import { getVideos } from '@/lib/db';
import { VideoGallery } from '@/components/VideoGallery';
import { MediaItem } from '@/types';

export default async function Home() {
  // Obtenemos los videos directamente desde Turso en el servidor
  const data = await getVideos();
  
  // Formateamos los datos para que el componente VideoGallery los entienda
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
    <main className="min-h-screen bg-slate-950 text-white p-6 md:p-12 selection:bg-amber-500/30">
      {/* Header Premium con tu nueva identidad visual */}
      <header className="mb-20 text-center animate-in fade-in zoom-in duration-1000">
        <div className="flex flex-col items-center gap-6">
          {/* Logo del atardecer con efecto de brillo */}
          <img 
            src="/logo-encuentro.png" 
            alt="Logo Encuentro" 
            className="w-32 h-32 md:w-48 md:h-48 object-contain drop-shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:scale-105 transition-transform duration-500"
          />
          
          <div className="space-y-2">
            <h1 className="text-6xl md:text-8xl font-black bg-gradient-to-r from-amber-500 via-yellow-200 to-amber-600 bg-clip-text text-transparent tracking-tighter uppercase">
              Encuentro
            </h1>
            <p className="text-slate-500 text-sm md:text-base tracking-[0.5em] uppercase font-bold opacity-80">
              Con Karla Perdomo
            </p>
          </div>
        </div>
      </header>

      {/* Componente que maneja los filtros y el reproductor de video */}
      <VideoGallery videos={allVideos} />

      {/* Footer sencillo de marca */}
      <footer className="mt-32 py-12 border-t border-white/5 text-center">
        <p className="text-slate-600 text-xs tracking-widest uppercase">
          © {new Date().getFullYear()} Encuentro • Mensajes de Fe y Esperanza
        </p>
      </footer>
    </main>
  );
}
import { getVideos } from '@/lib/db';
import { VideoGallery } from '@/components/VideoGallery';
import { MediaItem } from '@/types';

export default async function Home() {
  // Obtenemos los datos de forma segura en el servidor
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
    <main className="min-h-screen bg-slate-950 text-white p-6 md:p-12">
      <header className="mb-20 text-center">
        <h1 className="text-6xl md:text-8xl font-black bg-gradient-to-r from-amber-500 via-yellow-200 to-amber-600 bg-clip-text text-transparent tracking-tighter">
          ENCUENTRO
        </h1>
        <p className="text-slate-500 mt-4 text-sm md:text-lg tracking-[0.3em] uppercase font-light">
          Con Karla Perdomo
        </p>
      </header>

      {/* Pasamos los videos al componente que maneja la interacción */}
      <VideoGallery videos={allVideos} />
    </main>
  );
}
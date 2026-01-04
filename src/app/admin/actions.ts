'use server';

import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function addVideoAction(formData: FormData) {
  const title = formData.get('title') as string;
  const category = formData.get('category') as string;
  const videoUrl = formData.get('url') as string;
  const artist = "Karla Perdomo"; // Por defecto para el ministerio

  // Lógica para extraer el ID de YouTube y generar la miniatura automáticamente
  const videoId = videoUrl.split('v=')[1]?.split('&')[0] || videoUrl.split('/').pop();
  const thumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

  try {
    // Insertamos el video en tu base de datos Turso
    await db.execute({
      sql: `INSERT INTO videos (title, type, category, url, thumbnail, artist, created_at) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
      args: [
        title, 
        category === 'Short' ? 'short' : 'video', 
        category, 
        videoUrl, 
        thumbnail, 
        artist,
        new Date().toISOString()
      ]
    });

    // Esto limpia la memoria de Vercel para que el video aparezca al instante en la web
    revalidatePath('/');
    return { success: true, message: '¡Video publicado con éxito!' };
  } catch (error) {
    console.error("Error al guardar:", error);
    return { success: false, message: 'Error al conectar con la base de datos.' };
  }
}
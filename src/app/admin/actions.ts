'use server';

// Estas son las líneas que corrigen tus errores
import { db } from '@/lib/db'; 
import { revalidatePath } from 'next/cache';

/**
 * Verifica la contraseña del administrador
 */
export async function checkPasswordAction(password: string) {
  const correctPassword = process.env.ADMIN_PASSWORD;
  if (password === correctPassword) {
    return { success: true };
  }
  return { success: false, message: 'Contraseña incorrecta. Intenta de nuevo.' };
}

/**
 * Agrega un video a la base de datos de Turso
 */
export async function addVideoAction(formData: FormData) {
  const title = formData.get('title') as string;
  const category = formData.get('category') as string;
  const videoUrl = formData.get('url') as string;
  const artist = "Karla Perdomo";

  const videoId = videoUrl.split('v=')[1]?.split('&')[0] || videoUrl.split('/').pop();
  const thumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

  try {
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

    // Estas funciones ahora funcionarán correctamente
    revalidatePath('/');
    revalidatePath('/admin');
    
    return { success: true, message: '¡Video publicado con éxito!' };
  } catch (error) {
    console.error("Error al guardar:", error);
    return { success: false, message: 'Error al conectar con la base de datos.' };
  }
}

/**
 * Elimina un video de Turso
 */
export async function deleteVideoAction(id: string | number) {
  try {
    const videoId = typeof id === 'string' ? id : id.toString();

    await db.execute({
      sql: `DELETE FROM videos WHERE id = ?`,
      args: [videoId]
    });

    revalidatePath('/');
    revalidatePath('/admin');
    
    return { success: true, message: 'Eliminado con éxito.' };
  } catch (error) {
    console.error("Error al eliminar:", error);
    return { success: false, message: 'No se pudo eliminar el video.' };
  }
}
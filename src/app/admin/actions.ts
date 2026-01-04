'use server';

import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function checkPasswordAction(password: string) {
  const correctPassword = process.env.ADMIN_PASSWORD;
  if (password === correctPassword) {
    return { success: true };
  }
  return { success: false, message: 'Contraseña incorrecta. Intenta de nuevo.' };
}

/**
 * ACCIÓN: Agregar un nuevo video al ministerio
 * Procesa el formulario, genera la miniatura y guarda en Turso
 */
export async function addVideoAction(formData: FormData) {
  const title = formData.get('title') as string;
  const category = formData.get('category') as string;
  const videoUrl = formData.get('url') as string;
  const artist = "Karla Perdomo";

  // Lógica para extraer el ID de YouTube y generar la miniatura automáticamente
  const videoId = videoUrl.split('v=')[1]?.split('&')[0] || videoUrl.split('/').pop();
  const thumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

  try {
    // Inserción en la base de datos Turso usando las credenciales seguras
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

    // Limpiamos la memoria caché para que el cambio aparezca en la web de inmediato
    revalidatePath('/');
    revalidatePath('/admin');
    
    return { success: true, message: '¡Video publicado con éxito en Encuentro!' };
  } catch (error) {
    console.error("Error al guardar en la base de datos:", error);
    return { 
      success: false, 
      message: 'Error al conectar con la base de datos. Verifica las llaves en Vercel.' 
    };
  }
}

/**
 * ACCIÓN: Eliminar un video existente
 * Borra el registro de Turso usando su ID único
 */
export async function deleteVideoAction(id: string) {
  try {
    // Comando de eliminación permanente en Turso
    await db.execute({
      sql: `DELETE FROM videos WHERE id = ?`,
      args: [id]
    });

    // Refrescamos las rutas para actualizar la lista visual
    revalidatePath('/');
    revalidatePath('/admin');
    
    return { success: true, message: 'El contenido ha sido eliminado correctamente.' };
  } catch (error) {
    console.error("Error al eliminar:", error);
    return { success: false, message: 'No se pudo eliminar el video en este momento.' };
  }
}
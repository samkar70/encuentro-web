'use server';

import { db } from '@/lib/db'; 
import { revalidatePath } from 'next/cache';

/**
 * 1. Verifica la clave maestra
 */
export async function checkPasswordAction(password: string) {
  const correctPassword = process.env.ADMIN_PASSWORD;
  if (password === correctPassword) {
    return { success: true };
  }
  return { success: false, message: 'Contraseña incorrecta. Intenta de nuevo.' };
}

/**
 * 2. Agrega un video con lógica de miniatura mejorada
 */
export async function addVideoAction(formData: FormData) {
  const title = formData.get('title') as string;
  const category = formData.get('category') as string;
  const videoUrl = formData.get('url') as string;

  // Extracción segura del ID de YouTube
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = videoUrl.match(regExp);
  const videoId = (match && match[2].length === 11) ? match[2] : null;

  // Miniatura estándar para evitar el cuadro gris
  const thumbnail = videoId 
    ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` 
    : '/logo-encuentro.png';

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
        "Karla Perdomo",
        new Date().toISOString()
      ]
    });

    revalidatePath('/', 'layout');
    revalidatePath('/admin', 'page');
    return { success: true, message: '¡Video publicado con éxito!' };
  } catch (error) {
    console.error("Error al guardar:", error);
    return { success: false, message: 'Error al conectar con la base de datos de Turso.' };
  }
}

/**
 * 3. Elimina un video (Versión Reforzada)
 */
export async function deleteVideoAction(id: string | number) {
  try {
    const numericId = Number(id);
    const finalId = isNaN(numericId) ? id : numericId;

    const result = await db.execute({
      sql: `DELETE FROM videos WHERE id = ?`,
      args: [finalId]
    });

    // Forzamos actualización de caché en Vercel
    revalidatePath('/', 'layout');
    revalidatePath('/admin', 'page');
    
    if (result.rowsAffected === 0) {
      return { success: false, message: 'No se encontró el video para borrar.' };
    }

    return { success: true, message: '¡Video eliminado permanentemente!' };
  } catch (error) {
    console.error("Error al eliminar:", error);
    return { success: false, message: 'Error crítico en el servidor.' };
  }
}
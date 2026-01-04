'use server';

import { db } from '@/lib/db'; 
import { revalidatePath } from 'next/cache';

/**
 * Verifica la clave maestra
 */
export async function checkPasswordAction(password: string) {
  const correctPassword = process.env.ADMIN_PASSWORD;
  return { success: password === correctPassword };
}

/**
 * Agrega un video con lógica de miniatura mejorada
 */
export async function addVideoAction(formData: FormData) {
  const title = formData.get('title') as string;
  const category = formData.get('category') as string;
  const videoUrl = formData.get('url') as string;

  // Extraemos el ID de YouTube de forma más segura
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = videoUrl.match(regExp);
  const videoId = (match && match[2].length === 11) ? match[2] : null;

  // Si YouTube no tiene alta resolución, usamos la estándar para evitar el cuadro gris
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

    revalidatePath('/');
    revalidatePath('/admin');
    return { success: true, message: '¡Video publicado con éxito!' };
  } catch (error) {
    return { success: false, message: 'Error al guardar en Turso.' };
  }
}

/**
 * Elimina un video (Corrección de ID para registros nuevos)
 */
export async function deleteVideoAction(id: string | number) {
  try {
    // Convertimos a número si es posible, para que Turso lo encuentre siempre
    const numericId = Number(id);

    await db.execute({
      sql: `DELETE FROM videos WHERE id = ?`,
      args: [isNaN(numericId) ? id : numericId]
    });

    revalidatePath('/');
    revalidatePath('/admin');
    
    return { success: true, message: 'Eliminado correctamente.' };
  } catch (error) {
    console.error("Error al eliminar:", error);
    return { success: false, message: 'No se pudo eliminar el video.' };
  }
}
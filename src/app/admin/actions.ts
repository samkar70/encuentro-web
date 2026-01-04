'use server';

import { db } from '@/lib/db'; 
import { revalidatePath } from 'next/cache';

export async function checkPasswordAction(password: string) {
  const correctPassword = process.env.ADMIN_PASSWORD;
  return { success: password === correctPassword };
}

export async function addVideoAction(formData: FormData) {
  const title = formData.get('title') as string;
  const category = formData.get('category') as string;
  const videoUrl = formData.get('url') as string;
  
  // Generador de ID único para evitar registros NULL en la DB
  const uniqueId = `v${Date.now()}`; 

  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = videoUrl.match(regExp);
  const videoId = (match && match[2].length === 11) ? match[2] : null;

  // Usamos mqdefault para asegurar que la imagen siempre cargue
  const thumbnail = videoId 
    ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` 
    : '/logo-encuentro.png';

  try {
    await db.execute({
      sql: `INSERT INTO videos (id, title, type, category, url, thumbnail, artist, created_at) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        uniqueId,
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
    return { success: true, message: '¡Video publicado exitosamente!' };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Error al conectar con Turso.' };
  }
}

export async function deleteVideoAction(id: string | number) {
  try {
    await db.execute({
      sql: `DELETE FROM videos WHERE id = ?`,
      args: [id]
    });

    revalidatePath('/', 'layout');
    revalidatePath('/admin', 'page');
    return { success: true, message: 'Video eliminado correctamente.' };
  } catch (error) {
    return { success: false, message: 'No se pudo eliminar el video.' };
  }
}
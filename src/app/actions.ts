'use server';

// Corregimos la importación para usar getDb
import { getDb } from '@/lib/db';

export async function sendContactAction(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const message = formData.get('message') as string;

  try {
    // Abrimos la conexión correctamente
    const db = await getDb();
    
    // Usamos .run() que es el comando correcto para insertar en SQLite
    await db.run(
      `INSERT INTO messages (id, name, email, message, created_at) VALUES (?, ?, ?, ?, ?)`,
      [
        `m${Date.now()}`,
        name,
        email,
        message,
        new Date().toISOString()
      ]
    );
    
    // Cerramos la conexión para liberar memoria
    await db.close();
    
    return { success: true, message: '¡Petición enviada! Estaremos orando por ti.' };
  } catch (error) {
    console.error("Error de contacto:", error);
    return { success: false, message: 'Error al enviar. Intenta de nuevo.' };
  }
}
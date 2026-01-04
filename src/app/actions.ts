'use server';

import { db } from '@/lib/db';

export async function sendContactAction(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const message = formData.get('message') as string;

  try {
    await db.execute({
      sql: `INSERT INTO messages (id, name, email, message, created_at) VALUES (?, ?, ?, ?, ?)`,
      args: [
        `m${Date.now()}`,
        name,
        email,
        message,
        new Date().toISOString()
      ]
    });
    return { success: true, message: '¡Petición enviada! Estaremos orando por ti.' };
  } catch (error) {
    console.error("Error de contacto:", error);
    return { success: false, message: 'Error al enviar. Intenta de nuevo.' };
  }
}
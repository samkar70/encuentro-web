'use server';

import { db } from '@/lib/db';

export async function sendContactAction(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const message = formData.get('message') as string;

  try {
    // Formato de inserción para Turso (SQLite/LibSQL)
    await db.execute({
      sql: "INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)",
      args: [name, email, message]
    });
    return { success: true };
  } catch (error) {
    console.error("Error guardando contacto:", error);
    return { success: false };
  }
}
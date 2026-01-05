import { createClient } from "@libsql/client";

export const db = createClient({
  url: process.env.TURSO_DATABASE_URL || "",
  authToken: process.env.TURSO_AUTH_TOKEN || "",
});

export async function getVideos() {
  try {
    const result = await db.execute("SELECT * FROM videos ORDER BY id DESC");
    
    // Limpiamos los datos para Next.js
    return result.rows.map(row => ({
      id: String(row.id),
      title: String(row.title),
      category: String(row.category),
      url: String(row.url),
      thumbnail: String(row.thumbnail),
      artist: String(row.artist),
      description: String(row.description || ''),
      type: String(row.type || 'video')
    }));
  } catch (error) {
    console.error("Error al obtener videos de Turso:", error);
    return [];
  }
}
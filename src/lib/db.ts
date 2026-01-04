import { createClient } from '@libsql/client';

const url = (process.env.TURSO_DATABASE_URL || "").trim();
const token = (process.env.TURSO_AUTH_TOKEN || "").trim();

export const db = createClient({
  url: url,
  authToken: token,
});

export async function getVideos() {
  try {
    const result = await db.execute("SELECT * FROM videos ORDER BY created_at DESC");
    return result.rows;
  } catch (error) {
    console.error("Error en la base de datos:", error);
    return [];
  }
}
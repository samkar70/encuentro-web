import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';

export async function getDb() {
  return open({
    filename: path.join(process.cwd(), 'src', 'data', 'biblia_completa_rvr1960.db'),
    driver: sqlite3.Database,
  });
}

// Agregamos esto para que la API de videos no falle si lo intenta importar
export async function getVideos() {
  const db = await getDb();
  const videos = await db.all('SELECT * FROM videos ORDER BY id DESC');
  await db.close();
  return videos;
}
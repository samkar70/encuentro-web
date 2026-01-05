import Database from 'better-sqlite3';
import path from 'path';

// Localizamos el archivo en la carpeta data que creamos
const dbPath = path.join(process.cwd(), 'src/data/biblia_completa_rvr1960.db');

// Conectamos a la base de datos
const db = new Database(dbPath);

// Función para buscar promesas (Buscador de Vida)
export function searchBibleLocal(query: string) {
  try {
    const term = `%${query}%`;
    const stmt = db.prepare(`
      SELECT * FROM Libro 
      WHERE full_content LIKE ? 
      OR mood LIKE ? 
      OR book_name LIKE ? 
      LIMIT 6
    `);
    const rows = stmt.all(term, term, term);
    
    // IMPORTANTE: Convertimos a objeto plano para evitar el error de Next.js
    return JSON.parse(JSON.stringify(rows));
  } catch (error) {
    console.error('Error en búsqueda local:', error);
    return [];
  }
}

// Función para obtener un capítulo según el sentimiento (Moods)
export function getChapterByMoodLocal(moodName: string) {
  try {
    // Buscamos un registro aleatorio que coincida con el sentimiento
    const stmt = db.prepare("SELECT * FROM Libro WHERE mood LIKE ? ORDER BY RANDOM() LIMIT 1");
    const row = stmt.get(`%${moodName}%`);
    
    // Si no hay resultado, devolvemos null, de lo contrario el objeto plano
    return row ? JSON.parse(JSON.stringify(row)) : null;
  } catch (error) {
    console.error('Error al obtener mood local:', error);
    return null;
  }
}
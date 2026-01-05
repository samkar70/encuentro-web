import Database from 'better-sqlite3';
import path from 'path';

// Localizamos la base de datos ya purificada
const dbPath = path.join(process.cwd(), 'src/data/biblia_completa_rvr1960.db');
const db = new Database(dbPath);

/**
 * BUSCADOR GENERAL
 * Esta función es la que usa el buscador principal de tu web.
 */
export function searchBibleLocal(query: string) {
  try {
    const term = `%${query.toLowerCase().trim()}%`;
    
    // Buscamos en las columnas principales
    const stmt = db.prepare(`
      SELECT * FROM Libro 
      WHERE full_content LIKE ? 
      OR verse_text LIKE ? 
      OR book_name LIKE ? 
      LIMIT 25
    `);
    
    const rows = stmt.all(term, term, term);
    return JSON.parse(JSON.stringify(rows));
  } catch (error) {
    console.error('Error en searchBibleLocal:', error);
    return [];
  }
}

/**
 * BUSCADOR POR SENTIMIENTO (MOOD)
 * Esta es la función que te está dando el error de "Export doesn't exist".
 */
export function getChapterByMoodLocal(moodName: string) {
  try {
    const term = `%${moodName.toLowerCase().trim()}%`;
    
    // Seleccionamos un capítulo al azar según el sentimiento
    const stmt = db.prepare(`
      SELECT * FROM Libro 
      WHERE mood LIKE ? 
      ORDER BY RANDOM() 
      LIMIT 1
    `);
    
    const row = stmt.get(term);
    
    // Devolvemos el objeto plano o null si no hay coincidencia
    return row ? JSON.parse(JSON.stringify(row)) : null;
  } catch (error) {
    console.error('Error en getChapterByMoodLocal:', error);
    return null;
  }
}
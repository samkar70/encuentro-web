import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'src/data/biblia_completa_rvr1960.db');
const db = new Database(dbPath);

const normalize = (text: string) => 
  text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

db.function('unaccent', (text: string) => normalize(text));

// Obtener versículo diario
export function getRandomVerseLocal() {
  try {
    const stmt = db.prepare(`SELECT * FROM Libro ORDER BY RANDOM() LIMIT 1`);
    return JSON.parse(JSON.stringify(stmt.get()));
  } catch (error) { return null; }
}

// NUEVA: Obtener 3 días de lectura para un plan
export function getPlanVersesLocal(topic: string) {
  try {
    const query = `%${normalize(topic)}%`;
    const stmt = db.prepare(`
      SELECT * FROM Libro 
      WHERE unaccent(reflection) LIKE ? 
      OR unaccent(full_content) LIKE ? 
      ORDER BY id ASC LIMIT 3
    `);
    return JSON.parse(JSON.stringify(stmt.all(query, query)));
  } catch (error) { return []; }
}

// Funciones de búsqueda anteriores
export function getExploreResultsLocal(term: string) {
  try {
    const query = `%${normalize(term)}%`;
    const stmt = db.prepare(`SELECT * FROM Libro WHERE unaccent(full_content) LIKE ? OR unaccent(reflection) LIKE ? LIMIT 2`);
    return JSON.parse(JSON.stringify(stmt.all(query, query)));
  } catch (error) { return []; }
}

export function searchBibleLocal(query: string) {
  try {
    const term = `%${normalize(query)}%`;
    const stmt = db.prepare(`SELECT * FROM Libro WHERE unaccent(full_content) LIKE ? LIMIT 2`);
    return JSON.parse(JSON.stringify(stmt.all(term)));
  } catch (error) { return []; }
}

export function getChapterByMoodLocal(moodName: string) {
  try {
    const term = `%${normalize(moodName)}%`;
    const stmt = db.prepare(`SELECT * FROM Libro WHERE unaccent(mood) LIKE ? ORDER BY RANDOM() LIMIT 1`);
    const row = stmt.get(term);
    return row ? JSON.parse(JSON.stringify(row)) : null;
  } catch (error) { return null; }
}
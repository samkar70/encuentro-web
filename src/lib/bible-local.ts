import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'src/data/biblia_completa_rvr1960.db');
const db = new Database(dbPath);

export function searchBibleLocal(query: string) {
  try {
    const term = `%${query.toLowerCase().trim()}%`;
    
    // Ya no usamos 'unaccent' porque la DB ya está limpia
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
    return [];
  }
}
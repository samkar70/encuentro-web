import Database from 'better-sqlite3';
import path from 'path';

// Conexión centralizada a la base de datos
const dbPath = path.join(process.cwd(), 'src/data/biblia_completa_rvr1960.db');
const db = new Database(dbPath);

// Función auxiliar para normalizar texto (quitar acentos y minúsculas)
const normalize = (text: string) => 
  text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

// Registramos la función 'unaccent' en SQLite para búsquedas precisas
db.function('unaccent', (text: string) => normalize(text));

/**
 * 1. SECCIÓN: MAESTRÍA EN SALMOS (Nivel Th.M.)
 * Utiliza la tabla relacional PsalmsMaster para exégesis técnica.
 */

// Obtiene la lista de Salmos pertenecientes a uno de los 5 libros del Pentateuco Davídico
export function getPsalmsByBookLocal(bookNumber: number) {
  try {
    const stmt = db.prepare(`
      SELECT psalm_id, gunkel_genre 
      FROM PsalmsMaster 
      WHERE book_num = ? 
      ORDER BY psalm_id ASC
    `);
    return JSON.parse(JSON.stringify(stmt.all(bookNumber)));
  } catch (error) {
    console.error("Error al obtener lista de Salmos:", error);
    return [];
  }
}

// Obtiene el análisis técnico y el texto completo de un Salmo específico
export function getPsalmFullDetailLocal(psalmId: number) {
  try {
    // Obtenemos metadatos de la tabla de inteligencia teológica
    const metadataStmt = db.prepare(`SELECT * FROM PsalmsMaster WHERE psalm_id = ?`);
    const metadata = metadataStmt.get(psalmId);

    // Obtenemos todos los versículos del Salmo desde la tabla Libro
    const textStmt = db.prepare(`
      SELECT verse_text, reference 
      FROM Libro 
      WHERE reference LIKE ? 
      ORDER BY id ASC
    `);
    const verses = textStmt.all(`Salmo ${psalmId}:%`);

    return JSON.parse(JSON.stringify({
      metadata: metadata || null,
      verses: verses,
      fullText: verses.map((v: any) => v.verse_text).join(' ')
    }));
  } catch (error) {
    console.error("Error en detalle de Salmo:", error);
    return null;
  }
}

/**
 * 2. SECCIÓN: DISCIPULADO CRISTIANO (4 DÍAS)
 * Conecta la lección del curso con el contexto bíblico de la tabla Libro.
 */

export function getDiscipleshipDayLocal(day: number) {
  try {
    const lessonStmt = db.prepare(`SELECT * FROM Discipleship WHERE day = ?`);
    const lesson = lessonStmt.get(day) as any;
    
    if (!lesson) return null;

    // Buscamos el versículo clave en la Biblia para dar profundidad a la lección
    const verseStmt = db.prepare(`SELECT * FROM Libro WHERE reference LIKE ? LIMIT 1`);
    const bibleContext = verseStmt.get(`%${lesson.verse_key}%`);

    return JSON.parse(JSON.stringify({
      ...lesson,
      bibleData: bibleContext || null
    }));
  } catch (error) {
    return null;
  }
}

/**
 * 3. SECCIÓN: FUNCIONES DE PORTADA Y BÚSQUEDA
 * Maneja el Versículo del Día, el Buscador y los Sentimientos.
 */

// Selecciona una promesa al azar para la tarjeta principal
export function getRandomVerseLocal() {
  try {
    const stmt = db.prepare(`SELECT * FROM Libro ORDER BY RANDOM() LIMIT 1`);
    return JSON.parse(JSON.stringify(stmt.get()));
  } catch (error) { return null; }
}

// Buscador general (limitado a 2 resultados para limpieza visual)
export function searchBibleLocal(query: string) {
  try {
    const term = `%${normalize(query)}%`;
    const stmt = db.prepare(`
      SELECT * FROM Libro 
      WHERE unaccent(full_content) LIKE ? 
      OR unaccent(reflection) LIKE ? 
      LIMIT 2
    `);
    return JSON.parse(JSON.stringify(stmt.all(term, term)));
  } catch (error) { return []; }
}

// Explorador de temas y personajes
export function getExploreResultsLocal(term: string) {
  try {
    const query = `%${normalize(term)}%`;
    const stmt = db.prepare(`
      SELECT * FROM Libro 
      WHERE unaccent(full_content) LIKE ? 
      OR unaccent(reflection) LIKE ?
      LIMIT 2
    `);
    return JSON.parse(JSON.stringify(stmt.all(query, query)));
  } catch (error) { return []; }
}

// Selector por estado de ánimo
export function getChapterByMoodLocal(moodName: string) {
  try {
    const term = `%${normalize(moodName)}%`;
    const stmt = db.prepare(`SELECT * FROM Libro WHERE unaccent(mood) LIKE ? ORDER BY RANDOM() LIMIT 1`);
    const row = stmt.get(term);
    return row ? JSON.parse(JSON.stringify(row)) : null;
  } catch (error) { return null; }
}
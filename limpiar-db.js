import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

// Configuración necesaria para manejar rutas en módulos ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'src/data/biblia_completa_rvr1960.db');
const db = new Database(dbPath);

console.log("🚀 Iniciando purificación de la Biblia...");

/**
 * Función para eliminar acentos y corregir nombres
 */
function limpiarTexto(text) {
  if (!text) return "";
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Elimina tildes y símbolos como ê, î, ô
    .replace(/Melchisedec/gi, "Melquisedec") // Corrige el nombre específico
    .replace(/Rachel/gi, "Raquel") // Corrige Raquel
    .replace(/ch/gi, "qu") // Intento general para nombres con grafía antigua
    .trim();
}

try {
  const rows = db.prepare("SELECT * FROM Libro").all();
  
  const update = db.prepare(`
    UPDATE Libro 
    SET full_content = ?, verse_text = ?, book_name = ?, mood = ? 
    WHERE id = ?
  `);

  // Ejecutamos todo como una sola transacción para que sea ultra rápido
  const transaction = db.transaction((items) => {
    for (const item of items) {
      update.run(
        limpiarTexto(item.full_content),
        limpiarTexto(item.verse_text),
        limpiarTexto(item.book_name),
        limpiarTexto(item.mood),
        item.id
      );
    }
  });

  transaction(rows);
  console.log(`✅ ¡Proceso terminado! ${rows.length} capítulos han sido limpiados de "bichos raros".`);
} catch (error) {
  console.error("❌ Error durante la limpieza:", error);
} finally {
  db.close();
}
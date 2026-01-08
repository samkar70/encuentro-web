import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

// GET: Leer cualquier tabla (Libro, videos, Discipleship, etc.)
export async function GET(req: Request, { params }: { params: Promise<{ table: string }> }) {
  const { table } = await params; // 👈 Aquí estaba el error: ahora esperamos el nombre
  const db = await getDb();
  
  try {
    // 1. Obtenemos los registros
    const data = await db.all(`SELECT * FROM "${table}"`);
    // 2. Obtenemos la estructura real (nombres de columnas)
    const columns = await db.all(`PRAGMA table_info("${table}")`);
    
    return NextResponse.json({ data, columns });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  } finally {
    await db.close();
  }
}

// POST: Grabar o Actualizar
export async function POST(req: Request, { params }: { params: Promise<{ table: string }> }) {
  const { table } = await params;
  const db = await getDb();
  const body = await req.json();

  try {
    // Detectamos cuál es la llave primaria (ID o DAY)
    const info = await db.all(`PRAGMA table_info("${table}")`);
    const pk = info.find(c => c.pk === 1)?.name || 'id';
    const pkValue = body[pk];

    // Separamos la llave para no enviarla en el INSERT
    const { [pk]: _pk, ...fields } = body;
    const keys = Object.keys(fields).map(k => `"${k}"`);
    const values = Object.values(fields);

    if (pkValue) {
      // MODO EDITAR
      const setStr = Object.keys(fields).map(k => `"${k}" = ?`).join(', ');
      await db.run(`UPDATE "${table}" SET ${setStr} WHERE "${pk}" = ?`, [...values, pkValue]);
    } else {
      // MODO NUEVO
      const placeholders = keys.map(() => '?').join(', ');
      await db.run(`INSERT INTO "${table}" (${keys.join(', ')}) VALUES (${placeholders})`, values);
    }
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  } finally {
    await db.close();
  }
}
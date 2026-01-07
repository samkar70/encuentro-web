import { NextResponse } from 'next/server';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';

export async function GET() {
  const dbPath = path.join(process.cwd(), 'src', 'data', 'biblia_completa_rvr1960.db');

  try {
    const db = await open({ filename: dbPath, driver: sqlite3.Database });
    // Usamos la tabla salmos_master que ya tienes creada
    const salmos = await db.all('SELECT * FROM salmos_master ORDER BY numero_salmo ASC');
    await db.close();
    return NextResponse.json(salmos);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
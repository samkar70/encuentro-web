import { NextResponse } from 'next/server';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get('name');
  const dbPath = path.join(process.cwd(), 'src', 'data', 'biblia_completa_rvr1960.db');

  try {
    const db = await open({ filename: dbPath, driver: sqlite3.Database });
    const info = await db.get('SELECT * FROM info_libros WHERE nombre_libro = ?', [name]);
    await db.close();
    return NextResponse.json(info || {});
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
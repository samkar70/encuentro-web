import { NextResponse } from 'next/server';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';

export async function POST(req: Request) {
  try {
    const { password } = await req.json();
    const dbPath = path.join(process.cwd(), 'src', 'data', 'biblia_completa_rvr1960.db');
    const db = await open({ filename: dbPath, driver: sqlite3.Database });

    // Consultamos la clave de la tabla encuentro_setup
    const setup = await db.get('SELECT clave_admin FROM encuentro_setup LIMIT 1');
    await db.close();

    if (setup && setup.clave_admin === password) {
      return NextResponse.json({ success: true });
    }
    
    return NextResponse.json({ success: false }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
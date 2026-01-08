import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const db = await getDb();
    // Seleccionamos uno al azar de la tabla Libro
    const verse = await db.get('SELECT verse_text, reference, reflection FROM Libro ORDER BY RANDOM() LIMIT 1');
    await db.close();
    
    if (!verse) return NextResponse.json({ error: 'Sin datos' }, { status: 404 });
    return NextResponse.json(verse);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
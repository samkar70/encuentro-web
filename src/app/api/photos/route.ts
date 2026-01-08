import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const db = await getDb();
    // Traemos todas las fotos para distribuirlas en la web
    const fotos = await db.all('SELECT * FROM fotos ORDER BY orden ASC');
    await db.close();
    return NextResponse.json(fotos);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const db = await getDb();
    // Leemos la configuración (nombre del sitio y URL oficial)
    const setup = await db.get('SELECT nombre_sitio, url_sitio FROM encuentro_setup LIMIT 1');
    await db.close();
    return NextResponse.json(setup);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
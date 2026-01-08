import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const db = await getDb();
    // Seleccionamos url_video que es el nombre real en tu DB
    const videos = await db.all('SELECT id, titulo, url_video, descripcion, categoria FROM videos ORDER BY id DESC');
    await db.close();
    return NextResponse.json(videos);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
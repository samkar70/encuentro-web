import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const db = await getDb();
    // Seleccionamos según las columnas del PDF: id, titulo, url_video, descripcion, categoria 
    const videos = await db.all('SELECT id, titulo, url_video, descripcion, categoria, fecha_publicacion FROM videos ORDER BY id DESC');
    await db.close();
    
    return NextResponse.json(videos);
  } catch (error: any) {
    console.error("Error en API de videos:", error.message);
    return NextResponse.json({ error: "Error al cargar videos" }, { status: 500 });
  }
}
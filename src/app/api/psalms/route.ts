import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const db = await getDb();
    // Traemos todos los campos, incluyendo los nuevos
    const salmos = await db.all(`
      SELECT 
        id, 
        numero_salmo, 
        titulo_occidental, 
        genero_gunkel, 
        analisis_psychologico, 
        clave_cristologica,
        texto_clave,
        url_audio
      FROM salmos_master 
      ORDER BY numero_salmo ASC
    `);
    await db.close();
    return NextResponse.json(salmos);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
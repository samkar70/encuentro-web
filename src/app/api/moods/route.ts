import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mood = searchParams.get('mood')?.toUpperCase() || '';

  try {
    const db = await getDb();
    
    // CAPA 1: Búsqueda por etiqueta (con o sin tildes)
    let data = await db.get(
      `SELECT verse_text, reference, reflection FROM Libro 
       WHERE UPPER(mood) LIKE ? OR UPPER(mood) LIKE ? 
       ORDER BY RANDOM() LIMIT 1`,
      [`%${mood}%`, `%${mood.replace('O', 'Ó').replace('A', 'Á').replace('E', 'É').replace('I', 'Í').replace('U', 'Ú')}%`]
    );

    // CAPA 2: Si no hay etiqueta, buscamos la palabra clave en el versículo o la reflexión
    if (!data && mood !== 'AZAR') {
      data = await db.get(
        `SELECT verse_text, reference, reflection FROM Libro 
         WHERE UPPER(verse_text) LIKE ? OR UPPER(reflection) LIKE ? 
         ORDER BY RANDOM() LIMIT 1`,
        [`%${mood}%`, `%${mood}%`]
      );
    }

    // CAPA 3: Si es 'SORPRÉNDEME' o si no hubo resultados en las capas anteriores
    // Entregamos cualquiera de los 1,189 registros al azar.
    if (!data || mood === 'AZAR') {
      data = await db.get('SELECT verse_text, reference, reflection FROM Libro ORDER BY RANDOM() LIMIT 1');
    }
    
    await db.close();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
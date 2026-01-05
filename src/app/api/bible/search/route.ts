import { NextResponse } from 'next/server';
import { searchBibleLocal } from '@/lib/bible-local';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query || query.length < 3) {
      return NextResponse.json([]);
    }

    // Buscamos en la base de datos local (Libro)
    const results = searchBibleLocal(query);
    
    return NextResponse.json(results);
  } catch (error) {
    console.error('Error en API de búsqueda:', error);
    return NextResponse.json({ error: 'Fallo interno' }, { status: 500 });
  }
}
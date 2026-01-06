import { NextResponse } from 'next/server';
import { searchBibleLocal } from '@/lib/bible-local';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query || query.length < 3) {
      return NextResponse.json([]);
    }

    const results = searchBibleLocal(query);
    
    // Enviamos los resultados directamente
    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json({ error: 'Fallo en el servidor' }, { status: 500 });
  }
}
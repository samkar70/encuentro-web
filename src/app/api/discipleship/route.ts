import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const day = searchParams.get('day');

  if (!day) return NextResponse.json({ error: 'Falta el día' }, { status: 400 });

  try {
    const db = await getDb();
    // Buscamos por el campo 'day' que es numérico
    const data = await db.get('SELECT * FROM Discipleship WHERE day = ?', [day]);
    await db.close();

    if (!data) return NextResponse.json({ error: 'Día no encontrado' }, { status: 404 });
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
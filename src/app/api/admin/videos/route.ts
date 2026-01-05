import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { title, category, url, thumbnail, artist } = await request.json();

    await db.execute({
      sql: "INSERT INTO videos (title, category, url, thumbnail, artist) VALUES (?, ?, ?, ?, ?)",
      args: [title, category, url, thumbnail, artist]
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Error en Turso" }, { status: 500 });
  }
}
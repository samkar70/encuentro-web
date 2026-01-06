import { NextResponse } from 'next/server';
import { getChapterByMoodLocal } from '@/lib/bible-local';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const mood = searchParams.get('m');
    if (!mood) return NextResponse.json({ error: 'Falta mood' }, { status: 400 });

    const result = getChapterByMoodLocal(mood);
    // Si no hay registro, enviamos un éxito falso para que el componente no se rompa
    if (!result) return NextResponse.json({ success: false });
    
    return NextResponse.json({ ...result, success: true });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
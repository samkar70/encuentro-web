import { NextResponse } from 'next/server';
import { getChapterByMoodLocal } from '@/lib/bible-local';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mood = searchParams.get('q');

  if (!mood) return NextResponse.json({ error: 'No mood provided' }, { status: 400 });

  const result = getChapterByMoodLocal(mood);
  return NextResponse.json(result);
}
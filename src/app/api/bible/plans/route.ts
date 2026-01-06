import { NextResponse } from 'next/server';
import { getPlanVersesLocal } from '@/lib/bible-local';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const topic = searchParams.get('topic');
  if (!topic) return NextResponse.json([]);
  
  const results = getPlanVersesLocal(topic);
  return NextResponse.json(results);
}
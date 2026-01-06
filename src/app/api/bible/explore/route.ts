import { NextResponse } from 'next/server';
import { getExploreResultsLocal } from '@/lib/bible-local';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const term = searchParams.get('t');
    if (!term) return NextResponse.json([]);
    
    const results = getExploreResultsLocal(term);
    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json([], { status: 500 });
  }
}
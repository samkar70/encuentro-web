import { NextResponse } from 'next/server';
import { getRandomVerseLocal } from '@/lib/bible-local';

export async function GET() {
  try {
    const result = getRandomVerseLocal();
    return NextResponse.json({ ...result, success: true });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
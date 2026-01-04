import { getVideos } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const videos = await getVideos();
    return NextResponse.json(videos);
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener videos" }, { status: 500 });
  }
}
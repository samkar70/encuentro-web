import { NextResponse } from 'next/server';
import { getDiscipleshipDayLocal } from '@/lib/bible-local';

/**
 * API para el Curso de Discipulado Cristiano
 * Recibe el parámetro 'day' (1, 2, 3 o 4) y devuelve la lección completa.
 */
export async function GET(request: Request) {
  try {
    // 1. Extraemos el parámetro 'day' de la URL
    const { searchParams } = new URL(request.url);
    const dayStr = searchParams.get('day');
    
    // 2. Validamos que el parámetro exista
    if (!dayStr) {
      return NextResponse.json(
        { success: false, error: 'Falta el parámetro del día' }, 
        { status: 400 }
      );
    }

    const day = parseInt(dayStr);

    // 3. Consultamos la base de datos local usando la función que definimos en bible-local.ts
    const lessonData = getDiscipleshipDayLocal(day);

    // 4. Si el día no existe en la base de datos
    if (!lessonData) {
      return NextResponse.json(
        { success: false, error: 'Día de discipulado no encontrado' }, 
        { status: 404 }
      );
    }

    // 5. Devolvemos la información completa al componente visual
    return NextResponse.json({
      ...lessonData,
      success: true
    });

  } catch (error) {
    console.error('Error en API de Discipulado:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' }, 
      { status: 500 }
    );
  }
}
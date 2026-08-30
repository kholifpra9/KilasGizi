import { NextResponse } from 'next/server';
import { generateMenu } from '@/lib/groq';
import { menuResultSchema } from '@/lib/schemas';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { budgetPerMeal, portions, mealTime, cheapIngredients } = body;

    if (!budgetPerMeal || !portions) {
      return NextResponse.json({ error: 'Budget dan jumlah porsi wajib diisi' }, { status: 400 });
    }

    const aiResult = await generateMenu(budgetPerMeal, portions, mealTime, cheapIngredients ?? []);

    const parsed = menuResultSchema.safeParse(aiResult);
    if (!parsed.success) {
      console.error('Zod validation failed:', JSON.stringify(parsed.error.issues, null, 2));
      return NextResponse.json({ error: 'Gagal membuat menu, coba lagi' }, { status: 422 });
    }

    return NextResponse.json({ result: parsed.data });
  } catch (error) {
    console.error('Unexpected error in /api/generate-menu:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
  }
}
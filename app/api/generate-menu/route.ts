import { NextResponse } from 'next/server';
import { generateMenu } from '@/lib/groq';
import { menuResultSchema } from '@/lib/schemas';
import { supabaseAdmin } from '@/lib/supabase-admin';

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

     // user_id masih null untuk sementara — Epic 6 akan mengisi ini dari session yang login.
    const { error: insertError } = await supabaseAdmin.from('menus').insert({
      budget: budgetPerMeal,
      portions,
      ingredients_input: cheapIngredients ?? [],
      ai_result: parsed.data,
      user_id: null,
    });

    if (insertError) {
      console.error('Gagal menyimpan menu ke riwayat:', insertError);
      // Sengaja TIDAK menghentikan response — user tetap dapat hasil menunya
      // meski penyimpanan riwayat gagal. Kegagalan simpan riwayat bukan alasan
      // untuk gagalkan seluruh permintaan user.
    }

    return NextResponse.json({ result: parsed.data });
  } catch (error) {
    console.error('Unexpected error in /api/generate-menu:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
  }
}
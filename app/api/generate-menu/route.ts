import { NextResponse } from 'next/server';
import { generateMenu } from '@/lib/groq';
import { menuResultSchema } from '@/lib/schemas';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { createClient as createServerSupabaseClient } from '@/lib/supabase/server'; 
import { checkAnonymousQuota, setQuotaCookie } from '@/lib/quota';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { budgetPerMeal, portions, mealTime, cheapIngredients } = body;

    if (!budgetPerMeal || !portions) {
      return NextResponse.json({ error: 'Budget dan jumlah porsi wajib diisi' }, { status: 400 });
    }

    // Cek status login, dan kalau anonim cek kuota dulu sebelum "membakar" API call.
    const supabaseServer = await createServerSupabaseClient();
    const { data: { user } } = await supabaseServer.auth.getUser();

    if (!user) {
      const { allowed } = await checkAnonymousQuota('anon_generate_menu_at');
      if (!allowed) {
        return NextResponse.json(
          {
            error: 'Jatah generate menu gratis hari ini sudah habis. Login untuk generate tanpa batas.',
            requiresLogin: true,
          },
          { status: 403 }
        );
      }
    }

    const aiResult = await generateMenu(budgetPerMeal, portions, mealTime, cheapIngredients ?? []);

    const parsed = menuResultSchema.safeParse(aiResult);
    if (!parsed.success) {
      console.error('Zod validation failed:', JSON.stringify(parsed.error.issues, null, 2));
      return NextResponse.json({ error: 'Gagal membuat menu, coba lagi' }, { status: 422 });
    }

    const { error: insertError } = await supabaseAdmin.from('menus').insert({
      budget: budgetPerMeal,
      portions,
      ingredients_input: cheapIngredients ?? [],
      ai_result: parsed.data,
      user_id: user?.id ?? null,
    });

    if (insertError) {
      console.error('Gagal menyimpan menu ke riwayat:', insertError);
    }

    const response = NextResponse.json({ result: parsed.data });

    if (!user) {
      setQuotaCookie(response, 'anon_generate_menu_at');
    }

    return response;
  } catch (error) {
    console.error('Unexpected error in /api/generate-menu:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
  }
}
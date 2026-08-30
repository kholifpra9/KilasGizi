import { createClient as createServerSupabaseClient } from '@/lib/supabase/server';
import type { MenuResult } from '@/lib/schemas';

export default async function HistoryPage() {
  // ✏️ DIUBAH — pakai session-aware client, bukan supabaseAdmin
  const supabaseServer = await createServerSupabaseClient();
  const { data: { user } } = await supabaseServer.auth.getUser();

  // Defense-in-depth: middleware (section 4) sudah redirect kalau belum login,
  // tapi tetap dicek di sini juga kalau-kalau middleware ke-skip untuk alasan tertentu
  if (!user) {
    return null;
  }

  const { data: menus } = await supabaseServer
    .from('menus')
    .select('id, budget, portions, ai_result, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(20);

  return (
    <div className="max-w-2xl mx-auto py-10 px-4 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Riwayat Menu</h1>
        <p className="text-sm text-muted-foreground">Menu yang pernah kamu buat sebelumnya.</p>
      </div>

      {menus && menus.length > 0 ? (
        <div className="space-y-4">
          {menus.map((item) => {
            const result = item.ai_result as MenuResult;
            return (
              <div key={item.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <h2 className="font-medium">{result.menu}</h2>
                  <span className="text-xs text-muted-foreground">
                    {new Date(item.created_at).toLocaleDateString('id-ID')}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Budget: Rp{item.budget?.toLocaleString('id-ID')} • {item.portions} porsi
                </p>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">Belum ada riwayat menu.</p>
      )}
    </div>
  );
}
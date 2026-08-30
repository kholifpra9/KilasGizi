import { supabaseAdmin } from '@/lib/supabase-admin';
import type { MenuResult } from '@/lib/schemas';

export default async function HistoryPage() {
  const { data: menus } = await supabaseAdmin
    .from('menus')
    .select('id, budget, portions, ai_result, created_at')
    .order('created_at', { ascending: false })
    .limit(20);

  return (
    <div className="max-w-2xl mx-auto py-10 px-4 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Riwayat Menu</h1>
        <p className="text-sm text-muted-foreground">Menu yang pernah dibuat sebelumnya.</p>
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
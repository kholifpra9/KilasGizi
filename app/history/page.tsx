import { createClient as createServerSupabaseClient } from '@/lib/supabase/server';
import type { MenuResult } from '@/lib/schemas';
import Link from 'next/link';

export default async function HistoryPage() {
  const supabaseServer = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabaseServer.auth.getUser();

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
    <div className="mx-auto max-w-4xl px-4 py-8 md:py-12">
      {/* Header Halaman */}
      <div className="mb-8 text-center max-w-lg mx-auto">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-kg-green/10 text-2xl mb-3">
          📜
        </div>
        <h1 className="font-display text-2xl md:text-3xl font-bold text-kg-ink">
          Riwayat Menu
        </h1>
        <p className="mt-1.5 text-xs md:text-sm text-kg-ink/60">
          Kumpulan resep & menu bergizi seimbang yang pernah kamu buat sebelumnya.
        </p>
      </div>

      {menus && menus.length > 0 ? (
        <div className="space-y-4">
          {menus.map((item) => {
            const result = item.ai_result as MenuResult;
            const formattedDate = new Date(item.created_at).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            });

            return (
              <details
                key={item.id}
                className="group rounded-3xl border border-kg-tan bg-card p-5 shadow-sm transition-all [&[open]]:shadow-md"
              >
                <summary className="flex cursor-pointer items-center justify-between list-none focus:outline-none">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-kg-green bg-kg-green/10 px-2.5 py-0.5 rounded-full">
                        {formattedDate}
                      </span>
                    </div>
                    <h2 className="font-display text-lg font-bold text-kg-ink group-hover:text-kg-green transition-colors">
                      {result?.menu ?? 'Menu Tanpa Nama'}
                    </h2>
                    <p className="text-xs text-kg-ink/60">
                      Budget: <span className="font-semibold text-kg-ink">Rp {item.budget?.toLocaleString('id-ID')}</span> • {item.portions} Porsi
                    </p>
                  </div>

                  {/* Icon Panah Toggle & Indikator Status */}
                  <div className="flex items-center gap-2 text-xs font-semibold text-kg-green">
                    <span className="hidden sm:inline text-kg-ink/50 group-open:hidden">
                      Lihat Detail
                    </span>
                    
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-background border border-kg-tan group-open:rotate-180 transition-transform duration-200">
                      <svg
                        className="h-4 w-4 text-kg-ink/70"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </summary>

                {/* Detail Menu saat Di-expand */}
                {result && (
                  <div className="mt-6 border-t border-kg-tan/40 pt-5 space-y-6 animate-in fade-in slide-in-from-top-1">
                    
                    {/* Daftar Bahan & Harga */}
                    {result.ingredients_and_prices && result.ingredients_and_prices.length > 0 && (
                      <div className="space-y-2">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-kg-ink/70">
                          Bahan & Estimasi Harga
                        </h3>
                        <div className="rounded-2xl border border-kg-tan/50 bg-background p-4 space-y-2">
                          {result.ingredients_and_prices.map((ing, i) => (
                            <div
                              key={i}
                              className="flex justify-between items-center text-xs border-b border-kg-tan/30 last:border-none pb-1.5 last:pb-0"
                            >
                              <span className="font-medium text-kg-ink">{ing.name}</span>
                              <span className="font-bold text-kg-green">
                                Rp {ing.price?.toLocaleString('id-ID')}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Langkah Memasak */}
                    {result.steps && result.steps.length > 0 && (
                      <div className="space-y-2">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-kg-ink/70">
                          Langkah Memasak
                        </h3>
                        <ol className="space-y-2 text-xs text-kg-ink/80 list-decimal pl-4">
                          {result.steps.map((step, i) => (
                            <li key={i} className="pl-1 leading-relaxed">
                              {step}
                            </li>
                          ))}
                        </ol>
                      </div>
                    )}

                    {/* Estimasi Nilai Gizi */}
                    {result.nutrition_score && (
                      <div className="space-y-2">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-kg-ink/70">
                          Ringkasan Nilai Gizi
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {Object.entries(result.nutrition_score).map(([key, value]) => (
                            <div key={key} className="rounded-xl border border-kg-tan/50 bg-background p-2.5 text-center">
                              <p className="text-[10px] text-kg-ink/50 capitalize">{key}</p>
                              <p className="text-xs font-bold text-kg-ink mt-0.5">{value}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  </div>
                )}
              </details>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="rounded-3xl border border-dashed border-kg-tan bg-card/50 p-12 text-center text-kg-ink/50 flex flex-col items-center justify-center min-h-[300px]">
          <span className="text-4xl mb-3">🍲</span>
          <p className="text-sm font-semibold">Belum Ada Riwayat Menu</p>
          <p className="text-xs mt-1 max-w-xs text-kg-ink/40 mb-4">
            Kamu belum pernah merancang menu. Mulai racik menu pertamamu sekarang!
          </p>
          <Link
            href="/generate-menu"
            className="rounded-full bg-kg-green px-6 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-kg-green-dark transition-all"
          >
            Buat Menu Baru ➔
          </Link>
        </div>
      )}
    </div>
  );
}
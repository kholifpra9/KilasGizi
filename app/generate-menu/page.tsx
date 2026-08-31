'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/supabase';
import type { MenuResult, CheapIngredient } from '@/lib/schemas';
import { allocateBudgetPerMeal, type MealTime } from '@/lib/budget-allocation';
import { createClient } from '@/lib/supabase/client';
import { exportMenuToPdf } from '@/lib/export-pdf';

export default function GenerateMenuPage() {
  const [budget, setBudget] = useState('');
  const [portions, setPortions] = useState('');
  const [mealTime, setMealTime] = useState<MealTime>('semua');
  const [cheapIngredients, setCheapIngredients] = useState<CheapIngredient[]>([]);
  const [isLoadingIngredients, setIsLoadingIngredients] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<MenuResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    async function loadCheapIngredients() {
      const { data } = await supabase
        .from('prices')
        .select('price_per_base_unit, unit, commodities!inner(name), reported_at')
        .order('reported_at', { ascending: false });

      const latestByCommodity = new Map<string, CheapIngredient & { reportedAt: string }>();
      data?.forEach((row) => {
        const name = (row.commodities as unknown as { name: string }).name;
        const existing = latestByCommodity.get(name);
        if (!existing || new Date(row.reported_at) > new Date(existing.reportedAt)) {
          latestByCommodity.set(name, {
            name,
            price: row.price_per_base_unit,
            unit: row.unit,
            reportedAt: row.reported_at,
          });
        }
      });

      const cheapest = Array.from(latestByCommodity.values())
        .sort((a, b) => a.price - b.price)
        .slice(0, 10)
        .map(({ name, price, unit }) => ({ name, price, unit }));

      setCheapIngredients(cheapest);
      setIsLoadingIngredients(false);
    }

    const client = createClient();
    client.auth.getUser().then(({ data }) => {
      setUserEmail(data.user?.email ?? null);
    });

    loadCheapIngredients();
  }, []);

  async function handleSubmit(e?: React.FormEvent) {
    if (e) e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    setResult(null);

    const budgetNumber = Number(budget);
    const portionsNumber = Number(portions);
    const budgetPerMeal = allocateBudgetPerMeal(budgetNumber, mealTime);

    try {
      const response = await fetch('/api/generate-menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          budgetPerMeal,
          portions: portionsNumber,
          mealTime,
          cheapIngredients,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 403 && data.requiresLogin) {
          setErrorMessage(data.error);
        } else {
          setErrorMessage(data.error ?? 'Terjadi kesalahan, coba lagi');
        }
        return;
      }

      setResult(data.result);
    } catch {
      setErrorMessage('Gagal terhubung ke server.');
    } finally {
      setIsLoading(false);
    }
  }

  function handleDownloadPdf() {
    if (!result) return;
    exportMenuToPdf(result, { budget: Number(budget), portions: Number(portions) });
  }

  const isFormValid = Number(budget) > 0 && Number(portions) > 0;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 md:py-12">
      
      {/* Header Halaman */}
      <div className="mb-8 text-center max-w-lg mx-auto">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-kg-green/10 text-2xl mb-3">
          ✨
        </div>
        <h1 className="font-display text-2xl md:text-3xl font-bold text-kg-ink">
          Buat Menu Sehat
        </h1>
        <p className="mt-1.5 text-xs md:text-sm text-kg-ink/60">
          Isi budget dan porsi harianmu. AI KilasGizi akan meracik resep bernutrisi seimbang sesuai harga pasar lokal terkini.
        </p>

        {!userEmail && (
          <div className="mt-3 inline-block rounded-full border border-kg-tan bg-card px-4 py-1.5 text-xs text-kg-ink/70 shadow-sm">
            💡 Mau simpan riwayat & generate tanpa batas?{' '}
            <Link href="/login?redirectTo=/generate-menu" className="font-bold text-kg-green underline">
              Masuk di sini
            </Link>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Form Kartu Input */}
        <form onSubmit={handleSubmit} className="md:col-span-5 rounded-3xl border border-kg-tan bg-card p-6 shadow-sm space-y-5">
          <h2 className="font-display text-lg font-bold text-kg-ink border-b border-kg-tan/40 pb-3">
            Parameter Menu
          </h2>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-kg-ink">Budget Total (Rp)</label>
            <Input
              type="number"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="Contoh: 30000"
              className="rounded-xl border-kg-tan bg-background px-4 py-2.5 text-sm focus-visible:ring-kg-green"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-kg-ink">Jumlah Porsi (Orang)</label>
            <Input
              type="number"
              value={portions}
              onChange={(e) => setPortions(e.target.value)}
              placeholder="Contoh: 3"
              className="rounded-xl border-kg-tan bg-background px-4 py-2.5 text-sm focus-visible:ring-kg-green"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-kg-ink">Waktu Makan</label>
            <select
              className="w-full rounded-xl border border-kg-tan bg-background px-4 py-2.5 text-sm text-kg-ink focus:outline-none focus:ring-2 focus:ring-kg-green"
              value={mealTime}
              onChange={(e) => setMealTime(e.target.value as MealTime)}
            >
              <option value="pagi">Sarapan (Pagi)</option>
              <option value="siang">Makan Siang</option>
              <option value="malam">Makan Malam</option>
              <option value="semua">Semua Waktu Makan (Pagi, Siang, Malam)</option>
            </select>
          </div>

          {/* Context Bahan Termurah */}
          {!isLoadingIngredients && cheapIngredients.length > 0 && (
            <div className="rounded-2xl border border-kg-tan/60 bg-background p-3 text-[11px] text-kg-ink/70">
              <span className="font-bold text-kg-green block mb-0.5">🥬 Acuan Bahan Pasar Murah Hari Ini:</span>
              <p className="line-clamp-2">
                {cheapIngredients.slice(0, 5).map((i) => i.name).join(', ')}
              </p>
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading || !isFormValid}
            className="w-full rounded-full bg-kg-green py-3 text-sm font-semibold text-white shadow-sm hover:bg-kg-green-dark transition-all disabled:opacity-50"
          >
            {isLoading ? 'Sedang Meracik Resep AI...' : 'Racik Menu Sekarang ➔'}
          </Button>

          {errorMessage && (
            <div className="rounded-xl border border-kg-coral/40 bg-kg-coral/10 p-3 text-xs text-kg-coral font-medium">
              <p>{errorMessage}</p>
              {errorMessage.includes('Login') && (
                <Link href="/login?redirectTo=/generate-menu" className="underline font-bold block mt-1">
                  Masuk Sekarang →
                </Link>
              )}
            </div>
          )}
        </form>

        {/* Panel Hasil Menu */}
        <div className="md:col-span-7">
          {result ? (
            <div className="rounded-3xl border border-kg-tan bg-card p-6 shadow-sm space-y-6 animate-in fade-in slide-in-from-bottom-2">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-kg-tan/40 pb-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-kg-green">Rekomendasi Menu AI</span>
                  <h2 className="font-display text-xl font-bold text-kg-ink">{result.menu}</h2>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadPdf}
                  className="rounded-full border-kg-tan bg-background text-xs font-semibold text-kg-ink hover:bg-kg-tan/30 shrink-0"
                >
                  📄 Cetak PDF
                </Button>
              </div>

              {/* Daftar Bahan & Harga */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-kg-ink/70">Bahan & Estimasi Harga</h3>
                <div className="rounded-2xl border border-kg-tan/50 bg-background p-4 space-y-2">
                  {result.ingredients_and_prices.map((ing, i) => (
                    <div key={i} className="flex justify-between items-center text-xs border-b border-kg-tan/30 last:border-none pb-1.5 last:pb-0">
                      <span className="font-medium text-kg-ink">{ing.name}</span>
                      <span className="font-bold text-kg-green">Rp {ing.price.toLocaleString('id-ID')}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Langkah Memasak */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-kg-ink/70">Langkah Memasak</h3>
                <ol className="space-y-2 text-xs text-kg-ink/80 list-decimal pl-4">
                  {result.steps.map((step, i) => (
                    <li key={i} className="pl-1 leading-relaxed">{step}</li>
                  ))}
                </ol>
              </div>

              {/* Estimasi Gizi */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-kg-ink/70">Ringkasan Nilai Gizi</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {Object.entries(result.nutrition_score).map(([key, value]) => (
                    <div key={key} className="rounded-xl border border-kg-tan/50 bg-background p-2.5 text-center">
                      <p className="text-[10px] text-kg-ink/50 capitalize">{key}</p>
                      <p className="text-xs font-bold text-kg-ink mt-0.5">{value}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-kg-tan bg-card/50 p-12 text-center text-kg-ink/50 flex flex-col items-center justify-center min-h-[360px]">
              <span className="text-4xl mb-3">🥗</span>
              <p className="text-sm font-semibold">Belum Ada Menu Dihasilkan</p>
              <p className="text-xs mt-1 max-w-xs text-kg-ink/40">
                Silakan isi parameter budget dan jumlah porsi di sebelah kiri, lalu klik &quot;Racik Menu Sekarang&quot;.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
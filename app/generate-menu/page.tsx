'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/supabase';
import type { MenuResult, CheapIngredient } from '@/lib/schemas';
import { allocateBudgetPerMeal, type MealTime } from '@/lib/budget-allocation';
import { createClient } from '@/lib/supabase/client';

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

  // Ambil bahan termurah dari data TanyaHarga — LANGSUNG dari Supabase,
  // tanpa lewat API TanyaHarga sama sekali (sesuai keputusan arsitektur "shared Supabase")
  useEffect(() => {
    async function loadCheapIngredients() {
      const { data } = await supabase
        .from('prices')
        .select('price_per_base_unit, unit, commodities!inner(name), reported_at')
        .order('reported_at', { ascending: false });

      // Dedup: ambil laporan TERBARU per komoditas dulu (sama prinsip dengan
      // lib/price-aggregation.ts TanyaHarga, tapi lebih sederhana — di sini
      // tidak perlu rata-rata lintas pasar, cukup harga terbaru saja)
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

      // Urutkan dari termurah, ambil 10 teratas untuk dikirim sebagai konteks ke AI
      const cheapest = Array.from(latestByCommodity.values())
        .sort((a, b) => a.price - b.price)
        .slice(0, 10)
        .map(({ name, price, unit }) => ({ name, price, unit }));

      setCheapIngredients(cheapest);
      setIsLoadingIngredients(false);
    }
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUserEmail(data.user?.email ?? null);
    });

    loadCheapIngredients();
  }, []);

  async function handleSubmit() {
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
    } catch (error) {
      setErrorMessage('Gagal terhubung ke server.');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.reload();
  }

  const isFormValid = Number(budget) > 0 && Number(portions) > 0;

  return (
    <div className="max-w-xl mx-auto py-10 px-4 space-y-4">
      <div className="flex justify-between items-center text-sm">
        {userEmail ? (
          <>
            <span className="text-muted-foreground">Login sebagai {userEmail}</span>
            <div className="flex gap-3">
              <a href="/history" className="underline text-muted-foreground">Riwayat</a>
              <button onClick={handleLogout} className="underline text-muted-foreground">Keluar</button>
            </div>
          </>
        ) : (
          <a href="/login?redirectTo=/generate-menu" className="underline text-muted-foreground">
            Login untuk generate tanpa batas
          </a>
        )}
      </div>
      <div>
        <h1 className="text-2xl font-semibold">Buat Menu Sehat</h1>
        <p className="text-sm text-muted-foreground">
          Isi budget dan jumlah porsi, kami carikan menu sehat sesuai bahan murah hari ini.
        </p>
      </div>

      <div className="space-y-3">
        <div>
          <label className="text-sm font-medium">Budget (Rp)</label>
          <Input type="number" value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="25000" />
        </div>
        <div>
          <label className="text-sm font-medium">Jumlah Porsi</label>
          <Input type="number" value={portions} onChange={(e) => setPortions(e.target.value)} placeholder="4" />
        </div>
        <div>
          <label className="text-sm font-medium">Waktu Makan</label>
          <select
            className="w-full border rounded-md px-3 py-2 text-sm"
            value={mealTime}
            onChange={(e) => setMealTime(e.target.value as MealTime)}
          >
            <option value="pagi">Pagi</option>
            <option value="siang">Siang</option>
            <option value="malam">Malam</option>
            <option value="semua">Semua (Pagi, Siang, Malam)</option>
          </select>
        </div>
      </div>

      {!isLoadingIngredients && cheapIngredients.length > 0 && (
        <p className="text-xs text-muted-foreground">
          Bahan termurah hari ini: {cheapIngredients.slice(0, 5).map((i) => i.name).join(', ')}
        </p>
      )}

      <Button onClick={handleSubmit} disabled={isLoading || !isFormValid}>
        {isLoading ? 'Membuat menu...' : 'Buat Menu'}
      </Button>

      {errorMessage && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3">
          <p>{errorMessage}</p>
          {errorMessage.includes('Login') && (
            <a href="/login?redirectTo=/generate-menu" className="underline font-medium">
              Login sekarang →
            </a>
          )}
        </div>
      )}

      {result && (
        <div className="border rounded-lg p-4 space-y-3">
          <h2 className="font-semibold">{result.menu}</h2>

          <div>
            <p className="text-sm font-medium">Bahan & Harga:</p>
            <ul className="text-sm text-muted-foreground list-disc pl-5">
              {result.ingredients_and_prices.map((ing, i) => (
                <li key={i}>{ing.name} — Rp{ing.price.toLocaleString('id-ID')}</li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-medium">Langkah Masak:</p>
            <ol className="text-sm text-muted-foreground list-decimal pl-5">
              {result.steps.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          </div>

          <div>
            <p className="text-sm font-medium">Skor Gizi:</p>
            <ul className="text-sm text-muted-foreground">
              {Object.entries(result.nutrition_score).map(([key, value]) => (
                <li key={key}>{key}: {value}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
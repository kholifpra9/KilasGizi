'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') ?? '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    const supabase = createClient();

    const { error } =
      mode === 'login'
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });

    if (error) {
      setErrorMessage(error.message);
      setIsLoading(false);
      return;
    }

    // Lakukan refresh router untuk memperbarui session server & client
    router.refresh();
    router.push(redirectTo);
  }

  return (
    <div className="flex min-h-[calc(100vh-140px)] items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md rounded-3xl border border-kg-tan bg-card p-8 shadow-sm">
        
        {/* Header Icon & Brand */}
        <div className="mb-6 text-center">
          <Link href="/" className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-kg-green/10 text-2xl mb-3">
            🥗
          </Link>
          <h1 className="font-display text-2xl font-bold text-kg-ink">
            {mode === 'login' ? 'Selamat Datang Kembali' : 'Buat Akun KilasGizi'}
          </h1>
          <p className="mt-1 text-xs text-kg-ink/60">
            {mode === 'login'
              ? 'Masuk untuk merancang menu tanpa batas dan menyimpan riwayat resep kamu.'
              : 'Daftar sekarang untuk mulai menyimpan resep hemat dan bergizi seimbang.'}
          </p>
        </div>

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-kg-ink">Email</label>
            <Input
              type="email"
              placeholder="nama@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="rounded-xl border-kg-tan bg-background px-4 py-2.5 text-sm focus-visible:ring-kg-green"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-kg-ink">Password</label>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="rounded-xl border-kg-tan bg-background px-4 py-2.5 text-sm focus-visible:ring-kg-green"
            />
          </div>

          {errorMessage && (
            <div className="rounded-xl border border-kg-coral/40 bg-kg-coral/10 p-3 text-xs text-kg-coral font-medium">
              {errorMessage}
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-full bg-kg-green py-3 text-sm font-semibold text-white shadow-sm hover:bg-kg-green-dark transition-all"
          >
            {isLoading ? 'Memproses...' : mode === 'login' ? 'Masuk' : 'Daftar Sekarang'}
          </Button>
        </form>

        {/* Mode Switcher */}
        <div className="mt-6 text-center border-t border-kg-tan/40 pt-4">
          <button
            type="button"
            className="text-xs font-medium text-kg-ink/70 hover:text-kg-green transition-colors"
            onClick={() => {
              setMode(mode === 'login' ? 'signup' : 'login');
              setErrorMessage(null);
            }}
          >
            {mode === 'login' ? (
              <span>Belum punya akun? <strong className="text-kg-green underline">Daftar di sini</strong></span>
            ) : (
              <span>Sudah punya akun? <strong className="text-kg-green underline">Masuk di sini</strong></span>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
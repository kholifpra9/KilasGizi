import Link from 'next/link';
import { KilasGiziLogo } from '@/components/ui/logo';

export function Footer() {
  return (
    <footer className="border-t border-kg-tan bg-card text-kg-ink">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          
          {/* Deskripsi Brand */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="hover:opacity-90 transition-opacity">
                <KilasGiziLogo size={36} />
            </Link>
            <p className="text-xs text-kg-ink/70 leading-relaxed max-w-sm">
              Solusi cerdas penyusun menu harian bergizi seimbang yang menyesuaikan dengan alokasi budget belanja dan fluktuasi harga bahan pangan real-time.
            </p>
          </div>

          {/* Navigasi Cepat */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-kg-green">Navigasi</h4>
            <ul className="space-y-2 text-xs text-kg-ink/70">
              <li>
                <Link href="/" className="hover:text-kg-green transition-colors">Beranda</Link>
              </li>
              <li>
                <Link href="/generate-menu" className="hover:text-kg-green transition-colors">Buat Menu AI</Link>
              </li>
              <li>
                <Link href="/history" className="hover:text-kg-green transition-colors">Riwayat Menu</Link>
              </li>
            </ul>
          </div>

          {/* Info Tambahan */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-kg-green">Sumber Data</h4>
            <p className="text-xs text-kg-ink/70 leading-relaxed">
              Integrasi langsung dengan komoditas pasar lokal untuk kalkulasi alokasi bahan terakurat.
            </p>
          </div>

        </div>

        {/* Copyright & Bottom Bar */}
        <div className="mt-12 border-t border-kg-tan/40 pt-6 flex flex-col items-center justify-between gap-4 text-[11px] text-kg-ink/50 sm:flex-row">
          <p>© {new Date().getFullYear()} KilasGizi. All rights reserved.</p>
          <p>Makan Sehat Tanpa Bikin Kantong Bolong 💚</p>
        </div>
      </div>
    </footer>
  );
}
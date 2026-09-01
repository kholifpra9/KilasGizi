import Link from 'next/link';
import Image from 'next/image';
import {IconArrowRight, IconChart, IconFire, IconMoneyBag, IconVegetarionFood, } from '@/components/ui/icons';


export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-kg-ink">
      {/* Hero Section */}
      <section className="mx-auto max-w-6xl px-6 pt-8 pb-16 md:pt-16">
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-12">
          
          {/* Kolom Kiri - Teks & CTA */}
          <div className="flex flex-col space-y-6 md:col-span-6">
            <h1 className="font-display text-4xl leading-tight font-extrabold text-kg-ink md:text-6xl">
              MAKAN SEHAT <br />
              <span className="italic font-normal text-kg-green">TANPA BIKIN</span> KANTONG BOLONG.
            </h1>

            {/* Social Proof Badges */}
            <div className="flex items-center gap-3 pt-2">
              <div className="flex -space-x-2">
                <div className="h-9 w-9 rounded-full bg-kg-green text-white border-2 border-background flex items-center justify-center text-xs font-bold">👩‍🍳</div>
                <div className="h-9 w-9 rounded-full bg-kg-gold text-white border-2 border-background flex items-center justify-center text-xs font-bold">👨‍🌾</div>
                <div className="h-9 w-9 rounded-full bg-kg-coral text-white border-2 border-background flex items-center justify-center text-xs font-bold">🥗</div>
              </div>
              <div className="text-xs text-kg-ink/70">
                <span className="font-bold text-kg-ink">1.200+</span> Menu bergizi dibuat sesuai budget lokal
              </div>
            </div>

            <p className="text-sm text-kg-ink/70 leading-relaxed md:text-base max-w-md">
              KilasGizi menghubungkan harga pasar komoditas real-time dengan kecerdasan AI untuk meracik menu harian hemat, bergizi seimbang, dan pas porsi keluarga.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                href="/generate-menu"
                className="inline-flex items-center justify-center rounded-full bg-kg-green px-8 py-4 font-semibold text-white shadow-md hover:bg-kg-green-dark transition-all"
              >
                Rancang Menu Sekarang <IconArrowRight size={15} className="text-accent shrink-0" />
              </Link>
              <Link
                href="#resep-populer"
                className="inline-flex items-center justify-center rounded-full border border-kg-tan bg-card px-6 py-4 font-medium text-kg-ink hover:bg-kg-tan/30 transition-all"
              >
                Lihat Resep Hemat
              </Link>
            </div>
          </div>

          {/* Kolom Kanan - Arch Image Hero & Floating Cards */}
          <div className="relative flex justify-center md:col-span-6">
            
            {/* Arch Frame Utama */}
            <div className="relative h-[380px] w-[260px] md:h-[460px] md:w-[320px] rounded-t-full border-2 border-kg-tan bg-card p-3 shadow-xl">
              <div className="relative h-full w-full overflow-hidden rounded-t-full">
                <Image
                  src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop"
                  alt="Salad Bergizi KilasGizi"
                  fill
                  className="object-cover"
                  priority
                />
              </div>

            </div>

            {/* Floating Card 1: Diskon / Hemat */}
            <div className="absolute top-10 right-0 md:-right-4 rounded-2xl bg-card/90 p-4 shadow-md backdrop-blur-md border border-kg-tan flex items-center gap-3">
              <span className="text-2xl"><IconFire size={16} className="text-kg-gold shrink-0" /></span>
              <div>
                <p className="text-xs font-bold text-kg-ink">Hemat hingga 40%</p>
                <p className="text-[10px] text-kg-ink/60">Berdasarkan data pasar real-time</p>
              </div>
            </div>

            {/* Floating Card 2: Contoh Menu Terhemat */}
            <div className="absolute bottom-6 -right-2 md:-right-8 rounded-2xl bg-card/95 p-3.5 shadow-lg border border-kg-tan flex items-center gap-3 w-56">
              <div className="relative h-12 w-12 rounded-xl overflow-hidden shrink-0">
                <Image
                  src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=200&auto=format&fit=crop"
                  alt="Tumis Tahu Tempe"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-kg-ink truncate">Tumis Tahu & Bayam</p>
                <p className="text-[11px] font-semibold text-kg-green">Rp 12.500 / porsi</p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Feature Section */}
      <section className="border-t border-b border-kg-tan bg-card py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="font-display text-2xl font-bold md:text-3xl">Pilih Sehat, Tetap Hemat</h2>
            <p className="text-xs text-kg-ink/60 mt-2">Disesuaikan langsung dengan fluktuasi harga sembako harian.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="rounded-3xl border border-kg-tan bg-background p-6 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-kg-gold/20 text-2xl"><IconMoneyBag size={25} className="text-kg-ink shrink-0" /></div>
              <h3 className="font-bold text-lg mb-2">Sesuai Budget</h3>
              <p className="text-xs text-kg-ink/70">Cukup masukkan alokasi uang belanja kamu, sistem membaginya presisi untuk tiap waktu makan.</p>
            </div>

            <div className="rounded-3xl border border-kg-tan bg-background p-6 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-kg-gold/20 text-2xl"><IconVegetarionFood size={25} className="text-kg-ink shrink-0" /></div>
              <h3 className="font-bold text-lg mb-2">Bahan Lokal Murah</h3>
              <p className="text-xs text-kg-ink/70">Memanfaatkan komoditas pasar lokal yang sedang turun harga atau stabil untuk efisiensi.</p>
            </div>

            <div className="rounded-3xl border border-kg-tan bg-background p-6 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-kg-gold/20 text-2xl"><IconChart size={25} className="text-kg-ink shrink-0" /></div>
              <h3 className="font-bold text-lg mb-2">Gizi Terukur</h3>
              <p className="text-xs text-kg-ink/70">Setiap resep dilengkapi estimasi kalori, makronutrisi, dan panduan memasak cepat.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section Resep Populer & Hemat */}
      <section id="resep-populer" className="mx-auto max-w-6xl px-6 py-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-kg-coral">Inspirasi Harian</span>
            <h2 className="font-display text-3xl font-bold mt-1">Resep Hemat Pilihan AI</h2>
          </div>
          <Link href="/generate-menu" className="inline-flex items-center gap-2 text-sm font-semibold text-kg-green hover:underline">
            <span>Generate Menu Custom Anda</span> <IconArrowRight size={15} className="text-kg-green shrink-0" />
          </Link>
        </div>

        {/* Grid Resep Makanan */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

          {/* Card Resep 1 */}
          <div className="group rounded-3xl border border-kg-tan bg-card overflow-hidden shadow-sm hover:shadow-md transition-all">
            <div className="relative h-52 w-full bg-kg-tan/30 overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=600&auto=format&fit=crop"
                alt="Salad Telur Dada Ayam"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute top-4 left-4 rounded-full bg-card/90 backdrop-blur-md px-3 py-1 text-xs font-bold text-kg-green">
                Pagi / Sarapan
              </span>
            </div>
            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-base text-kg-ink">Salad Orak-Arik Telur & Tempe</h3>
                <span className="font-extrabold text-kg-green text-sm">~Rp 8.500</span>
              </div>
              <p className="text-xs text-kg-ink/60 line-clamp-2 mb-4">
                Kombinasi protein tinggi dari telur dan tempe dengan serat sayur segar lokal.
              </p>
              <div className="flex items-center justify-between border-t border-kg-tan/40 pt-3 text-[11px] text-kg-ink/60">
                <span>⏱️ 15 Menit</span>
                <span>🔥 350 Kcal</span>
              </div>
            </div>
          </div>

          {/* Card Resep 2 */}
          <div className="group rounded-3xl border border-kg-tan bg-card overflow-hidden shadow-sm hover:shadow-md transition-all">
            <div className="relative h-52 w-full bg-kg-tan/30 overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=600&auto=format&fit=crop"
                alt="Sup Bening Bayam"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute top-4 left-4 rounded-full bg-card/90 backdrop-blur-md px-3 py-1 text-xs font-bold text-kg-gold">
                Siang / Makan Siang
              </span>
            </div>
            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-base text-kg-ink">Sup Bening Bayam & Jagung</h3>
                <span className="font-extrabold text-kg-green text-sm">~Rp 11.000</span>
              </div>
              <p className="text-xs text-kg-ink/60 line-clamp-2 mb-4">
                Segar, kaya zat besi dan vitamin C dari bayam dipadukan manisnya jagung manis.
              </p>
              <div className="flex items-center justify-between border-t border-kg-tan/40 pt-3 text-[11px] text-kg-ink/60">
                <span>⏱️ 20 Menit</span>
                <span>🔥 410 Kcal</span>
              </div>
            </div>
          </div>

          {/* Card Resep 3 */}
          <div className="group rounded-3xl border border-kg-tan bg-card overflow-hidden shadow-sm hover:shadow-md transition-all">
            <div className="relative h-52 w-full bg-kg-tan/30 overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=600&auto=format&fit=crop"
                alt="Pepes Tahu Kemangi"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute top-4 left-4 rounded-full bg-card/90 backdrop-blur-md px-3 py-1 text-xs font-bold text-kg-coral">
                Malam / Makan Malam
              </span>
            </div>
            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-base text-kg-ink">Pepes Tahu Kemangi Kukus</h3>
                <span className="font-extrabold text-kg-green text-sm">~Rp 9.000</span>
              </div>
              <p className="text-xs text-kg-ink/60 line-clamp-2 mb-4">
                Olahan protein tanpa minyak berlebih, wangi rempah kemangi meningkatkan nafsu makan.
              </p>
              <div className="flex items-center justify-between border-t border-kg-tan/40 pt-3 text-[11px] text-kg-ink/60">
                <span>⏱️ 25 Menit</span>
                <span>🔥 280 Kcal</span>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
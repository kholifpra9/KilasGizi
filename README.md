# 🥗 KilasGizi — Menu Sehat Sesuai Budget

[![Live Demo](https://img.shields.io/badge/Demo-kilas--gizi.vercel.app-2D6A4F?style=for-the-badge&logo=vercel)](https://kilas-gizi.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js-16.3.1-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth_%26_DB-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)

**KilasGizi** adalah aplikasi penyusun menu harian berbasis AI yang meracik resep bergizi seimbang berdasarkan alokasi budget belanja dan data fluktuasi harga komoditas pangan lokal secara real-time[cite: 1].

🌐 **Akses Aplikasi Live:** [https://kilas-gizi.vercel.app/](https://kilas-gizi.vercel.app/)

---

## ✨ Fitur Utama

- **🤖 AI Menu Generator (`/generate-menu`):** Menghasilkan kombinasi resep harian (Pagi, Siang, Malam, atau Semua) berdasarkan alokasi budget dan jumlah porsi[cite: 1].
- **📊 Integrasi Harga Pasar Real-Time:** Memanfaatkan data komoditas pangan termurah dari Supabase untuk kalkulasi alokasi bahan terakurat[cite: 1].
- **📄 Ekspor PDF Resep:** Cetak dan unduh hasil menu yang dihasilkan langsung ke format PDF secara instan tanpa biaya server[cite: 1].
- **📜 Riwayat Menu Tersimpan (`/history`):** Menyimpan daftar resep dan estimasi gizi yang pernah dibuat sebelumnya untuk pengguna terautentikasi[cite: 1].
- **🔐 Autentikasi & Model Akses Freemium:** Pengunjung anonim dapat mencoba generate menu gratis, sementara pengguna login mendapatkan akses tanpa batas dan riwayat simpan[cite: 1].
- **📱 Responsive & Mobile-Friendly:** Antarmuka bergaya *Editorial Modern* dengan skema warna alami (`kg-cream`, `kg-green`, `kg-tan`)[cite: 1].

---

## 🛠️ Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router) & [React 19](https://react.dev/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/), `@tailwindcss/postcss`, `tw-animate-css`
- **UI Components & Icons:** Shadcn/ui (`@base-ui/react`), Hugeicons (`@hugeicons/react`)
- **Backend & Database:** [Supabase](https://supabase.com/) (`@supabase/ssr` & `@supabase/supabase-js`)
- **PDF Generation:** Client-side PDF export via `jspdf`
- **Deployment:** [Vercel](https://vercel.com/)

---

## 🚀 Panduan Memulai (Local Development)

### 1. Clone Repository & Install Dependencies

```bash
git clone [https://github.com/username/kilasgizi.git](https://github.com/username/kilasgizi.git)
cd kilasgizi
npm install
2. Setup Environment Variables
Buat file .env.local di root project dan isi dengan kredensial Supabase serta API Key Groq:

Cuplikan kode
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=[https://your-supabase-project.supabase.co](https://your-supabase-project.supabase.co)
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# AI Engine (Groq / Provider Lain)
GROQ_API_KEY=your-groq-api-key
3. Jalankan Development Server
Bash
npm run dev
Buka http://localhost:3000 pada browser Anda.

📁 Struktur Folder Utama
Plaintext
kilasgizi/
├── app/
│   ├── api/
│   │   └── generate-menu/    # Route handler integrasi AI & kuota
│   ├── generate-menu/        # Form parameter & hasil resep
│   ├── history/              # Halaman riwayat menu tersimpan
│   ├── login/                # Halaman login & signup (Auth)
│   ├── globals.css           # Konfigurasi Tailwind v4 & tema warna
│   ├── layout.tsx            # Root layout dengan Navbar & Footer
│   └── page.tsx              # Landing page utama
├── components/
│   ├── ui/                   # Komponen Reusable (Navbar, Footer, Logo, Input, Button)
├── lib/
│   ├── supabase/             # Supabase client & server instances
│   ├── budget-allocation.ts  # Logic pembagian budget per waktu makan
│   ├── export-pdf.ts         # Utility generate & download PDF
│   └── schemas.ts            # Skema validasi Zod untuk AI response
└── package.json


📝 Script yang Tersedia
npm run dev — Menjalankan server pengembangan lokal

npm run build — Melakukan kompilasi dan build produksi

npm run start — Menjalankan server produksi hasil build

npm run lint — Memeriksa kode menggunakan ESLint

🌐 Deployment
Projek ini dikonfigurasi untuk langsung dapat dideploy di Vercel:

Push repo ke GitHub / GitLab.

Import project ke dashboard Vercel.

Masukkan Environment Variables (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY, GROQ_API_KEY).

Klik Deploy.

© 2026 KilasGizi. All rights reserved. Makan Sehat Tanpa Bikin Kantong Bolong 💚
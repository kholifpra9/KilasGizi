import type { Metadata } from 'next';
import { Baloo_2, Plus_Jakarta_Sans } from 'next/font/google';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/ui/footer';
import './globals.css';

const baloo = Baloo_2({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['600', '700', '800'],
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans', // 🔑 override variable font-sans yang sudah ada, bukan bikin nama baru
});

export const metadata: Metadata = {
  title: 'KilasGizi — Menu Sehat Sesuai Budget',
  description: 'Ubah uang belanja hari ini jadi menu bergizi untuk keluarga.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${baloo.variable} ${jakarta.variable}`}>
      <body className="bg-kg-cream text-kg-ink antialiased">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
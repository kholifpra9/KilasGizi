'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { KilasGiziLogo } from '@/components/ui/logo';

const NAV_LINKS = [
  { href: '/generate-menu', label: 'Buat Menu' },
  { href: '/history', label: 'Riwayat' },
];

export function Navbar() {
  const pathname = usePathname();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUserEmail(data.user?.email ?? null));
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = '/';
  }

  const userInitial = userEmail ? userEmail.charAt(0).toUpperCase() : 'U';

  return (
    <header className="sticky top-0 z-50 border-b border-kg-tan/50 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
        
        {/* Brand Logo */}
        <Link href="/" className="hover:opacity-90 transition-opacity">
          <KilasGiziLogo size={36} />
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`transition-colors duration-200 ${
                pathname === link.href ? 'font-bold text-kg-green' : 'text-kg-ink/70 hover:text-kg-ink'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop User Auth / Dropdown Menu */}
        <div className="hidden items-center gap-4 md:flex">
          {userEmail ? (
            <div className="relative" ref={dropdownRef}>
              {/* Profile Trigger Button */}
              <button
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="flex items-center gap-2.5 rounded-full border border-kg-tan bg-card px-3 py-1.5 shadow-sm hover:border-kg-green/50 hover:shadow-md transition-all"
                aria-expanded={dropdownOpen}
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-kg-green text-xs font-bold text-white">
                  {userInitial}
                </div>
                <span className="max-w-[130px] truncate text-xs font-semibold text-kg-ink">
                  {userEmail.split('@')[0]}
                </span>
                <svg
                  className={`h-4 w-4 text-kg-ink/50 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown Content */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-kg-tan bg-card p-2 shadow-xl animate-in fade-in slide-in-from-top-2 z-50">
                  <div className="border-b border-kg-tan/40 px-3 py-2.5">
                    <p className="text-[11px] font-medium text-kg-ink/50">Masuk sebagai</p>
                    <p className="truncate text-xs font-bold text-kg-ink">{userEmail}</p>
                  </div>

                  <div className="py-1">
                    <Link
                      href="/generate-menu"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-kg-ink hover:bg-kg-tan/30 transition-colors"
                    >
                      <span>✨</span> Buat Menu Baru
                    </Link>
                    <Link
                      href="/history"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-kg-ink hover:bg-kg-tan/30 transition-colors"
                    >
                      <span>📜</span> Riwayat Tersimpan
                    </Link>
                  </div>

                  <div className="border-t border-kg-tan/40 pt-1">
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-semibold text-kg-coral hover:bg-kg-coral/10 transition-colors"
                    >
                      <span>🚪</span> Keluar
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="rounded-full bg-kg-green px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-kg-green-dark transition-all"
            >
              Masuk
            </Link>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          className="flex flex-col gap-1.5 p-2 md:hidden"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Buka menu"
        >
          <span className={`h-0.5 w-6 rounded-full bg-kg-ink transition-transform ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`h-0.5 w-6 rounded-full bg-kg-ink transition-opacity ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`h-0.5 w-6 rounded-full bg-kg-ink transition-transform ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Mobile Drawer */}
      {menuOpen && (
        <nav className="flex flex-col gap-2 border-b border-kg-tan bg-background px-6 py-4 shadow-lg md:hidden animate-in slide-in-from-top-2">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`py-2 text-sm font-medium border-b border-kg-tan/30 ${
                pathname === link.href ? 'text-kg-green font-bold' : 'text-kg-ink'
              }`}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}

          {userEmail ? (
            <div className="pt-3 flex flex-col gap-3">
              <div className="flex items-center gap-2.5 rounded-xl bg-card p-3 border border-kg-tan">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-kg-green text-xs font-bold text-white">
                  {userInitial}
                </div>
                <div className="overflow-hidden">
                  <p className="text-[10px] text-kg-ink/50">Akun terhubung</p>
                  <p className="truncate text-xs font-bold text-kg-ink">{userEmail}</p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="w-full text-center rounded-xl border border-kg-coral/40 bg-kg-coral/10 py-2.5 text-xs font-bold text-kg-coral"
              >
                Keluar
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="mt-2 text-center rounded-full bg-kg-green py-2.5 text-xs font-bold text-white"
              onClick={() => setMenuOpen(false)}
            >
              Masuk
            </Link>
          )}
        </nav>
      )}
    </header>
  );
}
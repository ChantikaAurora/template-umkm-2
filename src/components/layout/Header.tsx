'use client';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Store, LayoutDashboard, LogOut, User, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-gradient-to-br from-violet-600 to-violet-800 rounded-xl flex items-center justify-center shadow-btn-violet group-hover:shadow-glow transition-all duration-300">
              <Store className="w-4.5 h-4.5 text-white w-5 h-5" />
            </div>
            <span className="font-bold text-slate-900 text-lg tracking-tight">
              UMKM<span className="text-violet-600">Digital</span>
            </span>
          </Link>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-1">
            <Link href="/katalog" className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all">Katalog</Link>
            <Link href="/cerita" className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all">Cerita</Link>
            <Link href="/event" className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all">Event</Link>
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-2">
            {session ? (
              <>
                <Link href="/dashboard">
                  <Button variant="outline" size="sm">
                    <LayoutDashboard className="w-4 h-4 mr-1.5" /> Dashboard
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={() => signOut({ callbackUrl: '/' })}>
                  <LogOut className="w-4 h-4 mr-1.5" /> Keluar
                </Button>
              </>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm">Masuk</Button>
                </Link>
                <Link href="/auth/register">
                  <Button variant="default" size="sm">Daftar Gratis</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden pb-4 border-t border-slate-200 pt-4 space-y-1">
            <Link href="/katalog" className="block px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg">Katalog</Link>
            <Link href="/cerita" className="block px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg">Cerita</Link>
            <Link href="/event" className="block px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg">Event</Link>
            <div className="pt-2 border-t border-slate-200 flex gap-2">
              {session ? (
                <Link href="/dashboard" className="flex-1"><Button variant="default" size="sm" className="w-full">Dashboard</Button></Link>
              ) : (
                <>
                  <Link href="/auth/login" className="flex-1"><Button variant="outline" size="sm" className="w-full">Masuk</Button></Link>
                  <Link href="/auth/register" className="flex-1"><Button variant="default" size="sm" className="w-full">Daftar</Button></Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

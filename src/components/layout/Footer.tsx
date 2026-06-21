import Link from 'next/link';
import { Store, Github, Instagram, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-navy-950 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-violet-600 to-violet-800 rounded-xl flex items-center justify-center">
                <Store className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-white text-lg">UMKM<span className="text-violet-400">Digital</span></span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs mb-6">
              Platform ekosistem digital modern untuk UMKM Indonesia. Kelola, promosikan, dan kembangkan bisnis Anda.
            </p>
            <div className="flex gap-3">
              {[Instagram, Twitter, Github].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 bg-navy-800 hover:bg-violet-600 rounded-lg flex items-center justify-center transition-colors">
                  <Icon className="w-4 h-4 text-slate-400 hover:text-white" />
                </a>
              ))}
            </div>
          </div>

          {/* Platform */}
          <div>
            <p className="font-semibold text-slate-200 mb-4 text-sm uppercase tracking-wider">Platform</p>
            <ul className="space-y-2.5">
              {[['Katalog UMKM', '/katalog'], ['Cerita & Blog', '/cerita'], ['Event', '/event'], ['Daftar UMKM', '/auth/register']].map(([label, href]) => (
                <li key={href}><Link href={href} className="text-sm hover:text-violet-400 transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Akun */}
          <div>
            <p className="font-semibold text-slate-200 mb-4 text-sm uppercase tracking-wider">Akun</p>
            <ul className="space-y-2.5">
              {[['Masuk', '/auth/login'], ['Registrasi', '/auth/register'], ['Dashboard', '/dashboard'], ['Profil', '/dashboard/profile']].map(([label, href]) => (
                <li key={href}><Link href={href} className="text-sm hover:text-violet-400 transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-navy-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs">© 2026 UMKM Digital. All rights reserved.</p>
          <p className="text-xs">Dibuat dengan <span className="text-violet-400">♥</span> untuk UMKM Indonesia</p>
        </div>
      </div>
    </footer>
  );
}

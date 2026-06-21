'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Store, Lock, Mail, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    const result = await signIn('credentials', { ...form, redirect: false });
    if (result?.ok) router.push('/dashboard');
    else { setError('Email atau password salah'); setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-violet-600 to-violet-800 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-glow">
            <Store className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mb-1">Selamat Datang</h1>
          <p className="text-slate-500 text-sm">Masuk ke akun UMKM Digital Anda</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-card-md p-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl p-3 mb-5">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <div className="relative mt-1.5">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input id="email" type="email" placeholder="email@domain.com" className="pl-10" value={form.email} onChange={e => setForm(p => ({...p, email: e.target.value}))} required />
              </div>
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative mt-1.5">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input id="password" type={showPw ? 'text' : 'password'} placeholder="••••••••" className="pl-10 pr-10" value={form.password} onChange={e => setForm(p => ({...p, password: e.target.value}))} required />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" variant="gradient" className="w-full mt-2" disabled={loading}>
              {loading ? 'Masuk...' : 'Masuk'}
            </Button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-100">
            <p className="text-xs text-slate-500 mb-3 font-medium">Akun Demo:</p>
            <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
              <div className="bg-slate-50 rounded-lg p-2.5"><p className="font-semibold text-violet-600">Superadmin</p><p>superadmin@umkm2.id</p><p>admin123</p></div>
              <div className="bg-slate-50 rounded-lg p-2.5"><p className="font-semibold text-blue-600">Admin</p><p>admin@umkm2.id</p><p>admin123</p></div>
              <div className="bg-slate-50 rounded-lg p-2.5"><p className="font-semibold text-green-600">Owner</p><p>rendang@umkm2.id</p><p>owner123</p></div>
              <div className="bg-slate-50 rounded-lg p-2.5"><p className="font-semibold text-slate-600">Visitor</p><p>visitor@umkm2.id</p><p>visitor123</p></div>
            </div>
          </div>
        </div>

        <p className="text-center text-sm text-slate-500 mt-6">
          Belum punya akun?{' '}
          <Link href="/auth/register" className="text-violet-600 font-semibold hover:underline">Daftar Gratis</Link>
        </p>
      </div>
    </div>
  );
}

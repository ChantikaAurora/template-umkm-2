'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Store, User, Mail, Lock } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    const res = await fetch('/api/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    const data = await res.json();
    if (data.success) router.push('/auth/login?registered=1');
    else { setError(data.message || 'Gagal mendaftar'); setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-violet-600 to-violet-800 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-glow">
            <Store className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mb-1">Buat Akun</h1>
          <p className="text-slate-500 text-sm">Daftar gratis dan mulai perjalanan UMKM Anda</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-card-md p-8">
          {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl p-3 mb-5">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Nama Lengkap</Label>
              <div className="relative mt-1.5">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input type="text" placeholder="Nama Anda" className="pl-10" value={form.name} onChange={e => setForm(p => ({...p, name: e.target.value}))} required />
              </div>
            </div>
            <div>
              <Label>Email</Label>
              <div className="relative mt-1.5">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input type="email" placeholder="email@domain.com" className="pl-10" value={form.email} onChange={e => setForm(p => ({...p, email: e.target.value}))} required />
              </div>
            </div>
            <div>
              <Label>Password</Label>
              <div className="relative mt-1.5">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input type="password" placeholder="Min. 8 karakter" className="pl-10" value={form.password} onChange={e => setForm(p => ({...p, password: e.target.value}))} required minLength={8} />
              </div>
            </div>
            <Button type="submit" variant="gradient" className="w-full mt-2" disabled={loading}>
              {loading ? 'Mendaftar...' : 'Daftar Gratis'}
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-slate-500 mt-6">
          Sudah punya akun?{' '}
          <Link href="/auth/login" className="text-violet-600 font-semibold hover:underline">Masuk</Link>
        </p>
      </div>
    </div>
  );
}

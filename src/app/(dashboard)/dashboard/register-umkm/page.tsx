'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Store, CheckCircle, Clock } from 'lucide-react';

export default function RegisterUMKMPage() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [regions, setRegions] = useState<any[]>([]);
  const [form, setForm] = useState({
    name: '', description: '', address: '', phone: '', whatsapp: '', website: '', regionId: '', category: '',
  });

  useEffect(() => {
    fetch('/api/v1/regions').then(r => r.json()).then(d => {
      if (d.success) setRegions(d.data);
    });
  }, []);

  // If user is already UMKM_OWNER, show message
  if ((session?.user as any)?.role === 'UMKM_OWNER') {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Anda Sudah Terdaftar</h2>
            <p className="text-slate-500 mb-4">Anda sudah terdaftar sebagai UMKM Owner. Kelola produk Anda melalui menu di sidebar.</p>
            <Button variant="gradient" onClick={() => router.push('/dashboard/products')}>Kelola Produk</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!form.name || !form.regionId || !form.whatsapp) {
      setError('Nama UMKM, wilayah, dan nomor WhatsApp wajib diisi');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/v1/umkm/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        // Refresh session to get updated role
        await update();
      } else {
        setError(data.message);
      }
    } catch {
      setError('Terjadi kesalahan, coba lagi');
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-amber-500" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Pendaftaran Berhasil!</h2>
            <p className="text-slate-500 mb-2">UMKM Anda telah didaftarkan dan sedang menunggu persetujuan admin.</p>
            <Badge variant="warning" className="mb-4">Menunggu Approval</Badge>
            <p className="text-sm text-slate-400">Anda akan mendapat notifikasi setelah UMKM disetujui. Silakan login ulang setelah disetujui untuk mengakses dashboard UMKM Owner.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Badge variant="violet" className="mb-3"><Store className="w-3 h-3 mr-1" /> Pendaftaran</Badge>
        <h1 className="text-2xl font-extrabold text-slate-900">Daftarkan UMKM Anda</h1>
        <p className="text-slate-500 mt-1">Isi data usaha Anda untuk bergabung dengan ekosistem digital UMKM</p>
      </div>

      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl border border-red-100 font-medium">{error}</div>}

            <div className="space-y-2">
              <Label>Nama UMKM *</Label>
              <Input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Contoh: Rendang Bundo Kanduang" required />
            </div>

            <div className="space-y-2">
              <Label>Deskripsi</Label>
              <Textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Ceritakan tentang usaha Anda..." rows={3} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Wilayah *</Label>
                <select
                  className="flex h-11 w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-2.5 text-sm transition-all duration-200 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                  value={form.regionId}
                  onChange={e => setForm({...form, regionId: e.target.value})}
                  required
                >
                  <option value="">Pilih wilayah</option>
                  {regions.map((r: any) => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Kategori</Label>
                <select
                  className="flex h-11 w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-2.5 text-sm transition-all duration-200 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                  value={form.category}
                  onChange={e => setForm({...form, category: e.target.value})}
                >
                  <option value="">Pilih kategori</option>
                  <option value="Kuliner">Kuliner</option>
                  <option value="Fashion">Fashion</option>
                  <option value="Kerajinan">Kerajinan</option>
                  <option value="Pertanian">Pertanian</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Nomor WhatsApp * (format: 6281234567890)</Label>
              <Input value={form.whatsapp} onChange={e => setForm({...form, whatsapp: e.target.value})} placeholder="6281234567890" required />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>No. Telepon</Label>
                <Input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="081234567890" />
              </div>
              <div className="space-y-2">
                <Label>Website</Label>
                <Input value={form.website} onChange={e => setForm({...form, website: e.target.value})} placeholder="https://umkm-anda.com" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Alamat</Label>
              <Textarea value={form.address} onChange={e => setForm({...form, address: e.target.value})} placeholder="Alamat lengkap usaha" rows={2} />
            </div>

            <Button type="submit" variant="gradient" className="w-full" size="lg" disabled={loading}>
              {loading ? 'Mendaftarkan...' : 'Daftarkan UMKM'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

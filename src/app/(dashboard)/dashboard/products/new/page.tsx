'use client';
import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ShoppingBag, CheckCircle, ImagePlus, X, Upload } from 'lucide-react';

const MAX_IMAGES = 3;

export default function NewProductPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [images, setImages] = useState<{ file?: File; preview: string; url: string }[]>([]);
  const [form, setForm] = useState({
    name: '', description: '', price: '', categoryId: '',
  });

  useEffect(() => {
    fetch('/api/v1/categories').then(r => r.json()).then(d => {
      if (d.success) setCategories(d.data);
    });
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const remaining = MAX_IMAGES - images.length;
    const selected = Array.from(files).slice(0, remaining);

    selected.forEach(file => {
      if (!file.type.startsWith('image/')) return;
      if (file.size > 5 * 1024 * 1024) {
        setError('Ukuran foto maksimal 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (ev) => {
        const dataUrl = ev.target?.result as string;
        setImages(prev => [...prev, { file, preview: dataUrl, url: dataUrl }]);
      };
      reader.readAsDataURL(file);
    });

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/v1/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          price: form.price ? parseFloat(form.price) : null,
          images: images.map(img => ({ url: img.url, alt: form.name })),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
      } else {
        setError(data.message);
      }
    } catch {
      setError('Terjadi kesalahan');
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Produk Berhasil Ditambahkan!</h2>
            <p className="text-slate-500 mb-2">Produk Anda sedang menunggu persetujuan admin.</p>
            <Badge variant="warning" className="mb-4">Menunggu Approval</Badge>
            <div className="flex gap-3 justify-center mt-4">
              <Button variant="outline" onClick={() => { setSuccess(false); setForm({ name: '', description: '', price: '', categoryId: '' }); setImages([]); }}>Tambah Lagi</Button>
              <Button variant="gradient" onClick={() => router.push('/dashboard/products')}>Lihat Produk Saya</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Badge variant="violet" className="mb-3"><ShoppingBag className="w-3 h-3 mr-1" /> Produk Baru</Badge>
        <h1 className="text-2xl font-extrabold text-slate-900">Tambah Produk</h1>
        <p className="text-slate-500 mt-1">Tambahkan produk baru ke katalog UMKM Anda</p>
      </div>

      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl border border-red-100 font-medium">{error}</div>}

            <div className="space-y-2">
              <Label>Nama Produk *</Label>
              <Input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Contoh: Rendang Daging Sapi 500g" required />
            </div>

            <div className="space-y-2">
              <Label>Deskripsi</Label>
              <Textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Deskripsi produk Anda..." rows={4} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Harga (Rp)</Label>
                <Input type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} placeholder="85000" />
              </div>
              <div className="space-y-2">
                <Label>Kategori</Label>
                <select
                  className="flex h-11 w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-2.5 text-sm transition-all duration-200 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                  value={form.categoryId}
                  onChange={e => setForm({...form, categoryId: e.target.value})}
                >
                  <option value="">Pilih kategori</option>
                  {categories.map((c: any) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Image Upload */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Foto Produk (Maks. {MAX_IMAGES} foto)</Label>
                <span className="text-xs text-slate-400">{images.length}/{MAX_IMAGES}</span>
              </div>

              {/* Preview Grid */}
              {images.length > 0 && (
                <div className="grid grid-cols-3 gap-3">
                  {images.map((img, i) => (
                    <div key={i} className="relative aspect-square rounded-xl overflow-hidden border-2 border-slate-200 bg-slate-50 group">
                      <img src={img.preview} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute top-1.5 right-1.5 w-7 h-7 bg-red-500 text-white rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <div className="absolute bottom-1.5 left-1.5">
                        <Badge variant="secondary" className="text-[10px] bg-white/90 backdrop-blur-sm">Foto {i + 1}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Upload Area */}
              {images.length < MAX_IMAGES && (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center cursor-pointer hover:border-violet-400 hover:bg-violet-50/30 transition-all duration-200"
                >
                  <div className="w-12 h-12 bg-violet-50 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <ImagePlus className="w-6 h-6 text-violet-500" />
                  </div>
                  <p className="text-sm font-semibold text-slate-700">Klik untuk tambah foto</p>
                  <p className="text-xs text-slate-400 mt-1">JPG, PNG, WebP - Maks. 5MB per foto</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>
              )}
            </div>

            <Button type="submit" variant="gradient" className="w-full" size="lg" disabled={loading}>
              {loading ? 'Menyimpan...' : 'Tambah Produk'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

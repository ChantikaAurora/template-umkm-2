'use client';
import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ImageIcon, Plus, CheckCircle, XCircle, ImagePlus, X } from 'lucide-react';

export default function PromosPage() {
  const [promos, setPromos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', image: '', link: '' });
  const [saving, setSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchPromos = async () => {
    const res = await fetch('/api/v1/promos?status=ALL');
    const data = await res.json();
    if (data.success) setPromos(data.data);
    setLoading(false);
  };

  useEffect(() => { fetchPromos(); }, []);

  const handleImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { alert('Ukuran gambar maksimal 5MB'); return; }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      setImagePreview(dataUrl);
      setForm(f => ({ ...f, image: dataUrl }));
    };
    reader.readAsDataURL(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title) return;
    setSaving(true);
    await fetch('/api/v1/promos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setForm({ title: '', description: '', image: '', link: '' });
    setImagePreview('');
    setShowForm(false);
    setSaving(false);
    fetchPromos();
  };

  const handleApproval = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    await fetch(`/api/v1/promos/${id}/approve`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    fetchPromos();
  };

  const toggleActive = async (id: string, isActive: boolean) => {
    await fetch(`/api/v1/promos/${id}/approve`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !isActive }),
    });
    fetchPromos();
  };

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <Badge variant="violet" className="mb-3"><ImageIcon className="w-3 h-3 mr-1" /> Promosi</Badge>
          <h1 className="text-2xl font-extrabold text-slate-900">Promo Slider</h1>
          <p className="text-slate-500 mt-1">Kelola banner promosi di halaman utama. Promo perlu persetujuan admin.</p>
        </div>
        <Button variant="gradient" size="sm" onClick={() => setShowForm(!showForm)}>
          <Plus className="w-4 h-4 mr-1" /> Tambah Promo
        </Button>
      </div>

      {showForm && (
        <Card className="mb-6 border-violet-200">
          <CardHeader><CardTitle className="text-lg">Tambah Promo Baru</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Judul Promo *</Label>
                <Input
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  placeholder="Contoh: Diskon 50% Produk Pilihan"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Deskripsi</Label>
                <Input
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder="Keterangan singkat promo Anda"
                />
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <Label>Gambar Banner</Label>
                {imagePreview ? (
                  <div className="relative rounded-xl overflow-hidden h-40 bg-slate-100">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => { setImagePreview(''); setForm(f => ({ ...f, image: '' })); }}
                      className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-lg flex items-center justify-center shadow-lg"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center cursor-pointer hover:border-violet-400 hover:bg-violet-50/30 transition-all"
                  >
                    <div className="w-10 h-10 bg-violet-50 rounded-xl flex items-center justify-center mx-auto mb-2">
                      <ImagePlus className="w-5 h-5 text-violet-500" />
                    </div>
                    <p className="text-sm font-medium text-slate-600">Klik untuk upload gambar</p>
                    <p className="text-xs text-slate-400 mt-0.5">JPG, PNG, WebP – maks. 5MB</p>
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageFile} className="hidden" />
                  </div>
                )}
                <p className="text-xs text-slate-400">Atau masukkan URL gambar langsung:</p>
                <Input
                  value={imagePreview ? '' : form.image}
                  onChange={e => { setForm({ ...form, image: e.target.value }); setImagePreview(''); }}
                  placeholder="https://contoh.com/gambar.jpg"
                  disabled={!!imagePreview}
                />
              </div>

              <div className="space-y-2">
                <Label>Link Tujuan (opsional)</Label>
                <Input
                  value={form.link}
                  onChange={e => setForm({ ...form, link: e.target.value })}
                  placeholder="/katalog atau https://..."
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" variant="gradient" disabled={saving}>
                  {saving ? 'Menyimpan...' : 'Kirim untuk Disetujui'}
                </Button>
                <Button type="button" variant="outline" onClick={() => { setShowForm(false); setImagePreview(''); }}>
                  Batal
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <p className="text-slate-500">Memuat...</p>
      ) : promos.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ImageIcon className="w-8 h-8 text-slate-400" />
            </div>
            <p className="font-semibold text-slate-700 mb-1">Belum ada promo</p>
            <p className="text-sm text-slate-400">Buat promo baru untuk ditampilkan di halaman utama.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {promos.map((promo) => (
            <Card key={promo.id}>
              <CardContent className="p-5">
                <div className="flex items-center gap-4">
                  {/* Thumbnail */}
                  <div className="w-24 h-16 bg-slate-100 rounded-xl overflow-hidden shrink-0">
                    {promo.image ? (
                      <img src={promo.image} alt={promo.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="w-6 h-6 text-slate-300" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-900 truncate">{promo.title}</h3>
                    {promo.description && (
                      <p className="text-sm text-slate-500 truncate">{promo.description}</p>
                    )}
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      <Badge variant={
                        promo.status === 'APPROVED' ? 'success' :
                        promo.status === 'PENDING' ? 'warning' : 'destructive'
                      }>
                        {promo.status}
                      </Badge>
                      {promo.status === 'APPROVED' && (
                        <Badge variant={promo.isActive ? 'success' : 'secondary'}>
                          {promo.isActive ? 'Aktif' : 'Nonaktif'}
                        </Badge>
                      )}
                      {promo.umkm && (
                        <Badge variant="outline" className="text-xs">{promo.umkm.name}</Badge>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-1 shrink-0">
                    {promo.status === 'PENDING' && (
                      <>
                        <Button size="sm" variant="ghost" onClick={() => handleApproval(promo.id, 'APPROVED')} title="Setujui">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleApproval(promo.id, 'REJECTED')} title="Tolak">
                          <XCircle className="w-4 h-4 text-red-500" />
                        </Button>
                      </>
                    )}
                    {promo.status === 'APPROVED' && (
                      <Button
                        size="sm"
                        variant={promo.isActive ? 'outline' : 'success'}
                        onClick={() => toggleActive(promo.id, promo.isActive)}
                        className="text-xs"
                      >
                        {promo.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

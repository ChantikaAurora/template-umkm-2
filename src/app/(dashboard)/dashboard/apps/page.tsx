'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { AppWindow, Plus, ExternalLink, Trash2, Power } from 'lucide-react';

export default function AppsPage() {
  const [apps, setApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', url: '', icon: '' });
  const [saving, setSaving] = useState(false);

  const fetchApps = async () => {
    const res = await fetch('/api/v1/apps');
    const data = await res.json();
    if (data.success) setApps(data.data);
    setLoading(false);
  };

  useEffect(() => { fetchApps(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await fetch('/api/v1/apps', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setForm({ name: '', description: '', url: '', icon: '' });
    setShowForm(false);
    setSaving(false);
    fetchApps();
  };

  const toggleActive = async (id: string, isActive: boolean) => {
    await fetch(`/api/v1/apps/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !isActive }),
    });
    fetchApps();
  };

  const deleteApp = async (id: string) => {
    await fetch(`/api/v1/apps/${id}`, { method: 'DELETE' });
    fetchApps();
  };

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <Badge variant="violet" className="mb-3"><AppWindow className="w-3 h-3 mr-1" /> SSO</Badge>
          <h1 className="text-2xl font-extrabold text-slate-900">Apps Management</h1>
          <p className="text-slate-500 mt-1">Kelola aplikasi yang terhubung dengan ekosistem</p>
        </div>
        <Button variant="gradient" size="sm" onClick={() => setShowForm(!showForm)}>
          <Plus className="w-4 h-4 mr-1" /> Tambah App
        </Button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <CardHeader><CardTitle className="text-lg">Tambah Aplikasi Baru</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nama Aplikasi *</Label>
                  <Input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Nama app" required />
                </div>
                <div className="space-y-2">
                  <Label>URL *</Label>
                  <Input value={form.url} onChange={e => setForm({...form, url: e.target.value})} placeholder="https://app.contoh.com" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Deskripsi</Label>
                <Input value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Deskripsi singkat" />
              </div>
              <div className="flex gap-2">
                <Button type="submit" variant="gradient" disabled={saving}>{saving ? 'Menyimpan...' : 'Simpan'}</Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Batal</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <p className="text-slate-500">Memuat...</p>
      ) : apps.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <AppWindow className="w-8 h-8 text-slate-400" />
            </div>
            <p className="font-semibold text-slate-700">Belum ada aplikasi terdaftar</p>
            <p className="text-sm text-slate-500 mt-1">Tambahkan aplikasi untuk mengaktifkan SSO</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {apps.map((app) => (
            <Card key={app.id} className="hover:shadow-card-hover">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-violet-700 rounded-xl flex items-center justify-center shadow-btn-violet">
                    <AppWindow className="w-5 h-5 text-white" />
                  </div>
                  <Badge variant={app.isActive ? 'success' : 'secondary'}>{app.isActive ? 'Aktif' : 'Nonaktif'}</Badge>
                </div>
                <h3 className="font-bold text-slate-900 mb-1">{app.name}</h3>
                {app.description && <p className="text-sm text-slate-500 mb-3">{app.description}</p>}
                <p className="text-xs text-violet-600 truncate mb-3">{app.url}</p>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" onClick={() => toggleActive(app.id, app.isActive)} title={app.isActive ? 'Nonaktifkan' : 'Aktifkan'}>
                    <Power className={`w-4 h-4 ${app.isActive ? 'text-green-500' : 'text-slate-400'}`} />
                  </Button>
                  <a href={app.url} target="_blank" rel="noopener noreferrer">
                    <Button size="sm" variant="ghost"><ExternalLink className="w-4 h-4 text-slate-400" /></Button>
                  </a>
                  <Button size="sm" variant="ghost" onClick={() => deleteApp(app.id)}>
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

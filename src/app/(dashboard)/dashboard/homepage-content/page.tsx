'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Home, Save, CheckCircle } from 'lucide-react';
import { siteConfig } from '@/config/site.config';

export default function HomepageContentPage() {
  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/v1/homepage').then(r => r.json()).then(d => {
      if (d.success) setSections(d.data);
      setLoading(false);
    });
  }, []);

  const updateSection = (key: string, field: string, value: string) => {
    setSections(prev => prev.map(s =>
      s.key === key ? { ...s, [field]: value } : s
    ));
  };

  const handleSave = async (section: any) => {
    setSaving(section.key);
    await fetch(`/api/v1/homepage/${section.key}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: section.title, content: section.content, isActive: section.isActive }),
    });
    setSaving(null);
    setSaved(section.key);
    setTimeout(() => setSaved(null), 2000);
  };

  return (
    <div>
      <div className="mb-6">
        <Badge variant="violet" className="mb-3"><Home className="w-3 h-3 mr-1" /> Konten</Badge>
        <h1 className="text-2xl font-extrabold text-slate-900">Homepage Content</h1>
        <p className="text-slate-500 mt-1">Kelola konten yang tampil di halaman utama website</p>
      </div>

      {/* Site Info Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Informasi Situs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-slate-500 font-medium">Nama Situs</p>
              <p className="font-bold text-slate-900">{siteConfig.name}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-slate-500 font-medium">Deskripsi</p>
              <p className="text-slate-700">{siteConfig.description}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-slate-500 font-medium">Email</p>
              <p className="text-slate-700">{siteConfig.contact.email}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-slate-500 font-medium">WhatsApp</p>
              <p className="text-slate-700">{siteConfig.contact.whatsapp}</p>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-4">Edit file <code className="bg-slate-100 px-1.5 py-0.5 rounded text-violet-700">src/config/site.config.ts</code> untuk mengubah informasi situs</p>
        </CardContent>
      </Card>

      {/* Homepage Sections */}
      {loading ? (
        <p className="text-slate-500">Memuat...</p>
      ) : sections.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Home className="w-8 h-8 text-slate-400" />
            </div>
            <p className="font-semibold text-slate-700">Belum ada section homepage</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {sections.map((section) => (
            <Card key={section.id} className="hover:shadow-card-hover">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="violet" className="uppercase text-[10px] tracking-wider">{section.key}</Badge>
                    <Badge variant={section.isActive ? 'success' : 'secondary'}>{section.isActive ? 'Aktif' : 'Nonaktif'}</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    {saved === section.key && (
                      <span className="text-green-500 text-sm flex items-center gap-1"><CheckCircle className="w-4 h-4" /> Tersimpan</span>
                    )}
                    <Button
                      size="sm"
                      variant="gradient"
                      onClick={() => handleSave(section)}
                      disabled={saving === section.key}
                    >
                      <Save className="w-4 h-4 mr-1" />
                      {saving === section.key ? 'Menyimpan...' : 'Simpan'}
                    </Button>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Judul</Label>
                    <Input
                      value={section.title || ''}
                      onChange={e => updateSection(section.key, 'title', e.target.value)}
                      placeholder="Judul section"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Konten (JSON)</Label>
                    <Textarea
                      value={typeof section.content === 'string' ? section.content : JSON.stringify(section.content, null, 2)}
                      onChange={e => updateSection(section.key, 'content', e.target.value)}
                      placeholder='{"subtitle": "...", "description": "..."}'
                      rows={3}
                      className="font-mono text-xs"
                    />
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

'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { FileText, CheckCircle, ImagePlus, X, Bold, Italic, List, Heading2 } from 'lucide-react';

export default function NewStoryPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [coverPreview, setCoverPreview] = useState('');
  const [form, setForm] = useState({
    title: '',
    content: '',
    excerpt: '',
    coverImage: '',
    tags: '',
  });

  const handleCoverSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError('Ukuran gambar maksimal 5MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      setCoverPreview(dataUrl);
      setForm(prev => ({ ...prev, coverImage: dataUrl }));
    };
    reader.readAsDataURL(file);
    if (coverInputRef.current) coverInputRef.current.value = '';
  };

  const removeCover = () => {
    setCoverPreview('');
    setForm(prev => ({ ...prev, coverImage: '' }));
  };

  const insertFormatting = (prefix: string, suffix: string = '') => {
    const textarea = contentRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = form.content.substring(start, end);
    const replacement = `${prefix}${selected}${suffix || prefix}`;
    const newContent = form.content.substring(0, start) + replacement + form.content.substring(end);
    setForm(prev => ({ ...prev, content: newContent }));
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selected.length);
    }, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!form.title || !form.content) {
      setError('Judul dan konten cerita wajib diisi');
      setLoading(false);
      return;
    }

    try {
      const tags = form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [];
      const res = await fetch('/api/v1/stories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title,
          content: form.content,
          excerpt: form.excerpt || form.content.substring(0, 150) + '...',
          coverImage: form.coverImage,
          tags,
          umkmId: (session?.user as any)?.umkmId,
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
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Cerita Berhasil Dikirim!</h2>
            <p className="text-slate-500 mb-2">Cerita Anda sedang menunggu persetujuan admin untuk dipublikasikan.</p>
            <Badge variant="warning" className="mb-4">Menunggu Approval</Badge>
            <div className="flex gap-3 justify-center mt-4">
              <Button variant="outline" onClick={() => { setSuccess(false); setForm({ title: '', content: '', excerpt: '', coverImage: '', tags: '' }); setCoverPreview(''); }}>Tulis Lagi</Button>
              <Button variant="gradient" onClick={() => router.push('/dashboard/cerita')}>Lihat Cerita Saya</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <Badge variant="violet" className="mb-3"><FileText className="w-3 h-3 mr-1" /> Cerita Baru</Badge>
        <h1 className="text-2xl font-extrabold text-slate-900">Tulis Cerita</h1>
        <p className="text-slate-500 mt-1">Bagikan kisah sukses dan pengalaman UMKM Anda</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl border border-red-100 font-medium">{error}</div>}

        {/* Cover Image */}
        <Card>
          <CardContent className="p-5">
            <Label className="mb-3 block">Gambar Cover</Label>
            {coverPreview ? (
              <div className="relative aspect-video rounded-xl overflow-hidden border-2 border-slate-200 group">
                <img src={coverPreview} alt="Cover" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={removeCover}
                  className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div
                onClick={() => coverInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center cursor-pointer hover:border-violet-400 hover:bg-violet-50/30 transition-all duration-200"
              >
                <div className="w-12 h-12 bg-violet-50 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <ImagePlus className="w-6 h-6 text-violet-500" />
                </div>
                <p className="text-sm font-semibold text-slate-700">Klik untuk tambah gambar cover</p>
                <p className="text-xs text-slate-400 mt-1">JPG, PNG, WebP - Maks. 5MB</p>
              </div>
            )}
            <input
              ref={coverInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleCoverSelect}
              className="hidden"
            />
          </CardContent>
        </Card>

        {/* Title & Content */}
        <Card>
          <CardContent className="p-5 space-y-5">
            <div className="space-y-2">
              <Label>Judul Cerita *</Label>
              <Input
                value={form.title}
                onChange={e => setForm({...form, title: e.target.value})}
                placeholder="Contoh: Dari Dapur Rumah ke Pasar Nasional"
                required
                className="text-lg font-semibold"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Konten Cerita *</Label>
                <div className="flex gap-1">
                  <button type="button" onClick={() => insertFormatting('**')} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors" title="Bold">
                    <Bold className="w-4 h-4 text-slate-500" />
                  </button>
                  <button type="button" onClick={() => insertFormatting('*')} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors" title="Italic">
                    <Italic className="w-4 h-4 text-slate-500" />
                  </button>
                  <button type="button" onClick={() => insertFormatting('\n## ', '\n')} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors" title="Heading">
                    <Heading2 className="w-4 h-4 text-slate-500" />
                  </button>
                  <button type="button" onClick={() => insertFormatting('\n- ', '\n')} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors" title="List">
                    <List className="w-4 h-4 text-slate-500" />
                  </button>
                </div>
              </div>
              <Textarea
                ref={contentRef}
                value={form.content}
                onChange={e => setForm({...form, content: e.target.value})}
                placeholder="Ceritakan kisah perjalanan UMKM Anda... &#10;&#10;Anda bisa menulis tentang:&#10;- Awal mula memulai usaha&#10;- Tantangan yang dihadapi&#10;- Pencapaian yang membanggakan&#10;- Tips untuk sesama pelaku UMKM"
                rows={14}
                required
                className="leading-relaxed"
              />
              <p className="text-xs text-slate-400">{form.content.length} karakter</p>
            </div>

            <div className="space-y-2">
              <Label>Ringkasan (opsional)</Label>
              <Textarea
                value={form.excerpt}
                onChange={e => setForm({...form, excerpt: e.target.value})}
                placeholder="Ringkasan singkat cerita Anda (akan ditampilkan di halaman daftar cerita)"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label>Tags (pisahkan dengan koma)</Label>
              <Input
                value={form.tags}
                onChange={e => setForm({...form, tags: e.target.value})}
                placeholder="kuliner, sukses, inspirasi"
              />
              {form.tags && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {form.tags.split(',').map((tag, i) => tag.trim() && (
                    <Badge key={i} variant="secondary" className="text-xs">{tag.trim()}</Badge>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Button type="submit" variant="gradient" className="w-full" size="lg" disabled={loading}>
          {loading ? 'Mengirim...' : 'Kirim Cerita'}
        </Button>
      </form>
    </div>
  );
}

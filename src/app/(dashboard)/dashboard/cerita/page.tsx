'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, CheckCircle, XCircle, Eye, X, BookOpen } from 'lucide-react';

function formatDate(d: string) { return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }); }

export default function CeritaDashboardPage() {
  const { data: session } = useSession();
  const role = (session?.user as any)?.role;
  const isAdmin = role === 'SUPERADMIN' || role === 'ADMIN';

  const [stories, setStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [detail, setDetail] = useState<any>(null);

  const fetchStories = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filter !== 'ALL') params.set('status', filter);
    else params.set('status', '');
    const res = await fetch(`/api/v1/stories?${params}`);
    const data = await res.json();
    if (data.success) setStories(data.data);
    setLoading(false);
  };

  useEffect(() => { fetchStories(); }, [filter]);

  const handleApproval = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    await fetch(`/api/v1/stories/${id}/approve`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    setDetail(null);
    fetchStories();
  };

  return (
    <div>
      <div className="mb-6">
        <Badge variant="violet" className="mb-3"><FileText className="w-3 h-3 mr-1" /> Blog</Badge>
        <h1 className="text-2xl font-extrabold text-slate-900">Cerita / Blog</h1>
      </div>

      {isAdmin && (
        <div className="flex gap-2 mb-6">
          {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((s) => (
            <Badge key={s} variant={filter === s ? 'default' : 'outline'} className="cursor-pointer px-3 py-1.5" onClick={() => setFilter(s)}>
              {s === 'ALL' ? 'Semua' : s}
            </Badge>
          ))}
        </div>
      )}

      {/* Detail Panel */}
      {detail && (
        <Card className="mb-6 border-violet-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg text-slate-900">Detail Cerita</h3>
              <Button variant="ghost" size="icon" onClick={() => setDetail(null)}><X className="w-5 h-5" /></Button>
            </div>
            {detail.coverImage && (
              <div className="aspect-video rounded-xl overflow-hidden bg-slate-100 mb-4">
                <img src={detail.coverImage} alt={detail.title} className="w-full h-full object-cover" />
              </div>
            )}
            <Badge variant={detail.status === 'APPROVED' ? 'success' : detail.status === 'PENDING' ? 'warning' : 'destructive'} className="mb-2">{detail.status}</Badge>
            <h2 className="text-xl font-bold text-slate-900 mb-2">{detail.title}</h2>
            <div className="flex gap-3 text-sm text-slate-500 mb-4">
              {detail.umkm && <span>UMKM: {detail.umkm.name}</span>}
              <span>{formatDate(detail.createdAt)}</span>
            </div>
            {detail.excerpt && (
              <div className="bg-slate-50 rounded-xl p-4 mb-4">
                <p className="text-sm font-semibold text-slate-700 mb-1">Ringkasan</p>
                <p className="text-sm text-slate-600">{detail.excerpt}</p>
              </div>
            )}
            <div className="mb-4">
              <p className="text-sm font-semibold text-slate-700 mb-2">Konten</p>
              <div className="bg-white border border-slate-200 rounded-xl p-4 max-h-[300px] overflow-y-auto">
                <p className="text-sm text-slate-600 whitespace-pre-line leading-relaxed">{detail.content}</p>
              </div>
            </div>
            {detail.tags && (
              <div className="flex flex-wrap gap-1.5 mb-4">
                {(typeof detail.tags === 'string' ? JSON.parse(detail.tags) : detail.tags).map((tag: string, i: number) => (
                  <Badge key={i} variant="secondary" className="text-xs">{tag}</Badge>
                ))}
              </div>
            )}
            {isAdmin && detail.status === 'PENDING' && (
              <div className="flex gap-2 pt-2">
                <Button variant="success" onClick={() => handleApproval(detail.id, 'APPROVED')} className="flex-1">
                  <CheckCircle className="w-4 h-4 mr-1.5" /> Setujui & Publikasikan
                </Button>
                <Button variant="destructive" onClick={() => handleApproval(detail.id, 'REJECTED')} className="flex-1">
                  <XCircle className="w-4 h-4 mr-1.5" /> Tolak
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="text-left p-4 font-semibold text-slate-700">Judul</th>
                  <th className="text-left p-4 font-semibold text-slate-700">UMKM</th>
                  <th className="text-left p-4 font-semibold text-slate-700">Status</th>
                  <th className="text-left p-4 font-semibold text-slate-700">Tanggal</th>
                  <th className="text-left p-4 font-semibold text-slate-700">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={5} className="p-8 text-center text-slate-400">Memuat...</td></tr>
                ) : stories.length === 0 ? (
                  <tr><td colSpan={5} className="p-8 text-center text-slate-400">Tidak ada cerita</td></tr>
                ) : stories.map((s) => (
                  <tr key={s.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {s.coverImage ? (
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 shrink-0"><img src={s.coverImage} alt="" className="w-full h-full object-cover" /></div>
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center shrink-0"><BookOpen className="w-5 h-5 text-slate-400" /></div>
                        )}
                        <span className="font-medium text-slate-900 line-clamp-1">{s.title}</span>
                      </div>
                    </td>
                    <td className="p-4 text-slate-500">{s.umkm?.name || '-'}</td>
                    <td className="p-4"><Badge variant={s.status === 'APPROVED' ? 'success' : s.status === 'PENDING' ? 'warning' : 'destructive'}>{s.status}</Badge></td>
                    <td className="p-4 text-slate-500">{formatDate(s.createdAt)}</td>
                    <td className="p-4">
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline" onClick={() => setDetail(s)}>
                          <Eye className="w-4 h-4 mr-1" /> Lihat
                        </Button>
                        {isAdmin && s.status === 'PENDING' && (
                          <>
                            <Button size="sm" variant="ghost" onClick={() => handleApproval(s.id, 'APPROVED')} title="Setujui"><CheckCircle className="w-4 h-4 text-green-500" /></Button>
                            <Button size="sm" variant="ghost" onClick={() => handleApproval(s.id, 'REJECTED')} title="Tolak"><XCircle className="w-4 h-4 text-red-500" /></Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

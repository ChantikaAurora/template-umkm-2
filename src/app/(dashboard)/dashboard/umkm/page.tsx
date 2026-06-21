'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Store, CheckCircle, XCircle, Clock, Eye, X, MapPin, Phone, MessageCircle, Globe } from 'lucide-react';

function formatDate(d: string) { return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }); }

export default function UmkmPage() {
  const [umkms, setUmkms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [detail, setDetail] = useState<any>(null);

  const fetchUmkms = async () => {
    setLoading(true);
    const res = await fetch(`/api/v1/umkm?status=${filter}`);
    const data = await res.json();
    if (data.success) setUmkms(data.data);
    setLoading(false);
  };

  useEffect(() => { fetchUmkms(); }, [filter]);

  const handleApproval = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    await fetch(`/api/v1/umkm/${id}/approve`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) });
    setDetail(null);
    fetchUmkms();
  };

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <Badge variant="violet" className="mb-3"><Store className="w-3 h-3 mr-1" /> Data</Badge>
          <h1 className="text-2xl font-extrabold text-slate-900">UMKM Data</h1>
        </div>
        <Link href="/dashboard/umkm/approvals">
          <Button variant="outline" size="sm"><Clock className="w-4 h-4 mr-1" /> Approval Queue</Button>
        </Link>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {['ALL','PENDING','APPROVED','REJECTED'].map((s) => (
          <Badge key={s} variant={filter === s ? 'default' : 'outline'} className="cursor-pointer px-3 py-1.5" onClick={() => setFilter(s)}>
            {s === 'ALL' ? 'Semua' : s}
          </Badge>
        ))}
      </div>

      {detail && (
        <Card className="mb-6 border-violet-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg text-slate-900">Detail UMKM</h3>
              <Button variant="ghost" size="icon" onClick={() => setDetail(null)}><X className="w-5 h-5" /></Button>
            </div>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-violet-500 to-violet-700 rounded-xl flex items-center justify-center shadow-btn-violet">
                <Store className="w-7 h-7 text-white" />
              </div>
              <div>
                <Badge variant={detail.status === 'APPROVED' ? 'success' : detail.status === 'PENDING' ? 'warning' : 'destructive'} className="mb-1">{detail.status}</Badge>
                <h2 className="font-bold text-xl text-slate-900">{detail.name}</h2>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              <div className="bg-slate-50 rounded-xl p-3 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-slate-500">Owner</span><span className="font-medium">{detail.owner?.name}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Email</span><span>{detail.owner?.email}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Wilayah</span><span className="font-medium">{detail.region?.name}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Kategori</span><span>{detail.category || '-'}</span></div>
              </div>
              <div className="bg-slate-50 rounded-xl p-3 space-y-2 text-sm">
                {detail.phone && <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-slate-400" /><span>{detail.phone}</span></div>}
                {detail.whatsapp && <div className="flex items-center gap-2"><MessageCircle className="w-3.5 h-3.5 text-green-500" /><span>{detail.whatsapp}</span></div>}
                {detail.address && <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-slate-400" /><span>{detail.address}</span></div>}
                {detail.website && <div className="flex items-center gap-2"><Globe className="w-3.5 h-3.5 text-slate-400" /><span className="text-violet-600">{detail.website}</span></div>}
                <div className="flex justify-between"><span className="text-slate-500">Produk</span><span className="font-medium">{detail._count?.products || 0} produk</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Terdaftar</span><span>{formatDate(detail.createdAt)}</span></div>
              </div>
            </div>
            {detail.description && (
              <div className="mb-4"><p className="text-sm font-semibold text-slate-700 mb-2">Deskripsi</p>
                <div className="bg-white border border-slate-200 rounded-xl p-4">
                  <p className="text-sm text-slate-600 whitespace-pre-line leading-relaxed">{detail.description}</p>
                </div>
              </div>
            )}
            {detail.status === 'PENDING' && (
              <div className="flex gap-2 pt-2">
                <Button variant="success" onClick={() => handleApproval(detail.id, 'APPROVED')} className="flex-1"><CheckCircle className="w-4 h-4 mr-1.5" /> Setujui</Button>
                <Button variant="destructive" onClick={() => handleApproval(detail.id, 'REJECTED')} className="flex-1"><XCircle className="w-4 h-4 mr-1.5" /> Tolak</Button>
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
                  <th className="text-left p-4 font-semibold text-slate-700">Nama UMKM</th>
                  <th className="text-left p-4 font-semibold text-slate-700">Owner</th>
                  <th className="text-left p-4 font-semibold text-slate-700">Region</th>
                  <th className="text-left p-4 font-semibold text-slate-700">Status</th>
                  <th className="text-left p-4 font-semibold text-slate-700">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={5} className="p-8 text-center text-slate-400">Memuat...</td></tr>
                ) : umkms.length === 0 ? (
                  <tr><td colSpan={5} className="p-8 text-center text-slate-400">Tidak ada data</td></tr>
                ) : umkms.map((u) => (
                  <tr key={u.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-medium text-slate-900">{u.name}</td>
                    <td className="p-4 text-slate-500">{u.owner?.name}</td>
                    <td className="p-4 text-slate-500">{u.region?.name}</td>
                    <td className="p-4"><Badge variant={u.status === 'APPROVED' ? 'success' : u.status === 'PENDING' ? 'warning' : 'destructive'}>{u.status}</Badge></td>
                    <td className="p-4">
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline" onClick={() => setDetail(u)}><Eye className="w-4 h-4 mr-1" /> Lihat</Button>
                        {u.status === 'PENDING' && (
                          <>
                            <Button size="sm" variant="ghost" onClick={() => handleApproval(u.id, 'APPROVED')} title="Setujui"><CheckCircle className="w-4 h-4 text-green-500" /></Button>
                            <Button size="sm" variant="ghost" onClick={() => handleApproval(u.id, 'REJECTED')} title="Tolak"><XCircle className="w-4 h-4 text-red-500" /></Button>
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

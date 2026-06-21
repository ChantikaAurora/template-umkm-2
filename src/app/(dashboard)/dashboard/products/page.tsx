'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingBag, CheckCircle, XCircle, Eye, X } from 'lucide-react';

function formatPrice(n: number) { return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n); }
function formatDate(d: string) { return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }); }

export default function ProductsPage() {
  const { data: session } = useSession();
  const role = (session?.user as any)?.role;
  const isAdmin = role === 'SUPERADMIN' || role === 'ADMIN';
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [detail, setDetail] = useState<any>(null);

  const fetchProducts = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filter !== 'ALL') params.set('status', filter); else params.set('status', '');
    const res = await fetch(`/api/v1/products?${params}`);
    const data = await res.json();
    if (data.success) setProducts(data.data);
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, [filter]);

  const handleApproval = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    await fetch(`/api/v1/products/${id}/approve`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) });
    setDetail(null); fetchProducts();
  };

  return (
    <div>
      <div className="mb-6">
        <Badge variant="violet" className="mb-3"><ShoppingBag className="w-3 h-3 mr-1" /> Katalog</Badge>
        <h1 className="text-2xl font-extrabold text-slate-900">Produk</h1>
      </div>
      {isAdmin && (
        <div className="flex gap-2 mb-6 flex-wrap">
          {['ALL','PENDING','APPROVED','REJECTED'].map((s) => (
            <Badge key={s} variant={filter === s ? 'default' : 'outline'} className="cursor-pointer px-3 py-1.5" onClick={() => setFilter(s)}>
              {s === 'ALL' ? 'Semua' : s}
            </Badge>
          ))}
        </div>
      )}

      {detail && (
        <Card className="mb-6 border-violet-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg text-slate-900">Detail Produk</h3>
              <Button variant="ghost" size="icon" onClick={() => setDetail(null)}><X className="w-5 h-5" /></Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                {detail.images?.length > 0 ? (
                  <div className="space-y-2">
                    <div className="aspect-square rounded-xl overflow-hidden bg-slate-100">
                      <img src={detail.images[0].url} alt={detail.name} className="w-full h-full object-cover" />
                    </div>
                    {detail.images.length > 1 && (
                      <div className="grid grid-cols-3 gap-2">
                        {detail.images.slice(1).map((img: any, i: number) => (
                          <div key={i} className="aspect-square rounded-lg overflow-hidden bg-slate-100">
                            <img src={img.url} alt="" className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="aspect-square rounded-xl bg-slate-100 flex items-center justify-center">
                    <ShoppingBag className="w-16 h-16 text-slate-300" />
                  </div>
                )}
              </div>
              <div className="space-y-3">
                <div>
                  <Badge variant={detail.status === 'APPROVED' ? 'success' : detail.status === 'PENDING' ? 'warning' : 'destructive'} className="mb-2">{detail.status}</Badge>
                  <h2 className="font-bold text-xl text-slate-900">{detail.name}</h2>
                </div>
                {detail.price && <p className="text-2xl font-extrabold text-violet-600">{formatPrice(detail.price)}</p>}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between py-2 border-b border-slate-100"><span className="text-slate-500">UMKM</span><span className="font-medium">{detail.umkm?.name}</span></div>
                  <div className="flex justify-between py-2 border-b border-slate-100"><span className="text-slate-500">Kategori</span><span className="font-medium">{detail.category?.name || '-'}</span></div>
                  <div className="flex justify-between py-2 border-b border-slate-100"><span className="text-slate-500">Tanggal</span><span>{formatDate(detail.createdAt)}</span></div>
                </div>
                {detail.description && (
                  <div><p className="text-sm font-semibold text-slate-700 mb-1">Deskripsi</p>
                    <p className="text-sm text-slate-600 whitespace-pre-line leading-relaxed">{detail.description}</p>
                  </div>
                )}
                {isAdmin && detail.status === 'PENDING' && (
                  <div className="flex gap-2 pt-4">
                    <Button variant="success" onClick={() => handleApproval(detail.id, 'APPROVED')} className="flex-1"><CheckCircle className="w-4 h-4 mr-1.5" /> Setujui</Button>
                    <Button variant="destructive" onClick={() => handleApproval(detail.id, 'REJECTED')} className="flex-1"><XCircle className="w-4 h-4 mr-1.5" /> Tolak</Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="text-left p-4 font-semibold text-slate-700">Produk</th>
                  <th className="text-left p-4 font-semibold text-slate-700">UMKM</th>
                  <th className="text-left p-4 font-semibold text-slate-700">Harga</th>
                  <th className="text-left p-4 font-semibold text-slate-700">Status</th>
                  <th className="text-left p-4 font-semibold text-slate-700">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={5} className="p-8 text-center text-slate-400">Memuat...</td></tr>
                ) : products.length === 0 ? (
                  <tr><td colSpan={5} className="p-8 text-center text-slate-400">Tidak ada produk</td></tr>
                ) : products.map((p) => (
                  <tr key={p.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {p.images?.[0] ? (
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 shrink-0"><img src={p.images[0].url} alt="" className="w-full h-full object-cover" /></div>
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center shrink-0"><ShoppingBag className="w-5 h-5 text-slate-400" /></div>
                        )}
                        <span className="font-medium text-slate-900">{p.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-slate-500">{p.umkm?.name}</td>
                    <td className="p-4 font-medium">{p.price ? formatPrice(p.price) : '-'}</td>
                    <td className="p-4"><Badge variant={p.status === 'APPROVED' ? 'success' : p.status === 'PENDING' ? 'warning' : 'destructive'}>{p.status}</Badge></td>
                    <td className="p-4">
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline" onClick={() => setDetail(p)}><Eye className="w-4 h-4 mr-1" /> Lihat</Button>
                        {isAdmin && p.status === 'PENDING' && (
                          <>
                            <Button size="sm" variant="ghost" onClick={() => handleApproval(p.id, 'APPROVED')} title="Setujui"><CheckCircle className="w-4 h-4 text-green-500" /></Button>
                            <Button size="sm" variant="ghost" onClick={() => handleApproval(p.id, 'REJECTED')} title="Tolak"><XCircle className="w-4 h-4 text-red-500" /></Button>
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

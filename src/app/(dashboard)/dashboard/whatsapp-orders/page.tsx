'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageCircle } from 'lucide-react';

export default function WhatsAppOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch('/api/v1/orders/whatsapp').then(r => r.json()).then(d => { if (d.success) setOrders(d.data); setLoading(false); });
  }, []);
  const formatDate = (d: string) => new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  return (
    <div>
      <div className="mb-6">
        <Badge variant="violet" className="mb-3"><MessageCircle className="w-3 h-3 mr-1" /> Orders</Badge>
        <h1 className="text-2xl font-extrabold text-slate-900">WhatsApp Orders</h1>
      </div>
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="text-left p-4 font-semibold text-slate-700">Produk</th>
                  <th className="text-left p-4 font-semibold text-slate-700">UMKM</th>
                  <th className="text-left p-4 font-semibold text-slate-700">Pembeli</th>
                  <th className="text-left p-4 font-semibold text-slate-700">Waktu</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={4} className="p-8 text-center text-slate-400">Memuat...</td></tr>
                ) : orders.length === 0 ? (
                  <tr><td colSpan={4} className="p-8 text-center text-slate-400">Belum ada order</td></tr>
                ) : orders.map((o) => (
                  <tr key={o.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-medium text-slate-900">{o.product?.name}</td>
                    <td className="p-4 text-slate-500">{o.umkm?.name}</td>
                    <td className="p-4 text-slate-500">{o.buyerName || '-'}</td>
                    <td className="p-4 text-slate-500">{formatDate(o.createdAt)}</td>
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

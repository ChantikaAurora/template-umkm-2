import prisma from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function ReportsPage() {
  const [totalUsers, totalUmkm, totalProducts, totalOrders] = await Promise.all([
    prisma.user.count(),
    prisma.umkm.count({ where: { status: 'APPROVED' } }),
    prisma.product.count({ where: { status: 'APPROVED' } }),
    prisma.whatsAppOrderLog.count(),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-slate-900 mb-6">Reports</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Ringkasan</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-slate-100"><span className="text-slate-500">Total Users</span><span className="font-bold text-slate-900">{totalUsers}</span></div>
              <div className="flex justify-between py-2 border-b border-slate-100"><span className="text-slate-500">UMKM Aktif</span><span className="font-bold text-slate-900">{totalUmkm}</span></div>
              <div className="flex justify-between py-2 border-b border-slate-100"><span className="text-slate-500">Produk</span><span className="font-bold text-slate-900">{totalProducts}</span></div>
              <div className="flex justify-between py-2"><span className="text-slate-500">Order WA</span><span className="font-bold text-slate-900">{totalOrders}</span></div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

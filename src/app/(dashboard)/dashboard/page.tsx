import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Store, ShoppingBag, FileText, Calendar, Users, Clock, ArrowRight, TrendingUp, Package } from 'lucide-react';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;
  const userId = (session?.user as any)?.id;
  const umkmId = (session?.user as any)?.umkmId;

  if (role === 'VISITOR') {
    return (
      <div>
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-slate-900">Selamat Datang 👋</h1>
          <p className="text-slate-500 mt-1">Halo, {session?.user?.name}! Mulai perjalanan UMKM digital Anda.</p>
        </div>
        <Card className="max-w-lg border-violet-200 bg-gradient-to-br from-violet-50 to-white">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-violet-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Store className="w-8 h-8 text-violet-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Daftarkan UMKM Anda</h2>
            <p className="text-slate-500 text-sm mb-6 leading-relaxed">Bergabunglah sebagai UMKM Owner dan mulai kelola produk, cerita, dan promosi bisnis Anda.</p>
            <Link href="/dashboard/register-umkm">
              <Button variant="gradient" size="lg">
                Daftar Sekarang <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (role === 'UMKM_OWNER') {
    const [productCount, storyCount, orderCount] = await Promise.all([
      prisma.product.count({ where: { umkmId: umkmId || '' } }),
      prisma.story.count({ where: { authorId: userId } }),
      prisma.whatsAppOrderLog.count({ where: { umkmId: umkmId || '' } }),
    ]);
    return (
      <div>
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-slate-900">Dashboard Owner</h1>
          <p className="text-slate-500 mt-1">Kelola bisnis UMKM Anda dari sini.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
          {[
            { label: 'Produk', value: productCount, icon: ShoppingBag, href: '/dashboard/products', color: 'violet' },
            { label: 'Cerita', value: storyCount, icon: FileText, href: '/dashboard/cerita', color: 'green' },
            { label: 'WA Orders', value: orderCount, icon: TrendingUp, href: '/dashboard/whatsapp-orders', color: 'blue' },
          ].map(({ label, value, icon: Icon, href, color }) => (
            <Link key={label} href={href}>
              <Card className="card-hover cursor-pointer p-5">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color === 'violet' ? 'bg-violet-100' : color === 'green' ? 'bg-green-100' : 'bg-blue-100'}`}>
                    <Icon className={`w-6 h-6 ${color === 'violet' ? 'text-violet-600' : color === 'green' ? 'text-green-600' : 'text-blue-600'}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-extrabold text-slate-900">{value}</p>
                    <p className="text-sm text-slate-500">{label}</p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Link href="/dashboard/products/new"><Button variant="gradient" size="lg" className="w-full">+ Tambah Produk</Button></Link>
          <Link href="/dashboard/cerita/new"><Button variant="outline" size="lg" className="w-full">+ Tulis Cerita</Button></Link>
        </div>
      </div>
    );
  }

  // Admin / Superadmin
  const [users, umkms, products, stories, events, orders] = await Promise.all([
    prisma.user.count(),
    prisma.umkm.count({ where: { status: 'APPROVED' } }),
    prisma.product.count({ where: { status: 'APPROVED' } }),
    prisma.story.count({ where: { status: 'APPROVED' } }),
    prisma.event.count({ where: { status: 'APPROVED' } }),
    prisma.whatsAppOrderLog.count(),
  ]);
  const pending = {
    umkms:    await prisma.umkm.count({ where: { status: 'PENDING' } }),
    products: await prisma.product.count({ where: { status: 'PENDING' } }),
    stories:  await prisma.story.count({ where: { status: 'PENDING' } }),
    events:   await prisma.event.count({ where: { status: 'PENDING' } }),
  };
  const stats = [
    { label: 'Total User', value: users, icon: Users, color: 'violet' },
    { label: 'UMKM Aktif', value: umkms, icon: Store, color: 'green' },
    { label: 'Produk', value: products, icon: Package, color: 'blue' },
    { label: 'WA Orders', value: orders, icon: TrendingUp, color: 'orange' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 mt-1">Selamat datang kembali, {session?.user?.name}</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <Card key={label} className="p-5">
            <div className="flex items-center gap-4">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${color === 'violet' ? 'bg-violet-100' : color === 'green' ? 'bg-green-100' : color === 'blue' ? 'bg-blue-100' : 'bg-orange-100'}`}>
                <Icon className={`w-5 h-5 ${color === 'violet' ? 'text-violet-600' : color === 'green' ? 'text-green-600' : color === 'blue' ? 'text-blue-600' : 'text-orange-600'}`} />
              </div>
              <div>
                <p className="text-xl font-extrabold text-slate-900">{value}</p>
                <p className="text-xs text-slate-500">{label}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
      {(pending.umkms + pending.products + pending.stories + pending.events) > 0 && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-5">
            <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2"><Clock className="w-4 h-4 text-amber-500" /> Menunggu Persetujuan</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: 'UMKM', count: pending.umkms, href: '/dashboard/umkm' },
                { label: 'Produk', count: pending.products, href: '/dashboard/products' },
                { label: 'Cerita', count: pending.stories, href: '/dashboard/cerita' },
                { label: 'Event', count: pending.events, href: '/dashboard/event' },
              ].map(({ label, count, href }) => count > 0 && (
                <Link key={label} href={href}>
                  <div className="bg-white border border-amber-200 rounded-xl p-3 hover:border-amber-400 transition-colors cursor-pointer">
                    <p className="text-xl font-extrabold text-amber-600">{count}</p>
                    <p className="text-xs text-slate-600">{label} pending</p>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

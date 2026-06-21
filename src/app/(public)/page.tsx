import Link from 'next/link';
import prisma from '@/lib/prisma';
import { formatPrice, formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import PromoSlider from '@/components/PromoSlider';
import { Store, ArrowRight, ShoppingBag, BookOpen, Calendar, Star, Users, Package, TrendingUp, Globe, MapPin, CheckCircle, Sparkles, Zap } from 'lucide-react';

async function getData() {
  const [products, umkms, stories, events, promos] = await Promise.all([
    prisma.product.findMany({ where: { status: 'APPROVED' }, include: { images: true, umkm: true }, take: 6, orderBy: { createdAt: 'desc' } }),
    prisma.umkm.findMany({ where: { status: 'APPROVED' }, include: { region: true, _count: { select: { products: true } } }, take: 6, orderBy: { createdAt: 'desc' } }),
    prisma.story.findMany({ where: { status: 'APPROVED' }, include: { umkm: true }, take: 3, orderBy: { publishedAt: 'desc' } }),
    prisma.event.findMany({ where: { status: 'APPROVED', startDate: { gte: new Date() } }, include: { _count: { select: { registrations: true } } }, take: 3, orderBy: { startDate: 'asc' } }),
    prisma.promo.findMany({ where: { status: 'APPROVED', isActive: true }, take: 6, orderBy: { createdAt: 'desc' } }),
  ]);
  const [totalUmkm, totalProduct, totalUser] = await Promise.all([
    prisma.umkm.count({ where: { status: 'APPROVED' } }),
    prisma.product.count({ where: { status: 'APPROVED' } }),
    prisma.user.count(),
  ]);
  return { products, umkms, stories, events, promos, stats: { totalUmkm, totalProduct, totalUser } };
}

export default async function HomePage() {
  const { products, umkms, stories, events, promos, stats } = await getData();

  return (
    <>
      {/* ── HERO ── */}
      <section className="hero-dark py-24 px-4 relative">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-violet-600/20 border border-violet-500/30 rounded-full px-4 py-1.5 mb-8">
            <Sparkles className="w-3.5 h-3.5 text-violet-400" />
            <span className="text-sm text-violet-300 font-medium">Platform UMKM Digital #1 Indonesia</span>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-6 tracking-tight">
            Ekosistem Digital<br/>
            <span className="gradient-text">UMKM Indonesia</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Kelola, promosikan, dan kembangkan bisnis UMKM Anda dengan platform lengkap. Dari katalog produk hingga event komunitas.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/auth/register">
              <Button variant="gradient" size="xl" className="w-full sm:w-auto">
                Mulai Gratis <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/katalog">
              <Button variant="outline" size="xl" className="w-full sm:w-auto border-white/20 text-white hover:bg-white/10 hover:border-white/30 bg-transparent">
                Lihat Katalog
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto">
            {[
              { value: stats.totalUmkm + '+', label: 'UMKM Terdaftar' },
              { value: stats.totalProduct + '+', label: 'Produk Aktif' },
              { value: stats.totalUser + '+', label: 'Pengguna' },
            ].map(({ value, label }) => (
              <div key={label} className="glass-card p-4 text-center">
                <div className="text-2xl font-extrabold text-white mb-1">{value}</div>
                <div className="text-xs text-slate-400">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROMO SLIDER ── */}
      {promos.length > 0 && <PromoSlider promos={promos} />}

      {/* ── FEATURES STRIP ── */}
      <section className="bg-slate-50 border-y border-slate-200 py-12">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: ShoppingBag, title: 'Katalog Produk', desc: 'Upload & kelola produk dengan mudah' },
              { icon: BookOpen, title: 'Cerita & Blog', desc: 'Bagikan kisah sukses bisnis Anda' },
              { icon: Calendar, title: 'Event & Komunitas', desc: 'Ikuti event dan pelatihan UMKM' },
              { icon: TrendingUp, title: 'WhatsApp Order', desc: 'Terima pesanan langsung via WA' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex flex-col items-center text-center p-4 rounded-2xl hover:bg-white hover:shadow-card transition-all duration-200">
                <div className="w-11 h-11 bg-violet-100 rounded-xl flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5 text-violet-600" />
                </div>
                <p className="font-semibold text-slate-800 text-sm mb-1">{title}</p>
                <p className="text-xs text-slate-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ── */}
      {products.length > 0 && (
        <section className="py-20 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-10">
              <div>
                <Badge variant="violet" className="mb-3"><Package className="w-3 h-3 mr-1" /> Produk Unggulan</Badge>
                <h2 className="text-3xl font-extrabold text-slate-900">Produk Pilihan</h2>
                <p className="text-slate-500 mt-2">Temukan produk terbaik dari UMKM lokal</p>
              </div>
              <Link href="/katalog" className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-violet-600 hover:text-violet-700">
                Lihat Semua <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
              {products.map((p) => (
                <Link key={p.id} href={`/katalog/${p.umkm.slug}`}>
                  <Card className="card-hover cursor-pointer overflow-hidden group">
                    <div className="aspect-square bg-slate-100 overflow-hidden">
                      {p.images[0] ? (
                        <img src={p.images[0].url} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center"><ShoppingBag className="w-10 h-10 text-slate-300" /></div>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <p className="font-semibold text-slate-900 text-sm line-clamp-1 mb-0.5">{p.name}</p>
                      <p className="text-xs text-slate-500 mb-2">{p.umkm.name}</p>
                      {p.price && <p className="font-bold text-violet-600 text-sm">{formatPrice(p.price)}</p>}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── UMKM GRID ── */}
      {umkms.length > 0 && (
        <section className="py-20 px-4 bg-slate-50">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-10">
              <div>
                <Badge variant="violet" className="mb-3"><Store className="w-3 h-3 mr-1" /> Direktori</Badge>
                <h2 className="text-3xl font-extrabold text-slate-900">UMKM Terdaftar</h2>
                <p className="text-slate-500 mt-2">Jelajahi UMKM lokal di seluruh Indonesia</p>
              </div>
              <Link href="/katalog" className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-violet-600 hover:text-violet-700">
                Lihat Semua <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {umkms.map((u) => (
                <Link key={u.id} href={`/katalog/${u.slug}`}>
                  <Card className="card-hover cursor-pointer p-5 flex flex-col gap-3 group">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-violet-700 flex items-center justify-center text-white font-bold text-lg shadow-btn-violet">
                        {u.name[0]}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 group-hover:text-violet-600 transition-colors line-clamp-1">{u.name}</p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span className="text-xs text-slate-500">{u.region.name}</span>
                        </div>
                      </div>
                    </div>
                    {u.description && <p className="text-sm text-slate-500 line-clamp-2">{u.description}</p>}
                    <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                      {u.category && <Badge variant="violet" className="text-xs">{u.category}</Badge>}
                      <span className="text-xs text-slate-400 ml-auto">{u._count.products} produk</span>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── STORIES ── */}
      {stories.length > 0 && (
        <section className="py-20 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-10">
              <div>
                <Badge variant="violet" className="mb-3"><BookOpen className="w-3 h-3 mr-1" /> Blog</Badge>
                <h2 className="text-3xl font-extrabold text-slate-900">Cerita UMKM</h2>
                <p className="text-slate-500 mt-2">Inspirasi dari pelaku UMKM Indonesia</p>
              </div>
              <Link href="/cerita" className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-violet-600 hover:text-violet-700">
                Lihat Semua <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {stories.map((s) => (
                <Link key={s.id} href={`/cerita/${s.slug}`}>
                  <Card className="card-hover cursor-pointer overflow-hidden group h-full">
                    {s.coverImage && (
                      <div className="aspect-video overflow-hidden bg-slate-100">
                        <img src={s.coverImage} alt={s.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      </div>
                    )}
                    <CardContent className="p-5 flex flex-col gap-2 flex-1">
                      <p className="font-bold text-slate-900 leading-snug group-hover:text-violet-600 transition-colors line-clamp-2">{s.title}</p>
                      {s.excerpt && <p className="text-sm text-slate-500 line-clamp-2">{s.excerpt}</p>}
                      <div className="flex items-center gap-2 mt-auto pt-3 border-t border-slate-100">
                        <span className="text-xs text-slate-400">{s.umkm?.name}</span>
                        <span className="text-slate-300">·</span>
                        <span className="text-xs text-slate-400">{formatDate(s.createdAt)}</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── EVENTS ── */}
      {events.length > 0 && (
        <section className="py-20 px-4 bg-slate-50">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-10">
              <div>
                <Badge variant="violet" className="mb-3"><Calendar className="w-3 h-3 mr-1" /> Agenda</Badge>
                <h2 className="text-3xl font-extrabold text-slate-900">Event Mendatang</h2>
                <p className="text-slate-500 mt-2">Jangan lewatkan event dan pelatihan UMKM</p>
              </div>
              <Link href="/event" className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-violet-600 hover:text-violet-700">
                Lihat Semua <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {events.map((e) => (
                <Link key={e.id} href={`/event/${e.id}`}>
                  <Card className="card-hover cursor-pointer p-5 group">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 bg-violet-100 rounded-xl flex flex-col items-center justify-center text-violet-600 flex-shrink-0">
                        <span className="text-xs font-semibold">{new Date(e.startDate).toLocaleString('id-ID', { month: 'short' })}</span>
                        <span className="text-xl font-extrabold">{new Date(e.startDate).getDate()}</span>
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 group-hover:text-violet-600 transition-colors leading-snug line-clamp-2 mb-2">{e.title}</p>
                        <div className="flex items-center gap-1.5">
                          {e.isOnline ? (
                            <Badge variant="violet" className="text-xs"><Globe className="w-3 h-3 mr-0.5" /> Online</Badge>
                          ) : (
                            <span className="text-xs text-slate-500 flex items-center gap-1"><MapPin className="w-3 h-3" />{e.location || '-'}</span>
                          )}
                        </div>
                        {e._count.registrations > 0 && (
                          <p className="text-xs text-slate-400 mt-1 flex items-center gap-1"><Users className="w-3 h-3" /> {e._count.registrations} peserta</p>
                        )}
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ── */}
      <section className="hero-dark py-24 px-4">
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-green-500/20 border border-green-500/30 rounded-full px-4 py-1.5 mb-6">
            <Zap className="w-3.5 h-3.5 text-green-400" />
            <span className="text-sm text-green-300 font-medium">Gratis selamanya untuk UMKM</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
            Siap mengembangkan<br/><span className="gradient-text">bisnis Anda?</span>
          </h2>
          <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto">Bergabung dengan ribuan UMKM yang sudah memanfaatkan platform digital kami.</p>
          <Link href="/auth/register">
            <Button variant="gradient" size="xl">
              Daftarkan UMKM Sekarang <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}

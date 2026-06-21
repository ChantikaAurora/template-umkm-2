import Link from 'next/link';
import prisma from '@/lib/prisma';
import { formatPrice } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShoppingBag, MapPin, MessageCircle, Store } from 'lucide-react';

function generateWALink(phone: string, productName: string, price: number | null, umkmName: string) {
  const cleaned = phone.replace(/\D/g, '').replace(/^0/, '62');
  const msg = `Halo! Saya tertarik dengan produk *${productName}* dari *${umkmName}*${price ? ` seharga Rp ${price.toLocaleString('id-ID')}` : ''}. Apakah masih tersedia?`;
  return `https://wa.me/${cleaned}?text=${encodeURIComponent(msg)}`;
}

export default async function KatalogPage() {
  const products = await prisma.product.findMany({
    where: { status: 'APPROVED' },
    include: {
      images: { orderBy: { order: 'asc' }, take: 1 },
      umkm: { include: { region: true } },
      category: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Page Header */}
      <div className="bg-white border-b border-slate-200 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <Badge variant="violet" className="mb-3">
            <ShoppingBag className="w-3 h-3 mr-1" /> Katalog
          </Badge>
          <h1 className="text-4xl font-extrabold text-slate-900 mb-2">Katalog Produk</h1>
          <p className="text-slate-500 text-lg">
            Temukan produk terbaik dari UMKM lokal pilihan seluruh Indonesia
          </p>
        </div>
      </div>

      {/* Product Grid */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {products.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-8 h-8 text-slate-300" />
            </div>
            <p className="text-slate-400 font-medium">Belum ada produk tersedia</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
            {products.map((p) => (
              <Card key={p.id} className="overflow-hidden group card-hover flex flex-col">
                {/* Product Image */}
                <div className="aspect-square bg-slate-100 overflow-hidden flex-shrink-0">
                  {p.images[0] ? (
                    <img
                      src={p.images[0].url}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ShoppingBag className="w-10 h-10 text-slate-300" />
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <CardContent className="p-4 flex flex-col flex-1 space-y-2">
                  {p.category && (
                    <Badge variant="violet" className="text-[10px] self-start">{p.category.name}</Badge>
                  )}
                  <p className="font-semibold text-slate-900 text-sm line-clamp-2 leading-snug flex-1">
                    {p.name}
                  </p>
                  {p.price && (
                    <p className="font-extrabold text-violet-600 text-base">
                      {formatPrice(p.price)}
                    </p>
                  )}

                  {/* UMKM info */}
                  <Link href={`/katalog/${p.umkm?.slug}`} className="flex items-center gap-1.5 group/umkm">
                    <div className="w-5 h-5 rounded bg-gradient-to-br from-violet-500 to-violet-700 flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0">
                      {p.umkm?.name[0]}
                    </div>
                    <span className="text-xs text-slate-500 group-hover/umkm:text-violet-600 transition-colors truncate">
                      {p.umkm?.name}
                    </span>
                    {p.umkm?.region && (
                      <span className="text-xs text-slate-400 flex items-center gap-0.5 flex-shrink-0">
                        <MapPin className="w-2.5 h-2.5" />
                        {p.umkm.region.name.split(' ')[0]}
                      </span>
                    )}
                  </Link>

                  {/* WhatsApp Order Button */}
                  {p.umkm?.whatsapp ? (
                    <a
                      href={generateWALink(p.umkm.whatsapp, p.name, p.price, p.umkm.name)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="whatsapp" size="sm" className="w-full mt-1">
                        <MessageCircle className="w-3.5 h-3.5 mr-1.5" /> Pesan via WA
                      </Button>
                    </a>
                  ) : (
                    <Link href={`/katalog/${p.umkm?.slug}`}>
                      <Button variant="outline" size="sm" className="w-full mt-1">
                        <Store className="w-3.5 h-3.5 mr-1.5" /> Lihat UMKM
                      </Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

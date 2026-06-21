import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import { formatPrice } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Store, MapPin, Phone, MessageCircle, Globe, ShoppingBag, Package } from 'lucide-react';

function generateWALink(phone: string, productName: string, price: number | null, umkmName: string) {
  const cleaned = phone.replace(/\D/g, '').replace(/^0/, '62');
  const msg = `Halo! Saya tertarik dengan produk *${productName}* dari *${umkmName}*${price ? ` seharga Rp ${price.toLocaleString('id-ID')}` : ''}. Apakah masih tersedia?`;
  return `https://wa.me/${cleaned}?text=${encodeURIComponent(msg)}`;
}

export default async function KatalogDetailPage({ params }: { params: { slug: string } }) {
  const umkm = await prisma.umkm.findUnique({
    where: { slug: params.slug },
    include: { owner: true, region: true, products: { where: { status: 'APPROVED' }, include: { images: true, category: true } } },
  });
  if (!umkm) notFound();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-violet-700 flex items-center justify-center text-white font-extrabold text-3xl shadow-card-lg flex-shrink-0">
              {umkm.name[0]}
            </div>
            <div className="flex-1">
              <Badge variant="success" className="mb-2">Terverifikasi</Badge>
              <h1 className="text-3xl font-extrabold text-slate-900 mb-2">{umkm.name}</h1>
              <div className="flex flex-wrap gap-3 text-sm text-slate-500 mb-3">
                <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {umkm.region.name}</span>
                {umkm.category && <span><Badge variant="violet">{umkm.category}</Badge></span>}
                <span className="flex items-center gap-1"><Package className="w-4 h-4" /> {umkm.products.length} produk</span>
              </div>
              {umkm.description && <p className="text-slate-600 text-sm max-w-xl">{umkm.description}</p>}
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-6">
            {umkm.whatsapp && (
              <a href={`https://wa.me/${umkm.whatsapp.replace(/\D/g,'').replace(/^0/,'62')}`} target="_blank" rel="noopener noreferrer">
                <Button variant="whatsapp" size="sm"><MessageCircle className="w-4 h-4 mr-1.5" /> WhatsApp</Button>
              </a>
            )}
            {umkm.phone && (
              <a href={`tel:${umkm.phone}`}><Button variant="outline" size="sm"><Phone className="w-4 h-4 mr-1.5" /> {umkm.phone}</Button></a>
            )}
            {umkm.website && (
              <a href={umkm.website} target="_blank" rel="noopener noreferrer"><Button variant="outline" size="sm"><Globe className="w-4 h-4 mr-1.5" /> Website</Button></a>
            )}
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="max-w-5xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          <ShoppingBag className="w-6 h-6 text-violet-600" /> Produk
        </h2>
        {umkm.products.length === 0 ? (
          <div className="text-center py-12 text-slate-400 bg-white rounded-2xl border border-slate-200">Belum ada produk</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {umkm.products.map((p) => (
              <Card key={p.id} className="overflow-hidden group">
                <div className="aspect-square bg-slate-100 overflow-hidden">
                  {p.images[0] ? (
                    <img src={p.images[0].url} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center"><ShoppingBag className="w-8 h-8 text-slate-300" /></div>
                  )}
                </div>
                <CardContent className="p-4 space-y-2">
                  <p className="font-semibold text-slate-900 text-sm line-clamp-2">{p.name}</p>
                  {p.price && <p className="font-bold text-violet-600">{formatPrice(p.price)}</p>}
                  {umkm.whatsapp && (
                    <a href={generateWALink(umkm.whatsapp, p.name, p.price, umkm.name)} target="_blank" rel="noopener noreferrer">
                      <Button variant="whatsapp" size="sm" className="w-full mt-1">
                        <MessageCircle className="w-3.5 h-3.5 mr-1.5" /> Pesan via WA
                      </Button>
                    </a>
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

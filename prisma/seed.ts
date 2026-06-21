import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Regions
  const regions = await Promise.all([
    prisma.region.upsert({ where: { slug: 'sumbar' }, update: {}, create: { name: 'Sumatera Barat', slug: 'sumbar' } }),
    prisma.region.upsert({ where: { slug: 'riau' }, update: {}, create: { name: 'Riau', slug: 'riau' } }),
    prisma.region.upsert({ where: { slug: 'jabar' }, update: {}, create: { name: 'Jawa Barat', slug: 'jabar' } }),
  ]);

  // Categories
  const cats = await Promise.all([
    prisma.category.upsert({ where: { slug: 'kuliner' }, update: {}, create: { name: 'Kuliner', slug: 'kuliner', icon: '🍜' } }),
    prisma.category.upsert({ where: { slug: 'fashion' }, update: {}, create: { name: 'Fashion', slug: 'fashion', icon: '👗' } }),
    prisma.category.upsert({ where: { slug: 'kerajinan' }, update: {}, create: { name: 'Kerajinan', slug: 'kerajinan', icon: '🎨' } }),
    prisma.category.upsert({ where: { slug: 'digital' }, update: {}, create: { name: 'Digital', slug: 'digital', icon: '💻' } }),
  ]);

  // Users
  const hash = (p: string) => bcrypt.hashSync(p, 10);
  const superadmin = await prisma.user.upsert({
    where: { email: 'superadmin@umkm2.id' }, update: {},
    create: { name: 'Super Admin', email: 'superadmin@umkm2.id', password: hash('admin123'), role: 'SUPERADMIN', regionId: regions[0].id },
  });
  const admin = await prisma.user.upsert({
    where: { email: 'admin@umkm2.id' }, update: {},
    create: { name: 'Admin Sumbar', email: 'admin@umkm2.id', password: hash('admin123'), role: 'ADMIN', regionId: regions[0].id },
  });
  const owner1 = await prisma.user.upsert({
    where: { email: 'rendang@umkm2.id' }, update: {},
    create: { name: 'Bunda Rendang', email: 'rendang@umkm2.id', password: hash('owner123'), role: 'UMKM_OWNER', regionId: regions[0].id },
  });
  const owner2 = await prisma.user.upsert({
    where: { email: 'batik@umkm2.id' }, update: {},
    create: { name: 'Ibu Batik', email: 'batik@umkm2.id', password: hash('owner123'), role: 'UMKM_OWNER', regionId: regions[2].id },
  });
  const owner3 = await prisma.user.upsert({
    where: { email: 'kopi@umkm2.id' }, update: {},
    create: { name: 'Pak Kopi', email: 'kopi@umkm2.id', password: hash('owner123'), role: 'UMKM_OWNER', regionId: regions[1].id },
  });
  const visitor = await prisma.user.upsert({
    where: { email: 'visitor@umkm2.id' }, update: {},
    create: { name: 'Pengunjung Baru', email: 'visitor@umkm2.id', password: hash('visitor123'), role: 'VISITOR', regionId: regions[0].id },
  });

  // UMKMs
  const umkm1 = await prisma.umkm.upsert({
    where: { slug: 'rendang-bundo-kanduang' }, update: {},
    create: { name: 'Rendang Bundo Kanduang', slug: 'rendang-bundo-kanduang', description: 'Rendang autentik Padang dengan resep turun-temurun', whatsapp: '08123456789', address: 'Jl. Minangkabau No.1, Padang', category: 'Kuliner', status: 'APPROVED', regionId: regions[0].id, ownerId: owner1.id },
  });
  const umkm2 = await prisma.umkm.upsert({
    where: { slug: 'batik-cirebon-indah' }, update: {},
    create: { name: 'Batik Cirebon Indah', slug: 'batik-cirebon-indah', description: 'Batik tulis dan cap khas Cirebon berkualitas tinggi', whatsapp: '08234567890', address: 'Jl. Batik No.5, Cirebon', category: 'Fashion', status: 'APPROVED', regionId: regions[2].id, ownerId: owner2.id },
  });
  const umkm3 = await prisma.umkm.upsert({
    where: { slug: 'kopi-riau-premium' }, update: {},
    create: { name: 'Kopi Riau Premium', slug: 'kopi-riau-premium', description: 'Kopi arabika dan robusta pilihan dari kebun terbaik Riau', whatsapp: '08345678901', address: 'Jl. Kopi No.3, Pekanbaru', category: 'Kuliner', status: 'APPROVED', regionId: regions[1].id, ownerId: owner3.id },
  });
  const umkm4 = await prisma.umkm.upsert({
    where: { slug: 'kedai-harian-susi' }, update: {},
    create: { name: 'Kedai Harian Susi', slug: 'kedai-harian-susi', description: 'Aneka makanan rumahan yang lezat dan terjangkau', whatsapp: '08156746821', address: 'Jl. Pasar No.7, Padang', category: 'Kuliner', status: 'APPROVED', regionId: regions[0].id, ownerId: owner1.id },
  });

  // Link User.umkmId to their primary UMKM
  await prisma.user.update({ where: { id: owner1.id }, data: { umkmId: umkm1.id } });
  await prisma.user.update({ where: { id: owner2.id }, data: { umkmId: umkm2.id } });
  await prisma.user.update({ where: { id: owner3.id }, data: { umkmId: umkm3.id } });

  // Products
  const products = [
    { name: 'Rendang Daging Sapi 500g', slug: 'rendang-daging-sapi-500g', price: 85000, umkmId: umkm1.id, categoryId: cats[0].id, status: 'APPROVED', description: 'Rendang daging sapi asli Minang, dimasak 6 jam dengan bumbu rempah pilihan' },
    { name: 'Rendang Jengkol 250g', slug: 'rendang-jengkol-250g', price: 45000, umkmId: umkm1.id, categoryId: cats[0].id, status: 'APPROVED', description: 'Rendang jengkol empuk dengan cita rasa pedas gurih khas Padang' },
    { name: 'Batik Mega Mendung', slug: 'batik-mega-mendung', price: 350000, umkmId: umkm2.id, categoryId: cats[1].id, status: 'APPROVED', description: 'Batik tulis motif mega mendung, warna biru cerah khas Cirebon' },
    { name: 'Kopi Arabika Riau 250g', slug: 'kopi-arabika-riau-250g', price: 75000, umkmId: umkm3.id, categoryId: cats[0].id, status: 'APPROVED', description: 'Kopi arabika single origin dari dataran tinggi Kampar, Riau' },
    { name: 'Kopi Robusta Riau 500g', slug: 'kopi-robusta-riau-500g', price: 55000, umkmId: umkm3.id, categoryId: cats[0].id, status: 'APPROVED', description: 'Kopi robusta body tebal dengan aroma tanah yang khas' },
  ];
  for (const p of products) {
    await prisma.product.upsert({ where: { slug: p.slug }, update: {}, create: p });
  }

  // Stories
  await prisma.story.upsert({
    where: { slug: 'kisah-sukses-rendang-bundo' }, update: {},
    create: { title: 'Kisah Sukses Rendang Bundo Kanduang', slug: 'kisah-sukses-rendang-bundo', excerpt: 'Dari dapur kecil ke pasar nasional, perjalanan inspiratif Bunda Rendang', content: 'Bermula dari dapur kecil di Padang, Bunda Rendang kini telah memasarkan rendangnya ke seluruh Indonesia. Dengan tekad dan inovasi, usaha kecilnya berkembang pesat berkat platform digital UMKM.', tags: '["kuliner","inspirasi","padang","rendang"]', status: 'APPROVED', publishedAt: new Date(), authorId: owner1.id, umkmId: umkm1.id },
  });
  await prisma.story.upsert({
    where: { slug: 'batik-digital-generasi-muda' }, update: {},
    create: { title: 'Batik Digital untuk Generasi Muda', slug: 'batik-digital-generasi-muda', excerpt: 'Bagaimana Batik Cirebon Indah menarik minat anak muda dengan strategi digital', content: 'Ibu Batik membuktikan bahwa warisan budaya bisa bersanding dengan teknologi digital. Strategi media sosial dan e-commerce membawa batiknya ke tangan generasi milenial dan Gen Z.', tags: '["batik","fashion","digital","budaya"]', status: 'APPROVED', publishedAt: new Date(), authorId: owner2.id, umkmId: umkm2.id },
  });

  // Events
  await prisma.event.upsert({
    where: { id: 'event-umkm-festival-2026' }, update: {},
    create: { id: 'event-umkm-festival-2026', title: 'UMKM Digital Festival 2026', description: 'Festival UMKM digital terbesar di Sumatera Barat. Workshop, pameran produk, dan networking session.', location: 'Padang Convention Center', startDate: new Date('2026-05-15'), endDate: new Date('2026-05-17'), maxAttendee: 500, status: 'APPROVED', createdBy: admin.id },
  });
  await prisma.event.upsert({
    where: { id: 'event-webinar-branding' }, update: {},
    create: { id: 'event-webinar-branding', title: 'Webinar: Branding UMKM di Era Digital', description: 'Pelajari strategi branding efektif untuk UMKM di era digital bersama para ahli pemasaran', isOnline: true, meetLink: 'https://meet.google.com/xyz-abc-def', startDate: new Date('2026-05-20'), status: 'APPROVED', createdBy: superadmin.id },
  });

  // Promos
  await prisma.promo.upsert({
    where: { id: 'promo-harbolnas' }, update: { isActive: true },
    create: { id: 'promo-harbolnas', title: 'Harbolnas UMKM 2026', description: 'Diskon spesial 30% untuk semua produk UMKM pilihan', status: 'APPROVED', isActive: true, umkmId: umkm1.id, startDate: new Date('2026-05-01'), endDate: new Date('2026-05-31') },
  });
  await prisma.promo.upsert({
    where: { id: 'promo-rendang-lebaran' }, update: { isActive: true },
    create: { id: 'promo-rendang-lebaran', title: 'Promo Rendang Spesial Lebaran', description: 'Diskon 20% untuk semua produk rendang pilihan Bundo Kanduang!', status: 'APPROVED', isActive: true, image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800', umkmId: umkm1.id },
  });

  console.log('✅ Seeding completed!\n');
  console.log('📋 Akun test:');
  console.log('   Superadmin : superadmin@umkm2.id / admin123');
  console.log('   Admin      : admin@umkm2.id / admin123');
  console.log('   UMKM Owner : rendang@umkm2.id / owner123');
  console.log('   UMKM Owner : batik@umkm2.id / owner123');
  console.log('   UMKM Owner : kopi@umkm2.id / owner123');
  console.log('   Visitor    : visitor@umkm2.id / visitor123');
}

main().catch(console.error).finally(() => prisma.$disconnect());

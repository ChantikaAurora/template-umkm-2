import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse, requireAuth, getPagination } from '@/lib/api-helpers';

function slugify(text: string) {
  return text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '').replace(/--+/g, '-').trim();
}

export async function GET(req: NextRequest) {
  try {
    const { page, perPage, skip } = getPagination(req.nextUrl.searchParams);
    const status = req.nextUrl.searchParams.get('status');
    const umkmId = req.nextUrl.searchParams.get('umkmId');
    const where: any = {};
    if (status && status !== 'ALL') where.status = status;
    else if (!status) where.status = 'APPROVED';
    if (umkmId) where.umkmId = umkmId;
    const [products, total] = await Promise.all([
      prisma.product.findMany({ where, include: { images: true, umkm: true, category: true }, skip, take: perPage, orderBy: { createdAt: 'desc' } }),
      prisma.product.count({ where }),
    ]);
    return successResponse(products, 'Success', { page, perPage, total });
  } catch (e: any) { return errorResponse(e.message); }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth();
    const body = await req.json();
    const { name, description, price, categoryId, images } = body;
    if (!name) return errorResponse('Name is required');
    let umkmId = (session.user as any).umkmId;
    if (!umkmId) {
      // Fallback: find UMKM by ownerId (covers seed users where User.umkmId not set)
      const ownerUmkm = await prisma.umkm.findFirst({
        where: { ownerId: (session.user as any).id, status: 'APPROVED' },
      });
      if (!ownerUmkm) return errorResponse('No UMKM associated. Please register your UMKM first.');
      umkmId = ownerUmkm.id;
    }
    const slug = slugify(name) + '-' + Date.now();
    const product = await prisma.product.create({
      data: {
        name, slug, description,
        price: price ? parseFloat(price) : null,
        categoryId: categoryId || null, umkmId, status: 'PENDING',
        images: images?.length ? { create: images.map((img: any, i: number) => ({ url: img.url || img, order: i })) } : undefined,
      },
      include: { images: true },
    });
    return successResponse(product, 'Product created');
  } catch (e: any) { return errorResponse(e.message, 400); }
}

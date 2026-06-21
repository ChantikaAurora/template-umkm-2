import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse, requireAuth, getPagination } from '@/lib/api-helpers';

export async function POST(req: NextRequest) {
  try {
    const { productId, umkmId, buyerName, buyerPhone, message } = await req.json();
    const log = await prisma.whatsAppOrderLog.create({ data: { productId, umkmId, buyerName, buyerPhone, message } });
    return successResponse(log, 'Order logged');
  } catch (e: any) { return errorResponse(e.message, 400); }
}

export async function GET(req: NextRequest) {
  try {
    const session = await requireAuth();
    const { page, perPage, skip } = getPagination(req.nextUrl.searchParams);
    const role = (session.user as any)?.role;
    const umkmId = (session.user as any)?.umkmId;
    const where: any = {};
    if (role === 'UMKM_OWNER' && umkmId) where.umkmId = umkmId;
    const [orders, total] = await Promise.all([
      prisma.whatsAppOrderLog.findMany({ where, include: { product: true, umkm: true }, skip, take: perPage, orderBy: { createdAt: 'desc' } }),
      prisma.whatsAppOrderLog.count({ where }),
    ]);
    return successResponse(orders, 'Success', { page, perPage, total });
  } catch (e: any) { return errorResponse(e.message, 400); }
}

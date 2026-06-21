import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse, requireAuth, getPagination } from '@/lib/api-helpers';

export async function GET(req: NextRequest) {
  try {
    const { page, perPage, skip } = getPagination(req.nextUrl.searchParams);
    const status = req.nextUrl.searchParams.get('status');
    const where: any = {};
    if (status && status !== 'ALL') where.status = status;
    else if (!status) where.status = 'APPROVED';
    const [promos, total] = await Promise.all([
      prisma.promo.findMany({ where, include: { umkm: true }, skip, take: perPage, orderBy: { createdAt: 'desc' } }),
      prisma.promo.count({ where }),
    ]);
    return successResponse(promos, 'Success', { page, perPage, total });
  } catch (e: any) { return errorResponse(e.message); }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth();
    const body = await req.json();
    const { title, description, image, link, startDate, endDate } = body;
    if (!title) return errorResponse('Title is required');
    const umkmId = (session.user as any).umkmId;
    const promo = await prisma.promo.create({ data: { title, description, image, link, umkmId, startDate: startDate ? new Date(startDate) : null, endDate: endDate ? new Date(endDate) : null, status: 'PENDING' } });
    return successResponse(promo, 'Promo created');
  } catch (e: any) { return errorResponse(e.message, 400); }
}

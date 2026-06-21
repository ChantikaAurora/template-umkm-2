import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse, getPagination } from '@/lib/api-helpers';

export async function GET(req: NextRequest) {
  try {
    const { page, perPage, skip } = getPagination(req.nextUrl.searchParams);
    const status = req.nextUrl.searchParams.get('status');
    const where: any = {};
    if (status && status !== 'ALL') where.status = status;
    else if (!status) where.status = 'APPROVED';
    const [umkms, total] = await Promise.all([
      prisma.umkm.findMany({ where, include: { owner: true, region: true, _count: { select: { products: true } } }, skip, take: perPage, orderBy: { createdAt: 'desc' } }),
      prisma.umkm.count({ where }),
    ]);
    return successResponse(umkms, 'Success', { page, perPage, total });
  } catch (e: any) { return errorResponse(e.message); }
}

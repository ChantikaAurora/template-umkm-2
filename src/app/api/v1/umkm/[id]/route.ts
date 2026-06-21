import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-helpers';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const umkm = await prisma.umkm.findFirst({
      where: { OR: [{ id: params.id }, { slug: params.id }] },
      include: { owner: true, region: true, products: { where: { status: 'APPROVED' }, include: { images: true, category: true } } },
    });
    if (!umkm) return errorResponse('UMKM not found', 404);
    return successResponse(umkm);
  } catch (e: any) { return errorResponse(e.message); }
}

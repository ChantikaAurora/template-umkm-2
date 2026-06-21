import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse, requireRole } from '@/lib/api-helpers';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireRole(['SUPERADMIN', 'ADMIN']);
    const body = await req.json();
    const { status, isActive } = body;
    const data: any = {};
    if (status !== undefined) data.status = status;
    if (isActive !== undefined) data.isActive = isActive;
    const promo = await prisma.promo.update({ where: { id: params.id }, data });
    return successResponse(promo, 'Promo updated');
  } catch (e: any) { return errorResponse(e.message, 400); }
}

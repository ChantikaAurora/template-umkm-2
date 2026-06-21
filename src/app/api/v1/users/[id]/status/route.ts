import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse, requireRole } from '@/lib/api-helpers';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireRole(['SUPERADMIN']);
    const { status } = await req.json();
    const user = await prisma.user.update({ where: { id: params.id }, data: { status } });
    return successResponse(user, 'Status updated');
  } catch (e: any) { return errorResponse(e.message, 400); }
}

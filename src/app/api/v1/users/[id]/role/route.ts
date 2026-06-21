import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse, requireRole } from '@/lib/api-helpers';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireRole(['SUPERADMIN']);
    const { role } = await req.json();
    const user = await prisma.user.update({ where: { id: params.id }, data: { role } });
    return successResponse(user, 'Role updated');
  } catch (e: any) { return errorResponse(e.message, 400); }
}

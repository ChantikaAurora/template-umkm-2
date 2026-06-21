import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse, requireRole } from '@/lib/api-helpers';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireRole(['SUPERADMIN', 'ADMIN']);
    const { status } = await req.json();
    const event = await prisma.event.update({ where: { id: params.id }, data: { status } });
    return successResponse(event, `Event ${status}`);
  } catch (e: any) { return errorResponse(e.message, 400); }
}

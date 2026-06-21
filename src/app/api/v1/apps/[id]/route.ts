import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse, requireRole } from '@/lib/api-helpers';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireRole(['SUPERADMIN']);
    const body = await req.json();
    const app = await prisma.app.update({ where: { id: params.id }, data: body });
    return successResponse(app, 'App updated');
  } catch (e: any) { return errorResponse(e.message, 400); }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireRole(['SUPERADMIN']);
    await prisma.app.delete({ where: { id: params.id } });
    return successResponse(null, 'App deleted');
  } catch (e: any) { return errorResponse(e.message, 400); }
}

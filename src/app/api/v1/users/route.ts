import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse, requireRole } from '@/lib/api-helpers';

export async function GET(req: NextRequest) {
  try {
    await requireRole(['SUPERADMIN']);
    const users = await prisma.user.findMany({ include: { region: true }, orderBy: { createdAt: 'desc' } });
    return successResponse(users);
  } catch (e: any) { return errorResponse(e.message, e.message === 'Unauthorized' ? 401 : e.message === 'Forbidden' ? 403 : 400); }
}

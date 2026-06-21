import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-helpers';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const event = await prisma.event.findUnique({ where: { id: params.id }, include: { _count: { select: { registrations: true } }, registrations: true } });
    if (!event) return errorResponse('Event not found', 404);
    return successResponse(event);
  } catch (e: any) { return errorResponse(e.message); }
}

import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse, requireRole, getPagination } from '@/lib/api-helpers';

export async function GET(req: NextRequest) {
  try {
    const { page, perPage, skip } = getPagination(req.nextUrl.searchParams);
    const status = req.nextUrl.searchParams.get('status');
    const upcoming = req.nextUrl.searchParams.get('upcoming');
    const where: any = {};
    if (status && status !== 'ALL') where.status = status;
    else if (!status) where.status = 'APPROVED';
    if (upcoming === 'true') where.startDate = { gte: new Date() };
    const [events, total] = await Promise.all([
      prisma.event.findMany({ where, include: { _count: { select: { registrations: true } } }, skip, take: perPage, orderBy: { startDate: 'asc' } }),
      prisma.event.count({ where }),
    ]);
    return successResponse(events, 'Success', { page, perPage, total });
  } catch (e: any) { return errorResponse(e.message); }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireRole(['SUPERADMIN', 'ADMIN']);
    const body = await req.json();
    const { title, description, location, image, startDate, endDate, isOnline, meetLink, maxAttendee } = body;
    if (!title || !startDate) return errorResponse('Title and startDate are required');
    const event = await prisma.event.create({ data: { title, description, location, image, startDate: new Date(startDate), endDate: endDate ? new Date(endDate) : null, isOnline, meetLink, maxAttendee, createdBy: (session.user as any).id } });
    return successResponse(event, 'Event created');
  } catch (e: any) { return errorResponse(e.message, e.message === 'Unauthorized' ? 401 : e.message === 'Forbidden' ? 403 : 400); }
}

import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse, requireRole } from '@/lib/api-helpers';

export async function GET() {
  try {
    const apps = await prisma.app.findMany({ orderBy: { createdAt: 'desc' } });
    return successResponse(apps);
  } catch (e: any) { return errorResponse(e.message); }
}

export async function POST(req: NextRequest) {
  try {
    await requireRole(['SUPERADMIN']);
    const body = await req.json();
    const app = await prisma.app.create({ data: body });
    return successResponse(app, 'App created');
  } catch (e: any) { return errorResponse(e.message, 400); }
}

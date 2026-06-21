import prisma from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-helpers';

export async function GET() {
  try {
    const regions = await prisma.region.findMany({ orderBy: { name: 'asc' } });
    return successResponse(regions);
  } catch (e: any) { return errorResponse(e.message); }
}

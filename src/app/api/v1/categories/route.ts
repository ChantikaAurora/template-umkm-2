import prisma from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-helpers';

export async function GET() {
  try {
    const cats = await prisma.category.findMany({ orderBy: { name: 'asc' } });
    return successResponse(cats);
  } catch (e: any) { return errorResponse(e.message); }
}

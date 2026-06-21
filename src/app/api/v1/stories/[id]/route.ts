import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-helpers';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const story = await prisma.story.findFirst({ where: { OR: [{ id: params.id }, { slug: params.id }] }, include: { author: true, umkm: true } });
    if (!story) return errorResponse('Story not found', 404);
    return successResponse(story);
  } catch (e: any) { return errorResponse(e.message); }
}

import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse, requireAuth, getPagination } from '@/lib/api-helpers';

function slugify(text: string) {
  return text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '').replace(/--+/g, '-').trim();
}

export async function GET(req: NextRequest) {
  try {
    const { page, perPage, skip } = getPagination(req.nextUrl.searchParams);
    const status = req.nextUrl.searchParams.get('status');
    const where: any = {};
    if (status && status !== 'ALL') where.status = status;
    else if (!status) where.status = 'APPROVED';
    const [stories, total] = await Promise.all([
      prisma.story.findMany({ where, include: { author: true, umkm: true }, skip, take: perPage, orderBy: { createdAt: 'desc' } }),
      prisma.story.count({ where }),
    ]);
    return successResponse(stories, 'Success', { page, perPage, total });
  } catch (e: any) { return errorResponse(e.message); }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth();
    const body = await req.json();
    const { title, excerpt, content, coverImage, tags } = body;
    if (!title || !content) return errorResponse('Title and content are required');
    const authorId = (session.user as any).id;
    const umkmId = (session.user as any).umkmId;
    const slug = slugify(title) + '-' + Date.now();
    const story = await prisma.story.create({
      data: { title, slug, excerpt, content, coverImage, tags: JSON.stringify(tags || []), authorId, umkmId, status: 'PENDING' },
    });
    return successResponse(story, 'Story created');
  } catch (e: any) { return errorResponse(e.message, 400); }
}

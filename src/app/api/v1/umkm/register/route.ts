import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse, requireAuth } from '@/lib/api-helpers';

function slugify(text: string) {
  return text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '').replace(/--+/g, '-').trim();
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth();
    const userId = (session.user as any).id;
    const { name, description, address, phone, whatsapp, website, category, regionId } = await req.json();
    if (!name || !whatsapp || !regionId) return errorResponse('Name, WhatsApp, and region are required');
    const slug = slugify(name) + '-' + Date.now();
    const umkm = await prisma.umkm.create({ data: { name, slug, description, address, phone, whatsapp, website, category, regionId, ownerId: userId, status: 'PENDING' } });
    await prisma.user.update({ where: { id: userId }, data: { role: 'UMKM_OWNER', umkmId: umkm.id } });
    return successResponse({ ...umkm, role: 'UMKM_OWNER' }, 'UMKM registered');
  } catch (e: any) { return errorResponse(e.message, 400); }
}

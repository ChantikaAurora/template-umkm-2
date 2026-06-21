import { successResponse, errorResponse, requireRole } from '@/lib/api-helpers';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    await requireRole(['SUPERADMIN', 'ADMIN']);
    const [users, umkms, products, stories, events, orders] = await Promise.all([
      prisma.user.count(),
      prisma.umkm.count(),
      prisma.product.count(),
      prisma.story.count(),
      prisma.event.count(),
      prisma.whatsAppOrderLog.count(),
    ]);
    const pending = {
      umkms:    await prisma.umkm.count({ where: { status: 'PENDING' } }),
      products: await prisma.product.count({ where: { status: 'PENDING' } }),
      stories:  await prisma.story.count({ where: { status: 'PENDING' } }),
      events:   await prisma.event.count({ where: { status: 'PENDING' } }),
    };
    return successResponse({ users, umkms, products, stories, events, orders, pending });
  } catch (e: any) { return errorResponse(e.message, e.message === 'Unauthorized' ? 401 : e.message === 'Forbidden' ? 403 : 400); }
}

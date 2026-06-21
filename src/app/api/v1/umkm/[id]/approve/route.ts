import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse, requireRole } from '@/lib/api-helpers';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireRole(['SUPERADMIN', 'ADMIN']);
    const { status } = await req.json();
    const umkm = await prisma.umkm.update({ where: { id: params.id }, data: { status } });
    // When approved, ensure owner's role is UMKM_OWNER and umkmId is set
    if (status === 'APPROVED') {
      await prisma.user.update({
        where: { id: umkm.ownerId },
        data: { role: 'UMKM_OWNER', umkmId: umkm.id },
      });
    }
    return successResponse(umkm, `UMKM ${status}`);
  } catch (e: any) { return errorResponse(e.message, 400); }
}

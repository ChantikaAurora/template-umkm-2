import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-helpers';

export async function GET() {
  try {
    const sections = await prisma.homepageSection.findMany({ where: { isActive: true } });
    return successResponse(sections);
  } catch (e: any) { return errorResponse(e.message); }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const section = await prisma.homepageSection.upsert({ where: { key: body.key }, update: body, create: body });
    return successResponse(section, 'Section saved');
  } catch (e: any) { return errorResponse(e.message, 400); }
}

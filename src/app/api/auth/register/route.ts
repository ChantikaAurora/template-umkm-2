import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-helpers';

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, regionId } = await req.json();
    if (!name || !email || !password) return errorResponse('Name, email and password are required');
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return errorResponse('Email already registered');
    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({ data: { name, email, password: hashed, role: 'VISITOR', regionId } });
    return successResponse({ id: user.id, name: user.name, email: user.email, role: user.role }, 'Registration successful');
  } catch (e: any) { return errorResponse(e.message); }
}

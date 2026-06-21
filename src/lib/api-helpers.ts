import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';

export function successResponse(data: any, message = 'Success', meta?: any) {
  return NextResponse.json({ success: true, message, data, ...(meta && { meta }) });
}

export function errorResponse(message: string, status = 400) {
  return NextResponse.json({ success: false, message }, { status });
}

export async function getSession() {
  return getServerSession(authOptions);
}

export async function requireAuth() {
  const session = await getSession();
  if (!session) throw new Error('Unauthorized');
  return session;
}

export async function requireRole(roles: string[]) {
  const session = await requireAuth();
  const role = (session.user as any)?.role;
  if (!roles.includes(role)) throw new Error('Forbidden');
  return session;
}

export function getPagination(params: URLSearchParams) {
  const page = parseInt(params.get('page') || '1');
  const perPage = parseInt(params.get('perPage') || '20');
  const skip = (page - 1) * perPage;
  return { page, perPage, skip };
}

import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/requireAdmin';
import { bad, readJson, str } from '@/lib/api';

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  const items = await prisma.user.findMany({
    orderBy: { createdAt: 'asc' },
    select: { id: true, email: true, name: true, role: true, createdAt: true },
  });
  return NextResponse.json({ items });
}

export async function POST(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const body = await readJson(req);
  const email = str(body?.email, 200).toLowerCase();
  const name = str(body?.name, 120) || null;
  const password = typeof body?.password === 'string' ? body.password : '';

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return bad('Enter a valid email address.');
  if (password.length < 10) return bad('The password must be at least 10 characters.');
  if (await prisma.user.findUnique({ where: { email } }))
    return bad('That email already has an account.');

  const user = await prisma.user.create({
    data: { email, name, role: 'admin', passwordHash: await hash(password, 12) },
    select: { id: true, email: true, name: true, role: true, createdAt: true },
  });
  return NextResponse.json(user, { status: 201 });
}

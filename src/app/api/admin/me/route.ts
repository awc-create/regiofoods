import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin, currentAdminEmail } from '@/lib/requireAdmin';
import { bad, readJson, str } from '@/lib/api';

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  const email = await currentAdminEmail();
  const user = await prisma.user.findUnique({
    where: { email: email! },
    select: { id: true, email: true, name: true, role: true },
  });
  return NextResponse.json(user);
}

export async function PATCH(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const email = await currentAdminEmail();
  const body = await readJson(req);
  const name = str(body?.name, 120);
  if (!name) return bad('Name cannot be empty.');
  const user = await prisma.user.update({
    where: { email: email! },
    data: { name },
    select: { id: true, email: true, name: true, role: true },
  });
  return NextResponse.json(user);
}

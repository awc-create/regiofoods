import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin, currentAdminEmail } from '@/lib/requireAdmin';
import { bad } from '@/lib/api';

type Ctx = { params: Promise<{ id: string }> };

export async function DELETE(_req: Request, { params }: Ctx) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { id } = await params;

  const me = await currentAdminEmail();
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) return bad('Not found', 404);
  if (user.email === me) return bad('You cannot remove your own account.');

  await prisma.user.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}

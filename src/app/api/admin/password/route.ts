import { NextResponse } from 'next/server';
import { compare, hash } from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { requireAdmin, currentAdminEmail } from '@/lib/requireAdmin';
import { bad, readJson } from '@/lib/api';

export async function POST(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const body = await readJson<{ current?: string; next?: string }>(req);
  const current = body?.current ?? '';
  const next = body?.next ?? '';
  if (next.length < 10) return bad('The new password must be at least 10 characters.');

  const email = await currentAdminEmail();
  const user = await prisma.user.findUnique({ where: { email: email! } });
  if (!user?.passwordHash || !(await compare(current, user.passwordHash))) {
    return bad('Your current password is not correct.');
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash: await hash(next, 12) },
  });
  return NextResponse.json({ ok: true });
}

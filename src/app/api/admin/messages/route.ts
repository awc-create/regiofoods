import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/requireAdmin';

export async function GET(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const unreadOnly = new URL(req.url).searchParams.get('unread') === '1';

  const [items, unread] = await Promise.all([
    prisma.contactMessage.findMany({
      where: unreadOnly ? { read: false } : undefined,
      orderBy: { createdAt: 'desc' },
      take: 200,
    }),
    prisma.contactMessage.count({ where: { read: false } }),
  ]);
  return NextResponse.json({ items, unread });
}

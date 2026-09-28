import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/requireAdmin';
import { bad, readJson, refreshSite } from '@/lib/api';

/** Body: { ids: string[] } — categories in their new order (same parent). */
export async function POST(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const body = await readJson<{ ids?: unknown }>(req);
  const ids = Array.isArray(body?.ids)
    ? body.ids.filter((x): x is string => typeof x === 'string')
    : [];
  if (!ids.length) return bad('Nothing to reorder');

  await prisma.$transaction(
    ids.map((id, i) => prisma.category.update({ where: { id }, data: { sortOrder: i } }))
  );
  refreshSite();
  return NextResponse.json({ ok: true });
}

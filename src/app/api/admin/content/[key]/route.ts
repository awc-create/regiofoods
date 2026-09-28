import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin, currentAdminEmail } from '@/lib/requireAdmin';
import { getSectionDef } from '@/content/registry';
import { cleanObject } from '@/content/fields';
import { bad, readJson, refreshSite } from '@/lib/api';

type Ctx = { params: Promise<{ key: string }> };

export async function GET(_req: Request, { params }: Ctx) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { key } = await params;
  const def = getSectionDef(key);
  if (!def) return bad('Unknown section', 404);

  const row = await prisma.contentBlock.findUnique({ where: { key } });
  const value = row ? cleanObject(def.fields, row.value, def.defaults) : def.defaults;

  return NextResponse.json({
    key,
    value,
    defaults: def.defaults,
    updatedAt: row?.updatedAt ?? null,
    updatedBy: row?.updatedBy ?? null,
  });
}

export async function PUT(req: Request, { params }: Ctx) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { key } = await params;
  const def = getSectionDef(key);
  if (!def) return bad('Unknown section', 404);

  const body = await readJson<{ value?: unknown }>(req);
  if (!body || typeof body.value !== 'object') return bad('Nothing to save');

  const value = cleanObject(def.fields, body.value, def.defaults);
  const updatedBy = await currentAdminEmail();

  const row = await prisma.contentBlock.upsert({
    where: { key },
    create: { key, value: value as object, updatedBy },
    update: { value: value as object, updatedBy },
  });

  refreshSite();
  return NextResponse.json({ key, value, updatedAt: row.updatedAt, updatedBy });
}

/** Reset a section back to the built-in wording. */
export async function DELETE(_req: Request, { params }: Ctx) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { key } = await params;
  if (!getSectionDef(key)) return bad('Unknown section', 404);

  await prisma.contentBlock.deleteMany({ where: { key } });
  refreshSite();
  return NextResponse.json({ ok: true });
}

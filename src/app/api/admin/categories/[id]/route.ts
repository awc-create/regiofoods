import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/requireAdmin';
import { bad, readJson, refreshSite, str } from '@/lib/api';

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Ctx) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { id } = await params;
  const body = await readJson(req);
  if (!body) return bad('Nothing to save');

  const data: { name?: string; visible?: boolean } = {};
  if (typeof body.name === 'string') {
    const name = str(body.name, 120);
    if (!name) return bad('The name cannot be empty.');
    data.name = name;
  }
  if (typeof body.visible === 'boolean') data.visible = body.visible;

  const category = await prisma.category.update({ where: { id }, data });
  refreshSite();
  return NextResponse.json(category);
}

/**
 * Delete a category. Products inside it are moved to `moveTo` if given,
 * otherwise they become "uncategorised" (hidden from the site until moved).
 */
export async function DELETE(req: Request, { params }: Ctx) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { id } = await params;
  const moveTo = new URL(req.url).searchParams.get('moveTo');

  const category = await prisma.category.findUnique({
    where: { id },
    include: { children: { select: { id: true } } },
  });
  if (!category) return bad('Not found', 404);

  const ids = [id, ...category.children.map((c) => c.id)];
  await prisma.$transaction([
    prisma.product.updateMany({
      where: { categoryId: { in: ids } },
      data: { categoryId: moveTo || null },
    }),
    prisma.category.delete({ where: { id } }),
  ]);

  refreshSite();
  return NextResponse.json({ ok: true });
}

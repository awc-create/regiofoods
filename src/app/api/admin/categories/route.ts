import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/requireAdmin';
import { uniqueCategorySlug } from '@/lib/slugs';
import { bad, readJson, refreshSite, str } from '@/lib/api';

/** Full category tree with product counts. */
export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;

  const parents = await prisma.category.findMany({
    where: { parentId: null },
    orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    include: {
      _count: { select: { products: true } },
      children: {
        orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
        include: { _count: { select: { products: true } } },
      },
    },
  });

  return NextResponse.json({ items: parents });
}

export async function POST(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const body = await readJson(req);
  const name = str(body?.name, 120);
  const parentId = str(body?.parentId, 60) || null;
  if (!name) return bad('Give the category a name.');

  let slugBase = name;
  if (parentId) {
    const parent = await prisma.category.findUnique({ where: { id: parentId } });
    if (!parent) return bad('Parent category not found.');
    if (parent.parentId) return bad('Sub-categories can only be one level deep.');
    slugBase = `${parent.name}-${name}`;
  }

  const last = await prisma.category.findFirst({
    where: { parentId },
    orderBy: { sortOrder: 'desc' },
    select: { sortOrder: true },
  });

  const category = await prisma.category.create({
    data: {
      name,
      parentId,
      slug: await uniqueCategorySlug(slugBase),
      sortOrder: (last?.sortOrder ?? -1) + 1,
    },
  });

  refreshSite();
  return NextResponse.json(category, { status: 201 });
}

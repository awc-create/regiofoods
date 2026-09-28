import { NextResponse } from 'next/server';
import type { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/requireAdmin';
import { uniqueProductSlug } from '@/lib/slugs';
import { parseProductInput } from '@/lib/productInput';
import { bad, readJson, refreshSite, str } from '@/lib/api';

export async function GET(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const url = new URL(req.url);
  const q = str(url.searchParams.get('q'), 100);
  const category = str(url.searchParams.get('category'), 60);
  const status = str(url.searchParams.get('status'), 20);
  const take = Math.min(200, Number(url.searchParams.get('take')) || 50);
  const page = Math.max(1, Number(url.searchParams.get('page')) || 1);

  const where: Prisma.ProductWhereInput = {};
  if (q) {
    where.OR = [
      { name: { contains: q, mode: 'insensitive' } },
      { variants: { some: { name: { contains: q, mode: 'insensitive' } } } },
    ];
  }
  if (category === 'none') {
    where.categoryId = null;
  } else if (category) {
    where.AND = [{ OR: [{ categoryId: category }, { category: { parentId: category } }] }];
  }
  if (status === 'visible') where.visible = true;
  if (status === 'hidden') where.visible = false;
  if (status === 'featured') where.featured = true;
  if (status === 'noimage') where.variants = { none: { imageUrl: { not: '' } } };

  const [items, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: [{ updatedAt: 'desc' }],
      take,
      skip: (page - 1) * take,
      include: {
        category: { include: { parent: true } },
        variants: { orderBy: { sortOrder: 'asc' } },
      },
    }),
    prisma.product.count({ where }),
  ]);

  return NextResponse.json({ items, total, page, pages: Math.max(1, Math.ceil(total / take)) });
}

export async function POST(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const input = parseProductInput(await readJson(req));
  if (typeof input === 'string') return bad(input);

  const product = await prisma.product.create({
    data: {
      name: input.name,
      slug: await uniqueProductSlug(input.slug || input.name),
      description: input.description,
      categoryId: input.categoryId,
      visible: input.visible,
      featured: input.featured,
      variants: { create: input.variants.map((v, i) => ({ ...v, sortOrder: i })) },
    },
    include: { variants: true },
  });

  refreshSite();
  return NextResponse.json(product, { status: 201 });
}

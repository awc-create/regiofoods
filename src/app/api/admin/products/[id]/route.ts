import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/requireAdmin';
import { uniqueProductSlug } from '@/lib/slugs';
import { parseProductInput } from '@/lib/productInput';
import { bad, readJson, refreshSite } from '@/lib/api';

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Ctx) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: { include: { parent: true } },
      variants: { orderBy: { sortOrder: 'asc' } },
    },
  });
  if (!product) return bad('Not found', 404);
  return NextResponse.json(product);
}

export async function PUT(req: Request, { params }: Ctx) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { id } = await params;

  const input = parseProductInput(await readJson(req));
  if (typeof input === 'string') return bad(input);

  const existing = await prisma.product.findUnique({ where: { id }, select: { slug: true } });
  if (!existing) return bad('Not found', 404);

  const slug =
    input.slug && input.slug !== existing.slug
      ? await uniqueProductSlug(input.slug, id)
      : existing.slug;

  const product = await prisma.$transaction(async (tx) => {
    await tx.productVariant.deleteMany({ where: { productId: id } });
    return tx.product.update({
      where: { id },
      data: {
        name: input.name,
        slug,
        description: input.description,
        categoryId: input.categoryId,
        visible: input.visible,
        featured: input.featured,
        variants: { create: input.variants.map((v, i) => ({ ...v, sortOrder: i })) },
      },
      include: { variants: { orderBy: { sortOrder: 'asc' } }, category: true },
    });
  });

  refreshSite();
  return NextResponse.json(product);
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { id } = await params;
  await prisma.product.delete({ where: { id } });
  refreshSite();
  return NextResponse.json({ ok: true });
}

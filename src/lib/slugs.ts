// src/lib/slugs.ts
import { prisma } from '@/lib/prisma';
import { slugify } from '@/utils/slugify';

async function unique(base: string, exists: (slug: string) => Promise<boolean>): Promise<string> {
  const root = slugify(base).slice(0, 80) || 'item';
  let slug = root;
  let n = 2;
  while (await exists(slug)) slug = `${root}-${n++}`;
  return slug;
}

export function uniqueProductSlug(name: string, exceptId?: string) {
  return unique(name, async (slug) => {
    const hit = await prisma.product.findUnique({ where: { slug }, select: { id: true } });
    return Boolean(hit && hit.id !== exceptId);
  });
}

export function uniqueCategorySlug(name: string, exceptId?: string) {
  return unique(name, async (slug) => {
    const hit = await prisma.category.findUnique({ where: { slug }, select: { id: true } });
    return Boolean(hit && hit.id !== exceptId);
  });
}

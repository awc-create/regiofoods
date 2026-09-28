import { NextResponse } from 'next/server';
import Papa from 'papaparse';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/requireAdmin';
import { uniqueCategorySlug, uniqueProductSlug } from '@/lib/slugs';
import { slugify } from '@/utils/slugify';
import { bad, refreshSite } from '@/lib/api';

type Row = Record<string, string>;
type Group = {
  key: string;
  slug: string;
  name: string;
  category: string;
  subcategory: string;
  description: string;
  visible: boolean;
  featured: boolean;
  variants: { name: string; packSize: string; imageUrl: string }[];
  firstRow: number;
};

const yes = (v: string | undefined, fallback: boolean) => {
  const s = (v ?? '').trim().toLowerCase();
  if (!s) return fallback;
  return ['yes', 'y', 'true', '1', 'visible', 'show'].includes(s);
};

/**
 * Import products from CSV (same columns as the export).
 * Rows with the same slug (or name, when slug is blank) are one product.
 * ?dryRun=1 checks the file and reports what would change without saving.
 */
export async function POST(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const dryRun = new URL(req.url).searchParams.get('dryRun') === '1';
  const form = await req.formData().catch(() => null);
  const file = form?.get('file');
  if (!(file instanceof File)) return bad('Choose a CSV file to import.');
  if (file.size > 5 * 1024 * 1024) return bad('CSV too large — the limit is 5 MB.');

  const text = (await file.text()).replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n');
  const parsed = Papa.parse<Row>(text, {
    header: true,
    skipEmptyLines: 'greedy',
    transformHeader: (h) => h.trim().toLowerCase().replace(/\s+/g, '_'),
  });

  const errors: { row: number; message: string }[] = parsed.errors
    .slice(0, 20)
    .map((e) => ({ row: (e.row ?? 0) + 2, message: e.message }));

  if (!parsed.meta.fields?.includes('name')) {
    return bad('The CSV needs at least a "name" column. Export first to get the right layout.');
  }

  // Group rows into products
  const groups = new Map<string, Group>();
  parsed.data.forEach((r, i) => {
    const rowNo = i + 2;
    const name = (r.name ?? '').trim();
    const slug = slugify((r.slug ?? '').trim() || name);
    if (!name && !r.slug) {
      errors.push({ row: rowNo, message: 'Missing product name.' });
      return;
    }
    const key = slug;
    let g = groups.get(key);
    if (!g) {
      g = {
        key,
        slug,
        name: name || slug,
        category: (r.category ?? '').trim(),
        subcategory: (r.subcategory ?? '').trim(),
        description: (r.description ?? '').trim(),
        visible: yes(r.visible, true),
        featured: yes(r.featured, false),
        variants: [],
        firstRow: rowNo,
      };
      groups.set(key, g);
    }
    const variant = {
      name: (r.variant_name ?? '').trim(),
      packSize: (r.pack_size ?? '').trim(),
      imageUrl: (r.image_url ?? '').trim(),
    };
    if (variant.name || variant.packSize || variant.imageUrl) g.variants.push(variant);
  });

  const existing = await prisma.product.findMany({
    where: { slug: { in: [...groups.keys()] } },
    select: { id: true, slug: true },
  });
  const existingBySlug = new Map(existing.map((p) => [p.slug, p.id]));

  const summary = {
    products: groups.size,
    created: 0,
    updated: 0,
    categoriesCreated: 0,
    errors,
    dryRun,
  };

  for (const g of groups.values()) {
    if (existingBySlug.has(g.slug)) summary.updated++;
    else summary.created++;
  }

  if (dryRun) return NextResponse.json({ ok: true, ...summary });

  // Resolve categories (create any that are missing)
  const catCache = new Map<string, string>();
  async function categoryId(parentName: string, childName: string): Promise<string | null> {
    if (!parentName) return null;
    const cacheKey = `${parentName.toLowerCase()}|${childName.toLowerCase()}`;
    if (catCache.has(cacheKey)) return catCache.get(cacheKey)!;

    let parent = await prisma.category.findFirst({
      where: { parentId: null, name: { equals: parentName, mode: 'insensitive' } },
    });
    if (!parent) {
      parent = await prisma.category.create({
        data: { name: parentName, slug: await uniqueCategorySlug(parentName), sortOrder: 999 },
      });
      summary.categoriesCreated++;
    }
    let id = parent.id;
    if (childName) {
      let child = await prisma.category.findFirst({
        where: { parentId: parent.id, name: { equals: childName, mode: 'insensitive' } },
      });
      if (!child) {
        child = await prisma.category.create({
          data: {
            name: childName,
            parentId: parent.id,
            slug: await uniqueCategorySlug(`${parentName}-${childName}`),
            sortOrder: 999,
          },
        });
        summary.categoriesCreated++;
      }
      id = child.id;
    }
    catCache.set(cacheKey, id);
    return id;
  }

  for (const g of groups.values()) {
    try {
      const catId = await categoryId(g.category, g.subcategory);
      const data = {
        name: g.name,
        description: g.description,
        categoryId: catId,
        visible: g.visible,
        featured: g.featured,
      };
      const variants = g.variants.map((v, i) => ({ ...v, sortOrder: i }));
      const id = existingBySlug.get(g.slug);

      if (id) {
        await prisma.$transaction([
          prisma.productVariant.deleteMany({ where: { productId: id } }),
          prisma.product.update({
            where: { id },
            data: { ...data, variants: { create: variants } },
          }),
        ]);
      } else {
        await prisma.product.create({
          data: { ...data, slug: await uniqueProductSlug(g.slug), variants: { create: variants } },
        });
      }
    } catch (err) {
      errors.push({ row: g.firstRow, message: (err as Error).message.slice(0, 200) });
    }
  }

  refreshSite();
  return NextResponse.json({ ok: true, ...summary });
}

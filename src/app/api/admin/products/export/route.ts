import Papa from 'papaparse';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/requireAdmin';

const CSV_COLUMNS = [
  'slug',
  'name',
  'category',
  'subcategory',
  'description',
  'visible',
  'featured',
  'variant_name',
  'pack_size',
  'image_url',
] as const;

/** One row per variant. Products with no variants get one row with empty variant columns. */
export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;

  const products = await prisma.product.findMany({
    orderBy: [{ name: 'asc' }],
    include: {
      category: { include: { parent: true } },
      variants: { orderBy: { sortOrder: 'asc' } },
    },
  });

  const rows: Record<string, string>[] = [];
  for (const p of products) {
    const parent = p.category?.parent?.name ?? p.category?.name ?? '';
    const child = p.category?.parent ? p.category.name : '';
    const base = {
      slug: p.slug,
      name: p.name,
      category: parent,
      subcategory: child,
      description: p.description,
      visible: p.visible ? 'yes' : 'no',
      featured: p.featured ? 'yes' : 'no',
    };
    const variants = p.variants.length ? p.variants : [null];
    for (const v of variants) {
      rows.push({
        ...base,
        variant_name: v?.name ?? '',
        pack_size: v?.packSize ?? '',
        image_url: v?.imageUrl ?? '',
      });
    }
  }

  const csv = Papa.unparse({ fields: [...CSV_COLUMNS], data: rows });
  const date = new Date().toISOString().slice(0, 10);

  return new Response('\uFEFF' + csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="regiofoods-products-${date}.csv"`,
    },
  });
}

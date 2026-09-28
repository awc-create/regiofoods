// src/lib/catalogue.ts
// Public product reads. Returns the same shape the catalogue components already use.
import { cache } from 'react';
import { prisma } from '@/lib/prisma';
import productsJson from '@/data/products.json';
import { slugify } from '@/utils/slugify';

export type CatalogueVariant = {
  name: string;
  packSize: string;
  category: string;
  image: string;
};

export type CatalogueProduct = {
  slug: string;
  baseName: string;
  description: string;
  parentCollection: string;
  collections: string[];
  variants: CatalogueVariant[];
};

export type Catalogue = {
  products: CatalogueProduct[];
  /** Parent tabs → visible sub-categories, in admin sort order. */
  tabs: { name: string; children: string[] }[];
};

type JsonProduct = Omit<CatalogueProduct, 'slug'>;

function fromJson(): Catalogue {
  const products = (productsJson as JsonProduct[]).map((p) => ({
    ...p,
    slug: slugify(p.baseName),
  }));
  const map = new Map<string, Set<string>>();
  for (const p of products) {
    const set = map.get(p.parentCollection) ?? new Set<string>();
    p.variants.forEach((v) => v.category && set.add(v.category));
    map.set(p.parentCollection, set);
  }
  return {
    products,
    tabs: [...map.entries()].map(([name, set]) => ({ name, children: [...set].sort() })),
  };
}

export const getCatalogue = cache(async (): Promise<Catalogue> => {
  try {
    const [categories, products] = await Promise.all([
      prisma.category.findMany({
        where: { parentId: null, visible: true },
        orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
        include: {
          children: { where: { visible: true }, orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }] },
        },
      }),
      prisma.product.findMany({
        where: { visible: true },
        orderBy: [{ featured: 'desc' }, { sortOrder: 'asc' }, { name: 'asc' }],
        include: {
          variants: { orderBy: { sortOrder: 'asc' } },
          category: { include: { parent: true } },
        },
      }),
    ]);

    if (products.length === 0 && categories.length === 0) return fromJson();

    const visibleParents = new Set(categories.map((c) => c.id));
    const visibleChildren = new Set(categories.flatMap((c) => c.children.map((ch) => ch.id)));

    const out: CatalogueProduct[] = [];
    for (const p of products) {
      const cat = p.category;
      if (!cat) continue;
      // A product is shown only when its category (and parent) are visible.
      const parent = cat.parent ?? cat;
      if (!visibleParents.has(parent.id)) continue;
      if (cat.parent && !visibleChildren.has(cat.id)) continue;

      const childName = cat.parent ? cat.name : '';
      out.push({
        slug: p.slug,
        baseName: p.name,
        description: p.description,
        parentCollection: parent.name,
        collections: [parent.name, ...(childName ? [childName] : [])],
        variants: (p.variants.length
          ? p.variants
          : [{ name: p.name, packSize: '', imageUrl: '' }]
        ).map((v) => ({
          name: v.name || p.name,
          packSize: v.packSize,
          category: childName || parent.name,
          image: v.imageUrl,
        })),
      });
    }

    return {
      products: out,
      tabs: categories.map((c) => ({ name: c.name, children: c.children.map((ch) => ch.name) })),
    };
  } catch (err) {
    console.error('[catalogue] database unavailable, using products.json:', (err as Error).message);
    return fromJson();
  }
});

export async function getProductBySlug(slug: string): Promise<CatalogueProduct | undefined> {
  const { products } = await getCatalogue();
  const target = slug.toLowerCase();
  return products.find((p) => p.slug === target);
}

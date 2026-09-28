// src/lib/productInput.ts — validates product data coming from the admin
import { str } from '@/lib/api';

export type VariantInput = { name: string; packSize: string; imageUrl: string };

export type ProductInput = {
  name: string;
  slug?: string;
  description: string;
  categoryId: string | null;
  visible: boolean;
  featured: boolean;
  variants: VariantInput[];
};

export function parseProductInput(body: Record<string, unknown> | null): ProductInput | string {
  if (!body) return 'Nothing to save';
  const name = str(body.name, 200);
  if (!name) return 'Give the product a name.';

  const rawVariants = Array.isArray(body.variants) ? body.variants.slice(0, 50) : [];
  const variants = rawVariants
    .map((v) => {
      const o = (v ?? {}) as Record<string, unknown>;
      return {
        name: str(o.name, 200),
        packSize: str(o.packSize, 100),
        imageUrl: str(o.imageUrl, 1000),
      };
    })
    .filter((v) => v.name || v.packSize || v.imageUrl);

  return {
    name,
    slug: str(body.slug, 100) || undefined,
    description: str(body.description, 5000),
    categoryId: str(body.categoryId, 60) || null,
    visible: body.visible !== false,
    featured: body.featured === true,
    variants,
  };
}

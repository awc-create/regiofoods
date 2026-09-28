export type AdminCategory = {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  sortOrder: number;
  visible: boolean;
  _count: { products: number };
  children?: AdminCategory[];
};

export type AdminVariant = { id?: string; name: string; packSize: string; imageUrl: string };

export type AdminProduct = {
  id: string;
  slug: string;
  name: string;
  description: string;
  categoryId: string | null;
  visible: boolean;
  featured: boolean;
  updatedAt: string;
  category: (AdminCategory & { parent: AdminCategory | null }) | null;
  variants: AdminVariant[];
};

export async function fetchCategories(): Promise<AdminCategory[]> {
  const res = await fetch('/api/admin/categories', { cache: 'no-store' });
  const json = await res.json().catch(() => ({ items: [] }));
  return json.items ?? [];
}

/** Flat list for <select>: parents and "Parent › Child" entries. */
export function categoryOptions(tree: AdminCategory[]) {
  const out: { id: string; label: string; isParent: boolean }[] = [];
  for (const p of tree) {
    out.push({ id: p.id, label: p.name, isParent: true });
    for (const c of p.children ?? [])
      out.push({ id: c.id, label: `${p.name} › ${c.name}`, isParent: false });
  }
  return out;
}

// src/lib/brands.ts
import { getContent } from '@/lib/content';
import { brandsList } from '@/content/sections/brands';

export async function getBrands() {
  const { items } = await getContent(brandsList);
  const clean = items.filter((b) => b.name);
  return {
    strip: clean
      .filter((b) => b.inStrip && b.logo)
      .map((b) => ({ name: b.name, logo: b.logo, website: b.website, scale: b.scale })),
    grid: clean
      .filter((b) => b.inGrid)
      .map((b) => ({
        name: b.name,
        logo: b.logo,
        website: b.website,
        scale: b.scale,
        note: b.note,
        scope: b.scope,
      })),
  };
}

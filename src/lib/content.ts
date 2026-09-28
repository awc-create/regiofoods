// src/lib/content.ts
// Server-side reads of editable content. Falls back to the built-in defaults
// when a section has never been saved or the database is unreachable.
import { cache } from 'react';
import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { cleanObject, type SectionDef } from '@/content/fields';
import { getSectionDef, type SeoPage } from '@/content/registry';

const loadBlocks = cache(async (): Promise<Map<string, unknown>> => {
  try {
    const rows = await prisma.contentBlock.findMany();
    return new Map(rows.map((r) => [r.key, r.value]));
  } catch (err) {
    console.error('[content] database unavailable, using defaults:', (err as Error).message);
    return new Map();
  }
});

export async function getContent<T extends Record<string, unknown>>(
  def: SectionDef<T>
): Promise<T> {
  const blocks = await loadBlocks();
  const stored = blocks.get(def.key);
  if (stored === undefined) return def.defaults;
  return cleanObject(def.fields, stored, def.defaults) as T;
}

/** Page <title>, description and share image from the page's SEO section. */
export async function seoMetadata(page: SeoPage, canonicalPath?: string): Promise<Metadata> {
  const def = getSectionDef(`seo.${page}`);
  if (!def) return {};
  const seo = (await getContent(def)) as { title: string; description: string; image: string };
  const images = seo.image ? [{ url: seo.image, width: 1200, height: 630 }] : undefined;

  return {
    title: seo.title,
    description: seo.description,
    alternates: canonicalPath ? { canonical: canonicalPath } : undefined,
    openGraph: {
      title: seo.title,
      description: seo.description,
      siteName: 'Regio Foods',
      type: 'website',
      locale: 'en_GB',
      images,
    },
    twitter: {
      card: seo.image ? 'summary_large_image' : 'summary',
      title: seo.title,
      description: seo.description,
      images: seo.image ? [seo.image] : undefined,
    },
  };
}

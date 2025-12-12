// src/app/products/[slug]/page.tsx
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import productsData from '@/data/products.json';
import ProductClient from './ProductClient';
import type { Product } from '@/components/products/detail/ProductDetail';
import { slugify } from '@/utils/slugify';

const PRODUCTS = productsData as Product[];

type PageParams = { slug: string };

// For the PAGE component – params is a Promise in Next 16
type PageProps = {
  params: Promise<PageParams>;
};

// For generateMetadata – also receives params as a Promise
type MetadataProps = {
  params: Promise<PageParams>;
};

function findProductBySlug(slug?: string): Product | undefined {
  if (!slug) return undefined;

  const target = slug.toLowerCase();

  return PRODUCTS.find((p) => {
    // Primary: slug from baseName (same as catalogue)
    const baseSlug = slugify(p.baseName);
    if (baseSlug === target) return true;

    // Fallback: slug from first variant name if needed
    const firstVariantName = p.variants[0]?.name;
    if (firstVariantName) {
      const variantSlug = slugify(firstVariantName);
      if (variantSlug === target) return true;
    }

    return false;
  });
}

export async function generateMetadata({ params }: MetadataProps): Promise<Metadata> {
  const { slug } = await params;

  const product = findProductBySlug(slug);

  if (!product) {
    return {
      title: 'Product not found | Regio Foods',
      description: 'The product you are looking for could not be found.',
    };
  }

  return {
    title: `${product.baseName} | Regio Foods`,
    description:
      product.description ||
      `Frozen product from the ${product.parentCollection || 'Regio Foods'} range.`,
  };
}

/**
 * Required for `output: 'export'` so Next can statically generate all product pages.
 */
export function generateStaticParams(): PageParams[] {
  return PRODUCTS.map((product) => ({
    slug: slugify(product.baseName),
  }));
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;

  const product = findProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return <ProductClient product={product} />;
}

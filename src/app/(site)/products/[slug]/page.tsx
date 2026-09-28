// src/app/products/[slug]/page.tsx
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProductClient from './ProductClient';
import { getProductBySlug } from '@/lib/catalogue';
import { getContent } from '@/lib/content';
import { productsDetail } from '@/content/sections/pages';

export const dynamic = 'force-dynamic';

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: 'Product not found | Regio Foods',
      description: 'The product you are looking for could not be found.',
    };
  }

  const image = product.variants.find((v) => v.image)?.image;
  const description =
    product.description || `${product.baseName} from the ${product.parentCollection} range.`;

  return {
    title: `${product.baseName} | Regio Foods`,
    description,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      title: product.baseName,
      description,
      images: image ? [{ url: image }] : undefined,
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const [product, labels] = await Promise.all([getProductBySlug(slug), getContent(productsDetail)]);

  if (!product) notFound();

  return <ProductClient product={product} labels={labels} />;
}

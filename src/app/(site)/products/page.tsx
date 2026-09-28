import ProductClient from './ProductClient';
import { getContent, seoMetadata } from '@/lib/content';
import { getCatalogue } from '@/lib/catalogue';
import { productsHero, productsCatalogue } from '@/content/sections/pages';

export const dynamic = 'force-dynamic';

export function generateMetadata() {
  return seoMetadata('products', '/products');
}

export default async function ProductsPage() {
  const [hero, heading, catalogue] = await Promise.all([
    getContent(productsHero),
    getContent(productsCatalogue),
    getCatalogue(),
  ]);

  return <ProductClient hero={hero} heading={heading} catalogue={catalogue} />;
}

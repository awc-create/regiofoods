import BrandClient from './BrandClient';
import { getContent, seoMetadata } from '@/lib/content';
import { getBrands } from '@/lib/brands';
import {
  brandsHero,
  brandsFamily,
  brandsGrid,
  brandsPrivateLabel,
  brandsCta,
} from '@/content/sections/brands';

export const dynamic = 'force-dynamic';

export function generateMetadata() {
  return seoMetadata('brands', '/brands');
}

export default async function BrandsPage() {
  const [hero, family, grid, privateLabel, cta, brandList] = await Promise.all([
    getContent(brandsHero),
    getContent(brandsFamily),
    getContent(brandsGrid),
    getContent(brandsPrivateLabel),
    getContent(brandsCta),
    getBrands(),
  ]);

  return (
    <BrandClient content={{ hero, family, grid, privateLabel, cta }} brands={brandList.grid} />
  );
}

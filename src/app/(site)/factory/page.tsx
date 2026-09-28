// src/app/factory/page.tsx
import FactoryClient from './FactoryClient';
import { getContent, seoMetadata } from '@/lib/content';
import { getBrands } from '@/lib/brands';
import {
  factoryHero,
  factoryRegulations,
  factoryBrands,
  factoryProcess,
  factoryMap,
  factoryGallery,
} from '@/content/sections/factory';

export const dynamic = 'force-dynamic';

export function generateMetadata() {
  return seoMetadata('factory', '/factory');
}

export default async function FactoryPage() {
  const [hero, regulations, brands, process, map, gallery, brandList] = await Promise.all([
    getContent(factoryHero),
    getContent(factoryRegulations),
    getContent(factoryBrands),
    getContent(factoryProcess),
    getContent(factoryMap),
    getContent(factoryGallery),
    getBrands(),
  ]);

  return (
    <FactoryClient
      content={{ hero, regulations, brands, process, map, gallery }}
      brands={brandList.strip}
    />
  );
}

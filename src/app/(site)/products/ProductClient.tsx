// src/app/products/ProductClient.tsx
import ProductsHero from '@/components/products/hero/ProductsHero';
import ProductCatalogue from '@/components/products/catalogue/ProductCatalogue';
import type { productsHero, productsCatalogue } from '@/content/sections/pages';
import type { Catalogue } from '@/lib/catalogue';

import styles from './Products.module.scss';

type Props = {
  hero: typeof productsHero.defaults;
  heading: typeof productsCatalogue.defaults;
  catalogue: Catalogue;
};

export default function ProductClient({ hero, heading, catalogue }: Props) {
  return (
    <div className={styles.page}>
      <ProductsHero content={hero} />
      <ProductCatalogue heading={heading} products={catalogue.products} tabs={catalogue.tabs} />
    </div>
  );
}

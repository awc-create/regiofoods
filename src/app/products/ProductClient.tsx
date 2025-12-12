// src/app/products/ProductClient.tsx
'use client';

import ProductsHero from '@/components/products/hero/ProductsHero';
import ProductCatalogue from '@/components/products/catalogue/ProductCatalogue';

import styles from './Products.module.scss';

// 👇 THIS MUST BE A DEFAULT EXPORT FUNCTION
export default function ProductClient() {
  return (
    <div className={styles.page}>
      <ProductsHero />
      <ProductCatalogue />
    </div>
  );
}

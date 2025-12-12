// src/app/products/[slug]/ProductClient.tsx
'use client';

import ProductDetail from '@/components/products/detail/ProductDetail';
import styles from './ProductDetailPage.module.scss';

export type ProductVariant = {
  name: string;
  packSize: string;
  category: string;
  image: string;
};

export type Product = {
  baseName: string;
  description: string;
  parentCollection: string;
  collections: string[];
  variants: ProductVariant[];
};

type Props = {
  product: Product;
};

export default function ProductClient({ product }: Props) {
  return (
    <div className={styles.page}>
      <ProductDetail product={product} />
    </div>
  );
}

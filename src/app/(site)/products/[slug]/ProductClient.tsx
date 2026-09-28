// src/app/products/[slug]/ProductClient.tsx
import ProductDetail from '@/components/products/detail/ProductDetail';
import type { CatalogueProduct } from '@/lib/catalogue';
import type { productsDetail } from '@/content/sections/pages';
import styles from './ProductDetailPage.module.scss';

type Props = {
  product: CatalogueProduct;
  labels: typeof productsDetail.defaults;
};

export default function ProductClient({ product, labels }: Props) {
  return (
    <div className={styles.page}>
      <ProductDetail product={product} labels={labels} />
    </div>
  );
}

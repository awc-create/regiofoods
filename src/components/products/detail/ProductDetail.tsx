// src/components/products/detail/ProductDetail.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import styles from './ProductDetail.module.scss';

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

export default function ProductDetail({ product }: Props) {
  const mainImage = product.variants[0]?.image || '/placeholder.jpg';

  // Pack sizes as clean string[]
  const packSizes: string[] = product.variants
    .map((v: ProductVariant) => v.packSize)
    .filter((size) => Boolean(size));

  // Unique child categories as string[]
  const childCategories: string[] = Array.from(
    new Set<string>(
      product.variants
        .map((v: ProductVariant) => v.category)
        .filter((cat) => Boolean(cat)) as string[]
    )
  );

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        {/* Breadcrumb */}
        <div className={styles.breadcrumb}>
          <Link href="/products">Catalogue</Link>
          <span aria-hidden="true">/</span>
          <span>{product.baseName}</span>
        </div>

        <div className={styles.layout}>
          {/* Text column */}
          <div className={styles.copy}>
            <p className={styles.eyebrow}>Frozen product</p>

            <h1 className={styles.title}>{product.baseName}</h1>

            {product.parentCollection && (
              <p className={styles.parentBadge}>{product.parentCollection}</p>
            )}

            {childCategories.length > 0 && (
              <div className={styles.tagRow}>
                {childCategories.map((cat: string) => (
                  <span key={cat} className={styles.tag}>
                    {cat}
                  </span>
                ))}
              </div>
            )}

            <p className={styles.lead}>
              {product.description ||
                'Frozen product in the Regio Foods range. Specifications, artwork and pack formats can be tuned for your market.'}
            </p>

            <dl className={styles.facts}>
              {packSizes.length > 0 && (
                <div>
                  <dt>Pack sizes</dt>
                  <dd>{packSizes.join(' • ')}</dd>
                </div>
              )}

              {product.collections.length > 0 && (
                <div>
                  <dt>Collections</dt>
                  <dd>{product.collections.join(' • ')}</dd>
                </div>
              )}
            </dl>

            <div className={styles.ctaRow}>
              <button type="button" className={styles.primaryCta}>
                Request spec sheet
              </button>
              <Link href="/contact" className={styles.secondaryCta}>
                Talk about this product →
              </Link>
            </div>
          </div>

          {/* Image column */}
          <div className={styles.media}>
            <div className={styles.imageWrap}>
              <Image
                src={mainImage}
                alt={product.baseName}
                fill
                sizes="(min-width: 960px) 420px, 100vw"
                className={styles.heroImage}
              />
            </div>

            <p className={styles.imageNote}>
              Pack shot for illustration. Final artwork and declarations can be adapted per market.
            </p>
          </div>
        </div>

        {/* Variants table */}
        {product.variants.length > 0 && (
          <section className={styles.variants} aria-label="Product variants">
            <h2 className={styles.variantsHeading}>Available variants &amp; formats</h2>

            <div className={styles.table}>
              <div className={`${styles.row} ${styles.headerRow}`}>
                <div>Name</div>
                <div>Pack size</div>
                <div>Category</div>
              </div>

              {product.variants.map((v: ProductVariant, index: number) => (
                <div
                  key={`${v.name || product.baseName}-${v.packSize}-${index}`}
                  className={styles.row}
                >
                  <div>{v.name || product.baseName}</div>
                  <div>{v.packSize}</div>
                  <div>{v.category || '—'}</div>
                </div>
              ))}
            </div>

            <p className={styles.variantsNote}>
              Exact pack sizes, case counts and barcodes can be confirmed during development or
              listing.
            </p>
          </section>
        )}
      </div>
    </section>
  );
}

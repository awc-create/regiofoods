'use client';

import Image from 'next/image';
import styles from './ProductsShowcase.module.scss';

export type ProductItem = {
  name: string;
  imageSrc?: string; // optional; we show a placeholder if missing
  imageAlt?: string;
  summary: string; // 1–2 lines
  bullets?: string[]; // short feature/spec points
  slug?: string; // optional link for “Learn more”
  badge?: string; // e.g., “Frozen”, “Cooked”
};

interface Props {
  heading?: string;
  subheading?: string;
  items: ProductItem[];
  cta?: { label: string; href: string }; // “View all products”
  className?: string;
}

export default function ProductsShowcase({
  heading = 'Products We Make',
  subheading = 'Consistent, export-ready products—benchmarked for hygiene, taste, and shelf-life.',
  items,
  cta,
  className,
}: Props) {
  return (
    <section className={`${styles.section} ${className ?? ''}`}>
      <div className={styles.header}>
        <h2 className={styles.heading}>{heading}</h2>
        {subheading ? <p className={styles.subheading}>{subheading}</p> : null}
      </div>

      <div className={styles.grid}>
        {items.map((p) => (
          <article key={p.name} className={styles.card}>
            <div className={styles.figure} aria-hidden="true">
              {p.imageSrc ? (
                <>
                  <Image
                    src={p.imageSrc}
                    alt={p.imageAlt ?? p.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    priority={false}
                  />
                  <div className={styles.figOverlay} />
                </>
              ) : (
                <div className={styles.placeholder}>
                  <span className={styles.phEmoji} aria-hidden="true">
                    🥘
                  </span>
                </div>
              )}
              {p.badge ? <span className={styles.badge}>{p.badge}</span> : null}
            </div>

            <div className={styles.body}>
              <h3 className={styles.title}>{p.name}</h3>
              <p className={styles.summary}>{p.summary}</p>

              {p.bullets?.length ? (
                <ul className={styles.bullets}>
                  {p.bullets.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              ) : null}

              {p.slug ? (
                <a className={styles.more} href={`/products/${p.slug}`}>
                  Learn more →
                </a>
              ) : null}
            </div>
          </article>
        ))}
      </div>

      {cta ? (
        <div className={styles.ctaRow}>
          <a href={cta.href} className={styles.ctaButton}>
            {cta.label}
          </a>
        </div>
      ) : null}
    </section>
  );
}

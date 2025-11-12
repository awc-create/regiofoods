'use client';

import { Icon } from '@iconify/react';
import styles from './MarketsServed.module.scss';

type MarketItem = {
  icon: string; // iconify name e.g. "mdi:storefront-outline"
  title: string; // e.g. "Retail"
  blurb: string; // one-liner
};

interface Props {
  heading?: string;
  subheading?: string;
  markets: MarketItem[]; // 4–6 cards recommended
  regions?: string[]; // optional simple list: ["UK & EU", "Middle East", ...]
  cta?: { label: string; href: string };
  className?: string;
}

export default function MarketsServed({
  heading = 'Markets We Serve',
  subheading = 'From retail packs to HORECA and export distributors, our products are designed for consistency and shelf-life across diverse channels.',
  markets,
  regions,
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
        {markets.map((m) => (
          <article key={m.title} className={styles.card}>
            <div className={styles.iconWrap} aria-hidden="true">
              <Icon icon={m.icon} />
            </div>
            <h3 className={styles.cardTitle}>{m.title}</h3>
            <p className={styles.cardDesc}>{m.blurb}</p>
          </article>
        ))}
      </div>

      {regions?.length ? (
        <div className={styles.regions}>
          <h4>Regional Coverage</h4>
          <ul>
            {regions.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </div>
      ) : null}

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

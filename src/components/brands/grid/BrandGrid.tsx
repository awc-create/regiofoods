'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import Lines from '@/components/common/Lines';
import type { brandsGrid } from '@/content/sections/brands';
import styles from './BrandGrid.module.scss';

export type GridBrand = {
  name: string;
  note: string;
  scope: string;
  website?: string;
  logo?: string;
  scale?: number; // optical correction per brand
};

type Props = {
  heading: typeof brandsGrid.defaults;
  brands: GridBrand[];
};

export default function BrandGrid({ heading: c, brands }: Props) {
  const reduceMotion = useReducedMotion();

  return (
    <section className={styles.section} aria-labelledby="brands-grid-heading">
      <div className={styles.inner}>
        <div className={styles.header}>
          {c.eyebrow && <p className={styles.eyebrow}>{c.eyebrow}</p>}
          <h2 id="brands-grid-heading" className={styles.heading}>
            <Lines text={c.heading} />
          </h2>
          {c.intro && <p className={styles.subheading}>{c.intro}</p>}
        </div>

        <div className={styles.grid}>
          {brands.map((b, i) => {
            const s = b.scale ?? 1;

            return (
              <motion.article
                key={`${b.name}-${i}`}
                className={styles.card}
                initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={
                  reduceMotion ? undefined : { duration: 0.55, delay: i * 0.06, ease: 'easeOut' }
                }
                whileHover={reduceMotion ? undefined : { y: -4 }}
              >
                {/* Visual / Logo zone */}
                <div className={styles.visual}>
                  {b.logo ? (
                    <span className={styles.mark} style={{ ['--s' as never]: s }}>
                      <Image
                        src={b.logo}
                        alt={`${b.name} logo`}
                        width={720}
                        height={360}
                        className={styles.logo}
                        sizes="(max-width: 640px) 90vw, (max-width: 1024px) 44vw, 360px"
                      />
                    </span>
                  ) : (
                    <div className={styles.logoFallback}>{b.name}</div>
                  )}
                </div>

                {/* Content */}
                <div className={styles.body}>
                  <div className={styles.topRow}>
                    <span className={styles.badge}>Group range</span>
                    {b.website ? (
                      <a
                        href={b.website}
                        target="_blank"
                        rel="noreferrer"
                        className={styles.siteLink}
                        aria-label={`Visit ${b.name} website`}
                      >
                        Visit website →
                      </a>
                    ) : (
                      <span className={styles.noSite}>No public site</span>
                    )}
                  </div>

                  <h3 className={styles.title}>{b.name}</h3>
                  <p className={styles.note}>{b.note}</p>

                  <p className={styles.scope}>{b.scope}</p>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import styles from './BrandGrid.module.scss';

type Brand = {
  name: string;
  note: string;
  scope: string;
  website?: string;
  logoSrc?: string;
  scale?: number; // ✅ optical correction per brand
};

const BRANDS: Brand[] = [
  {
    name: 'Royal Choice',
    note: 'A dependable range designed for everyday distribution needs.',
    scope: 'Frozen staples • export-ready formats',
    logoSrc: '/assets/brands/royal-choice-logo.png',
    scale: 1.15,
  },
  {
    name: 'Seelans',
    note: 'Traditional favourites built around familiar South Asian taste profiles.',
    scope: 'Select ranges • regional suitability',
    website: 'https://seelans.com/',
    logoSrc: '/assets/brands/seelans-logo_1.png',
    scale: 1,
  },
  {
    name: 'Keralites',
    note: 'Kerala-inspired products focusing on authentic formats and textures.',
    scope: 'Flatbreads • snacks • ready-to-cook',
    // use your real filename:
    logoSrc: '/assets/brands/Keralites-logo.png',
    scale: 3,
  },
];

export default function BrandGrid() {
  const reduceMotion = useReducedMotion();

  return (
    <section className={styles.section} aria-labelledby="brands-grid-heading">
      <div className={styles.inner}>
        <div className={styles.header}>
          <p className={styles.eyebrow}>Our named ranges</p>
          <h2 id="brands-grid-heading" className={styles.heading}>
            Brands we work with.
          </h2>
          <p className={styles.subheading}>
            These are the ranges we can publicly reference. Availability varies by market and buyer
            programme.
          </p>
        </div>

        <div className={styles.grid}>
          {BRANDS.map((b, i) => {
            const s = b.scale ?? 1;

            return (
              <motion.article
                key={b.name}
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
                  {b.logoSrc ? (
                    <span className={styles.mark} style={{ ['--s' as never]: s }}>
                      <Image
                        src={b.logoSrc}
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

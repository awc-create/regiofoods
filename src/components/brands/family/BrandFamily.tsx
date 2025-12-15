'use client';

import Image from 'next/image';
import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import styles from './BrandFamily.module.scss';

export default function BrandFamily() {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { amount: 0.35, once: true });

  return (
    <section className={styles.section} aria-labelledby="brand-family-heading">
      <div className={styles.inner} ref={ref}>
        <div className={styles.header}>
          <motion.p
            className={styles.eyebrow}
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.45, ease: 'easeOut' }}
          >
            How it’s structured
          </motion.p>

          <motion.h2
            id="brand-family-heading"
            className={styles.heading}
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.55, ease: 'easeOut', delay: 0.04 }}
          >
            Prince Foods is the parent company.
            <br />
            Regio Foods is its manufacturing arm.
          </motion.h2>

          <motion.p
            className={styles.subheading}
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.55, ease: 'easeOut', delay: 0.08 }}
          >
            This is one group — not a partnership. Prince Foods leads market presence and buyer
            relationships. Regio Foods delivers export-ready manufacturing, QA discipline and
            consistent production at scale.
          </motion.p>
        </div>

        <div className={styles.grid}>
          {/* Parent */}
          <motion.article
            className={styles.card}
            initial={{ opacity: 0, y: 18, scale: 0.985 }}
            animate={inView ? { opacity: 1, y: 0, scale: 1 } : undefined}
            transition={{ duration: 0.65, ease: 'easeOut', delay: 0.14 }}
            whileHover={{ y: -3 }}
          >
            <div className={styles.cardTop}>
              <span className={styles.badge}>Parent brand</span>

              <div className={styles.logoBox} aria-hidden="true">
                <Image
                  src="/assets/brands/prince-foods-logo.png"
                  alt="Prince Foods"
                  width={210}
                  height={70}
                  sizes="210px"
                />
              </div>
            </div>

            <h3 className={styles.cardTitle}>Prince Foods</h3>

            <p className={styles.cardText}>
              The parent brand that anchors market presence, buyer relationships, and export-facing
              standards — feeding real requirements back into production planning.
            </p>

            <ul className={styles.list}>
              <li>Wholesale & export supply experience</li>
              <li>Market feedback loop for product development</li>
              <li>Compliance-first operating culture</li>
            </ul>
          </motion.article>

          {/* Manufacturing */}
          <motion.article
            className={styles.card}
            initial={{ opacity: 0, y: 18, scale: 0.985 }}
            animate={inView ? { opacity: 1, y: 0, scale: 1 } : undefined}
            transition={{ duration: 0.65, ease: 'easeOut', delay: 0.22 }}
            whileHover={{ y: -3 }}
          >
            <div className={styles.cardTop}>
              <span className={styles.badgeAlt}>Manufacturing brand</span>

              <div className={styles.logoBox} aria-hidden="true">
                <Image
                  src="/assets/regiofoods-logo.svg"
                  alt="Regio Foods"
                  width={240}
                  height={90}
                  sizes="240px"
                  className={styles.regioLogo}
                />
              </div>
            </div>

            <h3 className={styles.cardTitle}>Regio Foods</h3>

            <p className={styles.cardText}>
              The manufacturing arm — built to produce frozen ranges at scale with traceability,
              process control, and pack formats suited to distributors and retailers.
            </p>

            <ul className={styles.list}>
              <li>Manufacturing + QA discipline</li>
              <li>Export-ready pack formats</li>
              <li>Customisable specs per market</li>
            </ul>
          </motion.article>
        </div>
      </div>
    </section>
  );
}

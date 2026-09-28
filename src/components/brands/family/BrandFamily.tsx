'use client';

import Image from 'next/image';
import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import Lines from '@/components/common/Lines';
import type { brandsFamily } from '@/content/sections/brands';
import styles from './BrandFamily.module.scss';

type Props = { content: typeof brandsFamily.defaults };

export default function BrandFamily({ content: c }: Props) {
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
            {c.eyebrow}
          </motion.p>

          <motion.h2
            id="brand-family-heading"
            className={styles.heading}
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.55, ease: 'easeOut', delay: 0.04 }}
          >
            <Lines text={c.heading} />
          </motion.h2>

          <motion.p
            className={styles.subheading}
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.55, ease: 'easeOut', delay: 0.08 }}
          >
            {c.intro}
          </motion.p>
        </div>

        <div className={styles.grid}>
          {c.cards.map((card, i) => (
            <motion.article
              key={`${card.title}-${i}`}
              className={styles.card}
              initial={{ opacity: 0, y: 18, scale: 0.985 }}
              animate={inView ? { opacity: 1, y: 0, scale: 1 } : undefined}
              transition={{ duration: 0.65, ease: 'easeOut', delay: 0.14 + i * 0.08 }}
              whileHover={{ y: -3 }}
            >
              <div className={styles.cardTop}>
                {card.badge && (
                  <span className={i % 2 === 0 ? styles.badge : styles.badgeAlt}>{card.badge}</span>
                )}

                {card.logo && (
                  <div className={styles.logoBox} aria-hidden="true">
                    <Image
                      src={card.logo}
                      alt={card.title}
                      width={240}
                      height={90}
                      sizes="240px"
                      className={card.logo.endsWith('.svg') ? styles.regioLogo : undefined}
                    />
                  </div>
                )}
              </div>

              <h3 className={styles.cardTitle}>{card.title}</h3>

              {card.text && <p className={styles.cardText}>{card.text}</p>}

              {card.bullets.length > 0 && (
                <ul className={styles.list}>
                  {card.bullets.map((b, j) => (
                    <li key={j}>{b}</li>
                  ))}
                </ul>
              )}
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

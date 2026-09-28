'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Lines from '@/components/common/Lines';
import type { aboutPillars } from '@/content/sections/about';
import styles from './Pillars.module.scss';

type Props = { content: typeof aboutPillars.defaults };

export default function Pillars({ content: c }: Props) {
  const PILLARS = c.items;
  const [activeIndex, setActiveIndex] = useState(0);
  const active = PILLARS[Math.min(activeIndex, PILLARS.length - 1)];

  return (
    <section id="pillars" className={styles.section} aria-labelledby="pillars-heading">
      <div className={styles.inner}>
        {/* Header */}
        <div className={styles.header}>
          {c.eyebrow && <p className={styles.eyebrow}>{c.eyebrow}</p>}
          <h2 id="pillars-heading" className={styles.heading}>
            <Lines text={c.heading} />
          </h2>
          {c.intro && <p className={styles.subheading}>{c.intro}</p>}
        </div>

        {/* Content */}
        <div className={styles.content}>
          {/* Left – regulation spine */}
          <div className={styles.navCol}>
            <div className={styles.spine} aria-hidden="true" />

            <ul className={styles.navList}>
              {PILLARS.map((pillar, index) => {
                const isActive = index === activeIndex;
                return (
                  <li key={`${pillar.label}-${index}`} className={styles.navItem}>
                    <button
                      type="button"
                      className={`${styles.navButton} ${isActive ? styles.navButtonActive : ''}`}
                      onClick={() => setActiveIndex(index)}
                    >
                      <span className={styles.navDot} />
                      <div className={styles.navText}>
                        <span className={styles.navIndex}>Pillar {index + 1}</span>
                        <span className={styles.navLabel}>{pillar.label}</span>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Right – animated detail card */}
          <div className={styles.detailCol}>
            {active && (
              <AnimatePresence mode="wait">
                <motion.article
                  key={`${active.label}-${activeIndex}`}
                  className={styles.card}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.22, ease: 'easeOut' }}
                >
                  <p className={styles.cardLabel}>{active.label}</p>
                  <h3 className={styles.cardTitle}>{active.title}</h3>
                  <p className={styles.cardBody}>{active.body}</p>

                  <ul className={styles.cardList}>
                    {active.bullets.map((line, i) => (
                      <li key={i}>{line}</li>
                    ))}
                  </ul>

                  {c.note && <p className={styles.cardHint}>{c.note}</p>}
                </motion.article>
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

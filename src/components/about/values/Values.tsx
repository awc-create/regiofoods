'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Lines from '@/components/common/Lines';
import type { aboutValues } from '@/content/sections/about';
import styles from './Values.module.scss';

type Props = { content: typeof aboutValues.defaults };

export default function Values({ content: c }: Props) {
  const VALUES = c.items;
  const [activeIndex, setActiveIndex] = useState(0);
  const active = VALUES[Math.min(activeIndex, VALUES.length - 1)];

  return (
    <section id="values" className={styles.section} aria-labelledby="values-heading">
      <div className={styles.inner}>
        {/* Heading / intro */}
        <header className={styles.header}>
          {c.eyebrow && <p className={styles.eyebrow}>{c.eyebrow}</p>}
          <h2 id="values-heading" className={styles.heading}>
            <Lines text={c.heading} />
          </h2>
          {c.intro && <p className={styles.subheading}>{c.intro}</p>}
        </header>

        <div className={styles.content}>
          {/* LEFT: vertical “spine” of values */}
          <div className={styles.spineCol}>
            <div className={styles.spineTrack} aria-hidden="true" />
            <motion.div
              className={styles.spinePulse}
              aria-hidden="true"
              animate={{ y: ['0%', '100%', '0%'] }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />

            <ol className={styles.nodeList}>
              {VALUES.map((value, index) => {
                const isActive = index === activeIndex;

                return (
                  <li key={`${value.title}-${index}`} className={styles.nodeItem}>
                    <motion.button
                      type="button"
                      className={`${styles.node} ${isActive ? styles.nodeActive : ''}`}
                      onClick={() => setActiveIndex(index)}
                      aria-pressed={isActive}
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <span className={styles.nodeDot} />
                      <span className={styles.nodeText}>
                        <span className={styles.nodeIndex}>
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <span className={styles.nodeTitle}>{value.title}</span>
                      </span>
                    </motion.button>
                  </li>
                );
              })}
            </ol>
          </div>

          {/* RIGHT: animated detail for active value */}
          <div className={styles.detailCol}>
            {active && (
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${active.title}-${activeIndex}`}
                  className={styles.detail}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.22, ease: 'easeOut' }}
                >
                  <p className={styles.detailKicker}>
                    Value {String(activeIndex + 1).padStart(2, '0')} of {VALUES.length}
                  </p>
                  <h3 className={styles.detailTitle}>{active.title}</h3>
                  <p className={styles.detailBody}>{active.body}</p>
                  <p className={styles.detailHint}>
                    Click a value on the left to see how it plays out day to day.
                  </p>
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

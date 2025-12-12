'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Values.module.scss';

const VALUES = [
  {
    title: 'Traceability as a default',
    body: 'Every ingredient, batch and process is logged so buyers can follow a product back to its source.',
  },
  {
    title: 'People before production',
    body: 'Well-trained teams, clear rules and safe working conditions come before line speeds.',
  },
  {
    title: 'No grey areas in hygiene',
    body: 'Cleaning, cooking, checks and sign-offs are recorded – not assumed.',
  },
  {
    title: 'Designed for export, not shortcuts',
    body: 'Layouts, flows and packaging are built to satisfy overseas regulations and buyer expectations.',
  },
  {
    title: 'Honesty in every batch',
    body: 'If a product or record falls short, we fix it instead of hiding it.',
  },
  {
    title: 'Continuous improvement',
    body: 'Feedback from audits, customers and staff is used to tighten our systems over time.',
  },
];

export default function Values() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = VALUES[activeIndex];

  return (
    <section id="values" className={styles.section} aria-labelledby="values-heading">
      <div className={styles.inner}>
        {/* Heading / intro */}
        <header className={styles.header}>
          <p className={styles.eyebrow}>Our values</p>
          <h2 id="values-heading" className={styles.heading}>
            Principles that actually show up on the factory floor.
          </h2>
          <p className={styles.subheading}>
            These aren’t slogans – they decide how we design layouts, write SOPs and train people.
          </p>
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
                  <li key={value.title} className={styles.nodeItem}>
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
            <AnimatePresence mode="wait">
              <motion.div
                key={active.title}
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
          </div>
        </div>
      </div>
    </section>
  );
}

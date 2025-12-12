'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Pillars.module.scss';

const PILLARS = [
  {
    id: 'global',
    label: 'Global standards',
    title: 'Built around international laws, not local minimums.',
    body: 'We used global food laws, workplace safety rules and fire regulations as the starting point for our design – from zoning and exits to documentation and traceability.',
    bullets: [
      'HACCP-style hazard analysis embedded in process flows.',
      'Guidance from Codex, EU and FDA hygiene principles.',
      'Fire safety and emergency planning inspired by UK/EU norms.',
    ],
  },
  {
    id: 'health-safety',
    label: 'Health & safety',
    title: 'Health, fire and worker safety fortified by design.',
    body: 'Instead of adding signs after the fact, we planned PPE, walkways, exits and the fire spine into the building layout, reinforced through training and drills.',
    bullets: [
      'Clearly marked escape routes and muster points.',
      'PPE and handwash points placed where people actually work.',
      'Lock-out/tag-out and safe working procedures for equipment.',
    ],
  },
  {
    id: 'traceability',
    label: 'Traceability & trust',
    title: 'Documentation that makes audits predictable.',
    body: 'We treat paperwork as part of the product. If a step is critical, there is a record for it – so buyers and auditors can follow any batch from intake to dispatch.',
    bullets: [
      'Batch codes mapped to ingredients, dates and lines.',
      'Retention samples for key products and SKUs.',
      'Checklists that show what was done, when and by whom.',
    ],
  },
];

export default function Pillars() {
  const [activeId, setActiveId] = useState<string>('global');
  const active = PILLARS.find((p) => p.id === activeId) ?? PILLARS[0];

  return (
    <section id="pillars" className={styles.section} aria-labelledby="pillars-heading">
      <div className={styles.inner}>
        {/* Header */}
        <div className={styles.header}>
          <p className={styles.eyebrow}>What shapes how we operate</p>
          <h2 id="pillars-heading" className={styles.heading}>
            Using global regulations to strengthen everyday practice.
          </h2>
          <p className={styles.subheading}>
            International food laws, workplace safety rules and export standards weren’t an
            afterthought. They were the blueprint for our factory and the way we run it.
          </p>
        </div>

        {/* Content */}
        <div className={styles.content}>
          {/* Left – regulation spine */}
          <div className={styles.navCol}>
            <div className={styles.spine} aria-hidden="true" />

            <ul className={styles.navList}>
              {PILLARS.map((pillar, index) => {
                const isActive = pillar.id === activeId;
                return (
                  <li key={pillar.id} className={styles.navItem}>
                    <button
                      type="button"
                      className={`${styles.navButton} ${isActive ? styles.navButtonActive : ''}`}
                      onClick={() => setActiveId(pillar.id)}
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
            <AnimatePresence mode="wait">
              <motion.article
                key={active.id}
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
                  {active.bullets.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>

                <p className={styles.cardHint}>
                  These pillars are how we turn laws and regulations into everyday habits on the
                  factory floor.
                </p>
              </motion.article>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

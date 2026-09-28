'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Lines from '@/components/common/Lines';
import type { aboutTeam } from '@/content/sections/about';
import styles from './Team.module.scss';

type Props = { content: typeof aboutTeam.defaults };

export default function Team({ content: c }: Props) {
  const AREAS = c.areas;
  const [activeIndex, setActiveIndex] = useState(0);
  const activeArea = AREAS[Math.min(activeIndex, AREAS.length - 1)];

  return (
    <section id="team" className={styles.section} aria-labelledby="team-heading">
      <div className={styles.header}>
        {c.eyebrow && <p className={styles.eyebrow}>{c.eyebrow}</p>}
        <h2 id="team-heading" className={styles.heading}>
          <Lines text={c.heading} />
        </h2>
        {c.intro && <p className={styles.subheading}>{c.intro}</p>}
      </div>

      <div className={styles.layout}>
        {/* LEFT: AREA LIST / NAV */}
        <div className={styles.areaList} aria-label="Factory responsibility areas">
          {AREAS.map((area, index) => {
            const isActive = index === activeIndex;
            return (
              <button
                key={`${area.title}-${index}`}
                type="button"
                className={`${styles.areaItem} ${isActive ? styles.areaItemActive : ''}`}
                onClick={() => setActiveIndex(index)}
              >
                {/* sliding accent bar */}
                {isActive && (
                  <motion.span
                    className={styles.areaActiveRail}
                    layoutId="area-rail"
                    transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                  />
                )}

                <div className={styles.areaText}>
                  <h3 className={styles.areaTitle}>{area.title}</h3>
                  <p className={styles.areaBody}>{area.body}</p>
                </div>

                <div className={styles.areaOwner}>
                  <span className={styles.areaOwnerRole}>{area.ownerRole}</span>
                  <span className={styles.areaOwnerName}>{area.ownerName}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* RIGHT: DETAIL CARD FOR SELECTED AREA */}
        <aside className={styles.detailPanel} aria-label="Area lead details">
          {activeArea && (
            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeArea.title}-${activeIndex}`}
                className={styles.detailInner}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18 }}
              >
                <p className={styles.detailEyebrow}>Area lead</p>
                <h3 className={styles.detailTitle}>{activeArea.ownerName}</h3>
                <p className={styles.detailRole}>{activeArea.ownerRole}</p>

                <p className={styles.detailFocus}>{activeArea.focus}</p>

                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Area</span>
                  <span className={styles.detailValue}>{activeArea.title}</span>
                </div>

                {activeArea.email && (
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Email</span>
                    <a href={`mailto:${activeArea.email}`} className={styles.detailLink}>
                      {activeArea.email}
                    </a>
                  </div>
                )}

                {c.note && <p className={styles.detailHint}>{c.note}</p>}
              </motion.div>
            </AnimatePresence>
          )}
        </aside>
      </div>
    </section>
  );
}

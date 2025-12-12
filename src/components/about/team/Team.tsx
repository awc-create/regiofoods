'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import styles from './Team.module.scss';

type AreaId = 'management' | 'production' | 'quality' | 'coldchain';

type Area = {
  id: AreaId;
  title: string;
  body: string;
  ownerRole: string;
  ownerName: string;
  email: string;
  focus: string;
};

const AREAS: Area[] = [
  {
    id: 'management',
    title: 'Management & planning',
    body: 'Capacity planning, purchasing, customer relationships and long-term factory strategy.',
    ownerRole: 'Factory Director',
    ownerName: 'Mr. D. Krishnan',
    email: 'director@regiofoods.in',
    focus: 'Overall factory performance, major investments and buyer relationships.',
  },
  {
    id: 'production',
    title: 'Production & kitchen teams',
    body: 'Running the lines, following recipes, maintaining hygiene and keeping the day-to-day moving.',
    ownerRole: 'Production Manager',
    ownerName: 'Ms. R. Thomas',
    email: 'production@regiofoods.in',
    focus: 'Daily production plans, staffing and making sure recipes are followed on line.',
  },
  {
    id: 'quality',
    title: 'Quality, safety & compliance',
    body: 'Checks, records, retention samples and making sure we meet both internal rules and external standards.',
    ownerRole: 'Quality & HSE Lead',
    ownerName: 'Ms. L. Nair',
    email: 'quality-safety@regiofoods.in',
    focus: 'Food safety checks, audit preparation, fire safety and health & safety training.',
  },
  {
    id: 'coldchain',
    title: 'Cold chain & dispatch',
    body: 'Protecting chilled and frozen product, building orders and loading for onward transport.',
    ownerRole: 'Cold Chain Supervisor',
    ownerName: 'Mr. Rahul S.',
    email: 'coldchain@regiofoods.in',
    focus: 'Chill rooms, blast freezers, loading temperatures and dispatch paperwork.',
  },
];

export default function Team() {
  const [activeId, setActiveId] = useState<AreaId>('management');
  const activeArea = AREAS.find((a) => a.id === activeId)!;

  return (
    <section id="team" className={styles.section} aria-labelledby="team-heading">
      <div className={styles.header}>
        <p className={styles.eyebrow}>The team behind the factory</p>
        <h2 id="team-heading" className={styles.heading}>
          A small, focused group with clear responsibilities.
        </h2>
        <p className={styles.subheading}>
          Work is grouped into a few core areas – each with a named lead. Buyers can see who looks
          after production, safety, fire and the cold chain at a glance.
        </p>
      </div>

      <div className={styles.layout}>
        {/* LEFT: AREA LIST / NAV */}
        <div className={styles.areaList} aria-label="Factory responsibility areas">
          {AREAS.map((area) => {
            const isActive = area.id === activeId;
            return (
              <button
                key={area.id}
                type="button"
                className={`${styles.areaItem} ${isActive ? styles.areaItemActive : ''}`}
                onClick={() => setActiveId(area.id)}
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
          <AnimatePresence mode="wait">
            <motion.div
              key={activeArea.id}
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

              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Email</span>
                <a href={`mailto:${activeArea.email}`} className={styles.detailLink}>
                  {activeArea.email}
                </a>
              </div>

              <p className={styles.detailHint}>
                For specific queries on fire safety or health & safety, this lead works together
                with the Fire Safety Officer and HSE Officer to respond.
              </p>
            </motion.div>
          </AnimatePresence>
        </aside>
      </div>
    </section>
  );
}

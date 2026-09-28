// src/components/factory/map/FactoryMap.tsx
'use client';

import { useState, KeyboardEvent } from 'react';
import { motion } from 'framer-motion';
import Lines from '@/components/common/Lines';
import type { factoryMap } from '@/content/sections/factory';
import styles from './FactoryMap.module.scss';

type SparkVerticalProps = {
  startFraction: number; // 0 → 1 along the loop
  direction: 'up' | 'down';
};

type ZoneContent = {
  shortLabel: string;
  title: string;
  description: string;
  detail: string;
  image: string;
};

/** Fixed dot positions on the corridor drawing (top %, left %), in zone order. */
const POSITIONS: { top: number; left: number }[] = [
  { top: 50, left: 14 },
  { top: 50, left: 32 },
  { top: 50, left: 50 },
  { top: 30, left: 50 },
  { top: 50, left: 68 },
  { top: 70, left: 32 },
  { top: 30, left: 22 },
];

const LOOP_DURATION = 16; // seconds – keep horizontal + vertical in sync
const H_SPINE_LEFT = 8;
const H_SPINE_RIGHT = 92;

// where along the horizontal corridor (0 → 1) a given x% sits
const fractionForX = (x: number) => (x - H_SPINE_LEFT) / (H_SPINE_RIGHT - H_SPINE_LEFT);

function SparkHorizontal() {
  return (
    <motion.span
      className={styles.sparkH}
      animate={{ backgroundPositionX: ['100%', '0%'] }} // left → right
      transition={{
        duration: LOOP_DURATION,
        repeat: Infinity,
        repeatType: 'loop',
        ease: 'linear',
      }}
    />
  );
}

function SparkVertical({ startFraction, direction }: SparkVerticalProps) {
  // how long the vertical zap lasts as a fraction of the full loop
  const segment = 0.05; // 5% of 20s = 1 second per vertical zap
  const start = startFraction;
  const end = Math.min(start + segment, 1);

  // flip the travel direction:
  //  - "down" = from spine towards the room below
  //  - "up"   = from spine towards the room above
  const yKeyframes =
    direction === 'down'
      ? ['0%', '0%', '100%', '100%'] // wait at top, then slide down
      : ['100%', '100%', '0%', '0%']; // wait at bottom, then slide up

  return (
    <motion.span
      className={styles.sparkV}
      animate={{
        backgroundPositionY: yKeyframes,
        opacity: [0, 0, 1, 0], // only visible during the zap
      }}
      transition={{
        duration: LOOP_DURATION, // 20s loop
        times: [0, start, end, 1],
        repeat: Infinity,
        ease: 'linear',
      }}
    />
  );
}

type Props = { content: typeof factoryMap.defaults };

export default function FactoryMap({ content: c }: Props) {
  const ZONES: (ZoneContent & { top: number; left: number })[] = c.zones
    .slice(0, POSITIONS.length)
    .map((z, i) => ({ ...z, ...POSITIONS[i] }));
  const [activeIndex, setActiveIndex] = useState(0);
  const activeZone = ZONES[Math.min(activeIndex, ZONES.length - 1)];

  const handleKey = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setActiveIndex(index);
    }
  };

  return (
    <section id="factory-map" className={styles.section} aria-labelledby="factory-map-heading">
      <div className={styles.header}>
        {c.eyebrow && <p className={styles.eyebrow}>{c.eyebrow}</p>}
        <h2 id="factory-map-heading" className={styles.heading}>
          <Lines text={c.heading} />
        </h2>
        {c.intro && <p className={styles.subheading}>{c.intro}</p>}
      </div>

      <div className={styles.layout}>
        {/* Map plane */}
        <div className={styles.mapPlane} aria-hidden="false">
          {/* main horizontal corridor */}
          <div className={`${styles.line} ${styles.mainHorizontal}`}>
            <SparkHorizontal />
          </div>

          {/* vertical branches (triggered where their junction actually is) */}
          <div className={`${styles.line} ${styles.branchBlast}`}>
            <SparkVertical startFraction={fractionForX(50)} direction="down" />
          </div>

          <div className={`${styles.line} ${styles.branchLab}`}>
            <SparkVertical startFraction={fractionForX(32)} direction="up" />
          </div>

          <div className={`${styles.line} ${styles.branchSafety}`}>
            <SparkVertical startFraction={fractionForX(22)} direction="down" />
          </div>

          {/* nodes */}
          {ZONES.map((zone, index) => {
            const isActive = index === activeIndex;
            return (
              <button
                key={`${zone.title}-${index}`}
                type="button"
                className={`${styles.zoneDot} ${isActive ? styles.zoneDotActive : ''}`}
                style={{ top: `${zone.top}%`, left: `${zone.left}%` }}
                aria-label={zone.title}
                onClick={() => setActiveIndex(index)}
                onKeyDown={(e) => handleKey(e, index)}
              >
                <span className={styles.dotCore} />

                {/* small hover card beside node */}
                <div className={styles.hoverCard}>
                  <p className={styles.hoverLabel}>{zone.shortLabel}</p>
                  <p className={styles.hoverDesc}>{zone.description}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Detail panel on the right */}
        {activeZone && (
          <aside className={styles.detailPanel} aria-label="Factory zone details">
            <p className={styles.detailEyebrow}>Zone in focus</p>
            <h3 className={styles.detailTitle}>{activeZone.title}</h3>
            <p className={styles.detailLead}>{activeZone.description}</p>

            <div className={styles.detailMedia}>
              {activeZone.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={activeZone.image} alt={activeZone.title} loading="lazy" />
              ) : (
                <div className={styles.detailPlaceholder}>
                  <span>Factory imagery for this area.</span>
                </div>
              )}
            </div>

            <p className={styles.detailBody}>{activeZone.detail}</p>
          </aside>
        )}
      </div>
    </section>
  );
}

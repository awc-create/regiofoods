// src/components/factory/map/FactoryMap.tsx
'use client';

import { useState, KeyboardEvent } from 'react';
import { motion } from 'framer-motion';
import styles from './FactoryMap.module.scss';

type SparkVerticalProps = {
  startFraction: number; // 0 → 1 along the loop
  direction: 'up' | 'down';
};

type ZoneId = 'intake' | 'prep' | 'cook' | 'blast' | 'cold' | 'lab' | 'safety';

type Zone = {
  id: ZoneId;
  shortLabel: string;
  title: string;
  description: string;
  detail: string;
  top: number; // % position
  left: number; // % position
  imageUrl?: string; // hook up later
};

const LOOP_DURATION = 16; // seconds – keep horizontal + vertical in sync
const H_SPINE_LEFT = 8;
const H_SPINE_RIGHT = 92;

// where along the horizontal corridor (0 → 1) a given x% sits
const fractionForX = (x: number) => (x - H_SPINE_LEFT) / (H_SPINE_RIGHT - H_SPINE_LEFT);

const ZONES: Zone[] = [
  {
    id: 'intake',
    shortLabel: 'Intake',
    title: 'Raw material intake bay',
    description: 'Approved suppliers checked and logged as product arrives.',
    detail:
      'Deliveries arrive at a dedicated intake bay where paperwork, seal checks and temperatures are taken before anything enters the building.',
    top: 50,
    left: 14,
  },
  {
    id: 'prep',
    shortLabel: 'Prep',
    title: 'Preparation area',
    description: 'Trimming, cutting and marination in stainless workspaces.',
    detail:
      'Controlled prep zones keep raw work together with their own tools, sinks and handwash points before product moves to cooking.',
    top: 50,
    left: 32,
  },
  {
    id: 'cook',
    shortLabel: 'Cook',
    title: 'Cooking line',
    description: 'Core heat step with validated time and temperature profiles.',
    detail:
      'Batch and continuous cooking lines run defined recipes, with time–temperature records you can audit by date and product.',
    top: 50,
    left: 50,
  },
  {
    id: 'blast',
    shortLabel: 'Blast',
    title: 'Chill / blast freezer',
    description: 'Rapid cooling to pull product out of the danger zone.',
    detail:
      'Chill rooms and blast freezers are sized to pull product down quickly, protecting shelf life and food safety.',
    top: 30,
    left: 50,
  },
  {
    id: 'cold',
    shortLabel: 'Cold',
    title: 'Cold store & dispatch',
    description: 'Finished goods stored and marshalled ready to ship.',
    detail:
      'Finished pallets are held in mapped cold storage, then marshalled at the dock for containers and trucks.',
    top: 50,
    left: 68,
  },
  {
    id: 'lab',
    shortLabel: 'Lab',
    title: 'Quality lab & retention',
    description: 'Samples and checks to release batches for sale.',
    detail:
      'Retention samples, rapid tests and formal lab work are tied back to production dates and batch codes.',
    top: 70,
    left: 32,
  },
  {
    id: 'safety',
    shortLabel: 'Safety',
    title: 'Fire, safety & utilities',
    description: 'Fire panel, plant room and emergency infrastructure.',
    detail:
      'The services spine houses the fire panel, alarms and plant equipment, so safety checks never clash with production.',
    top: 30,
    left: 22,
  },
];

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

export default function FactoryMap() {
  const [activeId, setActiveId] = useState<ZoneId>('intake');
  const activeZone = ZONES.find((z) => z.id === activeId)!;

  const handleKey = (e: KeyboardEvent<HTMLButtonElement>, id: ZoneId) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setActiveId(id);
    }
  };

  return (
    <section id="factory-map" className={styles.section} aria-labelledby="factory-map-heading">
      <div className={styles.header}>
        <p className={styles.eyebrow}>Factory map</p>
        <h2 id="factory-map-heading" className={styles.heading}>
          Skeleton layout of the site.
        </h2>
        <p className={styles.subheading}>
          A simple corridor-and-rooms view of the factory. Each glowing point marks a key zone —
          hover to see a quick label, click to see more detail.
        </p>
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
          {ZONES.map((zone) => {
            const isActive = zone.id === activeId;
            return (
              <button
                key={zone.id}
                type="button"
                className={`${styles.zoneDot} ${isActive ? styles.zoneDotActive : ''}`}
                style={{ top: `${zone.top}%`, left: `${zone.left}%` }}
                aria-label={zone.title}
                onClick={() => setActiveId(zone.id)}
                onKeyDown={(e) => handleKey(e, zone.id)}
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
        <aside className={styles.detailPanel} aria-label="Factory zone details">
          <p className={styles.detailEyebrow}>Zone in focus</p>
          <h3 className={styles.detailTitle}>{activeZone.title}</h3>
          <p className={styles.detailLead}>{activeZone.description}</p>

          <div className={styles.detailMedia}>
            {activeZone.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={activeZone.imageUrl} alt={activeZone.title} loading="lazy" />
            ) : (
              <div className={styles.detailPlaceholder}>
                <span>Factory imagery for this area.</span>
              </div>
            )}
          </div>

          <p className={styles.detailBody}>{activeZone.detail}</p>
        </aside>
      </div>
    </section>
  );
}

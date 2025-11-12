'use client';

import styles from './ExportFootprint.module.scss';

export type Stat = { value: string; label: string };
export type Region = string; // simple label (e.g., "UK & EU")

interface Props {
  heading?: string;
  subheading?: string;
  stats?: Stat[]; // e.g., [{value:"12+",label:"Countries"}]
  regions?: Region[]; // chips of markets/countries
  note?: string; // small disclaimer
  className?: string;
}

export default function ExportFootprint({
  heading = 'Export Footprint',
  subheading = 'Supplying retailers, HORECA, and distributors across multiple regions with compliant documentation.',
  stats = [
    { value: '12+', label: 'Countries' },
    { value: '4', label: 'Cold Rooms' },
    { value: '99.8%', label: 'On-time Dispatch' },
  ],
  regions = ['UK & EU', 'Middle East', 'North America', 'Africa', 'South East Asia'],
  note,
  className,
}: Props) {
  return (
    <section className={`${styles.section} ${className ?? ''}`}>
      <div className={styles.header}>
        <h2 className={styles.heading}>{heading}</h2>
        {subheading ? <p className={styles.subheading}>{subheading}</p> : null}
      </div>

      <div className={styles.panel}>
        <ul className={styles.stats}>
          {stats.map((s) => (
            <li key={s.label}>
              <div className={styles.value}>{s.value}</div>
              <div className={styles.label}>{s.label}</div>
            </li>
          ))}
        </ul>

        <div className={styles.regions}>
          {regions.map((r) => (
            <span key={r} className={styles.chip}>
              {r}
            </span>
          ))}
        </div>

        {note ? <p className={styles.note}>{note}</p> : null}
      </div>
    </section>
  );
}

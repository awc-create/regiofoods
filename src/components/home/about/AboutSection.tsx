'use client';

import Image from 'next/image';
import styles from './AboutSection.module.scss';

type Stat = { label: string; value: string };

interface Props {
  heading?: string;
  subheading?: string;
  body?: string;
  imageSrc?: string; // optional hero image (factory, team, line)
  imageAlt?: string;
  stats?: Stat[]; // small trust stats (e.g., “2,000 sq ft”, “ISO 22000”)
  cta?: { label: string; href: string };
  className?: string;
}

export default function AboutSection({
  heading = 'About Regio Foods',
  subheading = 'A modern food manufacturing facility focused on quality, consistency, and export readiness.',
  body = 'We operate a state-of-the-art plant designed around hygiene-first layouts, validated processes, and continuous temperature and quality monitoring. Our teams follow strict SOPs from raw intake to blast freezing and primary packaging, ensuring repeatable outcomes for partners across retail, HORECA, and export markets.',
  imageSrc,
  imageAlt = 'Factory overview',
  stats = [
    { label: 'Process Lines', value: 'Multiple' },
    { label: 'Cold Rooms', value: 'Redundant' },
    { label: 'QA Lab', value: 'Micro + Chemical' },
  ],
  cta,
  className,
}: Props) {
  return (
    <section className={`${styles.section} ${className ?? ''}`}>
      <div className={styles.inner}>
        <div className={styles.copy}>
          <h2 className={styles.heading}>{heading}</h2>
          <p className={styles.subheading}>{subheading}</p>
          <p className={styles.body}>{body}</p>

          {stats?.length ? (
            <ul className={styles.stats}>
              {stats.map((s) => (
                <li key={s.label}>
                  <div className={styles.value}>{s.value}</div>
                  <div className={styles.label}>{s.label}</div>
                </li>
              ))}
            </ul>
          ) : null}

          {cta ? (
            <a href={cta.href} className={styles.ctaButton}>
              {cta.label}
            </a>
          ) : null}
        </div>

        {imageSrc ? (
          <div className={styles.figure} aria-hidden="true">
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              sizes="(max-width: 900px) 100vw, 560px"
              priority={false}
            />
            <div className={styles.figOverlay} />
          </div>
        ) : null}
      </div>
    </section>
  );
}

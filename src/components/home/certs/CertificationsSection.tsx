'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './CertificationsSection.module.scss';

type CertItem = {
  name: string;
  logoSrc: string; // e.g. /assets/certs/haccp.png
  alt?: string;
  href?: string; // optional PDF/page
};

interface Props {
  heading?: string;
  subheading?: string;
  items: CertItem[];
  className?: string;
}

export default function CertificationsRow({
  heading = 'Certifications & Standards',
  subheading = 'Independently audited systems and food safety compliance.',
  items,
  className,
}: Props) {
  const railRef = useRef<HTMLDivElement>(null);

  const scrollByLogos = (dir: 'left' | 'right') => {
    const el = railRef.current;
    if (!el) return;
    const firstCard = el.querySelector(`.${styles.logoCard}`) as HTMLElement | null;
    const dx = (firstCard?.offsetWidth ?? 220) + 16; // card width + gap
    el.scrollBy({ left: dir === 'left' ? -dx * 2 : dx * 2, behavior: 'smooth' });
  };

  return (
    <section className={`${styles.section} ${className ?? ''}`}>
      <div className={styles.header}>
        <h2 className={styles.heading}>{heading}</h2>
        {subheading ? <p className={styles.subheading}>{subheading}</p> : null}
      </div>

      <div className={styles.shell}>
        <button
          type="button"
          className={`${styles.nav} ${styles.left}`}
          aria-label="Previous certifications"
          onClick={() => scrollByLogos('left')}
        >
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
            <path
              d="M15 6l-6 6 6 6"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <div className={styles.rail} ref={railRef} role="list" aria-label="Certification logos">
          {items.map((it) => {
            const card = (
              <div className={styles.logoCard} role="listitem">
                <div className={styles.logoBox}>
                  <Image
                    src={it.logoSrc}
                    alt={it.alt ?? it.name}
                    fill
                    sizes="(max-width: 768px) 40vw, 180px"
                    priority={false}
                  />
                </div>
                <span className="sr-only">{it.name}</span>
              </div>
            );
            return it.href ? (
              <Link
                key={it.name}
                href={it.href}
                className={styles.logoLink}
                aria-label={`View ${it.name} certificate`}
              >
                {card}
              </Link>
            ) : (
              <div key={it.name} className={styles.logoLink}>
                {card}
              </div>
            );
          })}
        </div>

        <button
          type="button"
          className={`${styles.nav} ${styles.right}`}
          aria-label="Next certifications"
          onClick={() => scrollByLogos('right')}
        >
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
            <path
              d="M9 6l6 6-6 6"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
          </svg>
        </button>

        {/* subtle fade edges */}
        <div className={`${styles.fade} ${styles.leftFade}`} aria-hidden="true" />
        <div className={`${styles.fade} ${styles.rightFade}`} aria-hidden="true" />
      </div>
    </section>
  );
}

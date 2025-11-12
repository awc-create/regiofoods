'use client';

import { useRef } from 'react';
import styles from './TestimonialsCarousel.module.scss';
import Image from 'next/image';

export type Testimonial = {
  quote: string;
  author: string;
  role?: string;
  company?: string;
  avatarSrc?: string; // optional /public path
};

interface Props {
  heading?: string;
  subheading?: string;
  items: Testimonial[];
  className?: string;
}

export default function TestimonialsCarousel({
  heading = 'What Partners Say',
  subheading = 'Feedback from distributors, chefs, and retail buyers.',
  items,
  className,
}: Props) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scrollByCards = (dir: 'left' | 'right') => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector(`.${styles.card}`) as HTMLElement | null;
    const dx = (card?.offsetWidth ?? 320) + 16;
    el.scrollBy({ left: dir === 'left' ? -dx : dx, behavior: 'smooth' });
  };

  return (
    <section className={`${styles.section} ${className ?? ''}`}>
      <div className={styles.header}>
        <h2 className={styles.heading}>{heading}</h2>
        {subheading ? <p className={styles.subheading}>{subheading}</p> : null}
      </div>

      <div className={styles.shell}>
        <button
          className={`${styles.nav} ${styles.left}`}
          aria-label="Previous testimonials"
          onClick={() => scrollByCards('left')}
        >
          ‹
        </button>

        <div className={styles.scroller} ref={scrollerRef}>
          {items.map((t, i) => (
            <figure className={styles.card} key={t.author + i}>
              {t.avatarSrc ? (
                <Image className={styles.avatar} src={t.avatarSrc} alt="" width={44} height={44} />
              ) : (
                <div className={styles.avatarFallback} aria-hidden="true">
                  ★
                </div>
              )}
              <blockquote className={styles.quote}>“{t.quote}”</blockquote>
              <figcaption className={styles.meta}>
                <span className={styles.author}>{t.author}</span>
                {t.role || t.company ? (
                  <span className={styles.role}>
                    {(t.role ?? '') + (t.role && t.company ? ' • ' : '') + (t.company ?? '')}
                  </span>
                ) : null}
              </figcaption>
            </figure>
          ))}
        </div>

        <button
          className={`${styles.nav} ${styles.right}`}
          aria-label="Next testimonials"
          onClick={() => scrollByCards('right')}
        >
          ›
        </button>
      </div>
    </section>
  );
}

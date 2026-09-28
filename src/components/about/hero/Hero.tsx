// src/components/about/hero/Hero.tsx
import Link from 'next/link';
import Lines from '@/components/common/Lines';
import type { aboutHero } from '@/content/sections/about';
import styles from './Hero.module.scss';

type Props = { content: typeof aboutHero.defaults };

export default function AboutHero({ content: c }: Props) {
  return (
    <section className={styles.hero} aria-labelledby="about-hero-heading">
      <div className={styles.inner}>
        {c.eyebrow && <p className={styles.eyebrow}>{c.eyebrow}</p>}

        <h1 id="about-hero-heading" className={styles.title}>
          <Lines text={c.heading} />
        </h1>

        {c.intro && <p className={styles.lead}>{c.intro}</p>}

        {c.chips.length > 0 && (
          <div className={styles.chips}>
            {c.chips.map((chip) => (
              <span key={chip} className={styles.chip}>
                {chip}
              </span>
            ))}
          </div>
        )}

        <div className={styles.ctaRow}>
          {c.primaryCta.label && (
            <Link href={c.primaryCta.href || '#'} className={styles.primaryCta}>
              {c.primaryCta.label}
            </Link>
          )}
          {c.secondaryCta.label && (
            <Link href={c.secondaryCta.href || '#'} className={styles.secondaryCta}>
              {c.secondaryCta.label}
            </Link>
          )}
        </div>

        {c.meta.length > 0 && (
          <div className={styles.metaRow}>
            {c.meta.map((m, i) => (
              <div key={`${m.label}-${i}`}>
                <span className={styles.metaLabel}>{m.label}</span>
                <p className={styles.metaValue}>{m.value}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

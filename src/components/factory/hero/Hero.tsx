import Image from 'next/image';
import Lines from '@/components/common/Lines';
import type { factoryHero } from '@/content/sections/factory';
import styles from './Hero.module.scss';

type Props = { content: typeof factoryHero.defaults };

export default function Hero({ content: c }: Props) {
  return (
    <section className={styles.hero}>
      {c.image && (
        <div className={styles.media}>
          <Image src={c.image} alt="" fill priority sizes="100vw" />
        </div>
      )}

      <div className={styles.overlay} />

      <div className={styles.content}>
        {c.eyebrow && <p className={styles.eyebrow}>{c.eyebrow}</p>}

        <h1 className={styles.title}>
          <Lines text={c.heading} />
        </h1>

        {c.intro && <p className={styles.subtitle}>{c.intro}</p>}

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
            <a href={c.primaryCta.href || '#'} className={styles.primaryCta}>
              {c.primaryCta.label}
            </a>
          )}
          {c.secondaryCta.label && (
            <a href={c.secondaryCta.href || '#'} className={styles.secondaryCta}>
              {c.secondaryCta.label}
            </a>
          )}
        </div>

        {c.notes.length > 0 && (
          <div className={styles.meta}>
            {c.notes.map((n, i) => (
              <p key={i}>{n}</p>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

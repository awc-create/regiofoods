import Link from 'next/link';
import Lines from '@/components/common/Lines';
import type { brandsPrivateLabel } from '@/content/sections/brands';
import styles from './PrivateLabel.module.scss';

type Props = { content: typeof brandsPrivateLabel.defaults };

export default function PrivateLabel({ content: c }: Props) {
  return (
    <section className={styles.section} aria-labelledby="private-label-heading">
      <div className={styles.inner}>
        <div className={styles.card}>
          <div className={styles.copy}>
            {c.eyebrow && <p className={styles.eyebrow}>{c.eyebrow}</p>}
            <h2 id="private-label-heading" className={styles.heading}>
              <Lines text={c.heading} />
            </h2>
            {c.intro && <p className={styles.text}>{c.intro}</p>}

            {c.chips.length > 0 && (
              <div className={styles.points} aria-label="Private label capabilities">
                {c.chips.map((chip) => (
                  <span key={chip} className={styles.point}>
                    {chip}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className={styles.actions}>
            {c.primaryCta.label && (
              <Link href={c.primaryCta.href || '#'} className={styles.primary}>
                {c.primaryCta.label}
              </Link>
            )}
            {c.secondaryCta.label && (
              <Link href={c.secondaryCta.href || '#'} className={styles.secondary}>
                {c.secondaryCta.label}
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

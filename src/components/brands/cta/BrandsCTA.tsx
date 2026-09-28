import Link from 'next/link';
import type { brandsCta } from '@/content/sections/brands';
import styles from './BrandsCTA.module.scss';

type Props = { content: typeof brandsCta.defaults };

export default function BrandsCTA({ content: c }: Props) {
  return (
    <section className={styles.section} aria-labelledby="brands-cta-heading">
      <div className={styles.inner}>
        <div className={styles.panel}>
          <h2 id="brands-cta-heading" className={styles.heading}>
            {c.heading}
          </h2>
          {c.intro && <p className={styles.text}>{c.intro}</p>}

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

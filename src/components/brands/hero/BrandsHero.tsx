import Image from 'next/image';
import Link from 'next/link';
import Lines from '@/components/common/Lines';
import type { brandsHero } from '@/content/sections/brands';
import styles from './BrandsHero.module.scss';

type Props = { content: typeof brandsHero.defaults };

export default function BrandsHero({ content: c }: Props) {
  return (
    <section className={styles.hero} aria-labelledby="brands-hero-heading">
      <div className={styles.inner}>
        {c.logo && (
          <div className={styles.logoWrap}>
            <Image src={c.logo} alt="Regio Foods" width={220} height={72} priority={false} />
          </div>
        )}

        {c.eyebrow && <p className={styles.eyebrow}>{c.eyebrow}</p>}

        <h1 id="brands-hero-heading" className={styles.title}>
          <Lines text={c.heading} />
        </h1>

        {c.intro && <p className={styles.lead}>{c.intro}</p>}

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

        {c.chips.length > 0 && (
          <div className={styles.chips} aria-label="Key points">
            {c.chips.map((chip) => (
              <span key={chip} className={styles.chip}>
                {chip}
              </span>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

import Image from 'next/image';
import Lines from '@/components/common/Lines';
import type { factoryGallery } from '@/content/sections/factory';
import styles from './InfrastructureGallery.module.scss';

type Props = { content: typeof factoryGallery.defaults };

export default function InfrastructureGallery({ content: c }: Props) {
  return (
    <section
      id="factory-gallery"
      className={styles.section}
      aria-labelledby="factory-gallery-heading"
    >
      <div className={styles.header}>
        {c.eyebrow && <p className={styles.eyebrow}>{c.eyebrow}</p>}
        <h2 id="factory-gallery-heading" className={styles.heading}>
          <Lines text={c.heading} />
        </h2>
        {c.intro && <p className={styles.subheading}>{c.intro}</p>}
      </div>

      <div className={styles.grid}>
        {c.items.map((area, i) => (
          <figure key={`${area.title}-${i}`} className={styles.card}>
            <div className={styles.mediaWrap}>
              {area.image && (
                <Image
                  src={area.image}
                  alt={area.title}
                  fill
                  sizes="(min-width: 1200px) 30vw, (min-width: 768px) 45vw, 100vw"
                />
              )}
            </div>

            <figcaption className={styles.caption}>
              <h3 className={styles.title}>{area.title}</h3>
              <p className={styles.text}>{area.caption}</p>
            </figcaption>
          </figure>
        ))}
      </div>

      {c.note && <p className={styles.footerNote}>{c.note}</p>}
    </section>
  );
}

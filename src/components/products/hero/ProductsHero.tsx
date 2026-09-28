import Lines from '@/components/common/Lines';
import type { productsHero } from '@/content/sections/pages';
import styles from './ProductsHero.module.scss';

type Props = { content: typeof productsHero.defaults };

export default function ProductsHero({ content: c }: Props) {
  return (
    <section id="products-hero" className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.copy}>
          {c.eyebrow && <p className={styles.eyebrow}>{c.eyebrow}</p>}

          <h1 className={styles.heading}>
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

        <aside className={styles.sideCard}>
          {c.sideTitle && <p className={styles.sideEyebrow}>{c.sideTitle}</p>}

          <dl className={styles.stats}>
            {c.sideStats.map((s, i) => (
              <div key={`${s.label}-${i}`}>
                <dt>{s.label}</dt>
                <dd>{s.value}</dd>
              </div>
            ))}
          </dl>

          {c.sideNote && <p className={styles.sideNote}>{c.sideNote}</p>}
        </aside>
      </div>
    </section>
  );
}

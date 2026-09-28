// src/components/factory/regulations/Regulations.tsx
import Lines from '@/components/common/Lines';
import type { factoryRegulations } from '@/content/sections/factory';
import styles from './Regulations.module.scss';

type Props = { content: typeof factoryRegulations.defaults };

export default function Regulations({ content: c }: Props) {
  return (
    <section
      id="safety-standards"
      className={styles.section}
      aria-labelledby="factory-standards-heading"
    >
      <div className={styles.inner}>
        <div className={styles.copy}>
          {c.eyebrow && <p className={styles.eyebrow}>{c.eyebrow}</p>}

          <h2 id="factory-standards-heading" className={styles.heading}>
            <Lines text={c.heading} />
          </h2>

          {c.intro && <p className={styles.lead}>{c.intro}</p>}

          <ul className={styles.points}>
            {c.points.map((pt, i) => (
              <li key={`${pt.title}-${i}`}>
                <span className={styles.bullet} />
                <div>
                  <h3>{pt.title}</h3>
                  <p>{pt.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <aside className={styles.panel} aria-label="Factory standards summary">
          {c.panelTitle && <p className={styles.panelTitle}>{c.panelTitle}</p>}

          <div className={styles.badges}>
            {c.badges.map((b, i) => (
              <div key={`${b.label}-${i}`} className={styles.badge}>
                <span className={styles.badgeLabel}>{b.label}</span>
                <p>{b.text}</p>
              </div>
            ))}
          </div>

          {c.note && <p className={styles.footerNote}>{c.note}</p>}
        </aside>
      </div>
    </section>
  );
}

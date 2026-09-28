import Lines from '@/components/common/Lines';
import type { aboutStory } from '@/content/sections/about';
import styles from './Story.module.scss';

type Props = { content: typeof aboutStory.defaults };

export default function Story({ content: c }: Props) {
  return (
    <section id="our-story" className={styles.section} aria-labelledby="about-story-heading">
      <div className={styles.inner}>
        {/* LEFT: main narrative */}
        <div className={styles.copy}>
          {c.eyebrow && <p className={styles.eyebrow}>{c.eyebrow}</p>}

          <h2 id="about-story-heading" className={styles.heading}>
            <Lines text={c.heading} />
          </h2>

          {c.intro && <p className={styles.lead}>{c.intro}</p>}

          {c.chips.length > 0 && (
            <div className={styles.chipRow}>
              {c.chips.map((chip) => (
                <span key={chip} className={styles.chip}>
                  {chip}
                </span>
              ))}
            </div>
          )}

          <div className={styles.bodyStack}>
            {c.paragraphs.map((p, i) => (
              <p key={i} className={styles.body}>
                {p}
              </p>
            ))}
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

        {/* RIGHT: “at a glance” card */}
        <aside className={styles.sidePanel} aria-label="At a glance">
          <ul className={styles.stats}>
            {c.facts.map((f, i) => (
              <li key={`${f.label}-${i}`}>
                <span className={styles.statLabel}>{f.label}</span>
                <p className={styles.statValue}>{f.value}</p>
              </li>
            ))}
          </ul>

          {c.note && <p className={styles.note}>{c.note}</p>}
        </aside>
      </div>
    </section>
  );
}

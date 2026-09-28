import Lines from '@/components/common/Lines';
import type { aboutTimeline } from '@/content/sections/about';
import styles from './Timeline.module.scss';

type Props = { content: typeof aboutTimeline.defaults };

export default function Timeline({ content: c }: Props) {
  return (
    <section id="timeline" className={styles.section} aria-labelledby="timeline-heading">
      <div className={styles.inner}>
        <div className={styles.header}>
          {c.eyebrow && <p className={styles.eyebrow}>{c.eyebrow}</p>}
          <h2 id="timeline-heading" className={styles.heading}>
            <Lines text={c.heading} />
          </h2>
          {c.intro && <p className={styles.subheading}>{c.intro}</p>}
        </div>

        <ol className={styles.timeline}>
          {c.events.map((event, i) => (
            <li key={`${event.year}-${i}`} className={styles.item}>
              <div className={styles.yearWrap}>
                <span className={styles.yearDot} aria-hidden="true" />
                <div className={styles.year}>
                  <span>{event.year}</span>
                </div>
              </div>

              <div className={styles.content}>
                <h3 className={styles.title}>{event.title}</h3>
                <p className={styles.body}>{event.body}</p>
              </div>
            </li>
          ))}
        </ol>

        {c.note && <p className={styles.footerNote}>{c.note}</p>}
      </div>
    </section>
  );
}

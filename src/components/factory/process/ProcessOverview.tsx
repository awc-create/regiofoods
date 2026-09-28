// src/components/factory/process/ProcessOverview.tsx
import Lines from '@/components/common/Lines';
import type { factoryProcess } from '@/content/sections/factory';
import styles from './ProcessOverview.module.scss';

type Props = { content: typeof factoryProcess.defaults };

export default function ProcessOverview({ content: c }: Props) {
  return (
    <section
      id="process-overview"
      className={styles.section}
      aria-labelledby="process-overview-heading"
    >
      <div className={styles.header}>
        {c.eyebrow && <p className={styles.eyebrow}>{c.eyebrow}</p>}
        <h2 id="process-overview-heading" className={styles.heading}>
          <Lines text={c.heading} />
        </h2>
        {c.intro && <p className={styles.subheading}>{c.intro}</p>}

        {c.metrics.length > 0 && (
          <div className={styles.metrics}>
            {c.metrics.map((m, i) => (
              <div key={`${m.label}-${i}`}>
                <span className={styles.metricLabel}>{m.label}</span>
                <p className={styles.metricValue}>{m.value}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className={styles.rail} aria-label="Factory process steps">
        {c.steps.map((step, i) => (
          <article key={`${step.title}-${i}`} className={styles.card}>
            <div className={styles.stepTag}>Step {i + 1}</div>
            <h3 className={styles.cardTitle}>{step.title}</h3>
            <p className={styles.cardBlurb}>{step.blurb}</p>
            {step.tag && <span className={styles.cardChip}>{step.tag}</span>}
          </article>
        ))}
      </div>
    </section>
  );
}

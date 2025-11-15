// src/components/factory/process/ProcessOverview.tsx
import styles from './ProcessOverview.module.scss';

const STEPS = [
  {
    id: 1,
    title: 'Intake & verification',
    blurb:
      'Approved suppliers, incoming checks and temperature readings logged as ingredients enter the factory.',
    tag: 'Raw materials',
  },
  {
    id: 2,
    title: 'Preparation & batching',
    blurb:
      'Trimming, marination and batching in stainless work areas, with clear separation from cooked zones.',
    tag: 'Controlled prep',
  },
  {
    id: 3,
    title: 'Cooking & validation',
    blurb:
      'Validated time and temperature profiles for each SKU, recorded by batch to prove cook steps were met.',
    tag: 'Core safety step',
  },
  {
    id: 4,
    title: 'Chilling & blast freezing',
    blurb:
      'Rapid cooling and blast freezing reduce time in the danger zone and lock in product quality.',
    tag: 'Cold chain',
  },
  {
    id: 5,
    title: 'Packing & labelling',
    blurb:
      'Portioning, sealing and labelling in dedicated clean areas, with metal checks and export-ready artwork.',
    tag: 'Export-ready packs',
  },
  {
    id: 6,
    title: 'Storage & dispatch',
    blurb:
      'Finished goods stored in temperature-controlled rooms, marshalled by order and loaded for onward transport.',
    tag: 'Ready to ship',
  },
];

export default function ProcessOverview() {
  return (
    <section
      id="process-overview"
      className={styles.section}
      aria-labelledby="process-overview-heading"
    >
      <div className={styles.header}>
        <p className={styles.eyebrow}>How the factory runs</p>
        <h2 id="process-overview-heading" className={styles.heading}>
          A clear path from intake to dispatch.
        </h2>
        <p className={styles.subheading}>
          The layout of the building mirrors the way a batch moves through it – ingredients always
          travelling forward, never looping back, with checks at each handover.
        </p>

        <div className={styles.metrics}>
          <div>
            <span className={styles.metricLabel}>Flow</span>
            <p className={styles.metricValue}>Linear, one-way</p>
          </div>
          <div>
            <span className={styles.metricLabel}>Controls</span>
            <p className={styles.metricValue}>Food safety + fire + people</p>
          </div>
          <div>
            <span className={styles.metricLabel}>Designed for</span>
            <p className={styles.metricValue}>Export buyers & audits</p>
          </div>
        </div>
      </div>

      <div className={styles.rail} aria-label="Factory process steps">
        {STEPS.map((step) => (
          <article key={step.id} className={styles.card}>
            <div className={styles.stepTag}>Step {step.id}</div>
            <h3 className={styles.cardTitle}>{step.title}</h3>
            <p className={styles.cardBlurb}>{step.blurb}</p>
            <span className={styles.cardChip}>{step.tag}</span>
          </article>
        ))}
      </div>
    </section>
  );
}

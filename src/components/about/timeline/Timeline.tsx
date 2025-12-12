import styles from './Timeline.module.scss';

const EVENTS = [
  {
    year: '2023',
    title: 'Planning the site',
    body: 'Layout, flows and utilities designed with export requirements, hygiene and fire safety in mind.',
  },
  {
    year: '2024',
    title: 'Factory build & trial runs',
    body: 'Core infrastructure installed, test batches run and processes refined based on real outputs.',
  },
  {
    year: '2025',
    title: 'Cold chain & capacity',
    body: 'Blast freezers, cold stores and dispatch zones aligned to support export volumes.',
  },
  {
    year: '2026+',
    title: 'Certifications & partnerships',
    body: 'Formal standards, third-party audits and long-term buyer partnerships added as the site scales.',
  },
];

export default function Timeline() {
  return (
    <section id="timeline" className={styles.section} aria-labelledby="timeline-heading">
      <div className={styles.inner}>
        <div className={styles.header}>
          <p className={styles.eyebrow}>Timeline</p>
          <h2 id="timeline-heading" className={styles.heading}>
            How the factory has taken shape.
          </h2>
          <p className={styles.subheading}>
            A quick view of how we’ve moved from plans on paper to a working, export-ready facility.
          </p>
        </div>

        <ol className={styles.timeline}>
          {EVENTS.map((event) => (
            <li key={event.year} className={styles.item}>
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

        <p className={styles.footerNote}>
          The goal is steady progress: each year adds capacity, controls and trust – not just more
          volume.
        </p>
      </div>
    </section>
  );
}

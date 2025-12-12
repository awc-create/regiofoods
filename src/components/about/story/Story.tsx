import styles from './Story.module.scss';

export default function Story() {
  return (
    <section id="our-story" className={styles.section} aria-labelledby="about-story-heading">
      <div className={styles.inner}>
        {/* LEFT: main narrative */}
        <div className={styles.copy}>
          <p className={styles.eyebrow}>Our story</p>

          <h2 id="about-story-heading" className={styles.heading}>
            A modern factory in Kerala,
            <br />
            planned backwards from export standards.
          </h2>

          <p className={styles.lead}>
            Regio Foods was shaped around global food laws and safety regulations – from UK and EU
            standards through to GCC and North American import rules. Instead of treating them as a
            hurdle, we used them to fortify how we hire, train and run the plant every day.
          </p>

          {/* highlight chips */}
          <div className={styles.chipRow}>
            <span className={styles.chip}>Export-focused manufacturing</span>
            <span className={styles.chip}>Global safety laws built-in</span>
            <span className={styles.chip}>Transparent, traceable batches</span>
          </div>

          {/* body stack — can grow/shrink */}
          <div className={styles.bodyStack}>
            <p className={styles.body}>
              Instead of growing from a small kitchen into a factory, we designed the site to behave
              like a serious export plant from day one. Raw, cooked, packing and cold stores were
              laid out so product always moves forward.
            </p>

            <p className={styles.body}>
              Safety systems, training and records were built in alongside ovens and chillers – not
              added later. That means we can show you how a batch moved, not just tell you.
            </p>

            <p className={styles.body}>
              Today, that planning means every new product follows the same logic: documented steps,
              clean flows and a clear handover from one zone to the next.
            </p>
          </div>

          {/* bottom meta row */}
          <div className={styles.metaRow}>
            <div>
              <span className={styles.metaLabel}>Founded for</span>
              <p className={styles.metaValue}>International buyers</p>
            </div>
            <div>
              <span className={styles.metaLabel}>Built around</span>
              <p className={styles.metaValue}>Global safety laws</p>
            </div>
            <div>
              <span className={styles.metaLabel}>Core promise</span>
              <p className={styles.metaValue}>No shortcuts on safety</p>
            </div>
          </div>
        </div>

        {/* RIGHT: “at a glance” card */}
        <aside className={styles.sidePanel} aria-label="At a glance">
          <ul className={styles.stats}>
            <li>
              <span className={styles.statLabel}>Location</span>
              <p className={styles.statValue}>Kerala, India</p>
            </li>
            <li>
              <span className={styles.statLabel}>Focus</span>
              <p className={styles.statValue}>Frozen &amp; ready-to-cook foods</p>
            </li>
            <li>
              <span className={styles.statLabel}>Built for</span>
              <p className={styles.statValue}>Export buyers &amp; audits</p>
            </li>
          </ul>

          <p className={styles.note}>
            The same mindset runs through everything we do: if we say a check happens, you should be
            able to see when, how and by whom it was done.
          </p>
        </aside>
      </div>
    </section>
  );
}

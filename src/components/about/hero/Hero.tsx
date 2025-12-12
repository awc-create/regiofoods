// src/components/about/hero/Hero.tsx
import Link from 'next/link';
import styles from './Hero.module.scss';

export default function AboutHero() {
  return (
    <section className={styles.hero} aria-labelledby="about-hero-heading">
      <div className={styles.inner}>
        <p className={styles.eyebrow}>About Regio Foods</p>

        <h1 id="about-hero-heading" className={styles.title}>
          A factory built on discipline,
          <br />
          not shortcuts.
        </h1>

        <p className={styles.lead}>
          Regio Foods was shaped around global food laws and safety regulations – from UK and EU
          standards through to GCC and North American import rules. Instead of treating them as a
          hurdle, we used them to fortify how we hire, train and run the plant every day.
        </p>

        <div className={styles.chips}>
          <span className={styles.chip}>Export-focused manufacturing</span>
          <span className={styles.chip}>Safety &amp; standards first</span>
          <span className={styles.chip}>Transparent, traceable batches</span>
        </div>

        <div className={styles.ctaRow}>
          <Link href="#about-story" className={styles.primaryCta}>
            Our story
          </Link>
          <Link href="#about-pillars" className={styles.secondaryCta}>
            How we&apos;re different
          </Link>
        </div>

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
    </section>
  );
}

import Image from 'next/image';
import styles from './Hero.module.scss';

export default function Hero() {
  return (
    <section className={styles.hero}>
      {/* Media layer (photo or video) */}
      <div className={styles.media}>
        {/* Swap this for a video if you like */}
        <Image
          src="/images/factory/line-overview.jpg"
          alt="Production line at Regio Foods factory"
          fill
          priority
          sizes="100vw"
        />
      </div>

      {/* Overlay tint so text reads clearly */}
      <div className={styles.overlay} />

      {/* Content */}
      <div className={styles.content}>
        <p className={styles.eyebrow}>Factory &amp; Infrastructure</p>

        <h1 className={styles.title}>
          Built for export-grade production,
          <br />
          designed around safety.
        </h1>

        <p className={styles.subtitle}>
          Our plant brings together controlled environments, repeatable processes and documented
          checks – so every batch leaves the factory safe, traceable and ready for international
          markets.
        </p>

        <div className={styles.chips}>
          <span className={styles.chip}>Food safety engineered in</span>
          <span className={styles.chip}>Fire &amp; emergency systems</span>
          <span className={styles.chip}>Cold chain from cook to dispatch</span>
        </div>

        <div className={styles.ctaRow}>
          <a href="#process-overview" className={styles.primaryCta}>
            View process overview
          </a>
          <a href="#safety-standards" className={styles.secondaryCta}>
            Safety &amp; compliance standards
          </a>
        </div>

        <div className={styles.meta}>
          <p>Single-site facility in Kerala, purpose-built for frozen foods.</p>
          <p>Layouts, flows and controls planned for export customers first.</p>
        </div>
      </div>
    </section>
  );
}

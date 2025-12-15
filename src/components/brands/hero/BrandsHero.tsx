import Image from 'next/image';
import Link from 'next/link';
import styles from './BrandsHero.module.scss';

export default function BrandsHero() {
  return (
    <section className={styles.hero} aria-labelledby="brands-hero-heading">
      <div className={styles.inner}>
        {/* Logo */}
        <div className={styles.logoWrap}>
          <Image
            src="/assets/regiofoods-logo.svg"
            alt="Regio Foods"
            width={220}
            height={72}
            priority={false}
          />
        </div>

        <p className={styles.eyebrow}>Brand structure</p>

        <h1 id="brands-hero-heading" className={styles.title}>
          Manufacturing brands
          <br />
          within the Prince Foods group.
        </h1>

        <p className={styles.lead}>
          Regio Foods is the manufacturing arm of Prince Foods — built to deliver export-ready
          frozen ranges with consistency, compliance, and scale.
        </p>

        <div className={styles.actions}>
          <Link href="/products" className={styles.primary}>
            View product ranges
          </Link>
          <Link href="/contact" className={styles.secondary}>
            Speak to export sales →
          </Link>
        </div>

        <div className={styles.chips} aria-label="Key points">
          <span className={styles.chip}>Prince Foods parent group</span>
          <span className={styles.chip}>Export manufacturing</span>
          <span className={styles.chip}>Frozen South Asian foods</span>
        </div>
      </div>
    </section>
  );
}

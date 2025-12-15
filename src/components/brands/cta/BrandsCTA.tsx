import Link from 'next/link';
import styles from './BrandsCTA.module.scss';

export default function BrandsCTA() {
  return (
    <section className={styles.section} aria-labelledby="brands-cta-heading">
      <div className={styles.inner}>
        <div className={styles.panel}>
          <h2 id="brands-cta-heading" className={styles.heading}>
            Want a brand catalogue for your market?
          </h2>
          <p className={styles.text}>
            We can share product lists, available formats, and the right range for your buyer
            profile.
          </p>

          <div className={styles.actions}>
            <Link href="/contact" className={styles.primary}>
              Request catalogue
            </Link>
            <Link href="/products" className={styles.secondary}>
              Browse products →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

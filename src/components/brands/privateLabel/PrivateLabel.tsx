import Link from 'next/link';
import styles from './PrivateLabel.module.scss';

export default function PrivateLabel() {
  return (
    <section className={styles.section} aria-labelledby="private-label-heading">
      <div className={styles.inner}>
        <div className={styles.card}>
          <div className={styles.copy}>
            <p className={styles.eyebrow}>Private label</p>
            <h2 id="private-label-heading" className={styles.heading}>
              Custom ranges for selected buyers.
            </h2>
            <p className={styles.text}>
              In addition to our named ranges, we manufacture private-label products for selected
              distributors and retail programmes. Specifications, pack formats and artwork can be
              tailored per market.
            </p>

            <div className={styles.points} aria-label="Private label capabilities">
              <span className={styles.point}>Specs aligned to buyer requirement</span>
              <span className={styles.point}>Market-specific declarations</span>
              <span className={styles.point}>Export-friendly case formats</span>
            </div>
          </div>

          <div className={styles.actions}>
            <Link href="/contact" className={styles.primary}>
              Request a catalogue
            </Link>
            <Link href="/products" className={styles.secondary}>
              View the range →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

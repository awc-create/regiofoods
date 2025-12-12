import styles from './Contact.module.scss';

export default function Contact() {
  return (
    <section id="about-contact" className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>Next steps</p>
          <h2 className={styles.heading}>Ready to talk about products or capacity?</h2>
          <p className={styles.subheading}>
            Whether you’re a buyer, distributor or partner, we’re happy to walk you through the
            factory, discuss volumes or explore new product ideas.
          </p>
        </div>

        <div className={styles.actionsBlock}>
          <div className={styles.actions}>
            <a href="/contact" className={styles.primaryCta}>
              Get in touch
            </a>
            <a href="/factory" className={styles.secondaryCta}>
              Explore the factory
            </a>
          </div>
          <p className={styles.hint}>
            We aim to respond to serious enquiries within one working day.
          </p>
        </div>
      </div>
    </section>
  );
}

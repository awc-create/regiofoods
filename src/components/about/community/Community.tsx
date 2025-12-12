import styles from './Community.module.scss';

export default function Community() {
  return (
    <section id="community" className={styles.section} aria-labelledby="community-heading">
      <div className={styles.inner}>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>Community & responsibility</p>
          <h2 id="community-heading" className={styles.heading}>
            Growth that respects people and place.
          </h2>

          <div className={styles.chips}>
            <span>Local jobs</span>
            <span>Safer workplaces</span>
            <span>Cleaner operations</span>
          </div>

          <p className={styles.lead}>
            We believe a factory should add value to its region – not just move pallets through it.
          </p>

          <div className={styles.bodyStack}>
            <p className={styles.body}>
              That means steady employment, safe conditions and training that helps people grow with
              the business. It also means thinking about energy use, waste and how we handle the
              products we make, from raw intake to loaded trucks.
            </p>

            <p className={styles.body}>
              As the site expands, we plan to deepen local partnerships, support staff development
              and invest in improvements that make the factory cleaner, safer and more efficient
              over time.
            </p>
          </div>
        </div>

        <ul className={styles.list} aria-label="How the factory supports the community">
          <li className={styles.listItem}>
            <div className={styles.dot} aria-hidden="true" />
            <div className={styles.listText}>
              <h3>Local employment</h3>
              <p>Creating stable roles with clear responsibilities and training.</p>
            </div>
          </li>
          <li className={styles.listItem}>
            <div className={styles.dot} aria-hidden="true" />
            <div className={styles.listText}>
              <h3>Safer workplaces</h3>
              <p>Protecting staff through design, PPE, training and procedures.</p>
            </div>
          </li>
          <li className={styles.listItem}>
            <div className={styles.dot} aria-hidden="true" />
            <div className={styles.listText}>
              <h3>Efficient operations</h3>
              <p>Reducing waste and using equipment and cold stores responsibly.</p>
            </div>
          </li>
        </ul>
      </div>
    </section>
  );
}

import styles from './ProductsHero.module.scss';

export default function ProductsHero() {
  return (
    <section id="products-hero" className={styles.section}>
      <div className={styles.inner}>
        {/* LEFT SIDE */}
        <div className={styles.copy}>
          <p className={styles.eyebrow}>Product range</p>

          <h1 className={styles.heading}>Frozen ready-to-cook foods, built for export shelves.</h1>

          <p className={styles.lead}>
            Layered parottas, appams, snacks and curries produced in a controlled environment. Each
            SKU is specced and labelled so buyers can drop them straight into their own systems.
          </p>

          <div className={styles.chips}>
            <span className={styles.chip}>South Indian frozen breads</span>
            <span className={styles.chip}>Heat-and-serve curries</span>
            <span className={styles.chip}>Retail & food-service packs</span>
          </div>

          <div className={styles.metaRow}>
            <div>
              <span className={styles.metaLabel}>Formats</span>
              <p className={styles.metaValue}>Retail sleeves & bulk bags</p>
            </div>
            <div>
              <span className={styles.metaLabel}>Target</span>
              <p className={styles.metaValue}>Export buyers & distributors</p>
            </div>
            <div>
              <span className={styles.metaLabel}>Support</span>
              <p className={styles.metaValue}>Specs, artwork & COAs</p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <aside className={styles.sideCard}>
          <p className={styles.sideEyebrow}>At a glance</p>

          <dl className={styles.stats}>
            <div>
              <dt>Core categories</dt>
              <dd>Parottas, appams, snacks, curries</dd>
            </div>
            <div>
              <dt>Pack sizes</dt>
              <dd>Retail 300–900 g, food-service multi-kg</dd>
            </div>
            <div>
              <dt>Labelling</dt>
              <dd>Export-ready, multi-language</dd>
            </div>
            <div>
              <dt>Support files</dt>
              <dd>Specs, allergens, COAs</dd>
            </div>
          </dl>

          <p className={styles.sideNote}>
            For a full spec sheet or private-label options, share your target market and we’ll send
            relevant pack details.
          </p>
        </aside>
      </div>
    </section>
  );
}

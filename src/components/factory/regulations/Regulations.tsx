// src/components/factory/regulations/Regulations.tsx
import styles from './Regulations.module.scss';

export default function Regulations() {
  return (
    <section
      id="safety-standards"
      className={styles.section}
      aria-labelledby="factory-standards-heading"
    >
      <div className={styles.inner}>
        {/* Left column: copy */}
        <div className={styles.copy}>
          <p className={styles.eyebrow}>Safety, Quality & Compliance</p>

          <h2 id="factory-standards-heading" className={styles.heading}>
            Infrastructure built around the rules that matter.
          </h2>

          <p className={styles.lead}>
            Our factory was planned backwards from export requirements: food-safety frameworks, fire
            regulations, occupational health, and the documentation auditors expect to see when they
            walk in.
          </p>

          <ul className={styles.points}>
            <li>
              <span className={styles.bullet} />
              <div>
                <h3>Food safety & hygiene controls</h3>
                <p>
                  Zoning between raw, cooked and packing areas, dedicated handwash and PPE points,
                  and cleaning routines documented by shift.
                </p>
              </div>
            </li>

            <li>
              <span className={styles.bullet} />
              <div>
                <h3>Fire safety & emergency readiness</h3>
                <p>
                  Extinguishers, alarms and escape routes planned into the building layout, with
                  regular checks and staff briefings.
                </p>
              </div>
            </li>

            <li>
              <span className={styles.bullet} />
              <div>
                <h3>People, training & record-keeping</h3>
                <p>
                  Induction for new staff, refreshers for existing teams, and simple logbooks so we
                  can prove what was done, not just say it.
                </p>
              </div>
            </li>
          </ul>
        </div>

        {/* Right column: badges / summary */}
        <aside className={styles.panel} aria-label="Factory standards summary">
          <p className={styles.panelTitle}>What buyers care about, covered.</p>

          <div className={styles.badges}>
            <div className={styles.badge}>
              <span className={styles.badgeLabel}>Food safety</span>
              <p>Process flows aligned with HACCP-style principles.</p>
            </div>
            <div className={styles.badge}>
              <span className={styles.badgeLabel}>Fire & safety</span>
              <p>Premises planned with extinguishers, alarms and exits.</p>
            </div>
            <div className={styles.badge}>
              <span className={styles.badgeLabel}>Worker welfare</span>
              <p>PPE, rest areas and clear rules for safe working.</p>
            </div>
            <div className={styles.badge}>
              <span className={styles.badgeLabel}>Documentation</span>
              <p>Checklists and records that keep audits predictable.</p>
            </div>
          </div>

          <p className={styles.footerNote}>
            As the factory grows, this section can link to specific certifications and downloadable
            policies.
          </p>
        </aside>
      </div>
    </section>
  );
}

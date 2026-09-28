import Lines from '@/components/common/Lines';
import type { aboutCta } from '@/content/sections/about';
import styles from './Contact.module.scss';

type Props = { content: typeof aboutCta.defaults };

export default function Contact({ content: c }: Props) {
  return (
    <section id="about-contact" className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.copy}>
          {c.eyebrow && <p className={styles.eyebrow}>{c.eyebrow}</p>}
          <h2 className={styles.heading}>
            <Lines text={c.heading} />
          </h2>
          {c.intro && <p className={styles.subheading}>{c.intro}</p>}
        </div>

        <div className={styles.actionsBlock}>
          <div className={styles.actions}>
            {c.primaryCta.label && (
              <a href={c.primaryCta.href || '#'} className={styles.primaryCta}>
                {c.primaryCta.label}
              </a>
            )}
            {c.secondaryCta.label && (
              <a href={c.secondaryCta.href || '#'} className={styles.secondaryCta}>
                {c.secondaryCta.label}
              </a>
            )}
          </div>
          {c.hint && <p className={styles.hint}>{c.hint}</p>}
        </div>
      </div>
    </section>
  );
}

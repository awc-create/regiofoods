import Lines from '@/components/common/Lines';
import type { aboutCommunity } from '@/content/sections/about';
import styles from './Community.module.scss';

type Props = { content: typeof aboutCommunity.defaults };

export default function Community({ content: c }: Props) {
  return (
    <section id="community" className={styles.section} aria-labelledby="community-heading">
      <div className={styles.inner}>
        <div className={styles.copy}>
          {c.eyebrow && <p className={styles.eyebrow}>{c.eyebrow}</p>}
          <h2 id="community-heading" className={styles.heading}>
            <Lines text={c.heading} />
          </h2>

          {c.chips.length > 0 && (
            <div className={styles.chips}>
              {c.chips.map((chip) => (
                <span key={chip}>{chip}</span>
              ))}
            </div>
          )}

          {c.intro && <p className={styles.lead}>{c.intro}</p>}

          <div className={styles.bodyStack}>
            {c.paragraphs.map((p, i) => (
              <p key={i} className={styles.body}>
                {p}
              </p>
            ))}
          </div>
        </div>

        <ul className={styles.list} aria-label="How the factory supports the community">
          {c.items.map((item, i) => (
            <li key={`${item.title}-${i}`} className={styles.listItem}>
              <div className={styles.dot} aria-hidden="true" />
              <div className={styles.listText}>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

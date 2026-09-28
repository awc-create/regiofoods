import RichText from '@/components/common/RichText';
import styles from './LegalPage.module.scss';

export default function LegalPage({ title, body }: { title: string; body: string }) {
  return (
    <section className={styles.page}>
      <div className={styles.wrapper}>
        <h1>{title}</h1>
        <RichText text={body} />
      </div>
    </section>
  );
}

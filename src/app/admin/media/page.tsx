import MediaGrid from '@/components/admin/media/MediaGrid';
import styles from '@/components/admin/common/Page.module.scss';

export const metadata = { title: 'Media library' };

export default function MediaPage() {
  return (
    <div className={styles.page}>
      <div className={styles.pageHead}>
        <div>
          <h1>Media library</h1>
          <p>
            Every photo and logo uploaded to the website. Upload sharp, high-resolution photos — the
            website automatically resizes them for phones and computers.
          </p>
        </div>
      </div>
      <MediaGrid />
    </div>
  );
}

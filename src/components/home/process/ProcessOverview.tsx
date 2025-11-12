'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Icon } from '@iconify/react';
import styles from './ProcessOverview.module.scss';

type ItemBase = {
  title: string;
  description: string;
  href?: string;
};

type IconItem = ItemBase & { icon: string; photo?: never };
type PhotoItem = ItemBase & { photo: string; icon?: never };

type Props =
  | {
      variant: 'icons';
      heading: string;
      subheading?: string;
      items: IconItem[]; // exactly 3 is ideal, but grid is flexible
      cta?: { label: string; href: string };
      className?: string;
    }
  | {
      variant: 'photos';
      heading: string;
      subheading?: string;
      items: PhotoItem[];
      cta?: { label: string; href: string };
      className?: string;
    };

export default function ProcessOverview({
  variant,
  heading,
  subheading,
  items,
  cta,
  className,
}: Props) {
  return (
    <section className={`${styles.section} ${className ?? ''}`}>
      <div className={styles.header}>
        <h2 className={styles.heading}>{heading}</h2>
        {subheading ? <p className={styles.subheading}>{subheading}</p> : null}
      </div>

      <div className={`${styles.grid} ${variant === 'photos' ? styles.photos : styles.icons}`}>
        {items.map((item, i) => {
          const key = `${item.title}-${i}`;

          if (variant === 'icons') {
            const iconItem = item as IconItem;
            return (
              <article className={styles.card} key={key}>
                <div className={styles.iconWrap} aria-hidden="true">
                  <Icon icon={iconItem.icon} />
                </div>
                <h3 className={styles.cardTitle}>{iconItem.title}</h3>
                <p className={styles.cardDesc}>{iconItem.description}</p>
                {iconItem.href ? (
                  <Link className={styles.cardLink} href={iconItem.href}>
                    Learn more →
                  </Link>
                ) : null}
              </article>
            );
          }

          // photos variant
          const photoItem = item as PhotoItem;
          return (
            <article className={`${styles.card} ${styles.cardPhoto}`} key={key}>
              <div className={styles.photoWrap} aria-hidden="true">
                <Image
                  src={photoItem.photo}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  priority={i < 2}
                />
                <div className={styles.photoOverlay} />
              </div>

              <div className={styles.cardBody}>
                <h3 className={styles.cardTitle}>{photoItem.title}</h3>
                <p className={styles.cardDesc}>{photoItem.description}</p>
                {photoItem.href ? (
                  <Link className={styles.cardLink} href={photoItem.href}>
                    Learn more →
                  </Link>
                ) : null}
              </div>
            </article>
          );
        })}
      </div>

      {cta ? (
        <div className={styles.ctaRow}>
          <Link href={cta.href} className={styles.ctaButton}>
            {cta.label}
          </Link>
        </div>
      ) : null}
    </section>
  );
}

'use client';

import React from 'react';
import Image from 'next/image';
import styles from './BrandCarousel.module.scss';
import { motion, useReducedMotion } from 'framer-motion';

type Props = {
  brands: CarouselBrand[];
  title?: string;
  subtitle?: string;
  speedSeconds?: number; // lower = faster
  className?: string;
};

export type CarouselBrand = {
  name: string;
  logo: string;
  website?: string;
  scale?: number; // optical correction
};

type CSSVars = React.CSSProperties & {
  '--speed'?: string;
};

export default function BrandCarousel({
  brands,
  title = 'Brands in the Prince Foods group',
  subtitle = 'Named ranges manufactured and supplied across the portfolio.',
  speedSeconds = 22,
  className,
}: Props) {
  const reduceMotion = useReducedMotion();
  const styleVars: CSSVars = { '--speed': `${speedSeconds}s` };

  const renderItem = (b: CarouselBrand, key: string) => {
    const scale = b.scale ?? 1;

    const Logo = (
      <motion.div
        className={styles.logo}
        whileHover={
          reduceMotion ? undefined : b.website ? { y: -4, scale: 1.02 } : { y: -2, scale: 1.01 }
        }
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      >
        {/* ✅ scale wrapper so it ALWAYS works */}
        <span className={styles.mark} style={{ ['--s' as never]: scale }}>
          <Image
            src={b.logo}
            alt={b.name}
            width={640}
            height={240}
            className={styles.logoImg}
            sizes="(max-width: 640px) 70vw, (max-width: 1024px) 42vw, 26vw"
            priority={false}
          />
        </span>
      </motion.div>
    );

    return b.website ? (
      <a
        key={key}
        href={b.website}
        target="_blank"
        rel="noreferrer"
        className={styles.logoLink}
        aria-label={`Open ${b.name} website`}
      >
        {Logo}
      </a>
    ) : (
      <div key={key} className={styles.logoWrap} aria-label={b.name}>
        {Logo}
      </div>
    );
  };

  if (brands.length === 0) return null;

  return (
    <motion.section
      className={`${styles.section} ${className ?? ''}`}
      aria-label="Brand carousel"
      initial={reduceMotion ? false : { opacity: 0, y: 10 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
    >
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
      </div>

      <div className={styles.carousel} style={styleVars}>
        {/* Optional soft edge fade (NOT black). Delete both divs if you want none */}
        <div className={styles.fadeLeft} aria-hidden="true" />
        <div className={styles.fadeRight} aria-hidden="true" />

        {/* ✅ TWO sets only. This is the clean infinite loop. */}
        <div className={styles.track} aria-label="Brands">
          <div className={styles.set} role="list">
            {brands.map((b, i) => renderItem(b, `a-${b.name}-${i}`))}
          </div>
          <div className={styles.set} role="list" aria-hidden="true">
            {brands.map((b, i) => renderItem(b, `b-${b.name}-${i}`))}
          </div>
        </div>
      </div>
    </motion.section>
  );
}

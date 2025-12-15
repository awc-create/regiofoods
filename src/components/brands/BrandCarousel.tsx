'use client';

import React from 'react';
import Image from 'next/image';
import styles from './BrandCarousel.module.scss';
import { motion, useReducedMotion } from 'framer-motion';

type Props = {
  title?: string;
  subtitle?: string;
  speedSeconds?: number; // lower = faster
  className?: string;
};

type Brand = {
  name: string;
  logoSrc: string;
  href?: string;
  scale?: number; // optical correction
};

const BRANDS: Brand[] = [
  {
    name: 'Prince Foods',
    logoSrc: '/assets/brands/prince-foods-logo.png',
    href: 'https://prince-foods.com',
    scale: 1.05,
  },
  {
    name: 'Royal Choice',
    logoSrc: '/assets/brands/royal-choice-logo.png',
    scale: 1.35,
  },
  {
    name: 'Seelans',
    logoSrc: '/assets/brands/seelans-logo_1.png',
    href: 'https://seelans.com/',
    scale: 1.1,
  },
  {
    name: 'Keralites',
    logoSrc: '/assets/brands/Keralites-logo.png', // (use your real filename)
    scale: 3, // works now (wrapper scale)
  },
];

type CSSVars = React.CSSProperties & {
  '--speed'?: string;
};

export default function BrandCarousel({
  title = 'Brands in the Prince Foods group',
  subtitle = 'Named ranges manufactured and supplied across the portfolio.',
  speedSeconds = 22,
  className,
}: Props) {
  const reduceMotion = useReducedMotion();
  const styleVars: CSSVars = { '--speed': `${speedSeconds}s` };

  const renderItem = (b: Brand, key: string) => {
    const scale = b.scale ?? 1;

    const Logo = (
      <motion.div
        className={styles.logo}
        whileHover={
          reduceMotion ? undefined : b.href ? { y: -4, scale: 1.02 } : { y: -2, scale: 1.01 }
        }
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      >
        {/* ✅ scale wrapper so it ALWAYS works */}
        <span className={styles.mark} style={{ ['--s' as never]: scale }}>
          <Image
            src={b.logoSrc}
            alt={b.name}
            width={640}
            height={240}
            className={styles.logoImg}
            sizes="(max-width: 640px) 70vw, (max-width: 1024px) 42vw, 26vw"
            priority={b.name === 'Prince Foods'}
          />
        </span>
      </motion.div>
    );

    return b.href ? (
      <a
        key={key}
        href={b.href}
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
            {BRANDS.map((b, i) => renderItem(b, `a-${b.name}-${i}`))}
          </div>
          <div className={styles.set} role="list" aria-hidden="true">
            {BRANDS.map((b, i) => renderItem(b, `b-${b.name}-${i}`))}
          </div>
        </div>
      </div>
    </motion.section>
  );
}

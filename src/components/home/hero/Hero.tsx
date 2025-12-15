'use client';

import React from 'react';
import Image from 'next/image';
import Head from 'next/head';
import styles from './Hero.module.scss';

type CTA = {
  label: string;
  href: string;
  variant?: 'primary' | 'ghost';
};

interface HeroMeta {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string; // e.g., "website"
}

type HeroMedia =
  | { kind: 'image'; src: string; alt?: string; preload?: boolean }
  | {
      kind: 'video';
      src: string;
      poster?: string;
      loop?: boolean;
      muted?: boolean;
      playsInline?: boolean;
      preload?: 'auto' | 'metadata' | 'none';
    };

interface Props {
  title: string;
  subtitle?: string;
  eyebrow?: string;

  /** New API */
  media?: HeroMedia;
  ctas?: CTA[];

  /** Back-compat (deprecated) */
  bgSrc?: string;
  ctaPrimary?: { label: string; href: string };
  ctaSecondary?: { label: string; href: string };

  /** Options */
  align?: 'center' | 'left';
  overlay?: 'light' | 'medium' | 'dark';
  scrollTargetId?: string;
  showScrollCue?: boolean;

  /** Optional per-section metadata */
  meta?: HeroMeta;
}

export default function Hero(props: Props) {
  const {
    title,
    subtitle,
    eyebrow,

    media,
    ctas = [],

    bgSrc,
    ctaPrimary,
    ctaSecondary,

    align = 'center',
    overlay = 'medium',
    scrollTargetId,
    showScrollCue = true,

    meta,
  } = props;

  // ---- Back-compat mapping ------------------------------------
  const resolvedMedia: HeroMedia | undefined =
    media ?? (bgSrc ? ({ kind: 'image', src: bgSrc } as const) : undefined);

  const resolvedCtas: CTA[] =
    ctas.length === 0 && (ctaPrimary || ctaSecondary)
      ? [
          ...(ctaPrimary ? [{ ...ctaPrimary, variant: 'primary' as const }] : []),
          ...(ctaSecondary ? [{ ...ctaSecondary, variant: 'ghost' as const }] : []),
        ]
      : ctas;

  const handleScrollClick = () => {
    if (!scrollTargetId) return;
    const el = document.getElementById(scrollTargetId);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Compute classes once
  const heroClass =
    styles.hero +
    ' ' +
    (align === 'left' ? styles.alignLeft : styles.alignCenter) +
    ' ' +
    (overlay === 'dark'
      ? styles.overlayDark
      : overlay === 'light'
        ? styles.overlayLight
        : styles.overlayMedium);

  return (
    <>
      {/* Optional per-hero metadata override */}
      {meta && (
        <Head>
          {meta.title && <title>{meta.title}</title>}
          {meta.description && <meta name="description" content={meta.description} />}

          {/* Open Graph */}
          {meta.title && <meta property="og:title" content={meta.title} />}
          {meta.description && <meta property="og:description" content={meta.description} />}
          {meta.image && <meta property="og:image" content={meta.image} />}
          {meta.url && <meta property="og:url" content={meta.url} />}
          <meta property="og:type" content={meta.type ?? 'website'} />

          {/* Twitter */}
          {meta.title && <meta name="twitter:title" content={meta.title} />}
          {meta.description && <meta name="twitter:description" content={meta.description} />}
          {meta.image && <meta name="twitter:image" content={meta.image} />}
          <meta name="twitter:card" content="summary_large_image" />
        </Head>
      )}

      {/* Optional image preload */}
      {resolvedMedia?.kind === 'image' && resolvedMedia.preload ? (
        <Head>
          <link rel="preload" href={resolvedMedia.src} as="image" />
        </Head>
      ) : null}

      <header className={heroClass} role="banner" aria-label="Section Hero">
        {/* Background media */}
        {resolvedMedia && (
          <div className={styles.media} aria-hidden="true">
            {resolvedMedia.kind === 'image' ? (
              <Image
                src={resolvedMedia.src}
                alt={resolvedMedia.alt ?? ''}
                fill
                sizes="100vw"
                priority={resolvedMedia.preload ?? false}
              />
            ) : (
              <video
                className={styles.bgVideo}
                autoPlay
                muted={resolvedMedia.muted ?? true}
                playsInline={resolvedMedia.playsInline ?? true}
                loop={resolvedMedia.loop ?? true}
                preload={resolvedMedia.preload ?? 'metadata'}
                poster={resolvedMedia.poster}
              >
                <source src={resolvedMedia.src} />
              </video>
            )}
          </div>
        )}

        {/* Gradient overlay */}
        <div className={styles.overlay} />

        {/* Content */}
        <div className={styles.content}>
          {eyebrow && <span className={styles.eyebrow}>{eyebrow}</span>}
          <h1>{title}</h1>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}

          {resolvedCtas.length > 0 && (
            <div className={styles.ctaRow}>
              {resolvedCtas.map((cta) => (
                <a
                  key={`${cta.href}-${cta.label}`}
                  href={cta.href}
                  className={cta.variant === 'ghost' ? styles.secondaryBtn : styles.primaryBtn}
                >
                  {cta.label}
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Scroll cue */}
        {showScrollCue && scrollTargetId && (
          <button
            className={styles.scrollDown}
            aria-label="Scroll to content"
            onClick={handleScrollClick}
            type="button"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M6 9l6 6 6-6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
      </header>
    </>
  );
}

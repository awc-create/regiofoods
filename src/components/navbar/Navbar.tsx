'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Icon } from '@iconify/react';
import { usePathname } from 'next/navigation';
import { motion, useAnimationControls, useReducedMotion } from 'framer-motion';
import styles from './Navbar.module.scss';
import { NAV_LINKS } from '@/config/menu.config';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => setMenuOpen((p) => !p);
  const closeMenu = () => setMenuOpen(false);
  const isLinkActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  // Glass → solid on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 6);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // --- Logo animation controls (no variants -> no TS friction)
  const sheenControls = useAnimationControls();
  const reduceMotion = useReducedMotion();

  const handleLogoHoverStart = () => {
    if (reduceMotion) return;
    sheenControls
      .start({ x: '140%', transition: { duration: 0.9 } })
      .then(() => sheenControls.set({ x: '-130%' }));
  };

  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.inner}>
        {/* Logo */}
        <Link href="/" className={styles.logo} aria-label="Regio Foods">
          <motion.div
            className={styles.logoWrap}
            initial={reduceMotion ? undefined : { opacity: 0, y: 6, scale: 0.98 }}
            animate={
              reduceMotion
                ? undefined
                : { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45 } }
            }
            whileHover={
              reduceMotion ? undefined : { y: -1, scale: 1.01, transition: { duration: 0.15 } }
            }
            onHoverStart={handleLogoHoverStart}
          >
            {/* Keep the file at /public/regiofoods-logo.svg */}
            <Image
              src="/assets/regiofoods-logo.svg"
              alt="Regio Foods"
              width={140}
              height={40}
              priority
              className={styles.logoImg}
            />
            {/* sheen sweep */}
            <motion.span
              className={styles.sheen}
              initial={{ x: '-130%' }}
              animate={sheenControls}
              aria-hidden="true"
            />
          </motion.div>
        </Link>

        {/* Desktop links */}
        <div className={styles.desktopLinks} role="navigation" aria-label="Primary">
          {NAV_LINKS.map(({ slug, label }: { slug: string; label: string }) => {
            const href = `/${slug}`;
            const active = isLinkActive(href);
            return (
              <Link
                key={slug}
                href={href}
                className={`${styles.link} ${active ? styles.active : ''}`}
              >
                <span>{label}</span>
                <i aria-hidden="true" />
              </Link>
            );
          })}
        </div>

        {/* Hamburger */}
        <button
          className={styles.hamburger}
          onClick={toggleMenu}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
        >
          <Icon icon={menuOpen ? 'mdi:close' : 'mdi:menu'} />
        </button>
      </div>

      {/* Mobile menu */}
      <div id="mobile-menu" className={`${styles.mobileMenu} ${menuOpen ? styles.open : ''}`}>
        {NAV_LINKS.map(({ slug, label }: { slug: string; label: string }) => {
          const href = `/${slug}`;
          const active = isLinkActive(href);
          return (
            <Link
              key={slug}
              href={href}
              onClick={closeMenu}
              className={`${styles.mobileLink} ${active ? styles.active : ''}`}
            >
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

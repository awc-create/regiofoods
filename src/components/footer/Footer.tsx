'use client';

import Link from 'next/link';
import { Icon } from '@iconify/react';
import type { siteSettings } from '@/content/sections/pages';
import styles from './Footer.module.scss';

type Props = { site: typeof siteSettings.defaults };

export default function Footer({ site }: Props) {
  const socials = site.socials.filter((s) => s.url);

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <nav className={styles.footerLinks}>
          <Link href="/privacy-policy">Privacy Policy</Link>
          <Link href="/terms-of-service">Terms of Service</Link>
          <Link href="/cookies">Cookie Policy</Link>
          <Link href="/faq">FAQs</Link>
          <Link href="/contact">Contact</Link>
        </nav>

        {socials.length > 0 && (
          <div className={styles.socialIcons}>
            {socials.map((s) => (
              <a
                key={`${s.platform}-${s.url}`}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.platform}
              >
                <Icon icon={s.icon || 'mdi:link-variant'} />
              </a>
            ))}
          </div>
        )}

        <p className={styles.copyright}>
          &copy; {new Date().getFullYear()} {site.copyright || site.siteName}. All rights reserved.
        </p>

        <p className={styles.credit}>
          Website created by{' '}
          <a href="https://adaptiveworks.net" target="_blank" rel="noopener noreferrer">
            AWC
          </a>
        </p>
      </div>
    </footer>
  );
}

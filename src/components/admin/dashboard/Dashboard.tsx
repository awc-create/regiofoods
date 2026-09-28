'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import { getSectionDef, PAGE_GROUPS } from '@/content/registry';
import { timeAgo } from '../common/format';
import styles from '../common/Page.module.scss';

type Stats = {
  products: number;
  hidden: number;
  noImage: number;
  uncategorised: number;
  categories: number;
  media: number;
  unread: number;
  storage: boolean;
  mail: boolean;
  recentEdits: { key: string; updatedAt: string; updatedBy: string | null }[];
  recentMessages: { id: string; name: string; email: string; createdAt: string; read: boolean }[];
};

const QUICK = [
  {
    href: '/admin/products/new',
    icon: 'mdi:plus-box-outline',
    title: 'Add a product',
    text: 'Name, pack sizes and photos',
  },
  {
    href: '/admin/pages/home',
    icon: 'mdi:home-edit-outline',
    title: 'Edit the home page',
    text: 'Banner, sections and photos',
  },
  {
    href: '/admin/media',
    icon: 'mdi:image-plus-outline',
    title: 'Upload photos',
    text: 'Add images to the library',
  },
  {
    href: '/admin/pages/faq',
    icon: 'mdi:frequently-asked-questions',
    title: 'Edit FAQs',
    text: 'Questions and answers',
  },
  {
    href: '/admin/settings',
    icon: 'mdi:phone-outline',
    title: 'Contact details',
    text: 'Email, phone, address, socials',
  },
  {
    href: '/admin/products/import',
    icon: 'mdi:microsoft-excel',
    title: 'Update from a spreadsheet',
    text: 'Export, edit in Excel, import',
  },
];

function sectionName(key: string) {
  const def = getSectionDef(key);
  if (!def) return key;
  const page = PAGE_GROUPS.find((g) => g.key === def.group)?.label ?? 'Settings';
  return `${page} → ${def.label}`;
}

export default function Dashboard() {
  const [s, setS] = useState<Stats | null>(null);

  useEffect(() => {
    fetch('/api/admin/stats', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then(setS)
      .catch(() => null);
  }, []);

  return (
    <div className={`${styles.page} ${styles.stack}`}>
      <div className={styles.pageHead}>
        <div>
          <h1>Welcome back</h1>
          <p>
            Everything on the Regio Foods website can be changed from here. Pick a shortcut or use
            the menu on the left.
          </p>
        </div>
      </div>

      {s && !s.storage && (
        <div className={styles.notice}>
          <Icon icon="mdi:alert-outline" />
          <span>
            Photo uploads are not switched on yet — the image storage bucket still needs to be
            connected on the server. Everything else works.
          </span>
        </div>
      )}

      <div className={styles.stats}>
        <Link href="/admin/products" className={styles.stat}>
          <strong>{s?.products ?? '–'}</strong>
          <span>Products</span>
        </Link>
        <Link href="/admin/products?status=hidden" className={styles.stat}>
          <strong>{s?.hidden ?? '–'}</strong>
          <span>Hidden from website</span>
        </Link>
        <Link
          href="/admin/products?status=noimage"
          className={`${styles.stat} ${s?.noImage ? styles.statAlert : ''}`}
        >
          <strong>{s?.noImage ?? '–'}</strong>
          <span>Products without a photo</span>
        </Link>
        <Link
          href="/admin/enquiries"
          className={`${styles.stat} ${s?.unread ? styles.statAlert : ''}`}
        >
          <strong>{s?.unread ?? '–'}</strong>
          <span>Unread enquiries</span>
        </Link>
        <Link href="/admin/media" className={styles.stat}>
          <strong>{s?.media ?? '–'}</strong>
          <span>Images in library</span>
        </Link>
      </div>

      {s && s.uncategorised > 0 && (
        <div className={styles.notice}>
          <Icon icon="mdi:shape-outline" />
          <span>
            {s.uncategorised} product{s.uncategorised === 1 ? ' has' : 's have'} no category and
            won’t appear on the website.{' '}
            <Link href="/admin/products?category=none">
              <u>Fix now</u>
            </Link>
          </span>
        </div>
      )}

      <div>
        <h2 className={styles.cardTitle}>Shortcuts</h2>
        <div className={styles.quick}>
          {QUICK.map((q) => (
            <Link key={q.href} href={q.href} className={styles.quickLink}>
              <Icon icon={q.icon} />
              <span>
                <strong>{q.title}</strong>
                <small>{q.text}</small>
              </span>
            </Link>
          ))}
        </div>
      </div>

      <div className={styles.twoCol}>
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Latest enquiries</h2>
          {s?.recentMessages.length ? (
            <ul className={styles.list}>
              {s.recentMessages.map((m) => (
                <li key={m.id}>
                  <Link href="/admin/enquiries">
                    {!m.read && <span className={`${styles.pill} ${styles.pillAccent}`}>New</span>}{' '}
                    {m.name}
                  </Link>
                  <span className={styles.muted}>{timeAgo(m.createdAt)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.muted}>No messages yet.</p>
          )}
        </div>
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Recently edited</h2>
          {s?.recentEdits.length ? (
            <ul className={styles.list}>
              {s.recentEdits.map((e) => (
                <li key={e.key}>
                  <span>{sectionName(e.key)}</span>
                  <span className={styles.muted}>{timeAgo(e.updatedAt)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.muted}>
              Nothing edited yet — the website is showing its original wording.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

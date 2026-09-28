'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { Icon } from '@iconify/react';
import { NAV, findNav } from './nav';
import { publicUrl } from '../common/publicUrl';
import styles from './AdminShell.module.scss';

type Me = { email: string; name: string | null };

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? '/admin';
  const [railOpen, setRailOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [me, setMe] = useState<Me | null>(null);
  const [unread, setUnread] = useState(0);

  const current = findNav(pathname);

  useEffect(() => {
    fetch('/api/admin/me', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then(setMe)
      .catch(() => null);
  }, []);

  // Refresh the enquiries badge on navigation and when a message is read.
  useEffect(() => {
    const load = () =>
      fetch('/api/admin/messages?unread=1', { cache: 'no-store' })
        .then((r) => (r.ok ? r.json() : null))
        .then((d) => setUnread(d?.unread ?? 0))
        .catch(() => null);
    load();
    window.addEventListener('admin:messages-changed', load);
    return () => window.removeEventListener('admin:messages-changed', load);
  }, [pathname]);

  const initials = (me?.name || me?.email || 'A')
    .split(/[\s@.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]!.toUpperCase())
    .join('');

  return (
    <div className={styles.app}>
      <header className={styles.topbar}>
        <div className={styles.topLeft}>
          <button
            type="button"
            className={styles.iconBtn}
            aria-label={railOpen ? 'Hide menu' : 'Show menu'}
            onClick={() => {
              if (window.matchMedia('(max-width: 900px)').matches) setMobileOpen((v) => !v);
              else setRailOpen((v) => !v);
            }}
          >
            <Icon icon={railOpen ? 'mdi:backburger' : 'mdi:menu'} />
          </button>

          <Link href="/admin" className={styles.brand}>
            <span className={styles.brandMark}>RF</span>
            <span className={styles.brandText}>Regio Foods</span>
          </Link>

          {current && (
            <nav className={styles.crumbs} aria-label="Breadcrumb">
              <span aria-hidden="true">/</span>
              <strong>{current.label}</strong>
            </nav>
          )}
        </div>

        <div className={styles.topRight}>
          <a
            href={publicUrl('/')}
            target="_blank"
            rel="noreferrer"
            className={styles.viewSite}
            title="Open the website in a new tab"
          >
            <Icon icon="mdi:open-in-new" />
            <span>View website</span>
          </a>

          <div className={styles.user} title={me?.email ?? ''}>
            <span className={styles.avatar}>{initials}</span>
            <span className={styles.userText}>
              <strong>{me?.name || 'Admin'}</strong>
              <small>{me?.email ?? ''}</small>
            </span>
          </div>

          <button
            type="button"
            className={styles.iconBtn}
            aria-label="Sign out"
            title="Sign out"
            onClick={() => signOut({ callbackUrl: '/auth/signin' })}
          >
            <Icon icon="mdi:logout" />
          </button>
        </div>
      </header>

      <div className={`${styles.body} ${railOpen ? '' : styles.railClosed}`}>
        <aside className={`${styles.rail} ${mobileOpen ? styles.mobileOpen : ''}`}>
          <nav className={styles.railNav} aria-label="Admin">
            {NAV.map((group) => (
              <div key={group.title} className={styles.group}>
                {railOpen && <p className={styles.groupTitle}>{group.title}</p>}
                {group.items.map((item) => {
                  const active = current?.href === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`${styles.item} ${active ? styles.active : ''}`}
                      aria-current={active ? 'page' : undefined}
                      title={railOpen ? item.hint : item.label}
                      onClick={() => setMobileOpen(false)}
                    >
                      <Icon icon={item.icon} className={styles.itemIcon} />
                      {railOpen && <span className={styles.itemLabel}>{item.label}</span>}
                      {item.badge === 'unread' && unread > 0 && (
                        <span className={styles.badge}>{unread}</span>
                      )}
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>
        </aside>

        {mobileOpen && (
          <button
            type="button"
            className={styles.scrim}
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
          />
        )}

        <main className={styles.main}>{children}</main>
      </div>
    </div>
  );
}

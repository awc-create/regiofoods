'use client';

import { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import { timeAgo } from '../common/format';
import styles from '../common/Page.module.scss';
import own from './Enquiries.module.scss';

type Msg = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  message: string;
  source: string;
  read: boolean;
  createdAt: string;
};

export default function Enquiries() {
  const [items, setItems] = useState<Msg[] | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);

  const load = () =>
    fetch('/api/admin/messages', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => setItems(d.items ?? []));

  useEffect(() => {
    void load();
  }, []);

  const changed = () => window.dispatchEvent(new Event('admin:messages-changed'));

  async function setRead(m: Msg, read: boolean) {
    await fetch(`/api/admin/messages/${m.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ read }),
    });
    setItems((prev) => prev?.map((x) => (x.id === m.id ? { ...x, read } : x)) ?? null);
    changed();
  }

  async function remove(m: Msg) {
    if (!confirm(`Delete the message from ${m.name}?`)) return;
    await fetch(`/api/admin/messages/${m.id}`, { method: 'DELETE' });
    setItems((prev) => prev?.filter((x) => x.id !== m.id) ?? null);
    changed();
  }

  function open(m: Msg) {
    setOpenId(openId === m.id ? null : m.id);
    if (!m.read) void setRead(m, true);
  }

  return (
    <div className={`${styles.page} ${styles.narrow}`}>
      <div className={styles.pageHead}>
        <div>
          <h1>Enquiries</h1>
          <p>
            Messages sent from the contact forms on the website. Click a message to read it and
            reply by email.
          </p>
        </div>
      </div>

      {items === null ? (
        <div className={styles.card}>Loading…</div>
      ) : items.length === 0 ? (
        <div className={`${styles.card} ${styles.empty}`}>No messages yet.</div>
      ) : (
        <div className={own.list}>
          {items.map((m) => {
            const isOpen = openId === m.id;
            return (
              <article key={m.id} className={`${own.item} ${m.read ? '' : own.unread}`}>
                <button
                  type="button"
                  className={own.head}
                  onClick={() => open(m)}
                  aria-expanded={isOpen}
                >
                  <span className={own.dot} aria-hidden="true" />
                  <span className={own.who}>
                    <strong>{m.name}</strong>
                    <small>
                      {m.company ? `${m.company} · ` : ''}
                      {m.email}
                    </small>
                  </span>
                  <span className={own.preview}>{m.message}</span>
                  <span className={own.when}>{timeAgo(m.createdAt)}</span>
                </button>
                {isOpen && (
                  <div className={own.body}>
                    <p className={own.message}>{m.message}</p>
                    <dl className={own.meta}>
                      <dt>Email</dt>
                      <dd>{m.email}</dd>
                      {m.phone && (
                        <>
                          <dt>Phone</dt>
                          <dd>{m.phone}</dd>
                        </>
                      )}
                      <dt>Sent from</dt>
                      <dd>{m.source === 'home' ? 'Home page form' : 'Contact page'}</dd>
                      <dt>Received</dt>
                      <dd>{new Date(m.createdAt).toLocaleString('en-GB')}</dd>
                    </dl>
                    <div className={styles.headActions}>
                      <a
                        className={styles.primaryBtn}
                        href={`mailto:${m.email}?subject=${encodeURIComponent('Re: your enquiry to Regio Foods')}`}
                      >
                        <Icon icon="mdi:reply" /> Reply by email
                      </a>
                      <button
                        type="button"
                        className={styles.ghostBtn}
                        onClick={() => void setRead(m, false)}
                      >
                        Mark as unread
                      </button>
                      <button
                        type="button"
                        className={styles.dangerBtn}
                        onClick={() => void remove(m)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

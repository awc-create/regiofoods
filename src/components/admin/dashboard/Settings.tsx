'use client';

import { useEffect, useState } from 'react';
import { siteSettings } from '@/content/sections/pages';
import SectionEditor from '../editor/SectionEditor';
import { timeAgo } from '../common/format';
import styles from '../common/Page.module.scss';
import tabs from '../editor/Editor.module.scss';

type Tab = 'site' | 'account' | 'users';
type User = { id: string; email: string; name: string | null; createdAt: string };

export default function Settings() {
  const [tab, setTab] = useState<Tab>('site');

  return (
    <div className={styles.page}>
      <div className={styles.pageHead}>
        <div>
          <h1>Settings</h1>
          <p>
            Company details shown across the website, your password, and who can use this admin.
          </p>
        </div>
      </div>

      <nav className={tabs.tabs} role="tablist">
        {(
          [
            ['site', 'Site settings'],
            ['account', 'Your account'],
            ['users', 'Admin users'],
          ] as [Tab, string][]
        ).map(([k, label]) => (
          <button
            key={k}
            type="button"
            role="tab"
            aria-selected={tab === k}
            className={`${tabs.tab} ${tab === k ? tabs.tabActive : ''}`}
            onClick={() => setTab(k)}
          >
            {label}
          </button>
        ))}
      </nav>

      {tab === 'site' && <SectionEditor def={siteSettings as never} viewHref="/contact" />}
      {tab === 'account' && <Account />}
      {tab === 'users' && <Users />}
    </div>
  );
}

function Account() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [nameMsg, setNameMsg] = useState<string | null>(null);
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [pwMsg, setPwMsg] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    fetch('/api/admin/me')
      .then((r) => r.json())
      .then((u) => {
        setName(u?.name ?? '');
        setEmail(u?.email ?? '');
      });
  }, []);

  async function saveName() {
    const res = await fetch('/api/admin/me', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    setNameMsg(res.ok ? 'Saved.' : 'Could not save.');
  }

  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    if (next !== confirmPw) {
      setPwMsg({ ok: false, text: 'The two new passwords do not match.' });
      return;
    }
    const res = await fetch('/api/admin/password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ current, next }),
    });
    const json = await res.json().catch(() => ({}));
    if (res.ok) {
      setPwMsg({ ok: true, text: 'Password changed.' });
      setCurrent('');
      setNext('');
      setConfirmPw('');
    } else {
      setPwMsg({ ok: false, text: json.error || 'Could not change the password.' });
    }
  }

  return (
    <div className={styles.twoCol}>
      <div className={styles.card}>
        <h2 className={styles.cardTitle}>Your details</h2>
        <div className={styles.stack}>
          <label className={styles.field}>
            <span className={styles.label}>Email (used to sign in)</span>
            <input className={styles.input} value={email} disabled />
          </label>
          <label className={styles.field}>
            <span className={styles.label}>Name</span>
            <input
              className={styles.input}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <div className={styles.headActions}>
            <button type="button" className={styles.primaryBtn} onClick={() => void saveName()}>
              Save name
            </button>
            {nameMsg && <span className={styles.muted}>{nameMsg}</span>}
          </div>
        </div>
      </div>

      <form className={styles.card} onSubmit={changePassword}>
        <h2 className={styles.cardTitle}>Change password</h2>
        <div className={styles.stack}>
          <label className={styles.field}>
            <span className={styles.label}>Current password</span>
            <input
              className={styles.input}
              type="password"
              autoComplete="current-password"
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
              required
            />
          </label>
          <label className={styles.field}>
            <span className={styles.label}>New password</span>
            <input
              className={styles.input}
              type="password"
              autoComplete="new-password"
              minLength={10}
              value={next}
              onChange={(e) => setNext(e.target.value)}
              required
            />
            <small className={styles.help}>At least 10 characters.</small>
          </label>
          <label className={styles.field}>
            <span className={styles.label}>New password again</span>
            <input
              className={styles.input}
              type="password"
              autoComplete="new-password"
              value={confirmPw}
              onChange={(e) => setConfirmPw(e.target.value)}
              required
            />
          </label>
          {pwMsg && (
            <div className={`${styles.notice} ${pwMsg.ok ? styles.success : styles.errorBox}`}>
              {pwMsg.text}
            </div>
          )}
          <div>
            <button type="submit" className={styles.primaryBtn}>
              Change password
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [form, setForm] = useState({ email: '', name: '', password: '' });
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const load = () =>
    fetch('/api/admin/users')
      .then((r) => r.json())
      .then((d) => setUsers(d.items ?? []));

  useEffect(() => {
    void load();
  }, []);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const json = await res.json().catch(() => ({}));
    if (res.ok) {
      setMsg({
        ok: true,
        text: `${form.email} can now sign in. Share the password with them securely.`,
      });
      setForm({ email: '', name: '', password: '' });
      void load();
    } else {
      setMsg({ ok: false, text: json.error || 'Could not add the user.' });
    }
  }

  async function remove(u: User) {
    if (!confirm(`Remove ${u.email}? They will no longer be able to sign in.`)) return;
    const res = await fetch(`/api/admin/users/${u.id}`, { method: 'DELETE' });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) alert(json.error || 'Could not remove the user.');
    void load();
  }

  return (
    <div className={styles.twoCol}>
      <div className={styles.card}>
        <h2 className={styles.cardTitle}>People who can sign in</h2>
        <ul className={styles.list}>
          {users.map((u) => (
            <li key={u.id}>
              <span>
                <strong>{u.name || u.email}</strong>
                <br />
                <small className={styles.muted}>
                  {u.email} · added {timeAgo(u.createdAt)}
                </small>
              </span>
              <button type="button" className={styles.dangerBtn} onClick={() => void remove(u)}>
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>

      <form className={styles.card} onSubmit={add}>
        <h2 className={styles.cardTitle}>Add a person</h2>
        <div className={styles.stack}>
          <label className={styles.field}>
            <span className={styles.label}>Email</span>
            <input
              className={styles.input}
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </label>
          <label className={styles.field}>
            <span className={styles.label}>Name</span>
            <input
              className={styles.input}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </label>
          <label className={styles.field}>
            <span className={styles.label}>Temporary password</span>
            <input
              className={styles.input}
              type="text"
              minLength={10}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
            <small className={styles.help}>
              At least 10 characters. They can change it under “Your account”.
            </small>
          </label>
          {msg && (
            <div className={`${styles.notice} ${msg.ok ? styles.success : styles.errorBox}`}>
              {msg.text}
            </div>
          )}
          <div>
            <button type="submit" className={styles.primaryBtn}>
              Add person
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

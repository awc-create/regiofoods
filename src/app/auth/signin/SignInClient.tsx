'use client';

import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import styles from './SignIn.module.scss';

export default function SignInClient() {
  const router = useRouter();
  const sp = useSearchParams();
  const callbackUrl = useMemo(() => {
    const cb = sp.get('callbackUrl') ?? '/admin';
    return cb.startsWith('/') ? cb : '/admin';
  }, [sp]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [err, setErr] = useState<string | null>(
    sp.get('error') === 'forbidden' ? 'This account does not have admin access.' : null
  );
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);

    try {
      const csrfRes = await fetch('/api/auth/csrf');
      const { csrfToken } = await csrfRes.json();

      const res = await fetch('/api/auth/callback/credentials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ email, password, csrfToken, callbackUrl, json: 'true' }),
      });
      const data = await res.json().catch(() => ({}));
      setLoading(false);

      if (!res.ok || data.error || String(data.url ?? '').includes('error=')) {
        setErr('Email or password is not correct.');
        return;
      }

      router.replace(callbackUrl);
      router.refresh();
    } catch {
      setLoading(false);
      setErr('Something went wrong. Please try again.');
    }
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.card}>
        <div className={styles.header}>
          <Image
            src="/assets/regiofoods-logo.svg"
            alt="Regio Foods"
            width={150}
            height={50}
            priority
          />
          <h1 className={styles.title}>Website admin</h1>
          <p className={styles.sub}>Sign in to update products, photos and page text.</p>
        </div>

        <form className={styles.form} onSubmit={onSubmit}>
          <label className={styles.field}>
            <span className={styles.label}>Email</span>
            <input
              className={styles.input}
              type="email"
              value={email}
              autoComplete="email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label className={styles.field}>
            <span className={styles.label}>Password</span>
            <span className={styles.passwordRow}>
              <input
                className={styles.input}
                type={showPw ? 'text' : 'password'}
                value={password}
                autoComplete="current-password"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button type="button" className={styles.toggle} onClick={() => setShowPw((v) => !v)}>
                {showPw ? 'Hide' : 'Show'}
              </button>
            </span>
          </label>

          {err && <div className={styles.error}>{err}</div>}

          <button className={styles.primary} type="submit" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className={styles.foot}>
          Forgot your password? Ask another admin to add you again, or contact AWC.
        </p>
      </div>
    </div>
  );
}

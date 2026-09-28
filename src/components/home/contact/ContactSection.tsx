'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './ContactSection.module.scss';
import { Icon } from '@iconify/react';
import type { siteSettings } from '@/content/sections/pages';

interface Props {
  heading?: string;
  subheading?: string;
  showForm?: boolean;
  site: typeof siteSettings.defaults;
  submitLabel?: string;
  successMessage?: string;
  /** Used on the Contact page: h1 heading + room for the fixed navbar. */
  pageMode?: boolean;
  source?: string;
}

type Status = 'idle' | 'sending' | 'sent' | 'error';

export default function ContactSection({
  heading = 'Get in Touch',
  subheading = 'We’re always open to new partnerships, distributor inquiries, and export collaborations.',
  showForm = true,
  site,
  submitLabel = 'Send Message',
  successMessage = 'Thank you — your message has been sent.',
  pageMode = false,
  source = 'home',
}: Props) {
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');
  const messageRef = useRef<HTMLTextAreaElement>(null);

  // Arriving from a product page (?product=…): start the message for them.
  useEffect(() => {
    const product = new URLSearchParams(window.location.search).get('product');
    if (product && messageRef.current && !messageRef.current.value) {
      messageRef.current.value = `Hello, I would like more information about ${product.slice(0, 200)}.`;
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setStatus('sending');
    setError('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, source }),
      });
      const json = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(json.error || 'Something went wrong. Please try again.');
      setStatus('sent');
      form.reset();
    } catch (err) {
      setStatus('error');
      setError((err as Error).message);
    }
  };

  const phoneHref = site.phone ? `tel:${site.phone.replace(/[^+\d]/g, '')}` : '';
  const socials = site.socials.filter((s) => s.url);
  const Heading = pageMode ? 'h1' : 'h2';

  return (
    <section className={`${styles.section} ${pageMode ? styles.pageMode : ''}`} id="contact">
      <div className={styles.container}>
        <div className={styles.infoPane}>
          <Heading className={styles.heading}>{heading}</Heading>
          {subheading && <p className={styles.subheading}>{subheading}</p>}

          <ul className={styles.contactList}>
            {site.email && (
              <li>
                <Icon icon="mdi:email-outline" />
                <a href={`mailto:${site.email}`}>{site.email}</a>
              </li>
            )}
            {site.phone && (
              <li>
                <Icon icon="mdi:phone-outline" />
                <a href={phoneHref}>{site.phone}</a>
              </li>
            )}
            {site.address && (
              <li>
                <Icon icon="mdi:map-marker-outline" />
                <span>{site.address}</span>
              </li>
            )}
          </ul>

          {socials.length > 0 && (
            <div className={styles.socials}>
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
        </div>

        {showForm && (
          <form className={styles.formPane} onSubmit={handleSubmit}>
            {status === 'sent' ? (
              <p className={styles.success} role="status">
                {successMessage}
              </p>
            ) : (
              <>
                <label>
                  Name
                  <input type="text" name="name" required maxLength={200} />
                </label>
                <label>
                  Email
                  <input type="email" name="email" required maxLength={200} />
                </label>
                <label>
                  Company <small>(optional)</small>
                  <input type="text" name="company" maxLength={200} />
                </label>
                <label>
                  Message
                  <textarea ref={messageRef} name="message" rows={4} required maxLength={5000} />
                </label>

                {/* Spam trap: hidden from people, filled in by bots. */}
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  className={styles.trap}
                  aria-hidden="true"
                />

                {status === 'error' && (
                  <p className={styles.error} role="alert">
                    {error}
                  </p>
                )}

                <button type="submit" className={styles.submitBtn} disabled={status === 'sending'}>
                  {status === 'sending' ? 'Sending…' : submitLabel}
                </button>
              </>
            )}
          </form>
        )}
      </div>
    </section>
  );
}

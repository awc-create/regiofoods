'use client';

import { useState } from 'react';
import styles from './ContactSection.module.scss';
import { Icon } from '@iconify/react';

interface Props {
  heading?: string;
  subheading?: string;
  showForm?: boolean;
}

export default function ContactSection({
  heading = 'Get in Touch',
  subheading = 'We’re always open to new partnerships, distributor inquiries, and export collaborations.',
  showForm = true,
}: Props) {
  const [status, setStatus] = useState<'idle' | 'sent' | 'error'>('idle');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // replace later with fetch("/api/contact", { method:"POST", body:... })
    setTimeout(() => setStatus('sent'), 800);
  };

  return (
    <section className={styles.section} id="contact">
      <div className={styles.container}>
        <div className={styles.infoPane}>
          <h2 className={styles.heading}>{heading}</h2>
          <p className={styles.subheading}>{subheading}</p>

          <ul className={styles.contactList}>
            <li>
              <Icon icon="mdi:email-outline" />
              <a href="mailto:info@regiofoods.com">info@regiofoods.com</a>
            </li>
            <li>
              <Icon icon="mdi:phone-outline" />
              <a href="tel:+919876543210">+91 98765 43210</a>
            </li>
            <li>
              <Icon icon="mdi:map-marker-outline" />
              <span>C-3430, Green Fields Colony, Sector 43, Faridabad, Haryana, India</span>
            </li>
          </ul>

          <div className={styles.socials}>
            <a href="#" aria-label="LinkedIn">
              <Icon icon="mdi:linkedin" />
            </a>
            <a href="#" aria-label="Instagram">
              <Icon icon="mdi:instagram" />
            </a>
            <a href="#" aria-label="Facebook">
              <Icon icon="mdi:facebook" />
            </a>
          </div>
        </div>

        {showForm && (
          <form className={styles.formPane} onSubmit={handleSubmit}>
            <label>
              Name
              <input type="text" name="name" required />
            </label>
            <label>
              Email
              <input type="email" name="email" required />
            </label>
            <label>
              Message
              <textarea name="message" rows={4} required />
            </label>

            <button type="submit" className={styles.submitBtn} disabled={status === 'sent'}>
              {status === 'sent' ? 'Message Sent ✓' : 'Send Message'}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

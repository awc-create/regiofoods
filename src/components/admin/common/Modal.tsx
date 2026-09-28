'use client';

import { useEffect } from 'react';
import { Icon } from '@iconify/react';
import styles from './Modal.module.scss';

type Props = {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  wide?: boolean;
  footer?: React.ReactNode;
};

export default function Modal({ title, onClose, children, wide, footer }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <div className={styles.backdrop} onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div
        className={`${styles.dialog} ${wide ? styles.wide : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <header className={styles.header}>
          <h2>{title}</h2>
          <button type="button" className={styles.close} onClick={onClose} aria-label="Close">
            <Icon icon="mdi:close" />
          </button>
        </header>
        <div className={styles.body}>{children}</div>
        {footer && <footer className={styles.footer}>{footer}</footer>}
      </div>
    </div>
  );
}

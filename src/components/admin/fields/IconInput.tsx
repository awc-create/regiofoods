'use client';

import { Icon } from '@iconify/react';
import styles from './Fields.module.scss';

const SUGGESTED = [
  'mdi:storefront-outline',
  'mdi:silverware-fork-knife',
  'mdi:warehouse',
  'mdi:airplane',
  'mdi:store-check',
  'mdi:truck-delivery-outline',
  'mdi:earth',
  'mdi:factory',
  'mdi:snowflake',
  'mdi:leaf',
  'mdi:shield-check-outline',
  'mdi:linkedin',
  'mdi:instagram',
  'mdi:facebook',
  'mdi:youtube',
  'mdi:whatsapp',
  'mdi:twitter',
];

export default function IconInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className={styles.iconField}>
      <div className={styles.iconChoices}>
        {SUGGESTED.map((name) => (
          <button
            key={name}
            type="button"
            title={name}
            className={`${styles.iconChoice} ${value === name ? styles.iconChoiceActive : ''}`}
            onClick={() => onChange(name)}
          >
            <Icon icon={name} />
          </button>
        ))}
      </div>
      <div className={styles.tagRow}>
        <span className={styles.iconPreview}>{value ? <Icon icon={value} /> : null}</span>
        <input
          className={styles.input}
          value={value}
          placeholder="mdi:leaf"
          onChange={(e) => onChange(e.target.value.trim())}
        />
      </div>
      <small className={styles.help}>
        Pick one above, or find more at{' '}
        <a href="https://icon-sets.iconify.design/mdi/" target="_blank" rel="noreferrer">
          iconify.design
        </a>{' '}
        and paste its name.
      </small>
    </div>
  );
}

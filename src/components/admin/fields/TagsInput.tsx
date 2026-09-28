'use client';

import { useState } from 'react';
import { Icon } from '@iconify/react';
import styles from './Fields.module.scss';

type Props = { value: string[]; onChange: (v: string[]) => void; placeholder?: string };

/** A list of short texts: one per line, with move/remove buttons. */
export default function TagsInput({ value, onChange, placeholder }: Props) {
  const [draft, setDraft] = useState('');

  const add = () => {
    const t = draft.trim();
    if (!t) return;
    onChange([...value, t]);
    setDraft('');
  };

  const move = (i: number, d: -1 | 1) => {
    const next = [...value];
    const j = i + d;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j]!, next[i]!];
    onChange(next);
  };

  return (
    <div className={styles.tags}>
      {value.map((t, i) => (
        <div key={i} className={styles.tagRow}>
          <input
            className={styles.input}
            value={t}
            onChange={(e) => onChange(value.map((x, j) => (j === i ? e.target.value : x)))}
          />
          <button
            type="button"
            className={styles.iconBtn}
            onClick={() => move(i, -1)}
            disabled={i === 0}
            aria-label="Move up"
          >
            <Icon icon="mdi:arrow-up" />
          </button>
          <button
            type="button"
            className={styles.iconBtn}
            onClick={() => move(i, 1)}
            disabled={i === value.length - 1}
            aria-label="Move down"
          >
            <Icon icon="mdi:arrow-down" />
          </button>
          <button
            type="button"
            className={styles.iconBtnDanger}
            onClick={() => onChange(value.filter((_, j) => j !== i))}
            aria-label="Remove"
          >
            <Icon icon="mdi:trash-can-outline" />
          </button>
        </div>
      ))}
      <div className={styles.tagRow}>
        <input
          className={styles.input}
          value={draft}
          placeholder={placeholder ?? 'Type and press Enter to add'}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              add();
            }
          }}
        />
        <button type="button" className={styles.smallGhost} onClick={add} disabled={!draft.trim()}>
          <Icon icon="mdi:plus" /> Add
        </button>
      </div>
    </div>
  );
}

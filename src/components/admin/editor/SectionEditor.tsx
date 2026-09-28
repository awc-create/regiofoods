'use client';

import { useCallback, useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import type { SectionDef } from '@/content/fields';
import { FieldGrid } from '../fields/FieldControl';
import SaveBar, { useDirty } from '../common/SaveBar';
import { timeAgo } from '../common/format';
import { publicUrl } from '../common/publicUrl';
import styles from './Editor.module.scss';

type Obj = Record<string, unknown>;

type Props = {
  def: SectionDef<Obj>;
  viewHref?: string;
  onDirtyChange?: (dirty: boolean) => void;
};

export default function SectionEditor({ def, viewHref, onDirtyChange }: Props) {
  const [value, setValue] = useState<Obj>(def.defaults);
  const [saved, setSaved] = useState<Obj>(def.defaults);
  const [ready, setReady] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState<{ updatedAt: string | null; updatedBy: string | null }>({
    updatedAt: null,
    updatedBy: null,
  });
  const { dirty, markSaved } = useDirty(value, ready);

  const load = useCallback(async () => {
    setReady(false);
    setError(null);
    const res = await fetch(`/api/admin/content/${encodeURIComponent(def.key)}`, {
      cache: 'no-store',
    });
    if (!res.ok) {
      setError('Could not load this section. Refresh the page to try again.');
      return;
    }
    const json = await res.json();
    setValue(json.value);
    setSaved(json.value);
    setMeta({ updatedAt: json.updatedAt, updatedBy: json.updatedBy });
    setReady(true);
  }, [def.key]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => onDirtyChange?.(dirty), [dirty, onDirtyChange]);

  async function save() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/content/${encodeURIComponent(def.key)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || 'Save failed.');
      setValue(json.value);
      setSaved(json.value);
      setMeta({ updatedAt: json.updatedAt, updatedBy: json.updatedBy });
      markSaved(json.value);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  async function resetToOriginal() {
    if (
      !confirm(
        `Put “${def.label}” back to the original website wording? Your saved changes to this section will be removed.`
      )
    )
      return;
    await fetch(`/api/admin/content/${encodeURIComponent(def.key)}`, { method: 'DELETE' });
    await load();
  }

  return (
    <section className={styles.section}>
      <header className={styles.head}>
        <div>
          <h2>{def.label}</h2>
          {def.hint && <p>{def.hint}</p>}
        </div>
        <div className={styles.headTools}>
          {viewHref && (
            <a
              href={publicUrl(viewHref)}
              target="_blank"
              rel="noreferrer"
              className={styles.ghostBtn}
            >
              <Icon icon="mdi:eye-outline" /> View page
            </a>
          )}
          {meta.updatedAt && (
            <button
              type="button"
              className={styles.ghostBtn}
              onClick={() => void resetToOriginal()}
            >
              <Icon icon="mdi:restore" /> Reset to original
            </button>
          )}
        </div>
      </header>

      {!ready && !error ? (
        <div className={styles.loading}>Loading…</div>
      ) : (
        <div className={styles.card}>
          <FieldGrid fields={def.fields} value={value} onChange={setValue} />
        </div>
      )}

      <SaveBar
        dirty={dirty}
        saving={saving}
        error={error}
        onSave={() => void save()}
        onDiscard={() => setValue(saved)}
        savedAt={
          meta.updatedAt
            ? `Last saved ${timeAgo(meta.updatedAt)}${meta.updatedBy ? ` by ${meta.updatedBy}` : ''}`
            : 'Showing the original website wording'
        }
      />
    </section>
  );
}

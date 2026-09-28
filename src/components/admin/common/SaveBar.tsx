'use client';

import { useEffect, useState } from 'react';
import styles from './SaveBar.module.scss';

/**
 * Tracks unsaved changes (same approach as the Essentia admin): snapshot the
 * value once loading finishes, compare on every render, re-snapshot on save.
 */
export function useDirty<T>(value: T, ready: boolean) {
  const serialised = JSON.stringify(value);
  const [baseline, setBaseline] = useState<string | null>(null);

  // Adjust state while rendering (React's recommended alternative to an effect):
  // the first render after loading becomes the baseline; a reload clears it.
  if (ready && baseline === null) setBaseline(serialised);
  if (!ready && baseline !== null) setBaseline(null);

  const dirty = ready && baseline !== null && baseline !== serialised;

  // Warn before closing the tab with unsaved work in the box.
  useEffect(() => {
    if (!dirty) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [dirty]);

  /** Call after a successful save, passing what was saved. */
  const markSaved = (saved?: T) => setBaseline(JSON.stringify(saved ?? value));

  return { dirty, markSaved };
}

type Props = {
  dirty: boolean;
  saving: boolean;
  onSave: () => void;
  onDiscard?: () => void;
  label?: string;
  note?: string;
  error?: string | null;
  savedAt?: string | null;
};

export default function SaveBar({
  dirty,
  saving,
  onSave,
  onDiscard,
  label,
  note,
  error,
  savedAt,
}: Props) {
  const status = error
    ? 'Not saved'
    : saving
      ? 'Saving…'
      : dirty
        ? 'Unsaved changes'
        : 'All changes saved';

  return (
    <div
      className={`${styles.bar} ${dirty ? styles.isDirty : ''} ${error ? styles.isError : ''}`}
      role="status"
    >
      <div className={styles.state}>
        <span className={styles.dot} aria-hidden="true" />
        <div className={styles.stateText}>
          <strong>{status}</strong>
          {error ? (
            <small>{error}</small>
          ) : note ? (
            <small>{note}</small>
          ) : savedAt ? (
            <small>{savedAt}</small>
          ) : null}
        </div>
      </div>

      <div className={styles.actions}>
        {dirty && onDiscard && (
          <button type="button" className={styles.discard} onClick={onDiscard} disabled={saving}>
            Undo changes
          </button>
        )}
        <button type="button" className={styles.save} onClick={onSave} disabled={saving || !dirty}>
          {saving ? 'Saving…' : (label ?? 'Save changes')}
        </button>
      </div>
    </div>
  );
}

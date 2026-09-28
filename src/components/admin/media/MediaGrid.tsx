'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Icon } from '@iconify/react';
import { uploadFile, type MediaItem } from './upload';
import { fileSize, timeAgo } from '../common/format';
import styles from './MediaGrid.module.scss';

type Props = {
  /** When set, clicking an image picks it instead of opening details. */
  onPick?: (item: MediaItem) => void;
  folder?: string;
  imagesOnly?: boolean;
};

const PAGE = 48;

export default function MediaGrid({ onPick, folder = 'general', imagesOnly }: Props) {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [total, setTotal] = useState(0);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [storage, setStorage] = useState(true);
  const [selected, setSelected] = useState<MediaItem | null>(null);
  const [drag, setDrag] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const load = useCallback(
    async (skip = 0) => {
      setLoading(true);
      const params = new URLSearchParams({ take: String(PAGE), skip: String(skip) });
      if (q) params.set('q', q);
      if (imagesOnly) params.set('type', 'image');
      const res = await fetch(`/api/admin/media?${params}`, { cache: 'no-store' });
      const json = await res.json().catch(() => ({ items: [], total: 0 }));
      setItems((prev) => (skip ? [...prev, ...json.items] : json.items));
      setTotal(json.total ?? 0);
      setStorage(json.storage !== false);
      setLoading(false);
    },
    [q, imagesOnly]
  );

  useEffect(() => {
    const t = setTimeout(() => void load(0), 250);
    return () => clearTimeout(t);
  }, [load]);

  async function handleFiles(files: FileList | File[]) {
    setError(null);
    const list = Array.from(files);
    setUploading((n) => n + list.length);
    for (const file of list) {
      try {
        const item = await uploadFile(file, folder);
        setItems((prev) => [item, ...prev]);
        setTotal((t) => t + 1);
        if (onPick && list.length === 1) onPick(item);
      } catch (err) {
        setError(`${file.name}: ${(err as Error).message}`);
      } finally {
        setUploading((n) => n - 1);
      }
    }
  }

  async function remove(item: MediaItem) {
    if (
      !confirm(
        `Delete "${item.name}"? Pages or products still using this image will show a blank space.`
      )
    )
      return;
    const res = await fetch(`/api/admin/media/${item.id}`, { method: 'DELETE' });
    if (res.ok) {
      setItems((prev) => prev.filter((m) => m.id !== item.id));
      setTotal((t) => t - 1);
      setSelected(null);
    }
  }

  async function saveDetails(item: MediaItem, patch: { name?: string; alt?: string }) {
    const res = await fetch(`/api/admin/media/${item.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    });
    if (res.ok) {
      const updated = (await res.json()) as MediaItem;
      setItems((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
      setSelected(updated);
    }
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.toolbar}>
        <div className={styles.search}>
          <Icon icon="mdi:magnify" />
          <input
            type="search"
            placeholder="Search images by name…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <button
          type="button"
          className={styles.uploadBtn}
          onClick={() => inputRef.current?.click()}
        >
          <Icon icon="mdi:upload" /> Upload images
        </button>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={imagesOnly ? 'image/*' : 'image/*,application/pdf'}
          hidden
          onChange={(e) => {
            if (e.target.files?.length) void handleFiles(e.target.files);
            e.target.value = '';
          }}
        />
      </div>

      {!storage && (
        <p className={styles.warn}>
          Image storage (Hetzner bucket) is not configured on this server yet. Uploads will only
          work on a developer machine.
        </p>
      )}
      {error && <p className={styles.error}>{error}</p>}

      <div
        className={`${styles.drop} ${drag ? styles.dragging : ''}`}
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          if (e.dataTransfer.files.length) void handleFiles(e.dataTransfer.files);
        }}
      >
        {uploading > 0 && (
          <p className={styles.uploading}>
            <Icon icon="mdi:loading" className={styles.spin} /> Uploading {uploading} file
            {uploading === 1 ? '' : 's'}…
          </p>
        )}

        {items.length === 0 && !loading ? (
          <div className={styles.empty}>
            <Icon icon="mdi:image-plus-outline" />
            <p>
              {q
                ? 'No images match your search.'
                : 'No images yet. Drag photos here or press “Upload images”.'}
            </p>
          </div>
        ) : (
          <ul className={styles.grid}>
            {items.map((m) => (
              <li key={m.id}>
                <button
                  type="button"
                  className={`${styles.tile} ${selected?.id === m.id ? styles.tileActive : ''}`}
                  onClick={() => (onPick ? onPick(m) : setSelected(m))}
                  title={m.name}
                >
                  {m.type === 'image' ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={m.url} alt={m.alt ?? m.name} loading="lazy" />
                  ) : (
                    <span className={styles.doc}>
                      <Icon icon="mdi:file-pdf-box" />
                    </span>
                  )}
                  <span className={styles.tileName}>{m.name}</span>
                </button>
              </li>
            ))}
          </ul>
        )}

        {items.length < total && (
          <div className={styles.more}>
            <button type="button" onClick={() => void load(items.length)} disabled={loading}>
              {loading ? 'Loading…' : `Show more (${total - items.length} left)`}
            </button>
          </div>
        )}
        {!onPick && (
          <p className={styles.dropHint}>Tip: you can drag and drop photos anywhere in this box.</p>
        )}
      </div>

      {selected && !onPick && (
        <Details
          key={selected.id}
          item={selected}
          onClose={() => setSelected(null)}
          onDelete={() => void remove(selected)}
          onSave={(patch) => void saveDetails(selected, patch)}
        />
      )}
    </div>
  );
}

function Details({
  item,
  onClose,
  onDelete,
  onSave,
}: {
  item: MediaItem;
  onClose: () => void;
  onDelete: () => void;
  onSave: (patch: { name: string; alt: string }) => void;
}) {
  const [name, setName] = useState(item.name);
  const [alt, setAlt] = useState(item.alt ?? '');
  const [copied, setCopied] = useState(false);

  return (
    <aside className={styles.details}>
      <div className={styles.detailsHead}>
        <strong>Image details</strong>
        <button type="button" onClick={onClose} aria-label="Close details">
          <Icon icon="mdi:close" />
        </button>
      </div>
      {item.type === 'image' && (
        // eslint-disable-next-line @next/next/no-img-element
        <img className={styles.preview} src={item.url} alt={item.alt ?? item.name} />
      )}
      <dl className={styles.meta}>
        <dt>Size</dt>
        <dd>{fileSize(item.size)}</dd>
        <dt>Uploaded</dt>
        <dd>{timeAgo(item.createdAt)}</dd>
        <dt>Folder</dt>
        <dd>{item.folder}</dd>
      </dl>
      <label className={styles.field}>
        <span>Name</span>
        <input value={name} onChange={(e) => setName(e.target.value)} />
      </label>
      <label className={styles.field}>
        <span>Description for screen readers &amp; Google</span>
        <input
          value={alt}
          onChange={(e) => setAlt(e.target.value)}
          placeholder="e.g. Frozen parotta pack"
        />
      </label>
      <div className={styles.detailActions}>
        <button type="button" className={styles.saveBtn} onClick={() => onSave({ name, alt })}>
          Save details
        </button>
        <button
          type="button"
          className={styles.copyBtn}
          onClick={() => {
            void navigator.clipboard.writeText(item.url);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          }}
        >
          {copied ? 'Copied!' : 'Copy link'}
        </button>
        <button type="button" className={styles.deleteBtn} onClick={onDelete}>
          Delete
        </button>
      </div>
    </aside>
  );
}

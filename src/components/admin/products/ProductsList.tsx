'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Icon } from '@iconify/react';
import { categoryOptions, fetchCategories, type AdminCategory, type AdminProduct } from './types';
import { timeAgo } from '../common/format';
import styles from '../common/Page.module.scss';

const PER_PAGE = 50;

export default function ProductsList() {
  const params = useSearchParams();
  const [q, setQ] = useState('');
  const [category, setCategory] = useState(params.get('category') ?? '');
  const [status, setStatus] = useState(params.get('status') ?? '');
  const [page, setPage] = useState(1);
  const [data, setData] = useState<{ items: AdminProduct[]; total: number; pages: number } | null>(
    null
  );
  const [cats, setCats] = useState<AdminCategory[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [moveTo, setMoveTo] = useState('');
  const [busy, setBusy] = useState(false);

  const options = useMemo(() => categoryOptions(cats), [cats]);

  const load = useCallback(async () => {
    const sp = new URLSearchParams({ page: String(page), take: String(PER_PAGE) });
    if (q) sp.set('q', q);
    if (category) sp.set('category', category);
    if (status) sp.set('status', status);
    const res = await fetch(`/api/admin/products?${sp}`, { cache: 'no-store' });
    setData(await res.json());
  }, [q, category, status, page]);

  useEffect(() => {
    const t = setTimeout(() => void load(), 200);
    return () => clearTimeout(t);
  }, [load]);

  useEffect(() => {
    void fetchCategories().then(setCats);
  }, []);

  // Changing a filter goes back to page 1 and clears the selection.
  const filter =
    <T,>(setter: (v: T) => void) =>
    (v: T) => {
      setter(v);
      setPage(1);
      setSelected(new Set());
    };

  const items = data?.items ?? [];
  const allSelected = items.length > 0 && items.every((p) => selected.has(p.id));

  async function bulk(action: string) {
    if (!selected.size) return;
    if (
      action === 'delete' &&
      !confirm(`Delete ${selected.size} product(s)? This cannot be undone.`)
    )
      return;
    if (action === 'move' && !moveTo) return;
    setBusy(true);
    await fetch('/api/admin/products/bulk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ids: [...selected],
        action,
        categoryId: moveTo === 'none' ? null : moveTo,
      }),
    });
    setBusy(false);
    setSelected(new Set());
    setMoveTo('');
    void load();
  }

  async function toggleVisible(p: AdminProduct) {
    await fetch('/api/admin/products/bulk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: [p.id], action: p.visible ? 'hide' : 'show' }),
    });
    void load();
  }

  return (
    <div className={styles.page}>
      <div className={styles.pageHead}>
        <div>
          <h1>Products</h1>
          <p>
            {data ? `${data.total} product${data.total === 1 ? '' : 's'}` : 'Loading…'} · Hidden
            products stay here but don’t show on the website.
          </p>
        </div>
        <div className={styles.headActions}>
          <Link href="/admin/products/import" className={styles.ghostBtn}>
            <Icon icon="mdi:file-delimited-outline" /> Import / export
          </Link>
          <Link href="/admin/products/new" className={styles.primaryBtn}>
            <Icon icon="mdi:plus" /> Add product
          </Link>
        </div>
      </div>

      <div className={styles.filters}>
        <input
          className={`${styles.input} ${styles.search}`}
          type="search"
          placeholder="Search by product name…"
          value={q}
          onChange={(e) => filter(setQ)(e.target.value)}
        />
        <select
          className={styles.select}
          value={category}
          onChange={(e) => filter(setCategory)(e.target.value)}
        >
          <option value="">All categories</option>
          <option value="none">No category</option>
          {options.map((o) => (
            <option key={o.id} value={o.id}>
              {o.label}
            </option>
          ))}
        </select>
        <select
          className={styles.select}
          value={status}
          onChange={(e) => filter(setStatus)(e.target.value)}
        >
          <option value="">Any status</option>
          <option value="visible">On website</option>
          <option value="hidden">Hidden</option>
          <option value="featured">Featured</option>
          <option value="noimage">No photo</option>
        </select>
      </div>

      {selected.size > 0 && (
        <div className={styles.bulkBar}>
          <strong>{selected.size} selected</strong>
          <button
            type="button"
            className={styles.ghostBtn}
            disabled={busy}
            onClick={() => void bulk('show')}
          >
            Show on website
          </button>
          <button
            type="button"
            className={styles.ghostBtn}
            disabled={busy}
            onClick={() => void bulk('hide')}
          >
            Hide
          </button>
          <button
            type="button"
            className={styles.ghostBtn}
            disabled={busy}
            onClick={() => void bulk('feature')}
          >
            Feature
          </button>
          <select
            className={styles.select}
            value={moveTo}
            onChange={(e) => setMoveTo(e.target.value)}
            style={{ width: 'auto' }}
          >
            <option value="">Move to category…</option>
            {options.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
          {moveTo && (
            <button
              type="button"
              className={styles.primaryBtn}
              disabled={busy}
              onClick={() => void bulk('move')}
            >
              Move
            </button>
          )}
          <button
            type="button"
            className={styles.dangerBtn}
            disabled={busy}
            onClick={() => void bulk('delete')}
          >
            Delete
          </button>
        </div>
      )}

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th style={{ width: 36 }}>
                <input
                  type="checkbox"
                  aria-label="Select all"
                  checked={allSelected}
                  onChange={() =>
                    setSelected(allSelected ? new Set() : new Set(items.map((p) => p.id)))
                  }
                />
              </th>
              <th style={{ width: 60 }}>Photo</th>
              <th>Product</th>
              <th>Category</th>
              <th>Pack sizes</th>
              <th>Status</th>
              <th>Updated</th>
            </tr>
          </thead>
          <tbody>
            {items.map((p) => {
              const img = p.variants.find((v) => v.imageUrl)?.imageUrl;
              const cat = p.category
                ? p.category.parent
                  ? `${p.category.parent.name} › ${p.category.name}`
                  : p.category.name
                : null;
              return (
                <tr key={p.id}>
                  <td>
                    <input
                      type="checkbox"
                      aria-label={`Select ${p.name}`}
                      checked={selected.has(p.id)}
                      onChange={() =>
                        setSelected((prev) => {
                          const next = new Set(prev);
                          if (next.has(p.id)) next.delete(p.id);
                          else next.add(p.id);
                          return next;
                        })
                      }
                    />
                  </td>
                  <td>
                    {img ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img className={styles.thumb} src={img} alt="" loading="lazy" />
                    ) : (
                      <span className={`${styles.thumb} ${styles.thumbEmpty}`}>
                        <Icon icon="mdi:image-off-outline" />
                      </span>
                    )}
                  </td>
                  <td>
                    <div className={styles.nameCell}>
                      <Link href={`/admin/products/${p.id}`}>{p.name}</Link>
                      <small>/products/{p.slug}</small>
                    </div>
                  </td>
                  <td>
                    {cat ?? (
                      <span className={`${styles.pill} ${styles.pillAccent}`}>No category</span>
                    )}
                  </td>
                  <td className={styles.muted}>
                    {p.variants
                      .map((v) => v.packSize)
                      .filter(Boolean)
                      .join(' · ') || '—'}
                  </td>
                  <td>
                    <button
                      type="button"
                      className={`${styles.pill} ${p.visible ? styles.pillOk : styles.pillOff}`}
                      onClick={() => void toggleVisible(p)}
                      title="Click to switch"
                      style={{ cursor: 'pointer' }}
                    >
                      <Icon icon={p.visible ? 'mdi:eye-outline' : 'mdi:eye-off-outline'} />
                      {p.visible ? 'On website' : 'Hidden'}
                    </button>
                    {p.featured && (
                      <span
                        className={`${styles.pill} ${styles.pillAccent}`}
                        style={{ marginLeft: 6 }}
                      >
                        Featured
                      </span>
                    )}
                  </td>
                  <td className={styles.muted}>{timeAgo(p.updatedAt)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {data && items.length === 0 && (
          <div className={styles.empty}>No products match these filters.</div>
        )}
      </div>

      {data && data.pages > 1 && (
        <div className={styles.pager}>
          <span>
            Page {page} of {data.pages}
          </span>
          <div className={styles.headActions}>
            <button
              type="button"
              className={styles.ghostBtn}
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
            >
              Previous
            </button>
            <button
              type="button"
              className={styles.ghostBtn}
              disabled={page >= data.pages}
              onClick={() => setPage(page + 1)}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

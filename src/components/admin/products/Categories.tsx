'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import { fetchCategories, type AdminCategory } from './types';
import styles from '../common/Page.module.scss';
import own from './Categories.module.scss';

export default function Categories() {
  const [tree, setTree] = useState<AdminCategory[] | null>(null);
  const [newParent, setNewParent] = useState('');
  const [error, setError] = useState<string | null>(null);

  const load = () => fetchCategories().then(setTree);
  useEffect(() => {
    void load();
  }, []);

  async function call(url: string, method: string, body?: unknown) {
    setError(null);
    const res = await fetch(url, {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) setError(json.error || 'Something went wrong.');
    await load();
    return res.ok;
  }

  async function reorder(list: AdminCategory[], i: number, d: -1 | 1) {
    const j = i + d;
    if (j < 0 || j >= list.length) return;
    const ids = list.map((c) => c.id);
    [ids[i], ids[j]] = [ids[j]!, ids[i]!];
    await call('/api/admin/categories/reorder', 'POST', { ids });
  }

  async function rename(c: AdminCategory) {
    const name = prompt('New name', c.name)?.trim();
    if (name && name !== c.name) await call(`/api/admin/categories/${c.id}`, 'PATCH', { name });
  }

  async function remove(c: AdminCategory, parent?: AdminCategory) {
    const count =
      c._count.products + (c.children ?? []).reduce((n, ch) => n + ch._count.products, 0);
    let moveTo = '';
    if (count > 0) {
      const target = parent ?? null;
      const ok = confirm(
        target
          ? `Delete “${c.name}”? Its ${count} product(s) will be moved to “${target.name}”.`
          : `Delete “${c.name}”${c.children?.length ? ' and its sub-categories' : ''}? Its ${count} product(s) will have no category and disappear from the website until you move them.`
      );
      if (!ok) return;
      if (target) moveTo = target.id;
    } else if (!confirm(`Delete “${c.name}”?`)) {
      return;
    }
    await call(`/api/admin/categories/${c.id}${moveTo ? `?moveTo=${moveTo}` : ''}`, 'DELETE');
  }

  return (
    <div className={`${styles.page} ${styles.narrow}`}>
      <div className={styles.pageHead}>
        <div>
          <h1>Categories</h1>
          <p>
            Main categories are the tabs on the Products page (Frozen, Groceries, Snacks…). Each can
            have sub-categories that appear in its drop-down. Use the arrows to change the order.
          </p>
        </div>
      </div>

      {error && <div className={`${styles.notice} ${styles.errorBox}`}>{error}</div>}

      <div className={styles.card}>
        <form
          className={own.addRow}
          onSubmit={async (e) => {
            e.preventDefault();
            if (!newParent.trim()) return;
            if (await call('/api/admin/categories', 'POST', { name: newParent })) setNewParent('');
          }}
        >
          <input
            className={styles.input}
            value={newParent}
            placeholder="New main category, e.g. Spices"
            onChange={(e) => setNewParent(e.target.value)}
          />
          <button type="submit" className={styles.primaryBtn} disabled={!newParent.trim()}>
            <Icon icon="mdi:plus" /> Add main category
          </button>
        </form>
      </div>

      {tree === null ? (
        <div className={styles.card}>Loading…</div>
      ) : (
        <ol className={own.tree}>
          {tree.map((p, i) => (
            <li key={p.id} className={own.parent}>
              <Row
                c={p}
                index={i}
                total={tree.length}
                onUp={() => void reorder(tree, i, -1)}
                onDown={() => void reorder(tree, i, 1)}
                onRename={() => void rename(p)}
                onToggle={() =>
                  void call(`/api/admin/categories/${p.id}`, 'PATCH', { visible: !p.visible })
                }
                onDelete={() => void remove(p)}
                isParent
              />
              <ol className={own.children}>
                {(p.children ?? []).map((c, j) => (
                  <li key={c.id}>
                    <Row
                      c={c}
                      index={j}
                      total={p.children!.length}
                      onUp={() => void reorder(p.children!, j, -1)}
                      onDown={() => void reorder(p.children!, j, 1)}
                      onRename={() => void rename(c)}
                      onToggle={() =>
                        void call(`/api/admin/categories/${c.id}`, 'PATCH', { visible: !c.visible })
                      }
                      onDelete={() => void remove(c, p)}
                    />
                  </li>
                ))}
                <li>
                  <AddChild
                    onAdd={(name) =>
                      call('/api/admin/categories', 'POST', { name, parentId: p.id })
                    }
                  />
                </li>
              </ol>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

function Row({
  c,
  index,
  total,
  onUp,
  onDown,
  onRename,
  onToggle,
  onDelete,
  isParent,
}: {
  c: AdminCategory;
  index: number;
  total: number;
  onUp: () => void;
  onDown: () => void;
  onRename: () => void;
  onToggle: () => void;
  onDelete: () => void;
  isParent?: boolean;
}) {
  const count = c._count.products + (c.children ?? []).reduce((n, ch) => n + ch._count.products, 0);
  return (
    <div className={`${own.row} ${isParent ? own.rowParent : ''} ${c.visible ? '' : own.hidden}`}>
      <span className={own.name}>
        {c.name}
        {!c.visible && <em> (hidden)</em>}
      </span>
      <Link href={`/admin/products?category=${c.id}`} className={own.count}>
        {count} product{count === 1 ? '' : 's'}
      </Link>
      <span className={own.tools}>
        <button
          type="button"
          onClick={onUp}
          disabled={index === 0}
          title="Move up"
          aria-label="Move up"
        >
          <Icon icon="mdi:arrow-up" />
        </button>
        <button
          type="button"
          onClick={onDown}
          disabled={index === total - 1}
          title="Move down"
          aria-label="Move down"
        >
          <Icon icon="mdi:arrow-down" />
        </button>
        <button type="button" onClick={onRename} title="Rename" aria-label="Rename">
          <Icon icon="mdi:pencil-outline" />
        </button>
        <button
          type="button"
          onClick={onToggle}
          title={c.visible ? 'Hide from website' : 'Show on website'}
          aria-label={c.visible ? 'Hide' : 'Show'}
        >
          <Icon icon={c.visible ? 'mdi:eye-outline' : 'mdi:eye-off-outline'} />
        </button>
        <button
          type="button"
          onClick={onDelete}
          title="Delete"
          aria-label="Delete"
          className={own.danger}
        >
          <Icon icon="mdi:trash-can-outline" />
        </button>
      </span>
    </div>
  );
}

function AddChild({ onAdd }: { onAdd: (name: string) => Promise<boolean> }) {
  const [name, setName] = useState('');
  const [open, setOpen] = useState(false);
  if (!open) {
    return (
      <button type="button" className={own.addChild} onClick={() => setOpen(true)}>
        <Icon icon="mdi:plus" /> Add sub-category
      </button>
    );
  }
  return (
    <form
      className={own.addChildForm}
      onSubmit={async (e) => {
        e.preventDefault();
        if (name.trim() && (await onAdd(name))) {
          setName('');
          setOpen(false);
        }
      }}
    >
      <input
        autoFocus
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Sub-category name"
      />
      <button type="submit" disabled={!name.trim()}>
        Add
      </button>
      <button type="button" onClick={() => setOpen(false)}>
        Cancel
      </button>
    </form>
  );
}

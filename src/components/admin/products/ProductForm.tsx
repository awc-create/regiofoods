'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Icon } from '@iconify/react';
import ImageInput from '../fields/ImageInput';
import SaveBar, { useDirty } from '../common/SaveBar';
import { categoryOptions, fetchCategories, type AdminCategory, type AdminVariant } from './types';
import { publicUrl } from '../common/publicUrl';
import styles from '../common/Page.module.scss';
import own from './ProductForm.module.scss';

type Form = {
  name: string;
  slug: string;
  description: string;
  categoryId: string;
  visible: boolean;
  featured: boolean;
  variants: AdminVariant[];
};

const EMPTY: Form = {
  name: '',
  slug: '',
  description: '',
  categoryId: '',
  visible: true,
  featured: false,
  variants: [{ name: '', packSize: '', imageUrl: '' }],
};

export default function ProductForm({ id }: { id?: string }) {
  const router = useRouter();
  const isNew = !id;
  const [form, setForm] = useState<Form>(EMPTY);
  const [ready, setReady] = useState(isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cats, setCats] = useState<AdminCategory[]>([]);
  const [notFound, setNotFound] = useState(false);
  const { dirty, markSaved } = useDirty(form, ready);
  const options = useMemo(() => categoryOptions(cats), [cats]);

  useEffect(() => {
    void fetchCategories().then(setCats);
  }, []);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/admin/products/${id}`, { cache: 'no-store' })
      .then(async (r) => {
        if (!r.ok) {
          setNotFound(true);
          return;
        }
        const p = await r.json();
        setForm({
          name: p.name,
          slug: p.slug,
          description: p.description,
          categoryId: p.categoryId ?? '',
          visible: p.visible,
          featured: p.featured,
          variants: p.variants.length
            ? p.variants.map((v: AdminVariant) => ({
                name: v.name,
                packSize: v.packSize,
                imageUrl: v.imageUrl,
              }))
            : [{ name: '', packSize: '', imageUrl: '' }],
        });
        setReady(true);
      })
      .catch(() => setNotFound(true));
  }, [id]);

  const set = <K extends keyof Form>(k: K, v: Form[K]) => setForm((f) => ({ ...f, [k]: v }));
  const setVariant = (i: number, patch: Partial<AdminVariant>) =>
    set(
      'variants',
      form.variants.map((v, j) => (j === i ? { ...v, ...patch } : v))
    );
  const moveVariant = (i: number, d: -1 | 1) => {
    const j = i + d;
    if (j < 0 || j >= form.variants.length) return;
    const next = [...form.variants];
    [next[i], next[j]] = [next[j]!, next[i]!];
    set('variants', next);
  };

  async function save() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(isNew ? '/api/admin/products' : `/api/admin/products/${id}`, {
        method: isNew ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, categoryId: form.categoryId || null }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || 'Save failed.');
      if (isNew) {
        markSaved();
        router.replace(`/admin/products/${json.id}`);
      } else {
        const next = { ...form, slug: json.slug };
        setForm(next);
        markSaved(next);
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (
      !id ||
      !confirm(`Delete “${form.name}”? This cannot be undone. (Tip: you can hide it instead.)`)
    )
      return;
    await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
    markSaved();
    router.replace('/admin/products');
  }

  if (notFound) {
    return (
      <div className={styles.page}>
        <div className={`${styles.card} ${styles.empty}`}>
          This product no longer exists. <Link href="/admin/products">Back to products</Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.page} ${styles.narrow}`}>
      <div className={styles.pageHead}>
        <div>
          <Link href="/admin/products" className={own.back}>
            <Icon icon="mdi:arrow-left" /> All products
          </Link>
          <h1>{isNew ? 'Add a product' : form.name || 'Edit product'}</h1>
        </div>
        {!isNew && (
          <div className={styles.headActions}>
            <a
              href={publicUrl(`/products/${form.slug}`)}
              target="_blank"
              rel="noreferrer"
              className={styles.ghostBtn}
            >
              <Icon icon="mdi:eye-outline" /> View on website
            </a>
            <button type="button" className={styles.dangerBtn} onClick={() => void remove()}>
              <Icon icon="mdi:trash-can-outline" /> Delete
            </button>
          </div>
        )}
      </div>

      {!ready ? (
        <div className={styles.card}>Loading…</div>
      ) : (
        <div className={styles.stack}>
          <div className={styles.card}>
            <div className={styles.form}>
              <label className={`${styles.field} ${styles.full}`}>
                <span className={styles.label}>Product name</span>
                <input
                  className={styles.input}
                  value={form.name}
                  onChange={(e) => set('name', e.target.value)}
                  placeholder="Prince Foods Kerala Parotta"
                  required
                />
              </label>

              <label className={styles.field}>
                <span className={styles.label}>Category</span>
                <select
                  className={styles.select}
                  value={form.categoryId}
                  onChange={(e) => set('categoryId', e.target.value)}
                >
                  <option value="">— Choose a category —</option>
                  {options.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.label}
                    </option>
                  ))}
                </select>
                <small className={styles.help}>
                  Products without a category don’t show on the website.{' '}
                  <Link href="/admin/categories">
                    <u>Manage categories</u>
                  </Link>
                </small>
              </label>

              <div className={own.toggles}>
                <label className={own.check}>
                  <input
                    type="checkbox"
                    checked={form.visible}
                    onChange={(e) => set('visible', e.target.checked)}
                  />
                  <span>
                    <strong>Show on website</strong>
                    <small>Untick to hide without deleting.</small>
                  </span>
                </label>
                <label className={own.check}>
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) => set('featured', e.target.checked)}
                  />
                  <span>
                    <strong>Featured</strong>
                    <small>Listed first in the catalogue.</small>
                  </span>
                </label>
              </div>

              <label className={`${styles.field} ${styles.full}`}>
                <span className={styles.label}>Description</span>
                <textarea
                  className={styles.textarea}
                  rows={5}
                  value={form.description}
                  onChange={(e) => set('description', e.target.value)}
                  placeholder="Short description shown on the product page. Do not include prices."
                />
              </label>

              {!isNew && (
                <label className={`${styles.field} ${styles.full}`}>
                  <span className={styles.label}>Web address</span>
                  <div className={own.slug}>
                    <span>/products/</span>
                    <input
                      className={styles.input}
                      value={form.slug}
                      onChange={(e) => set('slug', e.target.value)}
                    />
                  </div>
                  <small className={styles.help}>
                    Changing this breaks old links to the product. Usually leave it alone.
                  </small>
                </label>
              )}
            </div>
          </div>

          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Pack sizes &amp; photos</h2>
            <p className={`${styles.help} ${own.intro}`}>
              Add one row per pack size. The first photo is used in the catalogue. Upload clear pack
              shots without prices.
            </p>

            <div className={own.variants}>
              {form.variants.map((v, i) => (
                <div key={i} className={own.variant}>
                  <div className={own.variantHead}>
                    <strong>Pack {i + 1}</strong>
                    <div className={own.variantTools}>
                      <button
                        type="button"
                        onClick={() => moveVariant(i, -1)}
                        disabled={i === 0}
                        aria-label="Move up"
                      >
                        <Icon icon="mdi:arrow-up" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveVariant(i, 1)}
                        disabled={i === form.variants.length - 1}
                        aria-label="Move down"
                      >
                        <Icon icon="mdi:arrow-down" />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          set(
                            'variants',
                            form.variants.filter((_, j) => j !== i)
                          )
                        }
                        aria-label="Remove pack"
                      >
                        <Icon icon="mdi:trash-can-outline" />
                      </button>
                    </div>
                  </div>
                  <div className={styles.form}>
                    <label className={styles.field}>
                      <span className={styles.label}>Name shown in table</span>
                      <input
                        className={styles.input}
                        value={v.name}
                        placeholder={form.name ? `${form.name} 1kg` : 'e.g. Kerala Parotta 1kg'}
                        onChange={(e) => setVariant(i, { name: e.target.value })}
                      />
                    </label>
                    <label className={styles.field}>
                      <span className={styles.label}>Pack size</span>
                      <input
                        className={styles.input}
                        value={v.packSize}
                        placeholder="1kg, 5 pcs, 400g x 12…"
                        onChange={(e) => setVariant(i, { packSize: e.target.value })}
                      />
                    </label>
                    <div className={`${styles.field} ${styles.full}`}>
                      <span className={styles.label}>Photo</span>
                      <ImageInput
                        value={v.imageUrl}
                        folder="products"
                        onChange={(url) => setVariant(i, { imageUrl: url })}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              className={own.addBtn}
              onClick={() =>
                set('variants', [...form.variants, { name: '', packSize: '', imageUrl: '' }])
              }
            >
              <Icon icon="mdi:plus" /> Add another pack size
            </button>
          </div>

          <SaveBar
            dirty={dirty || isNew}
            saving={saving}
            error={error}
            onSave={() => void save()}
            label={isNew ? 'Create product' : 'Save product'}
            note={isNew ? 'The product appears on the website once it has a category.' : undefined}
          />
        </div>
      )}
    </div>
  );
}

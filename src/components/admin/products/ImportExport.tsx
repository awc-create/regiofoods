'use client';

import { useRef, useState } from 'react';
import { Icon } from '@iconify/react';
import styles from '../common/Page.module.scss';

type Result = {
  ok: boolean;
  products: number;
  created: number;
  updated: number;
  categoriesCreated: number;
  errors: { row: number; message: string }[];
  dryRun: boolean;
  error?: string;
};

const COLUMNS: [string, string][] = [
  [
    'slug',
    'The product’s web address. Keep it as exported so the right product is updated. Leave blank for new products.',
  ],
  ['name', 'Product name (required).'],
  ['category', 'Main category, e.g. Frozen. New names create a new category.'],
  ['subcategory', 'Optional sub-category, e.g. Frozen Flatbreads.'],
  ['description', 'Text for the product page.'],
  ['visible', 'yes or no — whether it shows on the website.'],
  ['featured', 'yes or no — listed first in the catalogue.'],
  [
    'variant_name, pack_size, image_url',
    'One row per pack size. Repeat the product’s slug and name on each row.',
  ],
];

export default function ImportExport() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState<Result | null>(null);
  const [done, setDone] = useState<Result | null>(null);

  async function send(f: File, dryRun: boolean) {
    setBusy(true);
    const fd = new FormData();
    fd.set('file', f);
    const res = await fetch(`/api/admin/products/import${dryRun ? '?dryRun=1' : ''}`, {
      method: 'POST',
      body: fd,
    });
    const json = (await res.json().catch(() => ({ ok: false, error: 'Import failed.' }))) as Result;
    setBusy(false);
    if (!res.ok) json.ok = false;
    return json;
  }

  async function choose(f: File) {
    setFile(f);
    setDone(null);
    setPreview(await send(f, true));
  }

  async function confirmImport() {
    if (!file) return;
    setDone(await send(file, false));
    setPreview(null);
    setFile(null);
  }

  return (
    <div className={`${styles.page} ${styles.narrow} ${styles.stack}`}>
      <div className={styles.pageHead}>
        <div>
          <h1>Import &amp; export</h1>
          <p>
            Update many products at once in Excel or Google Sheets: download the spreadsheet, make
            your changes, save it as CSV and upload it here.
          </p>
        </div>
      </div>

      <div className={styles.card}>
        <h2 className={styles.cardTitle}>1. Download the current products</h2>
        <p className={styles.help} style={{ marginTop: 0 }}>
          A CSV file with one row per pack size. Opens in Excel, Numbers or Google Sheets.
        </p>
        <button
          type="button"
          className={styles.primaryBtn}
          onClick={() => {
            window.location.href = '/api/admin/products/export';
          }}
        >
          <Icon icon="mdi:download" /> Download products CSV
        </button>
      </div>

      <div className={styles.card}>
        <h2 className={styles.cardTitle}>2. Upload your updated file</h2>
        <p className={styles.help} style={{ marginTop: 0 }}>
          We check the file first and show you what will change before anything is saved. Products
          not in the file are left untouched.
        </p>
        <button
          type="button"
          className={styles.ghostBtn}
          onClick={() => inputRef.current?.click()}
          disabled={busy}
        >
          <Icon icon="mdi:upload" /> {file ? `Chosen: ${file.name}` : 'Choose CSV file'}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept=".csv,text/csv"
          hidden
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void choose(f);
            e.target.value = '';
          }}
        />

        {busy && <p className={styles.muted}>Checking…</p>}

        {preview && (
          <div className={styles.stack} style={{ marginTop: '1rem' }}>
            {preview.ok ? (
              <div className={`${styles.notice} ${styles.success}`}>
                <Icon icon="mdi:check-circle-outline" />
                <span>
                  Ready: {preview.products} product{preview.products === 1 ? '' : 's'} in the file —{' '}
                  <strong>{preview.created} new</strong> and{' '}
                  <strong>{preview.updated} updated</strong>.
                </span>
              </div>
            ) : (
              <div className={`${styles.notice} ${styles.errorBox}`}>
                <Icon icon="mdi:alert-circle-outline" />
                <span>{preview.error || 'This file could not be read.'}</span>
              </div>
            )}
            <Errors errors={preview.errors} />
            {preview.ok && (
              <div className={styles.headActions}>
                <button
                  type="button"
                  className={styles.primaryBtn}
                  onClick={() => void confirmImport()}
                  disabled={busy}
                >
                  Import now
                </button>
                <button
                  type="button"
                  className={styles.ghostBtn}
                  onClick={() => {
                    setPreview(null);
                    setFile(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        )}

        {done && (
          <div className={styles.stack} style={{ marginTop: '1rem' }}>
            <div className={`${styles.notice} ${done.ok ? styles.success : styles.errorBox}`}>
              <Icon icon={done.ok ? 'mdi:check-circle-outline' : 'mdi:alert-circle-outline'} />
              <span>
                {done.ok
                  ? `Import finished — ${done.created} created, ${done.updated} updated${
                      done.categoriesCreated ? `, ${done.categoriesCreated} new categories` : ''
                    }.`
                  : done.error || 'Import failed.'}
              </span>
            </div>
            <Errors errors={done.errors} />
          </div>
        )}
      </div>

      <div className={styles.card}>
        <h2 className={styles.cardTitle}>Spreadsheet columns</h2>
        <ul className={styles.list}>
          {COLUMNS.map(([col, text]) => (
            <li key={col} style={{ justifyContent: 'flex-start' }}>
              <code style={{ minWidth: 190, fontWeight: 700 }}>{col}</code>
              <span className={styles.muted}>{text}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Errors({ errors }: { errors?: { row: number; message: string }[] }) {
  if (!errors?.length) return null;
  return (
    <div className={`${styles.notice} ${styles.errorBox}`} style={{ display: 'block' }}>
      <strong>Rows with problems:</strong>
      <ul style={{ margin: '0.4rem 0 0', paddingLeft: '1.2rem' }}>
        {errors.slice(0, 20).map((e, i) => (
          <li key={i}>
            Row {e.row}: {e.message}
          </li>
        ))}
      </ul>
    </div>
  );
}

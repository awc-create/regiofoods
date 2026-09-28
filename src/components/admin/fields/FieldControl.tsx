'use client';

import { useState } from 'react';
import { Icon } from '@iconify/react';
import { emptyItem, type Field, type LinkValue, type ListField } from '@/content/fields';
import ImageInput from './ImageInput';
import TagsInput from './TagsInput';
import IconInput from './IconInput';
import styles from './Fields.module.scss';

type Obj = Record<string, unknown>;

/** Renders every field of an object as a form grid. */
export function FieldGrid({
  fields,
  value,
  onChange,
}: {
  fields: Field[];
  value: Obj;
  onChange: (next: Obj) => void;
}) {
  return (
    <div className={styles.grid}>
      {fields.map((f) => (
        <FieldControl
          key={f.name}
          field={f}
          value={value[f.name]}
          onChange={(v) => onChange({ ...value, [f.name]: v })}
        />
      ))}
    </div>
  );
}

export default function FieldControl({
  field,
  value,
  onChange,
}: {
  field: Field;
  value: unknown;
  onChange: (v: unknown) => void;
}) {
  const wide =
    field.full ||
    field.kind === 'list' ||
    field.kind === 'richtext' ||
    field.kind === 'tags' ||
    field.kind === 'image' ||
    field.kind === 'icon';

  const label = <span className={styles.label}>{field.label}</span>;
  const hint = field.hint ? <small className={styles.help}>{field.hint}</small> : null;

  switch (field.kind) {
    case 'text':
      return (
        <label className={`${styles.field} ${wide ? styles.full : ''}`}>
          {label}
          <input
            className={styles.input}
            value={(value as string) ?? ''}
            placeholder={field.placeholder}
            onChange={(e) => onChange(e.target.value)}
          />
          {hint}
        </label>
      );

    case 'textarea':
    case 'richtext':
      return (
        <label className={`${styles.field} ${wide ? styles.full : ''}`}>
          {label}
          <textarea
            className={`${styles.textarea} ${field.kind === 'richtext' ? styles.mono : ''}`}
            rows={field.rows ?? 3}
            value={(value as string) ?? ''}
            placeholder={'placeholder' in field ? field.placeholder : undefined}
            onChange={(e) => onChange(e.target.value)}
          />
          {hint}
        </label>
      );

    case 'number':
      return (
        <label className={`${styles.field} ${wide ? styles.full : ''}`}>
          {label}
          <input
            className={`${styles.input} ${styles.short}`}
            type="number"
            min={field.min}
            max={field.max}
            step={field.step ?? 1}
            value={typeof value === 'number' ? value : ''}
            onChange={(e) => onChange(e.target.value === '' ? 0 : Number(e.target.value))}
          />
          {hint}
        </label>
      );

    case 'toggle':
      return (
        <label className={`${styles.toggle} ${wide ? styles.full : ''}`}>
          <input
            type="checkbox"
            checked={Boolean(value)}
            onChange={(e) => onChange(e.target.checked)}
          />
          <span className={styles.switch} aria-hidden="true" />
          <span className={styles.toggleText}>
            {field.label}
            {hint}
          </span>
        </label>
      );

    case 'link': {
      const v = (value as LinkValue) ?? { label: '', href: '' };
      return (
        <div className={`${styles.field} ${wide ? styles.full : ''}`}>
          {label}
          <div className={styles.linkPair}>
            <input
              className={styles.input}
              value={v.label}
              placeholder="Button text"
              aria-label={`${field.label} text`}
              onChange={(e) => onChange({ ...v, label: e.target.value })}
            />
            <input
              className={styles.input}
              value={v.href}
              placeholder="/contact"
              aria-label={`${field.label} link`}
              onChange={(e) => onChange({ ...v, href: e.target.value })}
            />
          </div>
          {hint ?? <small className={styles.help}>Leave the text empty to hide the button.</small>}
        </div>
      );
    }

    case 'image':
      return (
        <div className={`${styles.field} ${styles.full}`}>
          {label}
          <ImageInput value={(value as string) ?? ''} onChange={onChange} folder={field.folder} />
          {hint}
        </div>
      );

    case 'icon':
      return (
        <div className={`${styles.field} ${styles.full}`}>
          {label}
          <IconInput value={(value as string) ?? ''} onChange={onChange} />
        </div>
      );

    case 'tags':
      return (
        <div className={`${styles.field} ${styles.full}`}>
          {label}
          {hint}
          <TagsInput
            value={(value as string[]) ?? []}
            onChange={onChange}
            placeholder={field.placeholder}
          />
        </div>
      );

    case 'list':
      return (
        <ListEditor
          field={field}
          value={(value as Obj[]) ?? []}
          onChange={onChange as (v: Obj[]) => void}
        />
      );
  }
}

function ListEditor({
  field,
  value,
  onChange,
}: {
  field: ListField;
  value: Obj[];
  onChange: (v: Obj[]) => void;
}) {
  // Rows start collapsed when there are many, so long lists stay scannable.
  const [open, setOpen] = useState<Set<number>>(
    () => new Set(value.length <= 3 ? value.map((_, i) => i) : [])
  );

  const toggle = (i: number) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  const move = (i: number, d: -1 | 1) => {
    const j = i + d;
    if (j < 0 || j >= value.length) return;
    const next = [...value];
    [next[i], next[j]] = [next[j]!, next[i]!];
    onChange(next);
    setOpen((prev) => {
      const s = new Set<number>();
      prev.forEach((k) => s.add(k === i ? j : k === j ? i : k));
      return s;
    });
  };

  const remove = (i: number) => {
    const title = rowTitle(value[i]!, i);
    if (!confirm(`Remove “${title}”?`)) return;
    onChange(value.filter((_, k) => k !== i));
    setOpen((prev) => {
      const s = new Set<number>();
      prev.forEach((k) => {
        if (k < i) s.add(k);
        else if (k > i) s.add(k - 1);
      });
      return s;
    });
  };

  const duplicate = (i: number) => {
    const next = [...value];
    next.splice(i + 1, 0, JSON.parse(JSON.stringify(value[i])));
    onChange(next);
    setOpen((prev) => new Set([...[...prev].map((k) => (k > i ? k + 1 : k)), i + 1]));
  };

  const add = () => {
    onChange([...value, emptyItem(field.fields)]);
    setOpen((prev) => new Set([...prev, value.length]));
  };

  const rowTitle = (item: Obj, i: number) => {
    const t = field.titleField ? item[field.titleField] : undefined;
    return (typeof t === 'string' && t.trim()) || `${capitalise(field.itemLabel)} ${i + 1}`;
  };

  const atMax = field.max !== undefined && value.length >= field.max;

  return (
    <fieldset className={`${styles.list} ${styles.full}`}>
      <legend className={styles.label}>
        {field.label} <span className={styles.count}>({value.length})</span>
      </legend>
      {field.hint && <small className={styles.help}>{field.hint}</small>}

      {value.map((item, i) => {
        const isOpen = open.has(i);
        return (
          <div key={i} className={`${styles.row} ${isOpen ? styles.rowOpen : ''}`}>
            <div className={styles.rowHead}>
              <button
                type="button"
                className={styles.rowToggle}
                onClick={() => toggle(i)}
                aria-expanded={isOpen}
              >
                <Icon icon={isOpen ? 'mdi:chevron-down' : 'mdi:chevron-right'} />
                <span className={styles.rowIndex}>{i + 1}</span>
                <span className={styles.rowTitle}>{rowTitle(item, i)}</span>
              </button>
              <div className={styles.rowTools}>
                <button
                  type="button"
                  className={styles.iconBtn}
                  onClick={() => move(i, -1)}
                  disabled={i === 0}
                  title="Move up"
                  aria-label="Move up"
                >
                  <Icon icon="mdi:arrow-up" />
                </button>
                <button
                  type="button"
                  className={styles.iconBtn}
                  onClick={() => move(i, 1)}
                  disabled={i === value.length - 1}
                  title="Move down"
                  aria-label="Move down"
                >
                  <Icon icon="mdi:arrow-down" />
                </button>
                <button
                  type="button"
                  className={styles.iconBtn}
                  onClick={() => duplicate(i)}
                  disabled={atMax}
                  title="Duplicate"
                  aria-label="Duplicate"
                >
                  <Icon icon="mdi:content-copy" />
                </button>
                <button
                  type="button"
                  className={styles.iconBtnDanger}
                  onClick={() => remove(i)}
                  title="Remove"
                  aria-label="Remove"
                >
                  <Icon icon="mdi:trash-can-outline" />
                </button>
              </div>
            </div>

            {isOpen && (
              <div className={styles.rowBody}>
                <FieldGrid
                  fields={field.fields}
                  value={item}
                  onChange={(next) => onChange(value.map((x, k) => (k === i ? next : x)))}
                />
              </div>
            )}
          </div>
        );
      })}

      <button type="button" className={styles.addBtn} onClick={add} disabled={atMax}>
        <Icon icon="mdi:plus" /> Add {field.itemLabel}
      </button>
    </fieldset>
  );
}

function capitalise(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

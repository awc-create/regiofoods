// src/content/fields.ts
// Field definitions for editable sections. The admin renders a form from these,
// and the API uses them to clean anything that is saved.

type Base = {
  name: string;
  label: string;
  hint?: string;
  /** Take the full row in the admin form grid. */
  full?: boolean;
};

export type TextField = Base & { kind: 'text'; placeholder?: string };
export type TextareaField = Base & { kind: 'textarea'; rows?: number; placeholder?: string };
export type ImageField = Base & { kind: 'image'; folder?: string };
export type LinkField = Base & { kind: 'link' }; // { label, href }
export type TagsField = Base & { kind: 'tags'; placeholder?: string }; // string[]
export type NumberField = Base & { kind: 'number'; min?: number; max?: number; step?: number };
export type ToggleField = Base & { kind: 'toggle' };
export type IconField = Base & { kind: 'icon' };
export type RichTextField = Base & { kind: 'richtext'; rows?: number };
export type ListField = Base & {
  kind: 'list';
  /** Singular noun for buttons, e.g. "stat" → "Add stat". */
  itemLabel: string;
  /** Which sub-field to show as the collapsed row title. */
  titleField?: string;
  fields: Field[];
  max?: number;
};

export type Field =
  | TextField
  | TextareaField
  | ImageField
  | LinkField
  | TagsField
  | NumberField
  | ToggleField
  | IconField
  | RichTextField
  | ListField;

export type LinkValue = { label: string; href: string };

export type SectionDef<T = Record<string, unknown>> = {
  key: string;
  /** Admin page this section is edited under, e.g. "home". */
  group: string;
  label: string;
  hint?: string;
  fields: Field[];
  defaults: T;
};

export function defineSection<T extends Record<string, unknown>>(
  def: SectionDef<T>
): SectionDef<T> {
  return def;
}

/* ---------- cleaning ---------- */

const MAX_TEXT = 20_000;

function cleanString(v: unknown, fallback: string): string {
  if (typeof v !== 'string') return fallback;
  return v.slice(0, MAX_TEXT);
}

function cleanField(field: Field, value: unknown, fallback: unknown): unknown {
  switch (field.kind) {
    case 'text':
    case 'textarea':
    case 'image':
    case 'icon':
    case 'richtext':
      return cleanString(value, typeof fallback === 'string' ? fallback : '');
    case 'number': {
      const n = typeof value === 'number' ? value : Number(value);
      if (!Number.isFinite(n)) return typeof fallback === 'number' ? fallback : 0;
      const min = field.min ?? -Infinity;
      const max = field.max ?? Infinity;
      return Math.min(max, Math.max(min, n));
    }
    case 'toggle':
      return typeof value === 'boolean' ? value : Boolean(fallback);
    case 'link': {
      const fb = (fallback ?? { label: '', href: '' }) as LinkValue;
      const v = (value ?? {}) as Partial<LinkValue>;
      return {
        label: cleanString(v.label, fb.label ?? ''),
        href: cleanString(v.href, fb.href ?? ''),
      };
    }
    case 'tags':
      if (!Array.isArray(value)) return Array.isArray(fallback) ? fallback : [];
      return value
        .filter((s): s is string => typeof s === 'string')
        .map((s) => s.slice(0, 500))
        .slice(0, 100);
    case 'list': {
      if (!Array.isArray(value)) return Array.isArray(fallback) ? fallback : [];
      const items = value.slice(0, field.max ?? 200);
      return items.map((item) => cleanObject(field.fields, item, {}));
    }
  }
}

/** Keep only known fields, coerce types, fill gaps from defaults. */
export function cleanObject(
  fields: Field[],
  value: unknown,
  defaults: Record<string, unknown>
): Record<string, unknown> {
  const src = (value && typeof value === 'object' ? value : {}) as Record<string, unknown>;
  const out: Record<string, unknown> = {};
  for (const f of fields) {
    out[f.name] = cleanField(f, f.name in src ? src[f.name] : defaults[f.name], defaults[f.name]);
  }
  return out;
}

/** An empty item for a list field — used by the admin "Add" button. */
export function emptyItem(fields: Field[]): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const f of fields) {
    switch (f.kind) {
      case 'number':
        out[f.name] = f.min ?? 0;
        break;
      case 'toggle':
        out[f.name] = true;
        break;
      case 'link':
        out[f.name] = { label: '', href: '' };
        break;
      case 'tags':
      case 'list':
        out[f.name] = [];
        break;
      default:
        out[f.name] = '';
    }
  }
  return out;
}

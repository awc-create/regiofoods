// src/utils/slugify.ts
export function slugify(str?: string): string {
  const base = (str || 'item').toLowerCase();
  const slug = base
    .replace(/[^a-z0-9]+/g, '-') // non-alphanumeric → hyphen
    .replace(/^-|-$/g, ''); // trim leading/trailing hyphens

  return slug || 'item';
}

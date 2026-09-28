// src/content/sections/common.ts
import type { Field } from '../fields';

/** Eyebrow + multi-line heading + intro — used by most page sections. */
export const introFields: Field[] = [
  { kind: 'text', name: 'eyebrow', label: 'Small text above heading' },
  {
    kind: 'textarea',
    name: 'heading',
    label: 'Heading',
    rows: 2,
    hint: 'Press Enter to start a new line.',
    full: true,
  },
  { kind: 'textarea', name: 'intro', label: 'Intro text', rows: 3, full: true },
];

export const chipsField = (label = 'Highlight chips'): Field => ({
  kind: 'tags',
  name: 'chips',
  label,
  full: true,
});

export const metaListField = (name = 'meta', label = 'Label / value pairs'): Field => ({
  kind: 'list',
  name,
  label,
  itemLabel: 'pair',
  titleField: 'label',
  max: 6,
  full: true,
  fields: [
    { kind: 'text', name: 'label', label: 'Label' },
    { kind: 'text', name: 'value', label: 'Value' },
  ],
});

export const pointsListField = (
  name: string,
  label: string,
  itemLabel = 'point',
  extra: Field[] = []
): Field => ({
  kind: 'list',
  name,
  label,
  itemLabel,
  titleField: 'title',
  max: 12,
  full: true,
  fields: [
    { kind: 'text', name: 'title', label: 'Title', full: true },
    { kind: 'textarea', name: 'body', label: 'Text', rows: 2, full: true },
    ...extra,
  ],
});

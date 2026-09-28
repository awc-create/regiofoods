// src/content/sections/brands.ts
import { defineSection } from '../fields';
import { chipsField, introFields } from './common';

/** One brand list feeds the scrolling strip (home + factory) and the Brands page grid. */
export const brandsList = defineSection({
  key: 'brands.list',
  group: 'brands',
  label: 'Brand list',
  hint: 'Used by the scrolling logo strip and the brand cards on the Brands page.',
  fields: [
    {
      kind: 'list',
      name: 'items',
      label: 'Brands',
      itemLabel: 'brand',
      titleField: 'name',
      max: 30,
      full: true,
      fields: [
        { kind: 'text', name: 'name', label: 'Brand name' },
        { kind: 'text', name: 'website', label: 'Website (optional)', placeholder: 'https://' },
        {
          kind: 'image',
          name: 'logo',
          label: 'Logo',
          hint: 'PNG with transparent background works best.',
          folder: 'brands',
          full: true,
        },
        {
          kind: 'number',
          name: 'scale',
          label: 'Logo size adjust',
          hint: '1 = normal. Increase if the logo looks small.',
          min: 0.5,
          max: 4,
          step: 0.05,
        },
        { kind: 'toggle', name: 'inStrip', label: 'Show in scrolling strip' },
        { kind: 'toggle', name: 'inGrid', label: 'Show as a card on Brands page' },
        { kind: 'textarea', name: 'note', label: 'Card description', rows: 2, full: true },
        { kind: 'text', name: 'scope', label: 'Card range line', full: true },
      ],
    },
  ],
  defaults: {
    items: [
      {
        name: 'Prince Foods',
        website: 'https://prince-foods.com',
        logo: '/assets/brands/prince-foods-logo.png',
        scale: 1.05,
        inStrip: true,
        inGrid: false,
        note: '',
        scope: '',
      },
      {
        name: 'Royal Choice',
        website: '',
        logo: '/assets/brands/royal-choice-logo.png',
        scale: 1.35,
        inStrip: true,
        inGrid: true,
        note: 'A dependable range designed for everyday distribution needs.',
        scope: 'Frozen staples • export-ready formats',
      },
      {
        name: 'Seelans',
        website: 'https://seelans.com/',
        logo: '/assets/brands/seelans-logo_1.png',
        scale: 1.1,
        inStrip: true,
        inGrid: true,
        note: 'Traditional favourites built around familiar South Asian taste profiles.',
        scope: 'Select ranges • regional suitability',
      },
      {
        name: 'Keralites',
        website: '',
        logo: '/assets/brands/Keralites-logo.png',
        scale: 3,
        inStrip: true,
        inGrid: true,
        note: 'Kerala-inspired products focusing on authentic formats and textures.',
        scope: 'Flatbreads • snacks • ready-to-cook',
      },
    ],
  },
});

export const brandsHero = defineSection({
  key: 'brands.hero',
  group: 'brands',
  label: 'Hero',
  fields: [
    { kind: 'image', name: 'logo', label: 'Logo', folder: 'brands', full: true },
    ...introFields,
    { kind: 'link', name: 'primaryCta', label: 'Main button' },
    { kind: 'link', name: 'secondaryCta', label: 'Second button' },
    chipsField(),
  ],
  defaults: {
    logo: '/assets/regiofoods-logo.svg',
    eyebrow: 'Brand structure',
    heading: 'Manufacturing brands\nwithin the Prince Foods group.',
    intro:
      'Regio Foods is the manufacturing arm of Prince Foods — built to deliver export-ready frozen ranges with consistency, compliance, and scale.',
    primaryCta: { label: 'View product ranges', href: '/products' },
    secondaryCta: { label: 'Speak to export sales →', href: '/contact' },
    chips: ['Prince Foods parent group', 'Export manufacturing', 'Frozen South Asian foods'],
  },
});

const familyCardFields = [
  { kind: 'text' as const, name: 'badge', label: 'Badge' },
  { kind: 'text' as const, name: 'title', label: 'Name' },
  { kind: 'image' as const, name: 'logo', label: 'Logo', folder: 'brands', full: true },
  { kind: 'textarea' as const, name: 'text', label: 'Text', rows: 3, full: true },
  { kind: 'tags' as const, name: 'bullets', label: 'Bullet points', full: true },
];

export const brandsFamily = defineSection({
  key: 'brands.family',
  group: 'brands',
  label: 'Group structure',
  fields: [
    ...introFields,
    {
      kind: 'list',
      name: 'cards',
      label: 'Cards',
      itemLabel: 'card',
      titleField: 'title',
      max: 4,
      full: true,
      fields: familyCardFields,
    },
  ],
  defaults: {
    eyebrow: 'How it’s structured',
    heading: 'Prince Foods is the parent company.\nRegio Foods is its manufacturing arm.',
    intro:
      'This is one group — not a partnership. Prince Foods leads market presence and buyer relationships. Regio Foods delivers export-ready manufacturing, QA discipline and consistent production at scale.',
    cards: [
      {
        badge: 'Parent brand',
        title: 'Prince Foods',
        logo: '/assets/brands/prince-foods-logo.png',
        text: 'The parent brand that anchors market presence, buyer relationships, and export-facing standards — feeding real requirements back into production planning.',
        bullets: [
          'Wholesale & export supply experience',
          'Market feedback loop for product development',
          'Compliance-first operating culture',
        ],
      },
      {
        badge: 'Manufacturing brand',
        title: 'Regio Foods',
        logo: '/assets/regiofoods-logo.svg',
        text: 'The manufacturing arm — built to produce frozen ranges at scale with traceability, process control, and pack formats suited to distributors and retailers.',
        bullets: [
          'Manufacturing + QA discipline',
          'Export-ready pack formats',
          'Customisable specs per market',
        ],
      },
    ],
  },
});

export const brandsGrid = defineSection({
  key: 'brands.grid',
  group: 'brands',
  label: 'Brand cards heading',
  hint: 'Heading above the brand cards. The cards come from the Brand list tab.',
  fields: [...introFields],
  defaults: {
    eyebrow: 'Our named ranges',
    heading: 'Brands we work with.',
    intro:
      'These are the ranges we can publicly reference. Availability varies by market and buyer programme.',
  },
});

export const brandsPrivateLabel = defineSection({
  key: 'brands.privateLabel',
  group: 'brands',
  label: 'Private label',
  fields: [
    ...introFields,
    chipsField('Capabilities'),
    { kind: 'link', name: 'primaryCta', label: 'Main button' },
    { kind: 'link', name: 'secondaryCta', label: 'Second button' },
  ],
  defaults: {
    eyebrow: 'Private label',
    heading: 'Custom ranges for selected buyers.',
    intro:
      'In addition to our named ranges, we manufacture private-label products for selected distributors and retail programmes. Specifications, pack formats and artwork can be tailored per market.',
    chips: [
      'Specs aligned to buyer requirement',
      'Market-specific declarations',
      'Export-friendly case formats',
    ],
    primaryCta: { label: 'Request a catalogue', href: '/contact' },
    secondaryCta: { label: 'View the range →', href: '/products' },
  },
});

export const brandsCta = defineSection({
  key: 'brands.cta',
  group: 'brands',
  label: 'Closing call-to-action',
  fields: [
    { kind: 'text', name: 'heading', label: 'Heading', full: true },
    { kind: 'textarea', name: 'intro', label: 'Text', rows: 2, full: true },
    { kind: 'link', name: 'primaryCta', label: 'Main button' },
    { kind: 'link', name: 'secondaryCta', label: 'Second button' },
  ],
  defaults: {
    heading: 'Want a brand catalogue for your market?',
    intro:
      'We can share product lists, available formats, and the right range for your buyer profile.',
    primaryCta: { label: 'Request catalogue', href: '/contact' },
    secondaryCta: { label: 'Browse products →', href: '/products' },
  },
});

export const brandsSections = [
  brandsList,
  brandsHero,
  brandsFamily,
  brandsGrid,
  brandsPrivateLabel,
  brandsCta,
];

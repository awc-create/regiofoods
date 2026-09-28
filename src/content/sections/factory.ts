// src/content/sections/factory.ts
import { defineSection } from '../fields';
import { chipsField, introFields, metaListField, pointsListField } from './common';

export const factoryHero = defineSection({
  key: 'factory.hero',
  group: 'factory',
  label: 'Hero',
  fields: [
    ...introFields,
    { kind: 'image', name: 'image', label: 'Background image', folder: 'factory', full: true },
    chipsField(),
    { kind: 'link', name: 'primaryCta', label: 'Main button' },
    { kind: 'link', name: 'secondaryCta', label: 'Second button' },
    { kind: 'tags', name: 'notes', label: 'Small notes', full: true },
  ],
  defaults: {
    eyebrow: 'Factory & Infrastructure',
    heading: 'Built for export-grade production,\ndesigned around safety.',
    intro:
      'Our plant brings together controlled environments, repeatable processes and documented checks – so every batch leaves the factory safe, traceable and ready for international markets.',
    image: '/images/factory/line-overview.jpg',
    chips: [
      'Food safety engineered in',
      'Fire & emergency systems',
      'Cold chain from cook to dispatch',
    ],
    primaryCta: { label: 'View process overview', href: '#process-overview' },
    secondaryCta: { label: 'Safety & compliance standards', href: '#safety-standards' },
    notes: [
      'Single-site facility in Kerala, purpose-built for frozen foods.',
      'Layouts, flows and controls planned for export customers first.',
    ],
  },
});

export const factoryRegulations = defineSection({
  key: 'factory.regulations',
  group: 'factory',
  label: 'Safety & compliance',
  fields: [
    ...introFields,
    pointsListField('points', 'Points'),
    { kind: 'text', name: 'panelTitle', label: 'Panel heading', full: true },
    {
      kind: 'list',
      name: 'badges',
      label: 'Panel badges',
      itemLabel: 'badge',
      titleField: 'label',
      max: 8,
      full: true,
      fields: [
        { kind: 'text', name: 'label', label: 'Label' },
        { kind: 'text', name: 'text', label: 'Text' },
      ],
    },
    { kind: 'textarea', name: 'note', label: 'Panel note', rows: 2, full: true },
  ],
  defaults: {
    eyebrow: 'Safety, Quality & Compliance',
    heading: 'Infrastructure built around the rules that matter.',
    intro:
      'Our factory was planned backwards from export requirements: food-safety frameworks, fire regulations, occupational health, and the documentation auditors expect to see when they walk in.',
    points: [
      {
        title: 'Food safety & hygiene controls',
        body: 'Zoning between raw, cooked and packing areas, dedicated handwash and PPE points, and cleaning routines documented by shift.',
      },
      {
        title: 'Fire safety & emergency readiness',
        body: 'Extinguishers, alarms and escape routes planned into the building layout, with regular checks and staff briefings.',
      },
      {
        title: 'People, training & record-keeping',
        body: 'Induction for new staff, refreshers for existing teams, and simple logbooks so we can prove what was done, not just say it.',
      },
    ],
    panelTitle: 'What buyers care about, covered.',
    badges: [
      { label: 'Food safety', text: 'Process flows aligned with HACCP-style principles.' },
      { label: 'Fire & safety', text: 'Premises planned with extinguishers, alarms and exits.' },
      { label: 'Worker welfare', text: 'PPE, rest areas and clear rules for safe working.' },
      { label: 'Documentation', text: 'Checklists and records that keep audits predictable.' },
    ],
    note: 'As the factory grows, this section can link to specific certifications and downloadable policies.',
  },
});

export const factoryBrands = defineSection({
  key: 'factory.brands',
  group: 'factory',
  label: 'Brands strip',
  hint: 'Logos are edited under Brands → Brand list.',
  fields: [
    { kind: 'text', name: 'title', label: 'Heading', full: true },
    { kind: 'text', name: 'subtitle', label: 'Intro text', full: true },
  ],
  defaults: {
    title: 'Brands in the Prince Foods group',
    subtitle: 'Named ranges manufactured and supplied across the portfolio.',
  },
});

export const factoryProcess = defineSection({
  key: 'factory.process',
  group: 'factory',
  label: 'Process steps',
  fields: [
    ...introFields,
    metaListField('metrics', 'Summary figures'),
    {
      kind: 'list',
      name: 'steps',
      label: 'Steps',
      itemLabel: 'step',
      titleField: 'title',
      max: 12,
      full: true,
      fields: [
        { kind: 'text', name: 'title', label: 'Title' },
        { kind: 'text', name: 'tag', label: 'Tag' },
        { kind: 'textarea', name: 'blurb', label: 'Text', rows: 2, full: true },
      ],
    },
  ],
  defaults: {
    eyebrow: 'How the factory runs',
    heading: 'A clear path from intake to dispatch.',
    intro:
      'The layout of the building mirrors the way a batch moves through it – ingredients always travelling forward, never looping back, with checks at each handover.',
    metrics: [
      { label: 'Flow', value: 'Linear, one-way' },
      { label: 'Controls', value: 'Food safety + fire + people' },
      { label: 'Designed for', value: 'Export buyers & audits' },
    ],
    steps: [
      {
        title: 'Intake & verification',
        tag: 'Raw materials',
        blurb:
          'Approved suppliers, incoming checks and temperature readings logged as ingredients enter the factory.',
      },
      {
        title: 'Preparation & batching',
        tag: 'Controlled prep',
        blurb:
          'Trimming, marination and batching in stainless work areas, with clear separation from cooked zones.',
      },
      {
        title: 'Cooking & validation',
        tag: 'Core safety step',
        blurb:
          'Validated time and temperature profiles for each SKU, recorded by batch to prove cook steps were met.',
      },
      {
        title: 'Chilling & blast freezing',
        tag: 'Cold chain',
        blurb:
          'Rapid cooling and blast freezing reduce time in the danger zone and lock in product quality.',
      },
      {
        title: 'Packing & labelling',
        tag: 'Export-ready packs',
        blurb:
          'Portioning, sealing and labelling in dedicated clean areas, with metal checks and export-ready artwork.',
      },
      {
        title: 'Storage & dispatch',
        tag: 'Ready to ship',
        blurb:
          'Finished goods stored in temperature-controlled rooms, marshalled by order and loaded for onward transport.',
      },
    ],
  },
});

export const factoryMap = defineSection({
  key: 'factory.map',
  group: 'factory',
  label: 'Factory map',
  hint: 'The seven zones sit on a fixed corridor drawing. You can change their text and photos; the positions are fixed to the drawing.',
  fields: [
    ...introFields,
    {
      kind: 'list',
      name: 'zones',
      label: 'Zones',
      itemLabel: 'zone',
      titleField: 'title',
      max: 7,
      full: true,
      fields: [
        { kind: 'text', name: 'shortLabel', label: 'Short label' },
        { kind: 'text', name: 'title', label: 'Title' },
        { kind: 'textarea', name: 'description', label: 'Hover text', rows: 2, full: true },
        { kind: 'textarea', name: 'detail', label: 'Detail text', rows: 3, full: true },
        { kind: 'image', name: 'image', label: 'Photo', folder: 'factory', full: true },
      ],
    },
  ],
  defaults: {
    eyebrow: 'Factory map',
    heading: 'Skeleton layout of the site.',
    intro:
      'A simple corridor-and-rooms view of the factory. Each glowing point marks a key zone — hover to see a quick label, click to see more detail.',
    zones: [
      {
        shortLabel: 'Intake',
        title: 'Raw material intake bay',
        description: 'Approved suppliers checked and logged as product arrives.',
        detail:
          'Deliveries arrive at a dedicated intake bay where paperwork, seal checks and temperatures are taken before anything enters the building.',
        image: '',
      },
      {
        shortLabel: 'Prep',
        title: 'Preparation area',
        description: 'Trimming, cutting and marination in stainless workspaces.',
        detail:
          'Controlled prep zones keep raw work together with their own tools, sinks and handwash points before product moves to cooking.',
        image: '',
      },
      {
        shortLabel: 'Cook',
        title: 'Cooking line',
        description: 'Core heat step with validated time and temperature profiles.',
        detail:
          'Batch and continuous cooking lines run defined recipes, with time–temperature records you can audit by date and product.',
        image: '',
      },
      {
        shortLabel: 'Blast',
        title: 'Chill / blast freezer',
        description: 'Rapid cooling to pull product out of the danger zone.',
        detail:
          'Chill rooms and blast freezers are sized to pull product down quickly, protecting shelf life and food safety.',
        image: '',
      },
      {
        shortLabel: 'Cold',
        title: 'Cold store & dispatch',
        description: 'Finished goods stored and marshalled ready to ship.',
        detail:
          'Finished pallets are held in mapped cold storage, then marshalled at the dock for containers and trucks.',
        image: '',
      },
      {
        shortLabel: 'Lab',
        title: 'Quality lab & retention',
        description: 'Samples and checks to release batches for sale.',
        detail:
          'Retention samples, rapid tests and formal lab work are tied back to production dates and batch codes.',
        image: '',
      },
      {
        shortLabel: 'Safety',
        title: 'Fire, safety & utilities',
        description: 'Fire panel, plant room and emergency infrastructure.',
        detail:
          'The services spine houses the fire panel, alarms and plant equipment, so safety checks never clash with production.',
        image: '',
      },
    ],
  },
});

export const factoryGallery = defineSection({
  key: 'factory.gallery',
  group: 'factory',
  label: 'Photo gallery',
  fields: [
    ...introFields,
    {
      kind: 'list',
      name: 'items',
      label: 'Photos',
      itemLabel: 'photo',
      titleField: 'title',
      max: 24,
      full: true,
      fields: [
        { kind: 'text', name: 'title', label: 'Title', full: true },
        { kind: 'image', name: 'image', label: 'Photo', folder: 'factory', full: true },
        { kind: 'textarea', name: 'caption', label: 'Caption', rows: 2, full: true },
      ],
    },
    { kind: 'textarea', name: 'note', label: 'Closing note', rows: 2, full: true },
  ],
  defaults: {
    eyebrow: 'On the factory floor',
    heading: 'Real spaces behind the process.',
    intro:
      'A snapshot of the key areas inside the factory – the same zones shown on the map, now in real photographs that buyers and auditors can recognise on a site visit.',
    items: [
      {
        title: 'Intake & loading bay',
        image: '/images/factory/intake-bay.jpg',
        caption:
          'Dedicated intake point for approved suppliers, with space for checks before product enters the main building.',
      },
      {
        title: 'Preparation & marination',
        image: '/images/factory/prep-area.jpg',
        caption:
          'Stainless work surfaces, colour-coded tools and clear segregation between raw and cooked areas.',
      },
      {
        title: 'Cooking line & controls',
        image: '/images/factory/cook-line.jpg',
        caption:
          'Line-of-sight from control panels to the cook step, with digital logs for time and temperature.',
      },
      {
        title: 'Chill & blast rooms',
        image: '/images/factory/blast-room.jpg',
        caption:
          'Chill and blast rooms sized for real volumes, bringing product through the danger zone quickly.',
      },
      {
        title: 'Cold store & marshaling',
        image: '/images/factory/cold-store.jpg',
        caption:
          'Racked cold storage and marshaling space so orders can be built, checked and loaded efficiently.',
      },
      {
        title: 'Fire & safety spine',
        image: '/images/factory/safety-corridor.jpg',
        caption:
          'Fire panel, exits and extinguishers placed along a central corridor, with routes clearly marked.',
      },
    ],
    note: 'As the facility expands with new equipment and lines, this gallery will be updated with fresh photography for buyers and auditors.',
  },
});

export const factorySections = [
  factoryHero,
  factoryRegulations,
  factoryBrands,
  factoryProcess,
  factoryMap,
  factoryGallery,
];

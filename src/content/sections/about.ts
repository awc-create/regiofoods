// src/content/sections/about.ts
import { defineSection } from '../fields';
import { chipsField, introFields, metaListField, pointsListField } from './common';

export const aboutHero = defineSection({
  key: 'about.hero',
  group: 'about',
  label: 'Hero',
  fields: [
    ...introFields,
    chipsField(),
    { kind: 'link', name: 'primaryCta', label: 'Main button' },
    { kind: 'link', name: 'secondaryCta', label: 'Second button' },
    metaListField(),
  ],
  defaults: {
    eyebrow: 'About Regio Foods',
    heading: 'A factory built on discipline,\nnot shortcuts.',
    intro:
      'Regio Foods was shaped around global food laws and safety regulations – from UK and EU standards through to GCC and North American import rules. Instead of treating them as a hurdle, we used them to fortify how we hire, train and run the plant every day.',
    chips: [
      'Export-focused manufacturing',
      'Safety & standards first',
      'Transparent, traceable batches',
    ],
    primaryCta: { label: 'Our story', href: '#our-story' },
    secondaryCta: { label: 'How we’re different', href: '#pillars' },
    meta: [
      { label: 'Founded for', value: 'International buyers' },
      { label: 'Built around', value: 'Global safety laws' },
      { label: 'Core promise', value: 'No shortcuts on safety' },
    ],
  },
});

export const aboutStory = defineSection({
  key: 'about.story',
  group: 'about',
  label: 'Our story',
  fields: [
    ...introFields,
    chipsField(),
    {
      kind: 'tags',
      name: 'paragraphs',
      label: 'Paragraphs',
      hint: 'One entry per paragraph.',
      full: true,
    },
    metaListField(),
    metaListField('facts', '“At a glance” panel'),
    { kind: 'textarea', name: 'note', label: 'Panel note', rows: 2, full: true },
  ],
  defaults: {
    eyebrow: 'Our story',
    heading: 'A modern factory in Kerala,\nplanned backwards from export standards.',
    intro:
      'Regio Foods was shaped around global food laws and safety regulations – from UK and EU standards through to GCC and North American import rules. Instead of treating them as a hurdle, we used them to fortify how we hire, train and run the plant every day.',
    chips: [
      'Export-focused manufacturing',
      'Global safety laws built-in',
      'Transparent, traceable batches',
    ],
    paragraphs: [
      'Instead of growing from a small kitchen into a factory, we designed the site to behave like a serious export plant from day one. Raw, cooked, packing and cold stores were laid out so product always moves forward.',
      'Safety systems, training and records were built in alongside ovens and chillers – not added later. That means we can show you how a batch moved, not just tell you.',
      'Today, that planning means every new product follows the same logic: documented steps, clean flows and a clear handover from one zone to the next.',
    ],
    meta: [
      { label: 'Founded for', value: 'International buyers' },
      { label: 'Built around', value: 'Global safety laws' },
      { label: 'Core promise', value: 'No shortcuts on safety' },
    ],
    facts: [
      { label: 'Location', value: 'Kerala, India' },
      { label: 'Focus', value: 'Frozen & ready-to-cook foods' },
      { label: 'Built for', value: 'Export buyers & audits' },
    ],
    note: 'The same mindset runs through everything we do: if we say a check happens, you should be able to see when, how and by whom it was done.',
  },
});

export const aboutValues = defineSection({
  key: 'about.values',
  group: 'about',
  label: 'Values',
  fields: [...introFields, pointsListField('items', 'Values', 'value')],
  defaults: {
    eyebrow: 'Our values',
    heading: 'Principles that actually show up on the factory floor.',
    intro: 'These aren’t slogans – they decide how we design layouts, write SOPs and train people.',
    items: [
      {
        title: 'Traceability as a default',
        body: 'Every ingredient, batch and process is logged so buyers can follow a product back to its source.',
      },
      {
        title: 'People before production',
        body: 'Well-trained teams, clear rules and safe working conditions come before line speeds.',
      },
      {
        title: 'No grey areas in hygiene',
        body: 'Cleaning, cooking, checks and sign-offs are recorded – not assumed.',
      },
      {
        title: 'Designed for export, not shortcuts',
        body: 'Layouts, flows and packaging are built to satisfy overseas regulations and buyer expectations.',
      },
      {
        title: 'Honesty in every batch',
        body: 'If a product or record falls short, we fix it instead of hiding it.',
      },
      {
        title: 'Continuous improvement',
        body: 'Feedback from audits, customers and staff is used to tighten our systems over time.',
      },
    ],
  },
});

export const aboutTeam = defineSection({
  key: 'about.team',
  group: 'about',
  label: 'Team',
  fields: [
    ...introFields,
    {
      kind: 'list',
      name: 'areas',
      label: 'Team areas',
      itemLabel: 'area',
      titleField: 'title',
      max: 10,
      full: true,
      fields: [
        { kind: 'text', name: 'title', label: 'Area', full: true },
        { kind: 'textarea', name: 'body', label: 'What this area covers', rows: 2, full: true },
        { kind: 'text', name: 'ownerName', label: 'Lead name' },
        { kind: 'text', name: 'ownerRole', label: 'Lead job title' },
        { kind: 'text', name: 'email', label: 'Email' },
        { kind: 'textarea', name: 'focus', label: 'Lead focus', rows: 2, full: true },
      ],
    },
    { kind: 'textarea', name: 'note', label: 'Note under lead card', rows: 2, full: true },
  ],
  defaults: {
    eyebrow: 'The team behind the factory',
    heading: 'A small, focused group with clear responsibilities.',
    intro:
      'Work is grouped into a few core areas – each with a named lead. Buyers can see who looks after production, safety, fire and the cold chain at a glance.',
    areas: [
      {
        title: 'Management & planning',
        body: 'Capacity planning, purchasing, customer relationships and long-term factory strategy.',
        ownerName: 'Mr. D. Krishnan',
        ownerRole: 'Factory Director',
        email: 'director@regiofoods.in',
        focus: 'Overall factory performance, major investments and buyer relationships.',
      },
      {
        title: 'Production & kitchen teams',
        body: 'Running the lines, following recipes, maintaining hygiene and keeping the day-to-day moving.',
        ownerName: 'Ms. R. Thomas',
        ownerRole: 'Production Manager',
        email: 'production@regiofoods.in',
        focus: 'Daily production plans, staffing and making sure recipes are followed on line.',
      },
      {
        title: 'Quality, safety & compliance',
        body: 'Checks, records, retention samples and making sure we meet both internal rules and external standards.',
        ownerName: 'Ms. L. Nair',
        ownerRole: 'Quality & HSE Lead',
        email: 'quality-safety@regiofoods.in',
        focus: 'Food safety checks, audit preparation, fire safety and health & safety training.',
      },
      {
        title: 'Cold chain & dispatch',
        body: 'Protecting chilled and frozen product, building orders and loading for onward transport.',
        ownerName: 'Mr. Rahul S.',
        ownerRole: 'Cold Chain Supervisor',
        email: 'coldchain@regiofoods.in',
        focus: 'Chill rooms, blast freezers, loading temperatures and dispatch paperwork.',
      },
    ],
    note: 'For specific queries on fire safety or health & safety, this lead works together with the Fire Safety Officer and HSE Officer to respond.',
  },
});

export const aboutPillars = defineSection({
  key: 'about.pillars',
  group: 'about',
  label: 'Pillars',
  fields: [
    ...introFields,
    {
      kind: 'list',
      name: 'items',
      label: 'Pillars',
      itemLabel: 'pillar',
      titleField: 'label',
      max: 8,
      full: true,
      fields: [
        { kind: 'text', name: 'label', label: 'Short name' },
        { kind: 'text', name: 'title', label: 'Card title' },
        { kind: 'textarea', name: 'body', label: 'Text', rows: 3, full: true },
        { kind: 'tags', name: 'bullets', label: 'Bullet points', full: true },
      ],
    },
    { kind: 'textarea', name: 'note', label: 'Note under card', rows: 2, full: true },
  ],
  defaults: {
    eyebrow: 'What shapes how we operate',
    heading: 'Using global regulations to strengthen everyday practice.',
    intro:
      'International food laws, workplace safety rules and export standards weren’t an afterthought. They were the blueprint for our factory and the way we run it.',
    items: [
      {
        label: 'Global standards',
        title: 'Built around international laws, not local minimums.',
        body: 'We used global food laws, workplace safety rules and fire regulations as the starting point for our design – from zoning and exits to documentation and traceability.',
        bullets: [
          'HACCP-style hazard analysis embedded in process flows.',
          'Guidance from Codex, EU and FDA hygiene principles.',
          'Fire safety and emergency planning inspired by UK/EU norms.',
        ],
      },
      {
        label: 'Health & safety',
        title: 'Health, fire and worker safety fortified by design.',
        body: 'Instead of adding signs after the fact, we planned PPE, walkways, exits and the fire spine into the building layout, reinforced through training and drills.',
        bullets: [
          'Clearly marked escape routes and muster points.',
          'PPE and handwash points placed where people actually work.',
          'Lock-out/tag-out and safe working procedures for equipment.',
        ],
      },
      {
        label: 'Traceability & trust',
        title: 'Documentation that makes audits predictable.',
        body: 'We treat paperwork as part of the product. If a step is critical, there is a record for it – so buyers and auditors can follow any batch from intake to dispatch.',
        bullets: [
          'Batch codes mapped to ingredients, dates and lines.',
          'Retention samples for key products and SKUs.',
          'Checklists that show what was done, when and by whom.',
        ],
      },
    ],
    note: 'These pillars are how we turn laws and regulations into everyday habits on the factory floor.',
  },
});

export const aboutTimeline = defineSection({
  key: 'about.timeline',
  group: 'about',
  label: 'Timeline',
  fields: [
    ...introFields,
    {
      kind: 'list',
      name: 'events',
      label: 'Milestones',
      itemLabel: 'milestone',
      titleField: 'title',
      max: 20,
      full: true,
      fields: [
        { kind: 'text', name: 'year', label: 'Year' },
        { kind: 'text', name: 'title', label: 'Title' },
        { kind: 'textarea', name: 'body', label: 'Text', rows: 2, full: true },
      ],
    },
    { kind: 'textarea', name: 'note', label: 'Closing note', rows: 2, full: true },
  ],
  defaults: {
    eyebrow: 'Timeline',
    heading: 'How the factory has taken shape.',
    intro:
      'A quick view of how we’ve moved from plans on paper to a working, export-ready facility.',
    events: [
      {
        year: '2023',
        title: 'Planning the site',
        body: 'Layout, flows and utilities designed with export requirements, hygiene and fire safety in mind.',
      },
      {
        year: '2024',
        title: 'Factory build & trial runs',
        body: 'Core infrastructure installed, test batches run and processes refined based on real outputs.',
      },
      {
        year: '2025',
        title: 'Cold chain & capacity',
        body: 'Blast freezers, cold stores and dispatch zones aligned to support export volumes.',
      },
      {
        year: '2026+',
        title: 'Certifications & partnerships',
        body: 'Formal standards, third-party audits and long-term buyer partnerships added as the site scales.',
      },
    ],
    note: 'The goal is steady progress: each year adds capacity, controls and trust – not just more volume.',
  },
});

export const aboutCommunity = defineSection({
  key: 'about.community',
  group: 'about',
  label: 'Community',
  fields: [
    ...introFields,
    chipsField(),
    {
      kind: 'tags',
      name: 'paragraphs',
      label: 'Paragraphs',
      hint: 'One entry per paragraph.',
      full: true,
    },
    pointsListField('items', 'List on the right', 'item'),
  ],
  defaults: {
    eyebrow: 'Community & responsibility',
    heading: 'Growth that respects people and place.',
    intro:
      'We believe a factory should add value to its region – not just move pallets through it.',
    chips: ['Local jobs', 'Safer workplaces', 'Cleaner operations'],
    paragraphs: [
      'That means steady employment, safe conditions and training that helps people grow with the business. It also means thinking about energy use, waste and how we handle the products we make, from raw intake to loaded trucks.',
      'As the site expands, we plan to deepen local partnerships, support staff development and invest in improvements that make the factory cleaner, safer and more efficient over time.',
    ],
    items: [
      {
        title: 'Local employment',
        body: 'Creating stable roles with clear responsibilities and training.',
      },
      {
        title: 'Safer workplaces',
        body: 'Protecting staff through design, PPE, training and procedures.',
      },
      {
        title: 'Efficient operations',
        body: 'Reducing waste and using equipment and cold stores responsibly.',
      },
    ],
  },
});

export const aboutCta = defineSection({
  key: 'about.cta',
  group: 'about',
  label: 'Closing call-to-action',
  fields: [
    ...introFields,
    { kind: 'link', name: 'primaryCta', label: 'Main button' },
    { kind: 'link', name: 'secondaryCta', label: 'Second button' },
    { kind: 'text', name: 'hint', label: 'Small print', full: true },
  ],
  defaults: {
    eyebrow: 'Next steps',
    heading: 'Ready to talk about products or capacity?',
    intro:
      'Whether you’re a buyer, distributor or partner, we’re happy to walk you through the factory, discuss volumes or explore new product ideas.',
    primaryCta: { label: 'Get in touch', href: '/contact' },
    secondaryCta: { label: 'Explore the factory', href: '/factory' },
    hint: 'We aim to respond to serious enquiries within one working day.',
  },
});

export const aboutSections = [
  aboutHero,
  aboutStory,
  aboutValues,
  aboutTeam,
  aboutPillars,
  aboutTimeline,
  aboutCommunity,
  aboutCta,
];

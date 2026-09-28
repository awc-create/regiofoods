// src/content/registry.ts
// Every editable section on the website, grouped the way the admin shows them.
import { defineSection, type SectionDef } from './fields';
import { homeSections } from './sections/home';
import { aboutSections } from './sections/about';
import { factorySections } from './sections/factory';
import { brandsSections } from './sections/brands';
import { pageSections } from './sections/pages';

/* ---------- SEO: one section per page ---------- */

const SEO_DEFAULTS: Record<string, { group: string; title: string; description: string }> = {
  home: {
    group: 'home',
    title: 'Regio Foods | Built for Food-Grade Scale',
    description:
      'Modern food manufacturing in Kerala — advanced processing, validated quality systems and a cold chain built for export buyers.',
  },
  about: {
    group: 'about',
    title: 'About Us | Regio Foods',
    description: 'Discover who we are, how we work and the standards our factory is built around.',
  },
  products: {
    group: 'productsPage',
    title: 'Products | Regio Foods',
    description:
      'Browse our range of frozen foods, groceries, snacks and bakery products built for export buyers.',
  },
  brands: {
    group: 'brands',
    title: 'Brands | Regio Foods',
    description:
      'Regio Foods operates within the Prince Foods group. Explore our brand family and manufacturing ranges built for export buyers.',
  },
  factory: {
    group: 'factory',
    title: 'Factory & Infrastructure | Regio Foods',
    description:
      'Explore our production facility, safety systems and export-ready infrastructure at Regio Foods.',
  },
  faq: {
    group: 'faq',
    title: 'FAQs | Regio Foods',
    description: 'Answers to common questions about Regio Foods, our products and export supply.',
  },
  contact: {
    group: 'contact',
    title: 'Contact Us | Regio Foods',
    description:
      'Get in touch with the Regio Foods team about products, samples and export supply.',
  },
  privacy: {
    group: 'legal',
    title: 'Privacy Policy | Regio Foods',
    description: 'How we collect, use and protect your personal data.',
  },
  terms: {
    group: 'legal',
    title: 'Terms of Service | Regio Foods',
    description: 'Terms for using the Regio Foods website.',
  },
  cookies: {
    group: 'legal',
    title: 'Cookie Policy | Regio Foods',
    description: 'How the Regio Foods website uses cookies.',
  },
};

export type SeoPage = keyof typeof SEO_DEFAULTS;

const seoSections = Object.entries(SEO_DEFAULTS).map(([page, d]) =>
  defineSection({
    key: `seo.${page}`,
    group: d.group,
    label: d.group === 'legal' ? `SEO — ${page}` : 'SEO',
    hint: 'What Google and link previews show for this page.',
    fields: [
      {
        kind: 'text',
        name: 'title',
        label: 'Page title',
        hint: 'Shown in the browser tab and Google results. Aim for under 60 characters.',
        full: true,
      },
      {
        kind: 'textarea',
        name: 'description',
        label: 'Description',
        rows: 3,
        hint: 'Shown under the title in Google. Aim for 120–160 characters.',
        full: true,
      },
      {
        kind: 'image',
        name: 'image',
        label: 'Share image',
        hint: 'Shown when the page is shared on social media or WhatsApp. 1200×630 works best.',
        folder: 'seo',
        full: true,
      },
    ],
    defaults: { title: d.title, description: d.description, image: '' },
  })
);

/* ---------- registry ---------- */

export const SECTIONS = [
  ...homeSections,
  ...aboutSections,
  ...factorySections,
  ...brandsSections,
  ...pageSections,
  ...seoSections,
] as SectionDef<Record<string, unknown>>[];

const BY_KEY = new Map(SECTIONS.map((s) => [s.key, s]));

export function getSectionDef(key: string): SectionDef<Record<string, unknown>> | undefined {
  return BY_KEY.get(key);
}

/** Admin navigation: page groups, in menu order. */
export const PAGE_GROUPS: { key: string; label: string; hint: string; href?: string }[] = [
  { key: 'home', label: 'Home', hint: 'Banner and home page sections', href: '/' },
  { key: 'about', label: 'About', hint: 'Story, values, team, timeline', href: '/about' },
  {
    key: 'productsPage',
    label: 'Products page',
    hint: 'Banner and product page wording',
    href: '/products',
  },
  { key: 'brands', label: 'Brands', hint: 'Brand list, logos and brand page', href: '/brands' },
  { key: 'factory', label: 'Factory', hint: 'Process, map and photo gallery', href: '/factory' },
  { key: 'faq', label: 'FAQ', hint: 'Questions and answers', href: '/faq' },
  { key: 'contact', label: 'Contact', hint: 'Contact page and enquiry email', href: '/contact' },
  {
    key: 'legal',
    label: 'Legal pages',
    hint: 'Privacy, terms and cookies',
    href: '/privacy-policy',
  },
];

export function sectionsForGroup(group: string) {
  return SECTIONS.filter((s) => s.group === group);
}

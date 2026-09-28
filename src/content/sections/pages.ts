// src/content/sections/pages.ts
// Products page, Contact, FAQ, legal pages and site-wide settings.
import { defineSection } from '../fields';
import { chipsField, introFields, metaListField } from './common';

/* ---------------- Products page ---------------- */

export const productsHero = defineSection({
  key: 'products.hero',
  group: 'productsPage',
  label: 'Hero',
  fields: [
    ...introFields,
    chipsField(),
    metaListField(),
    { kind: 'text', name: 'sideTitle', label: 'Side card heading' },
    metaListField('sideStats', 'Side card facts'),
    { kind: 'textarea', name: 'sideNote', label: 'Side card note', rows: 2, full: true },
  ],
  defaults: {
    eyebrow: 'Product range',
    heading: 'Frozen ready-to-cook foods, built for export shelves.',
    intro:
      'Layered parottas, appams, snacks and curries produced in a controlled environment. Each SKU is specced and labelled so buyers can drop them straight into their own systems.',
    chips: ['South Indian frozen breads', 'Heat-and-serve curries', 'Retail & food-service packs'],
    meta: [
      { label: 'Formats', value: 'Retail sleeves & bulk bags' },
      { label: 'Target', value: 'Export buyers & distributors' },
      { label: 'Support', value: 'Specs, artwork & COAs' },
    ],
    sideTitle: 'At a glance',
    sideStats: [
      { label: 'Core categories', value: 'Parottas, appams, snacks, curries' },
      { label: 'Pack sizes', value: 'Retail 300–900 g, food-service multi-kg' },
      { label: 'Labelling', value: 'Export-ready, multi-language' },
      { label: 'Support files', value: 'Specs, allergens, COAs' },
    ],
    sideNote:
      'For a full spec sheet or private-label options, share your target market and we’ll send relevant pack details.',
  },
});

export const productsCatalogue = defineSection({
  key: 'products.catalogue',
  group: 'productsPage',
  label: 'Catalogue heading',
  hint: 'Products and categories themselves are edited under Catalogue.',
  fields: [
    { kind: 'text', name: 'eyebrow', label: 'Small text above heading' },
    { kind: 'text', name: 'heading', label: 'Heading', full: true },
    { kind: 'textarea', name: 'intro', label: 'Intro text', rows: 2, full: true },
  ],
  defaults: {
    eyebrow: 'Catalogue',
    heading: 'Browse our product range.',
    intro:
      'These products are currently in production. Specifications and artwork can be tuned for private-label or regional requirements.',
  },
});

export const productsDetail = defineSection({
  key: 'products.detail',
  group: 'productsPage',
  label: 'Product page labels',
  hint: 'Wording used on every single-product page.',
  fields: [
    { kind: 'text', name: 'eyebrow', label: 'Small text above product name' },
    {
      kind: 'textarea',
      name: 'fallbackDescription',
      label: 'Text when a product has no description',
      rows: 2,
      full: true,
    },
    { kind: 'link', name: 'primaryCta', label: 'Main button' },
    { kind: 'link', name: 'secondaryCta', label: 'Second button' },
    { kind: 'text', name: 'imageNote', label: 'Note under photo', full: true },
    { kind: 'text', name: 'variantsNote', label: 'Note under variants table', full: true },
  ],
  defaults: {
    eyebrow: 'Product',
    fallbackDescription:
      'Product in the Regio Foods range. Specifications, artwork and pack formats can be tuned for your market.',
    primaryCta: { label: 'Request spec sheet', href: '/contact' },
    secondaryCta: { label: 'Talk about this product →', href: '/contact' },
    imageNote:
      'Pack shot for illustration. Final artwork and declarations can be adapted per market.',
    variantsNote:
      'Exact pack sizes, case counts and barcodes can be confirmed during development or listing.',
  },
});

/* ---------------- Contact ---------------- */

export const contactPage = defineSection({
  key: 'contact.page',
  group: 'contact',
  label: 'Contact page',
  hint: 'Email, phone and address shown on the site come from Settings → Site settings.',
  fields: [
    { kind: 'text', name: 'heading', label: 'Heading', full: true },
    { kind: 'textarea', name: 'intro', label: 'Intro text', rows: 2, full: true },
    { kind: 'text', name: 'submitLabel', label: 'Send button text' },
    { kind: 'text', name: 'successMessage', label: 'Message shown after sending', full: true },
    {
      kind: 'text',
      name: 'notifyEmail',
      label: 'Send new enquiries to',
      hint: 'Enquiries are always saved under Enquiries. If email is set up on the server, a copy is also sent here.',
      full: true,
    },
  ],
  defaults: {
    heading: 'Let’s Talk',
    intro: 'Drop us a message and we’ll get back to you within one working day.',
    submitLabel: 'Send Message',
    successMessage: 'Thank you — your message has been sent. We’ll be in touch shortly.',
    notifyEmail: '',
  },
});

/* ---------------- FAQ ---------------- */

export const faqPage = defineSection({
  key: 'faq.page',
  group: 'faq',
  label: 'Questions',
  fields: [
    { kind: 'text', name: 'heading', label: 'Heading', full: true },
    {
      kind: 'list',
      name: 'items',
      label: 'Questions',
      itemLabel: 'question',
      titleField: 'question',
      max: 60,
      full: true,
      fields: [
        { kind: 'text', name: 'question', label: 'Question', full: true },
        { kind: 'textarea', name: 'answer', label: 'Answer', rows: 3, full: true },
      ],
    },
  ],
  defaults: {
    heading: 'Frequently Asked Questions',
    items: [
      {
        question: 'What products does Regio Foods supply?',
        answer:
          'We supply a wide range of South Indian and Sri Lankan foods, including frozen flatbreads and ready-to-heat meals, groceries, rice, spices, snacks, bakery items and beverages.',
      },
      {
        question: 'Do you supply wholesale and trade customers?',
        answer:
          'Yes. We work with retailers, wholesalers, distributors and food-service businesses. Contact our team to discuss your requirements and volumes.',
      },
      {
        question: 'Can you produce private-label products?',
        answer:
          'Yes. We can develop and pack products under your own brand, with specifications and artwork tailored to your market.',
      },
      {
        question: 'Which markets do you export to?',
        answer:
          'We supply customers across the UK, Europe, the Middle East and beyond. Get in touch to confirm availability and logistics for your region.',
      },
      {
        question: 'What quality and food-safety standards do you follow?',
        answer:
          'Our products are manufactured under controlled food-safety systems with batch traceability and multi-stage quality checks.',
      },
      {
        question: 'How do I request a price list or samples?',
        answer:
          'Use the contact form or the “Get a Quote” button at the top of the page, and our team will respond with pricing and sample options.',
      },
    ],
  },
});

/* ---------------- Legal ---------------- */

const legalHint =
  'Start a line with "## " for a heading and "- " for a bullet point. Leave a blank line between paragraphs.';

export const legalPrivacy = defineSection({
  key: 'legal.privacy',
  group: 'legal',
  label: 'Privacy policy',
  fields: [
    { kind: 'text', name: 'title', label: 'Title', full: true },
    { kind: 'richtext', name: 'body', label: 'Content', rows: 18, hint: legalHint, full: true },
  ],
  defaults: {
    title: 'Privacy Policy',
    body: `This Privacy Policy explains how we handle your personal data when you visit our website.

## Information We Collect
We collect basic contact information (name, email) and usage data through cookies and analytics.

## How We Use Your Information
- To respond to inquiries and provide support
- To improve our services and website experience
- To comply with legal obligations

## GDPR Rights
If you're located in the UK or EU, you have rights under GDPR:
- Access your data
- Request corrections
- Request deletion
- Object to processing

To exercise your rights, contact us using the details on our Contact page.

## Cookie Usage
We use cookies to enhance your experience. Learn more on our Cookie Policy page.`,
  },
});

export const legalTerms = defineSection({
  key: 'legal.terms',
  group: 'legal',
  label: 'Terms of service',
  fields: [
    { kind: 'text', name: 'title', label: 'Title', full: true },
    { kind: 'richtext', name: 'body', label: 'Content', rows: 18, hint: legalHint, full: true },
  ],
  defaults: {
    title: 'Terms of Service',
    body: `By using this website you agree to the following terms.

## Use of this website
The content on this website is for general information about Regio Foods and its products. It may change without notice.

## Product information
Product details, pack sizes and images are for guidance. Final specifications are confirmed in writing when an order or listing is agreed.

## Intellectual property
Logos, text and images on this website belong to Regio Foods or the Prince Foods group and may not be reused without permission.

## Contact
If you have questions about these terms, please contact us through the Contact page.`,
  },
});

export const legalCookies = defineSection({
  key: 'legal.cookies',
  group: 'legal',
  label: 'Cookie policy',
  fields: [
    { kind: 'text', name: 'title', label: 'Title', full: true },
    { kind: 'richtext', name: 'body', label: 'Content', rows: 18, hint: legalHint, full: true },
  ],
  defaults: {
    title: 'Cookie Policy',
    body: `This page explains how this website uses cookies.

## What are cookies?
Cookies are small text files stored on your device when you visit a website.

## How we use cookies
- Essential cookies that make the website work
- Analytics cookies that help us understand how the website is used

## Managing cookies
You can block or delete cookies in your browser settings. Some parts of the website may not work without essential cookies.`,
  },
});

/* ---------------- Site settings ---------------- */

export const siteSettings = defineSection({
  key: 'site.settings',
  group: 'settings',
  label: 'Site settings',
  hint: 'Details used across the whole website: header, footer and contact sections.',
  fields: [
    { kind: 'text', name: 'siteName', label: 'Company name' },
    { kind: 'image', name: 'logo', label: 'Logo (header)', folder: 'site' },
    { kind: 'text', name: 'email', label: 'Contact email' },
    { kind: 'text', name: 'phone', label: 'Phone' },
    { kind: 'textarea', name: 'address', label: 'Address', rows: 2, full: true },
    { kind: 'link', name: 'headerCta', label: 'Header button (top right)' },
    {
      kind: 'list',
      name: 'socials',
      label: 'Social links',
      itemLabel: 'link',
      titleField: 'platform',
      max: 8,
      full: true,
      fields: [
        { kind: 'text', name: 'platform', label: 'Platform', placeholder: 'LinkedIn' },
        { kind: 'icon', name: 'icon', label: 'Icon' },
        { kind: 'text', name: 'url', label: 'Link', placeholder: 'https://', full: true },
      ],
    },
    { kind: 'text', name: 'copyright', label: 'Footer copyright name', full: true },
  ],
  defaults: {
    siteName: 'Regio Foods',
    logo: '/assets/regiofoods-logo.svg',
    email: 'info@regiofoods.com',
    phone: '+91 98765 43210',
    address: 'C-3430, Green Fields Colony, Sector 43, Faridabad, Haryana, India',
    headerCta: { label: 'Get a Quote', href: '/contact' },
    socials: [
      { platform: 'LinkedIn', icon: 'mdi:linkedin', url: '' },
      { platform: 'Instagram', icon: 'mdi:instagram', url: '' },
      { platform: 'Facebook', icon: 'mdi:facebook', url: '' },
    ],
    copyright: 'Regio Foods Pvt. Ltd.',
  },
});

export const pageSections = [
  productsHero,
  productsCatalogue,
  productsDetail,
  contactPage,
  faqPage,
  legalPrivacy,
  legalTerms,
  legalCookies,
  siteSettings,
];

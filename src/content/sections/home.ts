// src/content/sections/home.ts
import { defineSection, type Field } from '../fields';

const headingFields: Field[] = [
  { kind: 'text', name: 'heading', label: 'Heading', full: true },
  { kind: 'textarea', name: 'subheading', label: 'Intro text', rows: 2, full: true },
];

export const homeHero = defineSection({
  key: 'home.hero',
  group: 'home',
  label: 'Hero',
  hint: 'The large banner at the top of the home page.',
  fields: [
    { kind: 'text', name: 'eyebrow', label: 'Small text above title', hint: 'Optional.' },
    { kind: 'text', name: 'title', label: 'Title', full: true },
    { kind: 'textarea', name: 'subtitle', label: 'Subtitle', rows: 2, full: true },
    {
      kind: 'image',
      name: 'image',
      label: 'Background image',
      hint: 'Wide landscape photo, at least 2000px wide.',
      folder: 'home',
      full: true,
    },
    { kind: 'link', name: 'primaryCta', label: 'Main button' },
    { kind: 'link', name: 'secondaryCta', label: 'Second button' },
  ],
  defaults: {
    eyebrow: '',
    title: 'Built for Food-Grade Scale',
    subtitle:
      'Advanced processing, validated quality systems, and a cold chain you can trust — from intake to export.',
    image: '/assets/hero.png',
    primaryCta: { label: 'Book a Factory Visit', href: '/contact#visit' },
    secondaryCta: { label: 'Request Samples', href: '/contact#samples' },
  },
});

export const homeAbout = defineSection({
  key: 'home.about',
  group: 'home',
  label: 'About',
  hint: 'Section 1 below the banner.',
  fields: [
    ...headingFields,
    { kind: 'textarea', name: 'body', label: 'Body text', rows: 5, full: true },
    { kind: 'image', name: 'image', label: 'Image', folder: 'home', full: true },
    {
      kind: 'list',
      name: 'stats',
      label: 'Key facts',
      itemLabel: 'fact',
      titleField: 'label',
      max: 6,
      full: true,
      fields: [
        { kind: 'text', name: 'value', label: 'Value', placeholder: 'High-Volume' },
        { kind: 'text', name: 'label', label: 'Label', placeholder: 'Processing Capacity' },
      ],
    },
    { kind: 'link', name: 'cta', label: 'Button' },
  ],
  defaults: {
    heading: 'About Regio Foods',
    subheading:
      'A modern food manufacturing facility focused on quality, consistency, and export readiness.',
    body: 'We operate a state-of-the-art plant designed around hygiene-first layouts, validated processes, and continuous temperature and quality monitoring. Our teams follow strict SOPs from raw intake to blast freezing and primary packaging, ensuring repeatable outcomes for partners across retail, HORECA, and export markets.',
    image: '/assets/sections/factory-wide.jpg',
    stats: [
      { value: 'High-Volume', label: 'Processing Capacity' },
      { value: 'Multi-Stage', label: 'Quality Checks' },
      { value: 'Export-Ready', label: 'Dispatch' },
    ],
    cta: { label: 'Read our story', href: '/about' },
  },
});

export const homeProducts = defineSection({
  key: 'home.products',
  group: 'home',
  label: 'Products',
  hint: 'Section 2 — featured product cards.',
  fields: [
    ...headingFields,
    {
      kind: 'list',
      name: 'items',
      label: 'Featured products',
      itemLabel: 'product',
      titleField: 'name',
      max: 9,
      full: true,
      fields: [
        { kind: 'text', name: 'name', label: 'Name' },
        { kind: 'text', name: 'badge', label: 'Badge', placeholder: 'Frozen' },
        { kind: 'image', name: 'image', label: 'Image', folder: 'products', full: true },
        { kind: 'textarea', name: 'summary', label: 'Summary', rows: 2, full: true },
        { kind: 'tags', name: 'bullets', label: 'Bullet points', full: true },
        {
          kind: 'text',
          name: 'href',
          label: 'Link',
          hint: 'e.g. /products or /products/prince-foods-aripathiri',
          full: true,
        },
      ],
    },
    { kind: 'link', name: 'cta', label: 'Button' },
  ],
  defaults: {
    heading: 'Products We Make',
    subheading: 'Consistent, export-ready products—benchmarked for hygiene, taste, and shelf-life.',
    items: [
      {
        name: 'Parotta (Layered Flatbread)',
        badge: 'Frozen',
        image: '/assets/products/parotta.jpg',
        summary: 'Soft, flaky layers—quick-fry from thaw. Ideal for HORECA and retail.',
        bullets: ['Frozen | Ready-to-Cook', 'Consistent diameter & weight'],
        href: '/products',
      },
      {
        name: 'Marinated Chicken Cuts',
        badge: 'Ready-to-Cook',
        image: '/assets/products/marinade.jpg',
        summary: 'Pre-marinated, consistent yield—optimized for quick grilling/roasting.',
        bullets: ['Batch-tracked', 'Flavor profiles per market'],
        href: '/products',
      },
      {
        name: 'Smoked & Oven-Roasted SKUs',
        badge: 'Cooked',
        image: '/assets/products/smokehouse.jpg',
        summary: 'Oven and smokehouse-finished products with validated temperatures.',
        bullets: ['Thermal profiles logged', 'Primary packed for shelf-life'],
        href: '/products',
      },
    ],
    cta: { label: 'View all products', href: '/products' },
  },
});

export const homeBrands = defineSection({
  key: 'home.brands',
  group: 'home',
  label: 'Brands strip',
  hint: 'Section 3 — scrolling logos. The logos themselves are edited under Brands → Brand list.',
  fields: [
    { kind: 'text', name: 'title', label: 'Heading', full: true },
    { kind: 'text', name: 'subtitle', label: 'Intro text', full: true },
  ],
  defaults: {
    title: 'Brands in the Prince Foods group',
    subtitle: 'Named ranges manufactured and supplied across the portfolio.',
  },
});

export const homeFactory = defineSection({
  key: 'home.factory',
  group: 'home',
  label: 'Factory',
  hint: 'Section 4 — infrastructure photo cards.',
  fields: [
    ...headingFields,
    {
      kind: 'list',
      name: 'items',
      label: 'Cards',
      itemLabel: 'card',
      titleField: 'title',
      max: 6,
      full: true,
      fields: [
        { kind: 'text', name: 'title', label: 'Title' },
        { kind: 'text', name: 'href', label: 'Link', placeholder: '/factory' },
        { kind: 'image', name: 'photo', label: 'Photo', folder: 'factory', full: true },
        { kind: 'textarea', name: 'description', label: 'Description', rows: 2, full: true },
      ],
    },
    { kind: 'link', name: 'cta', label: 'Button' },
  ],
  defaults: {
    heading: 'Built to Handle Quality at Scale',
    subheading:
      'From raw intake to blast freezing and primary packaging, every step is controlled, logged, and audited.',
    items: [
      {
        title: 'Dock & Intake',
        href: '/factory',
        photo: '/assets/sections/dock.jpg',
        description: 'Controlled receiving with hygiene protocols and temperature checks.',
      },
      {
        title: 'Cold Storage',
        href: '/factory',
        photo: '/assets/sections/coldroom.jpg',
        description: 'Redundant cooling and continuous data logging for stable storage.',
      },
      {
        title: 'QA Lab',
        href: '/factory',
        photo: '/assets/sections/lab.jpg',
        description: 'TVC, coliforms, pathogens, moisture/salt—batch release only after pass.',
      },
    ],
    cta: { label: 'See infrastructure', href: '/factory' },
  },
});

export const homeMarkets = defineSection({
  key: 'home.markets',
  group: 'home',
  label: 'Markets',
  fields: [
    ...headingFields,
    {
      kind: 'list',
      name: 'markets',
      label: 'Market cards',
      itemLabel: 'market',
      titleField: 'title',
      max: 9,
      full: true,
      fields: [
        { kind: 'text', name: 'title', label: 'Title' },
        { kind: 'icon', name: 'icon', label: 'Icon' },
        { kind: 'textarea', name: 'blurb', label: 'Description', rows: 2, full: true },
      ],
    },
    { kind: 'tags', name: 'regions', label: 'Regions', full: true },
    { kind: 'link', name: 'cta', label: 'Button' },
  ],
  defaults: {
    heading: 'Markets We Serve',
    subheading:
      'From retail packs to HORECA and export distributors, our products are designed for consistency and shelf-life across diverse channels.',
    markets: [
      {
        title: 'Retail',
        icon: 'mdi:storefront-outline',
        blurb: 'Pack sizes and barcoding aligned to modern trade and e-commerce.',
      },
      {
        title: 'HORECA',
        icon: 'mdi:silverware-fork-knife',
        blurb: 'Consistent spec, yield, and format for kitchens and catering.',
      },
      {
        title: 'Distributors',
        icon: 'mdi:warehouse',
        blurb: 'Cartonization, pallet plans, and export-ready documentation.',
      },
      {
        title: 'Airline & Travel',
        icon: 'mdi:airplane',
        blurb: 'Cooked SKUs with validated thermal profiles and safety logs.',
      },
      {
        title: 'Private Label',
        icon: 'mdi:store-check',
        blurb: 'Custom recipes and compliant labels for target markets.',
      },
      {
        title: 'Cold Chain',
        icon: 'mdi:truck-delivery-outline',
        blurb: 'Intake to dispatch with continuous temperature monitoring.',
      },
    ],
    regions: ['UK & EU', 'Middle East', 'North America', 'Africa', 'South East Asia'],
    cta: { label: 'Talk to our export team', href: '/contact' },
  },
});

export const homeExport = defineSection({
  key: 'home.export',
  group: 'home',
  label: 'Export footprint',
  fields: [
    ...headingFields,
    {
      kind: 'list',
      name: 'stats',
      label: 'Stats',
      itemLabel: 'stat',
      titleField: 'label',
      max: 6,
      full: true,
      fields: [
        { kind: 'text', name: 'value', label: 'Value', placeholder: '15+' },
        { kind: 'text', name: 'label', label: 'Label', placeholder: 'Countries' },
      ],
    },
    { kind: 'tags', name: 'regions', label: 'Countries / regions', full: true },
    { kind: 'text', name: 'note', label: 'Small print', full: true },
  ],
  defaults: {
    heading: 'Export Footprint',
    subheading:
      'Supplying retailers, HORECA, and distributors across multiple regions with compliant documentation.',
    stats: [
      { value: '15+', label: 'Countries' },
      { value: '98%', label: 'OTIF (On-Time In-Full)' },
      { value: '24/7', label: 'Temperature Logs' },
    ],
    regions: [
      'United Kingdom',
      'Germany',
      'France',
      'Norway',
      'UAE',
      'Saudi Arabia',
      'Qatar',
      'Canada',
      'USA',
      'Kenya',
      'South Africa',
      'Malaysia',
    ],
    note: 'Regions shown are representative and expanding based on distributor coverage.',
  },
});

export const homeTestimonials = defineSection({
  key: 'home.testimonials',
  group: 'home',
  label: 'Testimonials',
  fields: [
    ...headingFields,
    {
      kind: 'list',
      name: 'items',
      label: 'Testimonials',
      itemLabel: 'testimonial',
      titleField: 'author',
      max: 20,
      full: true,
      fields: [
        { kind: 'textarea', name: 'quote', label: 'Quote', rows: 3, full: true },
        { kind: 'text', name: 'author', label: 'Name' },
        { kind: 'text', name: 'role', label: 'Role' },
        { kind: 'text', name: 'company', label: 'Company' },
        { kind: 'image', name: 'avatar', label: 'Photo (optional)', folder: 'testimonials' },
      ],
    },
  ],
  defaults: {
    heading: 'What Partners Say',
    subheading: 'Feedback from distributors, chefs, and retail buyers.',
    items: [
      {
        quote: 'Consistent quality and excellent cold-chain handling.',
        author: 'A. Perera',
        role: 'Procurement Lead',
        company: 'Lanka Foods',
        avatar: '',
      },
      {
        quote: 'Batch traceability and documentation are spot on for exports.',
        author: 'R. Ali',
        role: 'Director',
        company: 'EuroMart Distributors',
        avatar: '',
      },
      {
        quote: 'Ready-to-cook SKUs perform well in HORECA menus.',
        author: 'Chef N. Menon',
        role: '',
        company: 'Executive Chef',
        avatar: '',
      },
    ],
  },
});

export const homeCerts = defineSection({
  key: 'home.certs',
  group: 'home',
  label: 'Certifications',
  fields: [
    ...headingFields,
    {
      kind: 'list',
      name: 'items',
      label: 'Certificates',
      itemLabel: 'certificate',
      titleField: 'name',
      max: 20,
      full: true,
      fields: [
        { kind: 'text', name: 'name', label: 'Name' },
        {
          kind: 'text',
          name: 'href',
          label: 'Link (optional)',
          hint: 'A PDF or page with the certificate.',
        },
        { kind: 'image', name: 'logo', label: 'Logo', folder: 'certificates', full: true },
      ],
    },
  ],
  defaults: {
    heading: 'Certifications & Standards',
    subheading: 'Independently audited systems and food safety compliance.',
    items: [
      {
        name: 'HACCP',
        href: '/docs/certificates/haccp.pdf',
        logo: '/assets/certs/haccp.png',
      },
      {
        name: 'FSSAI',
        href: '/docs/certificates/fssai.pdf',
        logo: '/assets/certs/fssai.png',
      },
      { name: 'ISO 22000', href: '', logo: '/assets/certs/iso-22000.png' },
      { name: 'Export Licence', href: '', logo: '/assets/certs/india-export.png' },
      { name: 'Halal', href: '', logo: '/assets/certs/halal.png' },
    ],
  },
});

export const homeContact = defineSection({
  key: 'home.contact',
  group: 'home',
  label: 'Contact',
  hint: 'Email, phone and address come from Settings → Site settings.',
  fields: [...headingFields],
  defaults: {
    heading: 'Get in Touch',
    subheading:
      'We’re always open to new partnerships, distributor inquiries, and export collaborations.',
  },
});

export const homeSections = [
  homeHero,
  homeAbout,
  homeProducts,
  homeBrands,
  homeFactory,
  homeMarkets,
  homeExport,
  homeTestimonials,
  homeCerts,
  homeContact,
];

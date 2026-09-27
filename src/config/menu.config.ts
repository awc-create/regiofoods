export type NavLink = { slug: string; label: string };

export const NAV_LINKS: NavLink[] = [
  { slug: '', label: 'Home' },
  { slug: 'about', label: 'About' },
  { slug: 'products', label: 'Products' },
  { slug: 'brands', label: 'Brands' },
  { slug: 'factory', label: 'Factory' },
  { slug: 'faq', label: 'FAQ' },
  { slug: 'contact', label: 'Contact' },
];

// Call-to-action shown on the right of the navbar
export const NAV_CTA = { label: 'Get a Quote', href: '/contact' };

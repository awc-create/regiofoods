import { PAGE_GROUPS } from '@/content/registry';

export type NavItem = {
  href: string;
  label: string;
  hint?: string;
  icon: string;
  badge?: 'unread';
};
export type NavGroup = { title: string; items: NavItem[] };

const PAGE_ICONS: Record<string, string> = {
  home: 'mdi:home-outline',
  about: 'mdi:information-outline',
  productsPage: 'mdi:view-grid-outline',
  brands: 'mdi:tag-multiple-outline',
  factory: 'mdi:factory',
  faq: 'mdi:frequently-asked-questions',
  contact: 'mdi:email-outline',
  legal: 'mdi:file-document-outline',
};

export const NAV: NavGroup[] = [
  {
    title: 'Overview',
    items: [
      {
        href: '/admin',
        label: 'Dashboard',
        hint: 'Quick links and to-dos',
        icon: 'mdi:view-dashboard-outline',
      },
    ],
  },
  {
    title: 'Catalogue',
    items: [
      {
        href: '/admin/products',
        label: 'Products',
        hint: 'Add, edit, hide products',
        icon: 'mdi:package-variant-closed',
      },
      {
        href: '/admin/categories',
        label: 'Categories',
        hint: 'Tabs and sub-categories',
        icon: 'mdi:shape-outline',
      },
      {
        href: '/admin/products/import',
        label: 'Import & export',
        hint: 'Spreadsheet upload',
        icon: 'mdi:file-delimited-outline',
      },
    ],
  },
  {
    title: 'Website pages',
    items: PAGE_GROUPS.map((g) => ({
      href: `/admin/pages/${g.key}`,
      label: g.label,
      hint: g.hint,
      icon: PAGE_ICONS[g.key] ?? 'mdi:file-outline',
    })),
  },
  {
    title: 'Library & inbox',
    items: [
      {
        href: '/admin/media',
        label: 'Media library',
        hint: 'All uploaded images',
        icon: 'mdi:image-multiple-outline',
      },
      {
        href: '/admin/enquiries',
        label: 'Enquiries',
        hint: 'Messages from the website',
        icon: 'mdi:inbox-outline',
        badge: 'unread',
      },
    ],
  },
  {
    title: 'Settings',
    items: [
      {
        href: '/admin/settings',
        label: 'Settings',
        hint: 'Contact details, logo, users',
        icon: 'mdi:cog-outline',
      },
    ],
  },
];

export function findNav(pathname: string): NavItem | undefined {
  const all = NAV.flatMap((g) => g.items);
  // Longest matching href wins (so /admin/products/import beats /admin/products).
  return all
    .filter(
      (i) => pathname === i.href || (i.href !== '/admin' && pathname.startsWith(i.href + '/'))
    )
    .sort((a, b) => b.href.length - a.href.length)[0];
}

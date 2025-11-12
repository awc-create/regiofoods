import type { Metadata } from 'next';
import styles from './page.module.scss';
import HomeClient from './HomeClient';

export const metadata: Metadata = {
  title: 'Prince Foods Factory | Built for Food-Grade Scale',
  description:
    'Explore our state-of-the-art food manufacturing facility — advanced processing, validated quality systems, and a world-class cold chain designed for consistency and trust.',
  keywords: [
    'food manufacturing plant',
    'private label foods',
    'frozen food factory',
    'Prince Foods',
    'cold chain logistics',
    'HACCP certified',
    'BRCGS certified',
  ],
  openGraph: {
    title: 'Prince Foods Factory | Built for Food-Grade Scale',
    description:
      'State-of-the-art processing and packaging for export-quality South Asian foods — innovation in process, excellence in infrastructure.',
    url: 'https://www.princefoods.com',
    siteName: 'Prince Foods',
    images: [
      {
        url: '/assets/hero.png',
        width: 1200,
        height: 630,
        alt: 'Prince Foods Factory Infrastructure',
      },
    ],
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Prince Foods Factory | Built for Food-Grade Scale',
    description: 'A showcase of modern food manufacturing and export excellence.',
    images: ['/assets/hero.png'],
  },
  alternates: {
    canonical: 'https://www.princefoods.com',
  },
};

export default function Home() {
  return (
    <main className={styles.homeContainer}>
      <HomeClient />
    </main>
  );
}

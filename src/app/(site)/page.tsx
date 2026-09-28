import styles from './page.module.scss';
import HomeClient from './HomeClient';
import { getContent, seoMetadata } from '@/lib/content';
import { getBrands } from '@/lib/brands';
import {
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
} from '@/content/sections/home';
import { siteSettings } from '@/content/sections/pages';

export const dynamic = 'force-dynamic';

export function generateMetadata() {
  return seoMetadata('home', '/');
}

export default async function Home() {
  const [
    hero,
    about,
    products,
    brands,
    factory,
    markets,
    exportFootprint,
    testimonials,
    certs,
    contact,
    site,
    brandList,
  ] = await Promise.all([
    getContent(homeHero),
    getContent(homeAbout),
    getContent(homeProducts),
    getContent(homeBrands),
    getContent(homeFactory),
    getContent(homeMarkets),
    getContent(homeExport),
    getContent(homeTestimonials),
    getContent(homeCerts),
    getContent(homeContact),
    getContent(siteSettings),
    getBrands(),
  ]);

  return (
    <main className={styles.homeContainer}>
      <HomeClient
        content={{
          hero,
          about,
          products,
          brands,
          factory,
          markets,
          exportFootprint,
          testimonials,
          certs,
          contact,
        }}
        brands={brandList.strip}
        site={site}
      />
    </main>
  );
}

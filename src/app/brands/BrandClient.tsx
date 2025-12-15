'use client';

import BrandsHero from '@/components/brands/hero/BrandsHero';
import BrandFamily from '@/components/brands/family/BrandFamily';
import BrandGrid from '@/components/brands/grid/BrandGrid';
import PrivateLabel from '@/components/brands/privateLabel/PrivateLabel';
import BrandsCTA from '@/components/brands/cta/BrandsCTA';

import styles from './Brands.module.scss';

export default function BrandClient() {
  return (
    <div className={styles.page}>
      <BrandsHero />
      <BrandFamily />
      <BrandGrid />
      <PrivateLabel />
      <BrandsCTA />
    </div>
  );
}

import BrandsHero from '@/components/brands/hero/BrandsHero';
import BrandFamily from '@/components/brands/family/BrandFamily';
import BrandGrid, { type GridBrand } from '@/components/brands/grid/BrandGrid';
import PrivateLabel from '@/components/brands/privateLabel/PrivateLabel';
import BrandsCTA from '@/components/brands/cta/BrandsCTA';
import type {
  brandsHero,
  brandsFamily,
  brandsGrid,
  brandsPrivateLabel,
  brandsCta,
} from '@/content/sections/brands';

import styles from './Brands.module.scss';

export type BrandsContent = {
  hero: typeof brandsHero.defaults;
  family: typeof brandsFamily.defaults;
  grid: typeof brandsGrid.defaults;
  privateLabel: typeof brandsPrivateLabel.defaults;
  cta: typeof brandsCta.defaults;
};

export default function BrandClient({
  content,
  brands,
}: {
  content: BrandsContent;
  brands: GridBrand[];
}) {
  return (
    <div className={styles.page}>
      <BrandsHero content={content.hero} />
      <BrandFamily content={content.family} />
      <BrandGrid heading={content.grid} brands={brands} />
      <PrivateLabel content={content.privateLabel} />
      <BrandsCTA content={content.cta} />
    </div>
  );
}

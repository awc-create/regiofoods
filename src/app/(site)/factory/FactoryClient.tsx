import Hero from '@/components/factory/hero/Hero';
import Regulations from '@/components/factory/regulations/Regulations';
import ProcessOverview from '@/components/factory/process/ProcessOverview';
import FactoryMap from '@/components/factory/map/FactoryMap';
import InfrastructureGallery from '@/components/factory/gallery/InfrastructureGallery';
import BrandCarousel, { type CarouselBrand } from '@/components/brands/BrandCarousel';
import type {
  factoryHero,
  factoryRegulations,
  factoryBrands,
  factoryProcess,
  factoryMap,
  factoryGallery,
} from '@/content/sections/factory';

import styles from './Factory.module.scss';

export type FactoryContent = {
  hero: typeof factoryHero.defaults;
  regulations: typeof factoryRegulations.defaults;
  brands: typeof factoryBrands.defaults;
  process: typeof factoryProcess.defaults;
  map: typeof factoryMap.defaults;
  gallery: typeof factoryGallery.defaults;
};

export default function FactoryClient({
  content,
  brands,
}: {
  content: FactoryContent;
  brands: CarouselBrand[];
}) {
  return (
    <div className={styles.page}>
      <Hero content={content.hero} />
      <Regulations content={content.regulations} />
      <BrandCarousel
        brands={brands}
        title={content.brands.title}
        subtitle={content.brands.subtitle}
        speedSeconds={22}
      />
      <ProcessOverview content={content.process} />
      <FactoryMap content={content.map} />
      <InfrastructureGallery content={content.gallery} />
    </div>
  );
}

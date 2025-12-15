'use client';

import Hero from '@/components/factory/hero/Hero';
import Regulations from '@/components/factory/regulations/Regulations';
import ProcessOverview from '@/components/factory/process/ProcessOverview';
import FactoryMap from '@/components/factory/map/FactoryMap';
import InfrastructureGallery from '@/components/factory/gallery/InfrastructureGallery';
import BrandCarousel from '@/components/brands/BrandCarousel';

import styles from './Factory.module.scss';

export default function FactoryClient() {
  return (
    <div className={styles.page}>
      <Hero />

      <Regulations />

      {/* ✅ Credibility reinforcement after compliance */}
      <BrandCarousel
        title="Brands in the Prince Foods group"
        subtitle="Named ranges manufactured and supplied across the portfolio."
        speedSeconds={22}
      />
      <ProcessOverview />
      <FactoryMap />
      <InfrastructureGallery />
    </div>
  );
}

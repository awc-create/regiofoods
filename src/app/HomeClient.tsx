'use client';

import Hero from '@/components/home/hero/Hero';
import ProcessOverview from '@/components/home/process/ProcessOverview';
import AboutSection from '@/components/home/about/AboutSection';
import ProductsShowcase from '@/components/home/products/ProductsShowcase';
import CertificationsSection from '@/components/home/certs/CertificationsSection';
import MarketsServed from '@/components/home/markets/MarketsServed';
import TestimonialsCarousel from '@/components/home/testimonials/TestimonialsCarousel';
import ExportFootprint from '@/components/home/export/ExportFootprint';
import ContactSection from '@/components/home/contact/ContactSection';

export default function HomeClient() {
  return (
    <>
      <Hero
        title="Built for Food-Grade Scale"
        subtitle="Advanced processing, validated quality systems, and a cold chain you can trust — from intake to export."
        bgSrc="/assets/hero.png"
        ctaPrimary={{ label: 'Book a Factory Visit', href: '/contact#visit' }}
        ctaSecondary={{ label: 'Request Samples', href: '/contact#samples' }}
        scrollTargetId="intro"
        meta={{
          title: 'Prince Foods Factory | Advanced Food Manufacturing',
          description:
            'Discover our world-class food processing facility designed for quality, hygiene, and export excellence.',
          image: '/assets/hero.png',
          url: 'https://www.princefoods.com',
        }}
      />

      <ProcessOverview
        variant="photos"
        heading="Built to Handle Quality at Scale"
        subheading="From raw intake to blast freezing and primary packaging, every step is controlled, logged, and audited."
        items={[
          {
            photo: '/assets/sections/dock.jpg',
            title: 'Dock & Intake',
            description: 'Controlled receiving with hygiene protocols and temperature checks.',
            href: '/process-infrastructure#dock',
          },
          {
            photo: '/assets/sections/coldroom.jpg',
            title: 'Cold Storage',
            description: 'Redundant cooling and continuous data logging for stable storage.',
            href: '/process-infrastructure#cold',
          },
          {
            photo: '/assets/sections/lab.jpg',
            title: 'QA Lab',
            description: 'TVC, coliforms, pathogens, moisture/salt—batch release only after pass.',
            href: '/quality#lab',
          },
        ]}
        cta={{ label: 'See infrastructure', href: '/process-infrastructure' }}
      />

      <AboutSection
        imageSrc="/assets/sections/factory-wide.jpg"
        stats={[
          { label: 'Processing Capacity', value: 'High-Volume' },
          { label: 'Quality Checks', value: 'Multi-Stage' },
          { label: 'Dispatch', value: 'Export-Ready' },
        ]}
        cta={{ label: 'Read our story', href: '/about' }}
      />

      <ProductsShowcase
        items={[
          {
            name: 'Parotta (Layered Flatbread)',
            imageSrc: '/assets/products/parotta.jpg',
            summary: 'Soft, flaky layers—quick-fry from thaw. Ideal for HORECA and retail.',
            bullets: ['Frozen | Ready-to-Cook', 'Consistent diameter & weight'],
            slug: 'parotta',
            badge: 'Frozen',
          },
          {
            name: 'Marinated Chicken Cuts',
            imageSrc: '/assets/products/marinade.jpg',
            summary: 'Pre-marinated, consistent yield—optimized for quick grilling/roasting.',
            bullets: ['Batch-tracked', 'Flavor profiles per market'],
            slug: 'marinated-chicken',
            badge: 'Ready-to-Cook',
          },
          {
            name: 'Smoked & Oven-Roasted SKUs',
            imageSrc: '/assets/products/smokehouse.jpg',
            summary: 'Oven and smokehouse-finished products with validated temperatures.',
            bullets: ['Thermal profiles logged', 'Primary packed for shelf-life'],
            slug: 'smoked-oven-range',
            badge: 'Cooked',
          },
        ]}
        cta={{ label: 'View all products', href: '/products' }}
      />

      <MarketsServed
        markets={[
          {
            icon: 'mdi:storefront-outline',
            title: 'Retail',
            blurb: 'Pack sizes and barcoding aligned to modern trade and e-commerce.',
          },
          {
            icon: 'mdi:silverware-fork-knife',
            title: 'HORECA',
            blurb: 'Consistent spec, yield, and format for kitchens and catering.',
          },
          {
            icon: 'mdi:warehouse',
            title: 'Distributors',
            blurb: 'Cartonization, pallet plans, and export-ready documentation.',
          },
          {
            icon: 'mdi:airplane',
            title: 'Airline & Travel',
            blurb: 'Cooked SKUs with validated thermal profiles and safety logs.',
          },
          {
            icon: 'mdi:store-check',
            title: 'Private Label',
            blurb: 'Custom recipes and compliant labels for target markets.',
          },
          {
            icon: 'mdi:truck-delivery-outline',
            title: 'Cold Chain',
            blurb: 'Intake to dispatch with continuous temperature monitoring.',
          },
        ]}
        regions={['UK & EU', 'Middle East', 'North America', 'Africa', 'South East Asia']}
        cta={{ label: 'Talk to our export team', href: '/contact' }}
      />

      <TestimonialsCarousel
        items={[
          {
            quote: 'Consistent quality and excellent cold-chain handling.',
            author: 'A. Perera',
            role: 'Procurement Lead',
            company: 'Lanka Foods',
          },
          {
            quote: 'Batch traceability and documentation are spot on for exports.',
            author: 'R. Ali',
            role: 'Director',
            company: 'EuroMart Distributors',
          },
          {
            quote: 'Ready-to-cook SKUs perform well in HORECA menus.',
            author: 'Chef N. Menon',
            company: 'Executive Chef',
          },
        ]}
      />

      <ExportFootprint
        stats={[
          { value: '15+', label: 'Countries' },
          { value: '98%', label: 'OTIF (On-Time In-Full)' },
          { value: '24/7', label: 'Temperature Logs' },
        ]}
        regions={[
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
        ]}
        note="Regions shown are representative and expanding based on distributor coverage."
      />

      <ContactSection />

      <CertificationsSection
        items={[
          {
            name: 'HACCP',
            logoSrc: '/assets/certs/haccp.png',
            href: '/docs/certificates/haccp.pdf',
          },
          {
            name: 'FSSAI',
            logoSrc: '/assets/certs/fssai.png',
            href: '/docs/certificates/fssai.pdf',
          },
          { name: 'ISO 22000', logoSrc: '/assets/certs/iso-22000.png' },
          { name: 'Export Licence', logoSrc: '/assets/certs/india-export.png' },
          { name: 'Halal', logoSrc: '/assets/certs/halal.png' },
        ]}
      />

      {/* Placeholder below the fold so the scroll chevron lands somewhere */}
      <section id="intro" style={{ padding: '64px 0' }}>
        {/* You can replace this with your real sections later */}
      </section>
    </>
  );
}

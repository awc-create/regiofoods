import Hero from '@/components/home/hero/Hero';
import ProcessOverview from '@/components/home/process/ProcessOverview';
import AboutSection from '@/components/home/about/AboutSection';
import ProductsShowcase from '@/components/home/products/ProductsShowcase';
import CertificationsSection from '@/components/home/certs/CertificationsSection';
import MarketsServed from '@/components/home/markets/MarketsServed';
import TestimonialsCarousel from '@/components/home/testimonials/TestimonialsCarousel';
import ExportFootprint from '@/components/home/export/ExportFootprint';
import ContactSection from '@/components/home/contact/ContactSection';
import BrandCarousel, { type CarouselBrand } from '@/components/brands/BrandCarousel';
import type {
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
import type { siteSettings } from '@/content/sections/pages';

export type HomeContent = {
  hero: typeof homeHero.defaults;
  about: typeof homeAbout.defaults;
  products: typeof homeProducts.defaults;
  brands: typeof homeBrands.defaults;
  factory: typeof homeFactory.defaults;
  markets: typeof homeMarkets.defaults;
  exportFootprint: typeof homeExport.defaults;
  testimonials: typeof homeTestimonials.defaults;
  certs: typeof homeCerts.defaults;
  contact: typeof homeContact.defaults;
};

const link = (l: { label: string; href: string }) => (l.label ? l : undefined);

export default function HomeClient({
  content: c,
  brands,
  site,
}: {
  content: HomeContent;
  brands: CarouselBrand[];
  site: typeof siteSettings.defaults;
}) {
  return (
    <>
      <Hero
        eyebrow={c.hero.eyebrow || undefined}
        title={c.hero.title}
        subtitle={c.hero.subtitle}
        media={c.hero.image ? { kind: 'image', src: c.hero.image, preload: true } : undefined}
        ctas={[
          ...(c.hero.primaryCta.label
            ? [{ ...c.hero.primaryCta, variant: 'primary' as const }]
            : []),
          ...(c.hero.secondaryCta.label
            ? [{ ...c.hero.secondaryCta, variant: 'ghost' as const }]
            : []),
        ]}
        scrollTargetId="intro"
      />

      {/* 1. About */}
      <div id="intro">
        <AboutSection
          heading={c.about.heading}
          subheading={c.about.subheading}
          body={c.about.body}
          imageSrc={c.about.image || undefined}
          stats={c.about.stats}
          cta={link(c.about.cta)}
        />
      </div>

      {/* 2. Products */}
      <ProductsShowcase
        heading={c.products.heading}
        subheading={c.products.subheading}
        items={c.products.items.map((p) => ({
          name: p.name,
          imageSrc: p.image || undefined,
          summary: p.summary,
          bullets: p.bullets,
          href: p.href || undefined,
          badge: p.badge || undefined,
        }))}
        cta={link(c.products.cta)}
      />

      {/* 3. Brands */}
      <BrandCarousel
        brands={brands}
        title={c.brands.title}
        subtitle={c.brands.subtitle}
        speedSeconds={22}
      />

      {/* 4. Factory / infrastructure */}
      <ProcessOverview
        variant="photos"
        heading={c.factory.heading}
        subheading={c.factory.subheading}
        items={c.factory.items.map((it) => ({
          title: it.title,
          description: it.description,
          href: it.href || undefined,
          photo: it.photo,
        }))}
        cta={link(c.factory.cta)}
      />

      {/* Markets & export reach */}
      <MarketsServed
        heading={c.markets.heading}
        subheading={c.markets.subheading}
        markets={c.markets.markets}
        regions={c.markets.regions}
        cta={link(c.markets.cta)}
      />

      <ExportFootprint
        heading={c.exportFootprint.heading}
        subheading={c.exportFootprint.subheading}
        stats={c.exportFootprint.stats}
        regions={c.exportFootprint.regions}
        note={c.exportFootprint.note || undefined}
      />

      <TestimonialsCarousel
        heading={c.testimonials.heading}
        subheading={c.testimonials.subheading}
        items={c.testimonials.items.map((t) => ({
          quote: t.quote,
          author: t.author,
          role: t.role || undefined,
          company: t.company || undefined,
          avatarSrc: t.avatar || undefined,
        }))}
      />

      <CertificationsSection
        heading={c.certs.heading}
        subheading={c.certs.subheading}
        items={c.certs.items
          .filter((it) => it.logo)
          .map((it) => ({ name: it.name, logoSrc: it.logo, href: it.href || undefined }))}
      />

      {/* Contact */}
      <ContactSection heading={c.contact.heading} subheading={c.contact.subheading} site={site} />
    </>
  );
}

import ContactSection from '@/components/home/contact/ContactSection';
import { getContent, seoMetadata } from '@/lib/content';
import { contactPage, siteSettings } from '@/content/sections/pages';

export const dynamic = 'force-dynamic';

export function generateMetadata() {
  return seoMetadata('contact', '/contact');
}

export default async function ContactPage() {
  const [c, site] = await Promise.all([getContent(contactPage), getContent(siteSettings)]);

  return (
    <ContactSection
      pageMode
      source="contact"
      heading={c.heading}
      subheading={c.intro}
      submitLabel={c.submitLabel}
      successMessage={c.successMessage}
      site={site}
    />
  );
}

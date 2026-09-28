import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/footer/Footer';
import { getContent } from '@/lib/content';
import { siteSettings } from '@/content/sections/pages';

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const site = await getContent(siteSettings);

  return (
    <>
      <Navbar logo={site.logo} siteName={site.siteName} cta={site.headerCta} />
      <main>{children}</main>
      <Footer site={site} />
    </>
  );
}

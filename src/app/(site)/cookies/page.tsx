import LegalPage from '@/components/legal/LegalPage';
import { getContent, seoMetadata } from '@/lib/content';
import { legalCookies } from '@/content/sections/pages';

export const dynamic = 'force-dynamic';

export function generateMetadata() {
  return seoMetadata('cookies', '/cookies');
}

export default async function CookiesPage() {
  const c = await getContent(legalCookies);
  return <LegalPage title={c.title} body={c.body} />;
}

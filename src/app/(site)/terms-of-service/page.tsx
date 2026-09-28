import LegalPage from '@/components/legal/LegalPage';
import { getContent, seoMetadata } from '@/lib/content';
import { legalTerms } from '@/content/sections/pages';

export const dynamic = 'force-dynamic';

export function generateMetadata() {
  return seoMetadata('terms', '/terms-of-service');
}

export default async function TermsPage() {
  const c = await getContent(legalTerms);
  return <LegalPage title={c.title} body={c.body} />;
}

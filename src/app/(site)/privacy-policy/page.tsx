import LegalPage from '@/components/legal/LegalPage';
import { getContent, seoMetadata } from '@/lib/content';
import { legalPrivacy } from '@/content/sections/pages';

export const dynamic = 'force-dynamic';

export function generateMetadata() {
  return seoMetadata('privacy', '/privacy-policy');
}

export default async function PrivacyPage() {
  const c = await getContent(legalPrivacy);
  return <LegalPage title={c.title} body={c.body} />;
}

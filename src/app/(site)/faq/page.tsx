import FaqClient from './FaqClient';
import { getContent, seoMetadata } from '@/lib/content';
import { faqPage } from '@/content/sections/pages';

export const dynamic = 'force-dynamic';

export function generateMetadata() {
  return seoMetadata('faq', '/faq');
}

export default async function FaqPage() {
  const content = await getContent(faqPage);
  return <FaqClient content={content} />;
}

import AboutClient from './AboutClient';
import { getContent, seoMetadata } from '@/lib/content';
import {
  aboutHero,
  aboutStory,
  aboutValues,
  aboutTeam,
  aboutPillars,
  aboutTimeline,
  aboutCommunity,
  aboutCta,
} from '@/content/sections/about';

export const dynamic = 'force-dynamic';

export function generateMetadata() {
  return seoMetadata('about', '/about');
}

export default async function AboutPage() {
  const [hero, story, values, team, pillars, timeline, community, cta] = await Promise.all([
    getContent(aboutHero),
    getContent(aboutStory),
    getContent(aboutValues),
    getContent(aboutTeam),
    getContent(aboutPillars),
    getContent(aboutTimeline),
    getContent(aboutCommunity),
    getContent(aboutCta),
  ]);

  return <AboutClient content={{ hero, story, values, team, pillars, timeline, community, cta }} />;
}

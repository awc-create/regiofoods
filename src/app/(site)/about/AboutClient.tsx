// src/app/about/AboutClient.tsx
import Hero from '@/components/about/hero/Hero';
import Story from '@/components/about/story/Story';
import Values from '@/components/about/values/Values';
import Team from '@/components/about/team/Team';
import Pillars from '@/components/about/pillars/Pillars';
import Timeline from '@/components/about/timeline/Timeline';
import Community from '@/components/about/community/Community';
import Contact from '@/components/about/contact/Contact';
import type {
  aboutHero,
  aboutStory,
  aboutValues,
  aboutTeam,
  aboutPillars,
  aboutTimeline,
  aboutCommunity,
  aboutCta,
} from '@/content/sections/about';

import styles from './About.module.scss';

export type AboutContent = {
  hero: typeof aboutHero.defaults;
  story: typeof aboutStory.defaults;
  values: typeof aboutValues.defaults;
  team: typeof aboutTeam.defaults;
  pillars: typeof aboutPillars.defaults;
  timeline: typeof aboutTimeline.defaults;
  community: typeof aboutCommunity.defaults;
  cta: typeof aboutCta.defaults;
};

export default function AboutClient({ content }: { content: AboutContent }) {
  return (
    <div className={styles.page}>
      <Hero content={content.hero} />
      <Story content={content.story} />
      <Values content={content.values} />
      <Team content={content.team} />
      <Pillars content={content.pillars} />
      <Timeline content={content.timeline} />
      <Community content={content.community} />
      <Contact content={content.cta} />
    </div>
  );
}

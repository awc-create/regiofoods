// src/app/factory/FactoryClient.tsx
'use client';

import Hero from '@/components/about/hero/Hero';
import Story from '@/components/about/story/Story';
import Values from '@/components/about/values/Values';
import Team from '@/components/about/team/Team';
import Pillars from '@/components/about/pillars/Pillars';
import Timeline from '@/components/about/timeline/Timeline';
import Community from '@/components/about/community/Community';
import Contact from '@/components/about/contact/Contact';

import styles from './About.module.scss';

export default function AboutClient() {
  return (
    <div className={styles.page}>
      <Hero />
      <Story />
      <Values />
      <Team />
      <Pillars />
      <Timeline />
      <Community />
      <Contact />
    </div>
  );
}

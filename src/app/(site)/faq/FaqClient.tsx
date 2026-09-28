'use client';

import { useState } from 'react';
import styles from './Faq.module.scss';

import type { faqPage } from '@/content/sections/pages';

type Props = { content: typeof faqPage.defaults };

export default function FaqClient({ content }: Props) {
  const faqs = content.items;
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section className={styles.page}>
      <div className={styles.wrapper}>
        <h1>{content.heading}</h1>
        <div className={styles.accordion}>
          {faqs.map((item, index) => (
            <div key={index} className={styles.item}>
              <button className={styles.question} onClick={() => toggle(index)}>
                {item.question}
                <span className={styles.icon}>{openIndex === index ? '−' : '+'}</span>
              </button>
              <div className={`${styles.answer} ${openIndex === index ? styles.open : ''}`}>
                <p>{item.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

'use client';

import { useState } from 'react';
import styles from './Faq.module.scss';

// Draft questions — final wording to be confirmed by Regio Foods
const faqs = [
  {
    question: 'What products does Regio Foods supply?',
    answer:
      'We supply a wide range of South Indian and Sri Lankan foods, including frozen flatbreads and ready-to-heat meals, groceries, rice, spices, snacks, bakery items and beverages.',
  },
  {
    question: 'Do you supply wholesale and trade customers?',
    answer:
      'Yes. We work with retailers, wholesalers, distributors and food-service businesses. Contact our team to discuss your requirements and volumes.',
  },
  {
    question: 'Can you produce private-label products?',
    answer:
      'Yes. We can develop and pack products under your own brand, with specifications and artwork tailored to your market.',
  },
  {
    question: 'Which markets do you export to?',
    answer:
      'We supply customers across the UK, Europe, the Middle East and beyond. Get in touch to confirm availability and logistics for your region.',
  },
  {
    question: 'What quality and food-safety standards do you follow?',
    answer:
      'Our products are manufactured under controlled food-safety systems with batch traceability and multi-stage quality checks.',
  },
  {
    question: 'How do I request a price list or samples?',
    answer:
      'Use the contact form or the “Get a Quote” button at the top of the page, and our team will respond with pricing and sample options.',
  },
];

export default function FaqClient() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section className={styles.page}>
      <div className={styles.wrapper}>
        <h1>Frequently Asked Questions</h1>
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

// src/app/factory/page.tsx
import type { Metadata } from 'next';
import FactoryClient from './FactoryClient';

export const metadata: Metadata = {
  title: 'Factory & Infrastructure | Regio Foods',
  description:
    'Explore our production facility, safety systems and export-ready infrastructure at Regio Foods.',
};

export default function FactoryPage() {
  return <FactoryClient />;
}

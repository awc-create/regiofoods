import type { Metadata } from 'next';
import ProductClient from './ProductClient';

export const metadata: Metadata = {
  title: 'Products | Regio Foods',
  description:
    'Browse our frozen ready-to-cook range: parottas, appams, curries and snacks built for export buyers.',
};

export default function ProductsPage() {
  return <ProductClient />;
}

import type { Metadata } from 'next';
import BrandClient from './BrandClient';

export const metadata: Metadata = {
  title: 'Brands | Regio Foods',
  description:
    'Regio Foods operates within the Prince Foods group. Explore our brand family and manufacturing ranges built for export buyers.',
};

export default function BrandsPage() {
  return <BrandClient />;
}

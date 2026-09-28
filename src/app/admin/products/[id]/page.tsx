import ProductForm from '@/components/admin/products/ProductForm';

export const metadata = { title: 'Edit product' };

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ProductForm id={id} />;
}

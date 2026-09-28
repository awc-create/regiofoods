import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { PAGE_GROUPS } from '@/content/registry';
import PageEditor from '@/components/admin/editor/PageEditor';

type Props = { params: Promise<{ group: string }> };

export async function generateMetadata({ params }: Props) {
  const { group } = await params;
  return { title: PAGE_GROUPS.find((g) => g.key === group)?.label ?? 'Page' };
}

export default async function AdminPageEditor({ params }: Props) {
  const { group } = await params;
  if (!PAGE_GROUPS.some((g) => g.key === group)) notFound();
  return (
    <Suspense>
      <PageEditor group={group} />
    </Suspense>
  );
}

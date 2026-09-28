import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/requireAdmin';
import { isStorageConfigured } from '@/lib/storage';
import { isMailConfigured } from '@/lib/mailer';

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;

  const [
    products,
    hidden,
    noImage,
    uncategorised,
    categories,
    media,
    unread,
    recentEdits,
    recentMessages,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.product.count({ where: { visible: false } }),
    prisma.product.count({ where: { variants: { none: { imageUrl: { not: '' } } } } }),
    prisma.product.count({ where: { categoryId: null } }),
    prisma.category.count(),
    prisma.media.count(),
    prisma.contactMessage.count({ where: { read: false } }),
    prisma.contentBlock.findMany({
      orderBy: { updatedAt: 'desc' },
      take: 6,
      select: { key: true, updatedAt: true, updatedBy: true },
    }),
    prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: { id: true, name: true, email: true, createdAt: true, read: true },
    }),
  ]);

  return NextResponse.json({
    products,
    hidden,
    noImage,
    uncategorised,
    categories,
    media,
    unread,
    recentEdits,
    recentMessages,
    storage: isStorageConfigured(),
    mail: isMailConfigured(),
  });
}

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/requireAdmin';
import { deleteFromStorage, isStorageConfigured } from '@/lib/storage';
import { bad, readJson, str } from '@/lib/api';

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Ctx) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { id } = await params;
  const body = await readJson(req);
  if (!body) return bad('Nothing to save');

  const media = await prisma.media.update({
    where: { id },
    data: {
      ...(typeof body.name === 'string' ? { name: str(body.name, 200) } : {}),
      ...(typeof body.alt === 'string' ? { alt: str(body.alt, 300) } : {}),
    },
  });
  return NextResponse.json(media);
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { id } = await params;

  const media = await prisma.media.findUnique({ where: { id } });
  if (!media) return bad('Not found', 404);

  if (media.objectKey && isStorageConfigured()) {
    try {
      await deleteFromStorage(media.objectKey);
    } catch (err) {
      console.error('media delete from storage failed', err);
    }
  }
  await prisma.media.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}

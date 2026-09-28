import { NextResponse } from 'next/server';
import path from 'node:path';
import { mkdir, writeFile } from 'node:fs/promises';
import crypto from 'node:crypto';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/requireAdmin';
import { buildObjectKey, isStorageConfigured, uploadBufferToStorage } from '@/lib/storage';
import { bad, str } from '@/lib/api';

const IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
  'image/gif',
  'image/svg+xml',
];
const DOC_TYPES = ['application/pdf'];
const MAX_IMAGE = 12 * 1024 * 1024;
const MAX_DOC = 25 * 1024 * 1024;

export async function GET(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const url = new URL(req.url);
  const q = str(url.searchParams.get('q'), 100);
  const folder = str(url.searchParams.get('folder'), 50);
  const type = str(url.searchParams.get('type'), 20);
  const take = Math.min(200, Number(url.searchParams.get('take')) || 60);
  const skip = Math.max(0, Number(url.searchParams.get('skip')) || 0);

  const where = {
    ...(q ? { name: { contains: q, mode: 'insensitive' as const } } : {}),
    ...(folder ? { folder } : {}),
    ...(type ? { type } : {}),
  };

  const [items, total] = await Promise.all([
    prisma.media.findMany({ where, orderBy: { createdAt: 'desc' }, take, skip }),
    prisma.media.count({ where }),
  ]);

  return NextResponse.json({ items, total, storage: isStorageConfigured() });
}

export async function POST(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return bad('Upload failed — no file received.');
  }

  const file = form.get('file');
  const folder = str(form.get('folder'), 50) || 'general';
  if (!(file instanceof File) || file.size === 0) return bad('No file received.');

  const mime = file.type || 'application/octet-stream';
  const isImage = IMAGE_TYPES.includes(mime);
  const isDoc = DOC_TYPES.includes(mime);
  if (!isImage && !isDoc) {
    return bad('Unsupported file. Use JPG, PNG, WEBP, AVIF, GIF, SVG or PDF.');
  }
  if (isImage && file.size > MAX_IMAGE) return bad('Image too large — the limit is 12 MB.');
  if (isDoc && file.size > MAX_DOC) return bad('PDF too large — the limit is 25 MB.');

  const baseName = file.name.replace(/\.[^.]+$/, '') || 'image';
  const buffer = Buffer.from(await file.arrayBuffer());

  let url: string;
  let objectKey: string | null = null;

  if (isStorageConfigured()) {
    const key = buildObjectKey({ folder, itemName: baseName, filename: file.name });
    const res = await uploadBufferToStorage({ buffer, objectKey: key, contentType: mime });
    url = res.url;
    objectKey = res.objectKey;
  } else if (process.env.NODE_ENV !== 'production') {
    // Local development without a bucket: keep files in public/uploads.
    const ext = (file.name.split('.').pop() || 'bin').toLowerCase();
    const name = `${crypto.randomUUID()}.${ext}`;
    const dir = path.join(process.cwd(), 'public', 'uploads', folder);
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, name), buffer);
    url = `/uploads/${folder}/${name}`;
  } else {
    return bad('Image storage is not configured on the server (HETZNER_S3_* settings).', 500);
  }

  const media = await prisma.media.create({
    data: {
      url,
      objectKey,
      name: baseName.slice(0, 200),
      size: file.size,
      type: isImage ? 'image' : 'document',
      folder,
    },
  });

  return NextResponse.json(media, { status: 201 });
}

// src/lib/storage.ts
// Hetzner Object Storage (S3-compatible). Same env vars and key layout as Prince Foods.
import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import crypto from 'node:crypto';

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value || !value.trim()) throw new Error(`Missing env: ${name}`);
  return value.trim();
}

let cached: { bucket: string; publicBaseUrl: string; client: S3Client } | null = null;

function getStorageConfig() {
  if (cached) return cached;
  const bucket = requiredEnv('HETZNER_S3_BUCKET');
  cached = {
    bucket,
    publicBaseUrl: requiredEnv('HETZNER_S3_PUBLIC_BASE_URL').replace(/\/$/, ''),
    client: new S3Client({
      region: requiredEnv('HETZNER_S3_REGION'),
      endpoint: requiredEnv('HETZNER_S3_ENDPOINT'),
      credentials: {
        accessKeyId: requiredEnv('HETZNER_S3_ACCESS_KEY_ID'),
        secretAccessKey: requiredEnv('HETZNER_S3_SECRET_ACCESS_KEY'),
      },
    }),
  };
  return cached;
}

export function isStorageConfigured(): boolean {
  return [
    'HETZNER_S3_BUCKET',
    'HETZNER_S3_ENDPOINT',
    'HETZNER_S3_REGION',
    'HETZNER_S3_ACCESS_KEY_ID',
    'HETZNER_S3_SECRET_ACCESS_KEY',
    'HETZNER_S3_PUBLIC_BASE_URL',
  ].every((k) => Boolean(process.env[k]?.trim()));
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function getExtension(filename: string): string {
  const parts = filename.split('.');
  if (parts.length < 2) return 'bin';
  return parts.pop()?.toLowerCase() ?? 'bin';
}

/** regiofoods/<folder>/images/<item-name>/<uuid>.<ext> */
export function buildObjectKey(params: { folder: string; itemName: string; filename: string }) {
  const root = process.env.HETZNER_S3_ROOT?.trim() || 'regiofoods';
  return [
    slugify(root),
    slugify(params.folder) || 'general',
    'images',
    slugify(params.itemName) || 'image',
    `${crypto.randomUUID()}.${getExtension(params.filename)}`,
  ].join('/');
}

export async function uploadBufferToStorage(params: {
  buffer: Buffer;
  objectKey: string;
  contentType: string;
}) {
  const { bucket, client, publicBaseUrl } = getStorageConfig();
  const acl = process.env.HETZNER_S3_ACL?.trim();

  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: params.objectKey,
      Body: params.buffer,
      ContentType: params.contentType,
      CacheControl: 'public, max-age=31536000, immutable',
      ...(acl ? { ACL: acl as 'public-read' } : {}),
    })
  );

  return { objectKey: params.objectKey, url: `${publicBaseUrl}/${params.objectKey}` };
}

export async function deleteFromStorage(objectKey: string) {
  const { bucket, client } = getStorageConfig();
  await client.send(new DeleteObjectCommand({ Bucket: bucket, Key: objectKey }));
}

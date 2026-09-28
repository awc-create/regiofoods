export type MediaItem = {
  id: string;
  url: string;
  name: string;
  alt: string | null;
  size: number;
  type: string;
  folder: string;
  createdAt: string;
};

export async function uploadFile(file: File, folder = 'general'): Promise<MediaItem> {
  const fd = new FormData();
  fd.set('file', file);
  fd.set('folder', folder);
  const res = await fetch('/api/admin/media', { method: 'POST', body: fd });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error || 'Upload failed.');
  return json as MediaItem;
}

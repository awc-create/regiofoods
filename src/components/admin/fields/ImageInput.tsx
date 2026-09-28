'use client';

import { useRef, useState } from 'react';
import { Icon } from '@iconify/react';
import MediaPicker from '../media/MediaPicker';
import { uploadFile } from '../media/upload';
import styles from './Fields.module.scss';

type Props = {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
};

export default function ImageInput({ value, onChange, folder }: Props) {
  const [picking, setPicking] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showUrl, setShowUrl] = useState(false);
  const [broken, setBroken] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function upload(file: File) {
    setError(null);
    setUploading(true);
    try {
      const item = await uploadFile(file, folder);
      setBroken(false);
      onChange(item.url);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className={styles.image}>
      <div className={styles.imagePreview}>
        {value && !broken ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="" onError={() => setBroken(true)} onLoad={() => setBroken(false)} />
        ) : (
          <span className={styles.imageEmpty}>
            <Icon icon={value ? 'mdi:image-broken-variant' : 'mdi:image-outline'} />
            {value ? 'Image not found' : 'No image'}
          </span>
        )}
      </div>

      <div className={styles.imageSide}>
        <div className={styles.imageButtons}>
          <button type="button" className={styles.smallPrimary} onClick={() => setPicking(true)}>
            <Icon icon="mdi:image-search-outline" /> Choose from library
          </button>
          <button
            type="button"
            className={styles.smallGhost}
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
          >
            <Icon icon={uploading ? 'mdi:loading' : 'mdi:upload'} />
            {uploading ? 'Uploading…' : 'Upload new'}
          </button>
          {value && (
            <button type="button" className={styles.smallGhost} onClick={() => onChange('')}>
              <Icon icon="mdi:close" /> Remove
            </button>
          )}
        </div>

        <button type="button" className={styles.linkBtn} onClick={() => setShowUrl((v) => !v)}>
          {showUrl ? 'Hide image address' : 'Paste an image address instead'}
        </button>
        {showUrl && (
          <input
            className={styles.input}
            value={value}
            placeholder="https://…"
            onChange={(e) => {
              setBroken(false);
              onChange(e.target.value);
            }}
          />
        )}
        {error && <p className={styles.errorText}>{error}</p>}
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void upload(f);
          e.target.value = '';
        }}
      />

      {picking && (
        <MediaPicker
          folder={folder}
          onClose={() => setPicking(false)}
          onPick={(item) => {
            setBroken(false);
            onChange(item.url);
          }}
        />
      )}
    </div>
  );
}

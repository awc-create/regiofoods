'use client';

import Modal from '../common/Modal';
import MediaGrid from './MediaGrid';
import type { MediaItem } from './upload';

type Props = {
  onPick: (item: MediaItem) => void;
  onClose: () => void;
  folder?: string;
};

export default function MediaPicker({ onPick, onClose, folder }: Props) {
  return (
    <Modal title="Choose an image" onClose={onClose} wide>
      <MediaGrid
        folder={folder}
        imagesOnly
        onPick={(item) => {
          onPick(item);
          onClose();
        }}
      />
    </Modal>
  );
}

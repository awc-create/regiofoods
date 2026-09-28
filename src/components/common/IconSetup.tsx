'use client';

import { addCollection } from '@iconify/react';
import mdi from '@/lib/icons-mdi.json';

// Register bundled icons once, so they render without the Iconify web API.
addCollection(mdi as Parameters<typeof addCollection>[0]);

export default function IconSetup() {
  return null;
}

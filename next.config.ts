import type { NextConfig } from 'next';

// Host of the Hetzner Object Storage bucket, e.g. regiofoods.fsn1.your-objectstorage.com
const storageHost = (() => {
  try {
    return process.env.HETZNER_S3_PUBLIC_BASE_URL
      ? new URL(process.env.HETZNER_S3_PUBLIC_BASE_URL).hostname
      : null;
  } catch {
    return null;
  }
})();

const nextConfig: NextConfig = {
  // Node server (Docker on Hetzner) — pages read content from the database.
  output: 'standalone',
  reactStrictMode: true,
  serverExternalPackages: ['bcryptjs'],

  images: {
    // Serve modern formats at good quality — sharper product photos.
    formats: ['image/avif', 'image/webp'],
    qualities: [75, 85, 90],
    remotePatterns: [
      { protocol: 'https', hostname: '**.your-objectstorage.com' },
      ...(storageHost ? [{ protocol: 'https' as const, hostname: storageHost }] : []),
      // Existing product photos (from the old shop) until they are replaced.
      { protocol: 'https', hostname: 'static.wixstatic.com' },
    ],
    // Logos are often SVG; they come from our own bucket.
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;

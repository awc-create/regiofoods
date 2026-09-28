import type { Metadata } from 'next';
import '@/styles/Global.scss';
import IconSetup from '@/components/common/IconSetup';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://regiofoods.in';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: 'Regio Foods', template: '%s' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <IconSetup />
        {children}
      </body>
    </html>
  );
}

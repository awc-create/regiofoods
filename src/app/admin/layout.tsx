import type { Metadata } from 'next';
import '@/styles/admin.global.scss';
import AdminShell from '@/components/admin/shell/AdminShell';

export const metadata: Metadata = {
  title: { default: 'Admin | Regio Foods', template: '%s | Regio Foods Admin' },
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-root">
      <AdminShell>{children}</AdminShell>
    </div>
  );
}

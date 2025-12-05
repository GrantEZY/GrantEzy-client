import { Metadata } from 'next';

import RoleSelectionMenu from '@/components/admin/RoleSelectionMenu';
import { AuthGuard } from '@/components/guards/AuthGuard';
import AdminLayout from '@/components/layout/AdminLayout';

export const metadata: Metadata = {
  title: 'Admin Dashboard - GrantEzy',
  description: 'Administrative dashboard for managing startups and entrepreneurs in residence',
};

export default function AdminPage() {
  return (
    <AuthGuard>
      <AdminLayout>
        <RoleSelectionMenu />
      </AdminLayout>
    </AuthGuard>
  );
}

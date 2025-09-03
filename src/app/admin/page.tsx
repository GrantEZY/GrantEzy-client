import { Metadata } from 'next';
import AdminLayout from '@/components/layout/AdminLayout';
import RoleSelectionMenu from '@/components/admin/RoleSelectionMenu';

export const metadata: Metadata = {
  title: 'Admin Dashboard - GrantEzy',
  description: 'Administrative dashboard for managing startups and entrepreneurs in residence',
};

export default function AdminPage() {
  return (
    <AdminLayout>
      <RoleSelectionMenu />
    </AdminLayout>
  );
}

import AdminLayout from '@/components/layout/AdminLayout';
import RoleSelectionMenu from '@/components/admin/RoleSelectionMenu';

export default function AdminPage() {
  return (
    <AdminLayout>
      <RoleSelectionMenu />
    </AdminLayout>
  );
}

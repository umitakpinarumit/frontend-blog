import AdminSidebar from '@/components/admin/AdminSidebar';

/**
 * Admin Layout
 * Admin panelinin tüm sayfalarında kullanılacak layout
 * Sidebar içerir
 */

export default function AdminLayout({ children }) {
  return (
    <div className="flex">
      <AdminSidebar />
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}


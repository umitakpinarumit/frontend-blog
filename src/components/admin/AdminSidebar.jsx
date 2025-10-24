'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';
import { LayoutDashboard, FileText, FolderOpen, Users, Settings, ArrowLeft } from 'lucide-react';

/**
 * AdminSidebar Component
 * Admin panel sol menüsü
 */

export default function AdminSidebar() {
  const pathname = usePathname();

  const menuItems = [
    { 
      href: '/admin', 
      label: 'Dashboard', 
      icon: LayoutDashboard,
      exact: true 
    },
    { 
      href: '/admin/blogs', 
      label: 'Blog Yönetimi', 
      icon: FileText 
    },
    { 
      href: '/admin/categories', 
      label: 'Kategoriler', 
      icon: FolderOpen 
    },
    { 
      href: '/admin/users', 
      label: 'Kullanıcılar', 
      icon: Users 
    },
    { 
      href: '/admin/settings', 
      label: 'Ayarlar', 
      icon: Settings 
    },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 min-h-screen">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Admin Panel
        </h2>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.exact 
              ? pathname === item.href 
              : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                  isActive
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                )}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Ana Sayfaya Dön</span>
          </Link>
        </div>
      </div>
    </aside>
  );
}


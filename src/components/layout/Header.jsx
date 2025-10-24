'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';
import { Home, PenSquare, LayoutDashboard, Sun, Moon } from 'lucide-react';
import { useState, useEffect } from 'react';

/**
 * Header Component
 * Tüm sayfalarda kullanılacak üst menü
 * Dark/Light mode toggle içerir
 */

export default function Header() {
  const pathname = usePathname();
  const [isDark, setIsDark] = useState(false);

  // Dark mode kontrolü
  useEffect(() => {
    console.log('🔍 Dark Mode Debug - useEffect çalıştı');
    
    const theme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    console.log('📦 LocalStorage theme:', theme);
    console.log('🖥️ Sistem dark mode tercihi:', prefersDark);
    console.log('🎨 Mevcut HTML class:', document.documentElement.className);
    
    if (theme === 'dark' || (!theme && prefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
      console.log('✅ Dark mode AÇILDI');
      console.log('🎨 Yeni HTML class:', document.documentElement.className);
    } else {
      console.log('⚪ Light mode aktif');
    }
  }, []);

  // Dark mode toggle
  const toggleTheme = () => {
    console.log('🔄 Toggle butonuna tıklandı');
    console.log('📊 Önceki durum - isDark:', isDark);
    
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
      console.log('☀️ Light mode\'a geçildi');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
      console.log('🌙 Dark mode\'a geçildi');
    }
    
    console.log('🎨 Toggle sonrası HTML class:', document.documentElement.className);
    console.log('📦 LocalStorage:', localStorage.getItem('theme'));
  };

  const navLinks = [
    { href: '/', label: 'Ana Sayfa', icon: Home },
    { href: '/create-blog', label: 'Blog Yaz', icon: PenSquare },
    { href: '/admin', label: 'Admin Panel', icon: LayoutDashboard },
  ];

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            BlogPlatform
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-6">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={clsx(
                    'flex items-center gap-2 px-3 py-2 rounded-lg transition-colors',
                    isActive
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="hidden md:inline">{link.label}</span>
                </Link>
              );
            })}

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}


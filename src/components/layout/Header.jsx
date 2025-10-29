'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { clsx } from 'clsx';
import { Home, PenSquare, LayoutDashboard, Sun, Moon, LogIn, UserPlus, LogOut, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/lib/redux/slices/authSlice';

/**
 * Header Component
 * Tüm sayfalarda kullanılacak üst menü
 * Dark/Light mode toggle içerir
 */

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [isDark, setIsDark] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Dark mode kontrolü
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
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
    if (typeof window === 'undefined') return;
    
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

  const handleLogout = () => {
    dispatch(logout());
    setShowUserMenu(false);
    router.push('/');
  };

  const navLinks = [
    { href: '/', label: 'Ana Sayfa', icon: Home },
    { href: '/create-blog', label: 'Blog Yaz', icon: PenSquare },
  ];

  // Admin linki sadece admin kullanıcılara göster
  if (user?.role === 'admin') {
    navLinks.push({ href: '/admin', label: 'Admin Panel', icon: LayoutDashboard });
  }

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            BlogPlatform
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-4">
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

            {/* Auth Buttons / User Menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <User className="w-5 h-5" />
                  <span className="hidden md:inline font-medium">{user.name}</span>
                </button>

                {/* Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {user.email}
                      </p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Çıkış Yap
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <LogIn className="w-5 h-5" />
                  <span className="hidden md:inline">Giriş</span>
                </Link>
                <Link
                  href="/register"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                >
                  <UserPlus className="w-5 h-5" />
                  <span className="hidden md:inline">Kayıt Ol</span>
                </Link>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}


'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { fetchBlogs } from '@/lib/redux/slices/blogSlice';
import { motion } from 'framer-motion';
import { Card, Button } from '@/components/ui';
import { FileText, Users, Eye, Heart, FolderOpen, Tag, TrendingUp } from 'lucide-react';
import Link from 'next/link';

/**
 * Admin Dashboard Sayfası
 * Genel istatistikler ve özet bilgiler
 */

export default function AdminDashboard() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { blogs } = useSelector((state) => state.blog);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    // Admin kontrolü
    if (user && user.role !== 'admin') {
      alert('Bu sayfaya erişim yetkiniz yok!');
      router.push('/');
      return;
    }

    dispatch(fetchBlogs());
  }, [dispatch, user, router]);

  // İstatistikleri hesapla
  const totalBlogs = blogs?.length || 0;
  const publishedBlogs = blogs?.filter(b => b.status === 'published').length || 0;
  const draftBlogs = blogs?.filter(b => b.status === 'draft').length || 0;
  const totalViews = blogs?.reduce((sum, blog) => sum + (blog.views || 0), 0) || 0;
  const totalLikes = blogs?.reduce((sum, blog) => sum + (blog.likesCount || 0), 0) || 0;

  const stats = [
    {
      title: 'Toplam Blog',
      value: totalBlogs.toString(),
      subtitle: `${publishedBlogs} yayında, ${draftBlogs} taslak`,
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900',
      href: '/admin/blogs',
    },
    {
      title: 'Toplam Kullanıcı',
      value: '156',
      subtitle: '12 admin, 144 kullanıcı',
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900',
      href: '/admin/users',
    },
    {
      title: 'Toplam Görüntülenme',
      value: totalViews > 1000 ? `${(totalViews / 1000).toFixed(1)}K` : totalViews.toString(),
      subtitle: 'Tüm bloglar',
      icon: Eye,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900',
    },
    {
      title: 'Toplam Beğeni',
      value: totalLikes > 1000 ? `${(totalLikes / 1000).toFixed(1)}K` : totalLikes.toString(),
      subtitle: 'Tüm bloglar',
      icon: Heart,
      color: 'text-red-600',
      bgColor: 'bg-red-100 dark:bg-red-900',
    },
  ];

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Blog platformunuzun genel görünümü
        </p>
      </motion.div>

      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const CardContent = (
            <Card className={stat.href ? 'hover:shadow-lg transition-shadow cursor-pointer' : ''}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                    {stat.value}
                  </p>
                  {stat.subtitle && (
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      {stat.subtitle}
                    </p>
                  )}
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </Card>
          );

          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
            >
              {stat.href ? (
                <Link href={stat.href}>{CardContent}</Link>
              ) : (
                CardContent
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Hızlı Aksiyonlar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Blog Yönetimi
              </h3>
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Blogları görüntüle, düzenle veya sil
            </p>
            <Link href="/admin/blogs">
              <Button variant="outline" className="w-full">
                Yönet
              </Button>
            </Link>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Kategoriler
              </h3>
              <FolderOpen className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Kategori ve etiketleri düzenle
            </p>
            <Link href="/admin/categories">
              <Button variant="outline" className="w-full">
                Yönet
              </Button>
            </Link>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Kullanıcılar
              </h3>
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Kullanıcıları ve rolleri yönet
            </p>
            <Link href="/admin/users">
              <Button variant="outline" className="w-full">
                Yönet
              </Button>
            </Link>
          </Card>
        </motion.div>
      </div>

      {/* Son Eklenen Bloglar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Son Eklenen Bloglar
            </h2>
            <TrendingUp className="w-6 h-6 text-orange-500" />
          </div>
          
          {blogs && blogs.length > 0 ? (
            <div className="space-y-3">
              {blogs.slice(0, 5).map((blog, index) => (
                <Link
                  key={blog._id}
                  href={`/blogs/${blog._id}`}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                      {blog.title}
                    </h4>
                    <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                      <span>{blog.status === 'published' ? '✅ Yayında' : '📝 Taslak'}</span>
                      <span>•</span>
                      <span>{blog.views || 0} görüntülenme</span>
                    </div>
                  </div>
                  <span className="text-sm text-gray-400">#{index + 1}</span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">
              Henüz blog eklenmemiş.
            </p>
          )}
        </Card>
      </motion.div>
    </div>
  );
}


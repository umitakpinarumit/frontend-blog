'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { fetchBlogs, deleteBlog } from '@/lib/redux/slices/blogSlice';
import { motion } from 'framer-motion';
import { Card, Button } from '@/components/ui';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Search, 
  Filter,
  MoreVertical 
} from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

/**
 * Admin Blog Yönetimi Sayfası
 * Blog CRUD işlemleri
 */

export default function AdminBlogsPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { blogs, isLoading, error } = useSelector((state) => state.blog);
  const { user } = useSelector((state) => state.auth);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showMenu, setShowMenu] = useState(null);

  useEffect(() => {
    // Admin kontrolü
    if (user && user.role !== 'admin') {
      alert('Bu sayfaya erişim yetkiniz yok!');
      router.push('/');
      return;
    }
    
    dispatch(fetchBlogs());
  }, [dispatch, user, router]);

  // Filtreleme
  const filteredBlogs = blogs
    ? blogs.filter(blog => {
        const matchesSearch = searchQuery
          ? blog.title?.toLowerCase().includes(searchQuery.toLowerCase())
          : true;
        
        const matchesStatus = statusFilter !== 'all'
          ? blog.status === statusFilter
          : true;

        return matchesSearch && matchesStatus;
      })
    : [];

  // Blog Silme
  const handleDelete = async (id, title) => {
    if (!confirm(`"${title}" başlıklı blogu silmek istediğinize emin misiniz?`)) {
      return;
    }

    try {
      await dispatch(deleteBlog(id)).unwrap();
      alert('✅ Blog başarıyla silindi!');
    } catch (error) {
      console.error('Silme hatası:', error);
      alert('Blog silinirken bir hata oluştu!');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Blog Yönetimi
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Tüm blogları görüntüleyin, düzenleyin veya silin
            </p>
          </div>
          
          <Link href="/create-blog">
            <Button size="lg">
              <Plus className="w-5 h-5 mr-2" />
              Yeni Blog
            </Button>
          </Link>
        </div>

        {/* Filtreler */}
        <Card className="mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Arama */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Blog ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Durum Filtresi */}
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Tüm Durumlar</option>
                <option value="published">Yayınlananlar</option>
                <option value="draft">Taslaklar</option>
                <option value="archived">Arşivlenenler</option>
              </select>
            </div>
          </div>

          {/* Sonuç Sayısı */}
          <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            {filteredBlogs.length} blog bulundu
          </div>
        </Card>

        {/* Blog Listesi */}
        {error && (
          <Card className="mb-6 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
            <p className="text-red-600 dark:text-red-400">Hata: {error}</p>
          </Card>
        )}

        {filteredBlogs.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Blog bulunamadı.
              </p>
              <Link href="/create-blog">
                <Button>
                  <Plus className="w-5 h-5 mr-2" />
                  İlk Blogunuzu Oluşturun
                </Button>
              </Link>
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredBlogs.map((blog, index) => (
              <motion.div
                key={blog._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <div className="flex items-start gap-4">
                    {/* Görsel */}
                    {blog.featuredImage && blog.featuredImage !== 'default-blog.jpg' && (
                      <img
                        src={blog.featuredImage}
                        alt={blog.title}
                        className="w-24 h-24 object-cover rounded-lg"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    )}

                    {/* İçerik */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                            {blog.title}
                          </h3>
                          
                          {/* Meta Bilgiler */}
                          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                            <span>
                              {blog.createdAt && format(new Date(blog.createdAt), 'd MMM yyyy', { locale: tr })}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Eye className="w-4 h-4" />
                              {blog.views || 0}
                            </span>
                            <span>•</span>
                            <span>
                              {blog.status === 'published' && '✅ Yayında'}
                              {blog.status === 'draft' && '📝 Taslak'}
                              {blog.status === 'archived' && '📦 Arşivlendi'}
                            </span>
                          </div>

                          {/* Kategoriler */}
                          {blog.categories && blog.categories.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {blog.categories.slice(0, 3).map((cat, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded"
                                >
                                  {cat.name || cat}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Aksiyon Menüsü */}
                        <div className="relative">
                          <button
                            onClick={() => setShowMenu(showMenu === blog._id ? null : blog._id)}
                            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <MoreVertical className="w-5 h-5" />
                          </button>

                          {showMenu === blog._id && (
                            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                              <Link
                                href={`/blogs/${blog._id}`}
                                className="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                              >
                                <Eye className="w-4 h-4" />
                                Görüntüle
                              </Link>
                              <Link
                                href={`/blogs/${blog._id}/edit`}
                                className="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                              >
                                <Edit className="w-4 h-4" />
                                Düzenle
                              </Link>
                              <button
                                onClick={() => {
                                  setShowMenu(null);
                                  handleDelete(blog._id, blog.title);
                                }}
                                className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                              >
                                <Trash2 className="w-4 h-4" />
                                Sil
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Excerpt */}
                      {blog.excerpt && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mt-2">
                          {blog.excerpt}
                        </p>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}

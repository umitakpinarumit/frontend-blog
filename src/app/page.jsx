'use client';

import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBlogs } from '@/lib/redux/slices/blogSlice';
import { BlogList } from '@/components/blog';
import SearchBar from '@/components/blog/SearchBar';
import CategoryFilter from '@/components/blog/CategoryFilter';
import PopularBlogs from '@/components/blog/PopularBlogs';
import { motion } from 'framer-motion';
import { TrendingUp, Clock } from 'lucide-react';

export default function Home() {
  const dispatch = useDispatch();
  const { blogs, isLoading, error } = useSelector((state) => state.blog);
  
  // Filtreleme state'leri
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    dispatch(fetchBlogs());
  }, [dispatch]);

  // Kategorileri çıkar (unique)
  const categories = useMemo(() => {
    if (!blogs) return [];
    // Her blog birden fazla kategoriye sahip olabilir
    const allCategories = blogs.flatMap(blog => 
      blog.categories?.map(cat => cat.name) || []
    );
    const uniqueCategories = [...new Set(allCategories)].filter(Boolean);
    return uniqueCategories;
  }, [blogs]);

  // Popüler bloglar (en çok görüntülenen)
  const popularBlogs = useMemo(() => {
    if (!blogs) return [];
    return [...blogs]
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, 5);
  }, [blogs]);

  // Filtrelenmiş bloglar
  const filteredBlogs = useMemo(() => {
    if (!blogs) return [];
    
    let filtered = [...blogs];

    // Arama filtresi
    if (searchQuery) {
      filtered = filtered.filter(blog =>
        blog.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.content?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Kategori filtresi
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(blog => 
        blog.categories?.some(cat => cat.name === selectedCategory)
      );
    }

    return filtered;
  }, [blogs, searchQuery, selectedCategory]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-center text-red-600 dark:text-red-400">Hata: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Blog Platform
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          En son yayınlanan blog yazılarını keşfedin
        </p>
      </motion.div>

      {/* Arama Çubuğu */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="mb-6"
      >
        <SearchBar
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Blog yazılarında ara..."
        />
      </motion.div>

      {/* Kategori Filtreleme */}
      {categories.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mb-8"
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Kategoriler
      </h2>
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </motion.div>
      )}

      {/* İçerik Grid: Sol - Bloglar, Sağ - Popüler */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sol Taraf - Blog Listesi */}
        <div className="lg:col-span-2">
          {/* Sonuç Sayısı */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <Clock className="w-5 h-5" />
              <span className="font-medium">
                Son Yazılar
                {searchQuery || selectedCategory !== 'all' ? (
                  <span className="ml-2 text-sm">
                    ({filteredBlogs.length} sonuç)
                  </span>
                ) : (
                  <span className="ml-2 text-sm">
                    ({blogs?.length || 0} yazı)
                  </span>
                )}
              </span>
            </div>

            {/* Aktif Filtre Göstergesi */}
            {(searchQuery || selectedCategory !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                Filtreleri Temizle
              </button>
            )}
      </div>

          {/* Blog Listesi */}
          <BlogList blogs={filteredBlogs} />

          {/* Sonuç Bulunamadı */}
          {filteredBlogs.length === 0 && !isLoading && (
            <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">
                🔍 Sonuç bulunamadı
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500">
                Farklı bir arama terimi veya kategori deneyin
              </p>
            </div>
          )}
        </div>

        {/* Sağ Taraf - Popüler Bloglar Sidebar */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="sticky top-24"
          >
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-800 rounded-lg p-6 border border-blue-100 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-orange-500" />
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  Popüler Yazılar
                </h2>
              </div>
              <PopularBlogs blogs={popularBlogs} />
            </div>

            {/* İstatistikler */}
            <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
                📊 İstatistikler
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Toplam Blog</span>
                  <span className="font-bold text-gray-900 dark:text-white">{blogs?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Kategori</span>
                  <span className="font-bold text-gray-900 dark:text-white">{categories.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Toplam Görüntülenme</span>
                  <span className="font-bold text-gray-900 dark:text-white">
                    {blogs?.reduce((sum, blog) => sum + (blog.views || 0), 0) || 0}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}


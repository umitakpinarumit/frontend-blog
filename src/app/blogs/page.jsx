'use client';

import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBlogs } from '@/lib/redux/slices/blogSlice';
import { BlogList } from '@/components/blog';
import SearchBar from '@/components/blog/SearchBar';
import CategoryFilter from '@/components/blog/CategoryFilter';
import { motion } from 'framer-motion';
import { Layers, Loader } from 'lucide-react';
import { useInView } from 'react-intersection-observer';

/**
 * Blog Listeleme Sayfası
 * Tüm blogları infinite scroll ile gösterir
 * Kategori ve arama filtreleri var
 */

const BLOGS_PER_PAGE = 9; // Her yüklemede kaç blog gösterilecek

export default function BlogsPage() {
  const dispatch = useDispatch();
  const { blogs, isLoading, error } = useSelector((state) => state.blog);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [displayCount, setDisplayCount] = useState(BLOGS_PER_PAGE);
  
  // Infinite scroll için intersection observer
  const { ref, inView } = useInView({
    threshold: 0,
    triggerOnce: false,
  });

  useEffect(() => {
    dispatch(fetchBlogs());
  }, [dispatch]);

  // Kategorileri çıkar
  const categories = blogs 
    ? [...new Set(blogs.flatMap(blog => 
        blog.categories?.map(cat => cat.name) || []
      ).filter(Boolean))]
    : [];

  // Filtrelenmiş bloglar
  const filteredBlogs = blogs
    ? blogs.filter(blog => {
        const matchesSearch = searchQuery
          ? blog.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            blog.excerpt?.toLowerCase().includes(searchQuery.toLowerCase())
          : true;
        
        const matchesCategory = selectedCategory !== 'all'
          ? blog.categories?.some(cat => cat.name === selectedCategory)
          : true;

        return matchesSearch && matchesCategory;
      })
    : [];

  // Gösterilecek bloglar (infinite scroll için)
  const displayedBlogs = filteredBlogs.slice(0, displayCount);
  const hasMore = displayCount < filteredBlogs.length;

  // Infinite scroll - görünüme gelince daha fazla yükle
  useEffect(() => {
    if (inView && hasMore && !isLoading) {
      setDisplayCount(prev => prev + BLOGS_PER_PAGE);
      console.log('📜 Daha fazla blog yükleniyor...', displayCount, '→', displayCount + BLOGS_PER_PAGE);
    }
  }, [inView, hasMore, isLoading, displayCount]);

  // Filtreleri temizle
  const clearFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedCategory('all');
    setDisplayCount(BLOGS_PER_PAGE);
  }, []);

  // Filtre değişince sayfa başına dön
  useEffect(() => {
    setDisplayCount(BLOGS_PER_PAGE);
  }, [searchQuery, selectedCategory]);

  if (isLoading && !blogs) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-center min-h-[400px]">
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
        <div className="flex items-center gap-3 mb-2">
          <Layers className="w-8 h-8 text-blue-600" />
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Tüm Blog Yazıları
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          {filteredBlogs.length} yazı bulundu
        </p>
      </motion.div>

      {/* Arama */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-6"
      >
        <SearchBar
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Blog başlığı veya içeriğinde ara..."
        />
      </motion.div>

      {/* Kategori Filtreleme */}
      {categories.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </motion.div>
      )}

      {/* Aktif Filtre Göstergesi */}
      {(searchQuery || selectedCategory !== 'all') && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6 flex items-center justify-between bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4"
        >
          <div className="flex items-center gap-2 text-sm">
            <span className="text-blue-900 dark:text-blue-300">
              🔍 Aktif Filtreler:
              {searchQuery && <strong className="ml-2">"{searchQuery}"</strong>}
              {selectedCategory !== 'all' && <strong className="ml-2">[{selectedCategory}]</strong>}
            </span>
          </div>
          <button
            onClick={clearFilters}
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium"
          >
            Temizle
          </button>
        </motion.div>
      )}

      {/* Blog Listesi */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <BlogList blogs={displayedBlogs} />
      </motion.div>

      {/* Infinite Scroll Trigger */}
      {hasMore && (
        <div ref={ref} className="py-8 flex justify-center">
          <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
            <Loader className="w-5 h-5 animate-spin" />
            <span>Daha fazla yükleniyor...</span>
          </div>
        </div>
      )}

      {/* Sonuç Bulunamadı */}
      {filteredBlogs.length === 0 && (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">
            🔍 Sonuç bulunamadı
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mb-4">
            Farklı bir arama terimi veya kategori deneyin
          </p>
          <button
            onClick={clearFilters}
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Filtreleri Temizle
          </button>
        </div>
      )}

      {/* Tüm Bloglar Yüklendi */}
      {!hasMore && filteredBlogs.length > 0 && (
        <div className="py-8 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            ✨ Tüm blog yazıları gösteriliyor ({filteredBlogs.length} yazı)
          </p>
        </div>
      )}
    </div>
  );
}


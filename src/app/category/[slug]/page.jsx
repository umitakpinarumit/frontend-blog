'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBlogs } from '@/lib/redux/slices/blogSlice';
import { BlogList } from '@/components/blog';
import SearchBar from '@/components/blog/SearchBar';
import { motion } from 'framer-motion';
import { FolderOpen, ArrowLeft, Loader } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import Link from 'next/link';

/**
 * Kategori Sayfası
 * Belirli bir kategorideki blogları infinite scroll ile gösterir
 * URL: /category/[slug]
 */

const BLOGS_PER_PAGE = 9;

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { blogs, isLoading, error } = useSelector((state) => state.blog);
  
  const categorySlug = params.slug;
  const [searchQuery, setSearchQuery] = useState('');
  const [displayCount, setDisplayCount] = useState(BLOGS_PER_PAGE);
  
  const { ref, inView } = useInView({
    threshold: 0,
    triggerOnce: false,
  });

  useEffect(() => {
    dispatch(fetchBlogs());
  }, [dispatch]);

  // Bu kategorideki bloglar
  const categoryBlogs = blogs
    ? blogs.filter(blog => {
        const matchesCategory = blog.categories?.some(cat => 
          cat.name?.toLowerCase() === decodeURIComponent(categorySlug).toLowerCase()
        );
        const matchesSearch = searchQuery
          ? blog.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            blog.excerpt?.toLowerCase().includes(searchQuery.toLowerCase())
          : true;
        
        return matchesCategory && matchesSearch;
      })
    : [];

  const displayedBlogs = categoryBlogs.slice(0, displayCount);
  const hasMore = displayCount < categoryBlogs.length;

  // Infinite scroll
  useEffect(() => {
    if (inView && hasMore && !isLoading) {
      setDisplayCount(prev => prev + BLOGS_PER_PAGE);
      console.log('📜 Daha fazla blog yükleniyor (kategori)...');
    }
  }, [inView, hasMore, isLoading]);

  // Arama değişince sayfa başına dön
  useEffect(() => {
    setDisplayCount(BLOGS_PER_PAGE);
  }, [searchQuery]);

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
      {/* Geri Butonu */}
      <Link href="/">
        <button className="mb-6 flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span>Ana Sayfaya Dön</span>
        </button>
      </Link>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
            <FolderOpen className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              {decodeURIComponent(categorySlug)}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {categoryBlogs.length} yazı bulundu
            </p>
          </div>
        </div>
      </motion.div>

      {/* Arama */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <SearchBar
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={`${decodeURIComponent(categorySlug)} kategorisinde ara...`}
        />
      </motion.div>

      {/* Blog Listesi */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
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
      {categoryBlogs.length === 0 && (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">
            📁 Bu kategoride blog yazısı bulunamadı
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mb-4">
            {decodeURIComponent(categorySlug)} kategorisinde henüz yazı yok
          </p>
          <Link href="/blogs">
            <button className="text-blue-600 dark:text-blue-400 hover:underline">
              Tüm Yazılara Göz At
            </button>
          </Link>
        </div>
      )}

      {/* Tüm Bloglar Yüklendi */}
      {!hasMore && categoryBlogs.length > 0 && (
        <div className="py-8 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            ✨ Tüm yazılar gösteriliyor ({categoryBlogs.length} yazı)
          </p>
        </div>
      )}
    </div>
  );
}


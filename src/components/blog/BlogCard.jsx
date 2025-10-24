'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui';
import { Eye, Heart, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

/**
 * BlogCard Component
 * Ana sayfa ve listeleme sayfasında blog kartlarını gösterir
 * Framer Motion ile animasyonlu
 * 
 * Props:
 * - blog: Blog verisi (title, excerpt, views, likes, createdAt)
 * - index: Animasyon gecikmesi için index
 */

export default function BlogCard({ blog, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
    >
      <Card className="h-full">
        {/* Kategori Badges */}
        {blog.categories && blog.categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {blog.categories.map((category, idx) => (
              <Link 
                key={idx}
                href={`/category/${encodeURIComponent(category.name)}`}
                className="inline-block px-3 py-1 text-xs font-semibold text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-300 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
              >
                📁 {category.name}
              </Link>
            ))}
          </div>
        )}

        {/* Başlık - Tıklanabilir */}
        <Link href={`/blogs/${blog._id}`}>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer">
            {blog.title}
          </h3>
        </Link>
        
        {/* Özet */}
        {blog.excerpt && (
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
            {blog.excerpt}
          </p>
        )}

        {/* Etiketler */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {blog.tags.slice(0, 3).map((tag, idx) => {
              // Etiket string veya object olabilir
              const tagName = typeof tag === 'string' ? tag : (tag.name || tag.slug || tag);
              const tagSlug = typeof tag === 'string' ? tag : (tag.slug || tag.name || tag);
              
              return (
                <Link
                  key={idx}
                  href={`/tag/${encodeURIComponent(tagSlug)}`}
                  className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  #{tagName}
                </Link>
              );
            })}
            {blog.tags.length > 3 && (
              <span className="text-xs text-gray-400 dark:text-gray-500">
                +{blog.tags.length - 3}
              </span>
            )}
          </div>
        )}
        
        {/* Footer Bilgileri */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          {/* Tarih */}
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <Calendar className="w-4 h-4 mr-1" />
            {blog.createdAt && format(new Date(blog.createdAt), 'd MMM yyyy', { locale: tr })}
          </div>
          
          {/* Stats */}
          <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center">
              <Eye className="w-4 h-4 mr-1" />
              {blog.views || 0}
            </div>
            <div className="flex items-center">
              <Heart className="w-4 h-4 mr-1" />
              {blog.likesCount || 0}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}


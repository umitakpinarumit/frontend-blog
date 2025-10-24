'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Eye, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

/**
 * PopularBlogs Component
 * En popüler blog yazılarını gösterir (sidebar veya bölüm olarak)
 */

export default function PopularBlogs({ blogs }) {
  if (!blogs || blogs.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500 dark:text-gray-400">
        Popüler blog yok.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {blogs.map((blog, index) => (
        <motion.div
          key={blog._id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Link
            href={`/blogs/${blog._id}`}
            className="block bg-white dark:bg-gray-800 rounded-lg p-4 hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-start gap-3">
              {/* Sıralama Numarası */}
              <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {index + 1}
              </div>

              <div className="flex-1 min-w-0">
                {/* Başlık */}
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1 line-clamp-2">
                  {blog.title}
                </h3>

                {/* Meta Bilgiler */}
                <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    <span>{blog.views || 0}</span>
                  </div>
                  {blog.createdAt && (
                    <span>
                      {format(new Date(blog.createdAt), 'd MMM', { locale: tr })}
                    </span>
                  )}
                </div>
              </div>

              {/* Trending İkonu */}
              {index < 3 && (
                <TrendingUp className="w-5 h-5 text-orange-500 flex-shrink-0" />
              )}
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}


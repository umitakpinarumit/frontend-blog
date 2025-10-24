'use client';

import BlogCard from './BlogCard';

/**
 * BlogList Component
 * Blog kartlarını grid layout'ta gösterir
 * 
 * Props:
 * - blogs: Blog listesi
 */

export default function BlogList({ blogs }) {
  if (!blogs || blogs.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400 text-lg">
          Henüz blog yazısı bulunmuyor.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {blogs.map((blog, index) => (
        <BlogCard key={blog._id} blog={blog} index={index} />
      ))}
    </div>
  );
}


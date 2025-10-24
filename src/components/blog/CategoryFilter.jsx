'use client';

import { clsx } from 'clsx';

/**
 * CategoryFilter Component
 * Kategori filtreleme butonları
 */

export default function CategoryFilter({ categories, selectedCategory, onCategoryChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onCategoryChange('all')}
        className={clsx(
          'px-4 py-2 rounded-lg font-medium transition-all',
          selectedCategory === 'all'
            ? 'bg-blue-600 text-white shadow-md'
            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600'
        )}
      >
        Tümü
      </button>
      
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onCategoryChange(category)}
          className={clsx(
            'px-4 py-2 rounded-lg font-medium transition-all',
            selectedCategory === category
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600'
          )}
        >
          {category}
        </button>
      ))}
    </div>
  );
}


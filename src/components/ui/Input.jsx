import { clsx } from 'clsx';

/**
 * Input Component
 * Form inputları için kullanılacak
 * 
 * Props:
 * - label: Input etiketi
 * - error: Hata mesajı
 * - className: Ek CSS sınıfları
 */

export default function Input({ 
  label, 
  error,
  className = '',
  ...props 
}) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
        </label>
      )}
      <input
        className={clsx(
          'w-full px-4 py-2 border rounded-lg',
          'focus:outline-none focus:ring-2 focus:ring-blue-500',
          'dark:bg-gray-700 dark:border-gray-600 dark:text-white',
          error 
            ? 'border-red-500 focus:ring-red-500' 
            : 'border-gray-300 dark:border-gray-600',
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}


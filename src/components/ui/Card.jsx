import { clsx } from 'clsx';

/**
 * Card Component
 * Blog kartları, admin panel kartları için kullanılacak
 * 
 * Props:
 * - children: Kart içeriği
 * - hover: Hover efekti aktif mi? (default: true)
 * - className: Ek CSS sınıfları
 */

export default function Card({ 
  children, 
  hover = true,
  className = '',
  ...props 
}) {
  return (
    <div
      className={clsx(
        'bg-white dark:bg-gray-800 rounded-lg shadow-md p-6',
        hover && 'hover:shadow-xl transition-shadow duration-300',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}


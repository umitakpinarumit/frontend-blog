'use client';

import { motion } from 'framer-motion';
import { User, Mail, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

/**
 * AuthorCard Component
 * Yazar bilgilerini gösterir
 * 
 * Props:
 * - author: Yazar verisi (name, email, profileImage, bio)
 * - createdAt: Blog oluşturma tarihi
 */

export default function AuthorCard({ author, createdAt }) {
  if (!author) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-lg p-6 border border-blue-100 dark:border-gray-600"
    >
      {/* Başlık */}
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Yazar Hakkında
      </h3>

      {/* Yazar Bilgileri */}
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="flex-shrink-0">
          {author.profileImage ? (
            <img
              src={author.profileImage}
              alt={author.name}
              className="w-16 h-16 rounded-full border-2 border-white dark:border-gray-600 shadow-md object-cover"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-md border-2 border-white dark:border-gray-600">
              {author.name?.charAt(0).toUpperCase() || 'A'}
            </div>
          )}
        </div>

        {/* Bilgiler */}
        <div className="flex-1 min-w-0">
          {/* İsim */}
          <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            {author.name || 'Anonim'}
          </h4>

          {/* Bio */}
          {author.bio && (
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
              {author.bio}
            </p>
          )}

          {/* Meta Bilgiler */}
          <div className="space-y-1 text-sm text-gray-500 dark:text-gray-400">
            {/* Email */}
            {author.email && (
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span className="truncate">{author.email}</span>
              </div>
            )}

            {/* Yayınlanma Tarihi */}
            {createdAt && (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>
                  {format(new Date(createdAt), 'd MMMM yyyy', { locale: tr })} tarihinde yayınlandı
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}


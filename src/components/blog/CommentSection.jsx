'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Send } from 'lucide-react';
import CommentItem from './CommentItem';

/**
 * CommentSection Component
 * Yorum listesi ve yeni yorum ekleme formu
 * 
 * Props:
 * - blogId: Blog ID'si
 * - comments: Yorumlar array'i
 * - currentUserId: Giriş yapan kullanıcının ID'si
 * - onAddComment: Yeni yorum ekleme fonksiyonu
 * - onReplyComment: Cevap verme fonksiyonu
 * - onEditComment: Düzenleme fonksiyonu
 * - onDeleteComment: Silme fonksiyonu
 * - onLikeComment: Beğeni fonksiyonu
 * - isLoading: Yüklenme durumu
 */

export default function CommentSection({
  blogId,
  comments = [],
  currentUserId,
  onAddComment,
  onReplyComment,
  onEditComment,
  onDeleteComment,
  onLikeComment,
  isLoading = false
}) {
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!newComment.trim()) return;
    
    if (!currentUserId) {
      // Giriş yapmadan yorum yapılamaz (sessizce çık)
      return;
    }

    setIsSubmitting(true);
    try {
      await onAddComment(newComment);
      setNewComment('');
    } catch (error) {
      console.error('Yorum eklenirken hata:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Cevap verme
  const handleReply = async (parentCommentId, content) => {
    if (!currentUserId) {
      // Giriş yapmadan cevap yazılamaz (sessizce çık)
      return;
    }

    try {
      await onReplyComment(parentCommentId, content);
    } catch (error) {
      console.error('Cevap eklenirken hata:', error);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="mt-12 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 md:p-8"
    >
      {/* Başlık */}
      <div className="flex items-center gap-3 mb-6">
        <MessageCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Yorumlar
          {comments.length > 0 && (
            <span className="ml-2 text-lg text-gray-500 dark:text-gray-400">
              ({comments.length})
            </span>
          )}
        </h2>
      </div>

      {/* Yeni Yorum Formu */}
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex gap-3">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
              {currentUserId ? 'B' : '?'}
            </div>
          </div>

          {/* Form */}
          <div className="flex-1">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={currentUserId ? "Yorumunuzu yazın..." : "Yorum yapmak için giriş yapın"}
              disabled={!currentUserId || isSubmitting}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none disabled:opacity-50 disabled:cursor-not-allowed"
              rows={3}
            />
            
            <div className="flex justify-end mt-2">
              <button
                type="submit"
                disabled={!currentUserId || !newComment.trim() || isSubmitting}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-4 h-4" />
                {isSubmitting ? 'Gönderiliyor...' : 'Gönder'}
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Yorumlar Listesi */}
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-12">
          <MessageCircle className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400">
            Henüz yorum yok. İlk yorumu siz yapın!
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <CommentItem
              key={comment._id}
              comment={comment}
              onReply={handleReply}
              onEdit={onEditComment}
              onDelete={onDeleteComment}
              onLike={onLikeComment}
              currentUserId={currentUserId}
            />
          ))}
        </div>
      )}
    </motion.section>
  );
}


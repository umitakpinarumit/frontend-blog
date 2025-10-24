'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Reply, Edit2, Trash2, MoreVertical } from 'lucide-react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

/**
 * CommentItem Component
 * Tek bir yorumu gösterir
 * 
 * Props:
 * - comment: Yorum verisi (author, content, likes, replies)
 * - onReply: Cevap verme fonksiyonu
 * - onEdit: Düzenleme fonksiyonu
 * - onDelete: Silme fonksiyonu
 * - onLike: Beğeni fonksiyonu
 * - currentUserId: Giriş yapan kullanıcının ID'si
 * - isReply: Alt yorum mu? (girinti için)
 */

export default function CommentItem({ 
  comment, 
  onReply, 
  onEdit, 
  onDelete, 
  onLike,
  currentUserId,
  isReply = false 
}) {
  const [showReplies, setShowReplies] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState('');

  const isOwner = currentUserId === comment.author?._id;
  const hasReplies = comment.replies && comment.replies.length > 0;

  // Düzenleme kaydet
  const handleSaveEdit = () => {
    if (editContent.trim()) {
      onEdit(comment._id, editContent);
      setIsEditing(false);
    }
  };

  // Cevap gönder
  const handleSubmitReply = () => {
    if (replyContent.trim()) {
      onReply(comment._id, replyContent);
      setReplyContent('');
      setShowReplyForm(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${isReply ? 'ml-8 md:ml-12' : ''}`}
    >
      <div className="flex gap-3 group">
        {/* Avatar */}
        <div className="flex-shrink-0">
          {comment.author?.profileImage ? (
            <img
              src={comment.author.profileImage}
              alt={comment.author.name}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
              {comment.author?.name?.charAt(0).toUpperCase() || 'A'}
            </div>
          )}
        </div>

        {/* İçerik */}
        <div className="flex-1 min-w-0">
          {/* Başlık - Yazar ve Tarih */}
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-900 dark:text-white">
                {comment.author?.name || 'Anonim'}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {comment.createdAt && format(new Date(comment.createdAt), 'd MMM yyyy, HH:mm', { locale: tr })}
              </span>
              {comment.isEdited && (
                <span className="text-xs text-gray-400 dark:text-gray-500 italic">
                  (düzenlendi)
                </span>
              )}
            </div>

            {/* Menü (sadece yorum sahibi için) */}
            {isOwner && (
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>

                {showMenu && (
                  <div className="absolute right-0 mt-1 w-32 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                    <button
                      onClick={() => {
                        setIsEditing(true);
                        setShowMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                    >
                      <Edit2 className="w-3 h-3" />
                      Düzenle
                    </button>
                    <button
                      onClick={() => {
                        onDelete(comment._id);
                        setShowMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                    >
                      <Trash2 className="w-3 h-3" />
                      Sil
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Yorum İçeriği */}
          {isEditing ? (
            <div className="mb-2">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={3}
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={handleSaveEdit}
                  className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                >
                  Kaydet
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditContent(comment.content);
                  }}
                  className="px-3 py-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded text-sm hover:bg-gray-400 dark:hover:bg-gray-500"
                >
                  İptal
                </button>
              </div>
            </div>
          ) : (
            <p className="text-gray-700 dark:text-gray-300 mb-2 whitespace-pre-wrap">
              {comment.content}
            </p>
          )}

          {/* Aksiyonlar */}
          <div className="flex items-center gap-4 text-sm">
            {/* Beğeni */}
            <button
              onClick={() => onLike(comment._id)}
              className="flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
            >
              <Heart className={`w-4 h-4 ${comment.isLiked ? 'fill-current text-red-600' : ''}`} />
              <span>{comment.likesCount || 0}</span>
            </button>

            {/* Cevapla */}
            {!isReply && (
              <button
                onClick={() => setShowReplyForm(!showReplyForm)}
                className="flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <Reply className="w-4 h-4" />
                Cevapla
              </button>
            )}

            {/* Cevapları Göster/Gizle */}
            {hasReplies && (
              <button
                onClick={() => setShowReplies(!showReplies)}
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                {showReplies ? 'Cevapları Gizle' : `${comment.replies.length} Cevabı Göster`}
              </button>
            )}
          </div>

          {/* Cevap Formu */}
          {showReplyForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-3"
            >
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Cevabınızı yazın..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={3}
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={handleSubmitReply}
                  className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                >
                  Gönder
                </button>
                <button
                  onClick={() => {
                    setShowReplyForm(false);
                    setReplyContent('');
                  }}
                  className="px-3 py-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded text-sm hover:bg-gray-400 dark:hover:bg-gray-500"
                >
                  İptal
                </button>
              </div>
            </motion.div>
          )}

          {/* Cevaplar */}
          {hasReplies && showReplies && (
            <div className="mt-4 space-y-4">
              {comment.replies.map((reply) => (
                <CommentItem
                  key={reply._id}
                  comment={reply}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onLike={onLike}
                  currentUserId={currentUserId}
                  isReply={true}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}


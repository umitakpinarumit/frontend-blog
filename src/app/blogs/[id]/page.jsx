'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'next/navigation';
import { fetchBlogById, likeBlog, incrementViewCount } from '@/lib/redux/slices/blogSlice';
import { motion } from 'framer-motion';
import { Eye, Heart, Calendar, Clock, Share2, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import Link from 'next/link';
import { Button } from '@/components/ui';
import { 
  CommentSection, 
  SimilarBlogs, 
  AuthorCard 
} from '@/components/blog';

/**
 * Blog Detay Sayfası
 * Dinamik rota: /blogs/[id]
 * 
 * Özellikler:
 * - Blog içeriğini gösterir
 * - Yazar bilgileri
 * - Kategoriler ve etiketler
 * - Beğeni ve görüntülenme sayısı
 * - Yorumlar bölümü
 * - Benzer yazılar
 */

export default function BlogDetailPage() {
  const params = useParams();
  const dispatch = useDispatch();
  const { currentBlog, isLoading, error } = useSelector((state) => state.blog);
  const { user } = useSelector((state) => state.auth);
  
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState([]);
  const [similarBlogs, setSimilarBlogs] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [similarLoading, setSimilarLoading] = useState(false);

  useEffect(() => {
    if (params.id) {
      dispatch(fetchBlogById(params.id));
      loadComments();
      loadSimilarBlogs();
      
      // Görüntülenme sayısını artır (sayfa yüklendiğinde bir kez)
      dispatch(incrementViewCount(params.id));
    }
  }, [params.id, dispatch]);

  // Yorumları yükle
  const loadComments = async () => {
    setCommentsLoading(true);
    try {
      // TODO: API'den yorumları çek
      // const response = await fetch(`/api/comments/blog/${params.id}`);
      // const data = await response.json();
      // setComments(data.data || []);
      
      // Geçici mock veri
      setComments([]);
    } catch (error) {
      console.error('Yorumlar yüklenemedi:', error);
    } finally {
      setCommentsLoading(false);
    }
  };

  // Benzer yazıları yükle
  const loadSimilarBlogs = async () => {
    setSimilarLoading(true);
    try {
      // TODO: API'den benzer yazıları çek
      // const response = await fetch(`/api/blogs/${params.id}/similar`);
      // const data = await response.json();
      // setSimilarBlogs(data.data || []);
      
      // Geçici mock veri
      setSimilarBlogs([]);
    } catch (error) {
      console.error('Benzer yazılar yüklenemedi:', error);
    } finally {
      setSimilarLoading(false);
    }
  };

  // Beğeni işlemi
  const handleLike = async () => {
    if (!user) {
      alert('Beğenmek için giriş yapmalısınız.');
      return;
    }
    
    try {
      await dispatch(likeBlog(params.id)).unwrap();
      setLiked(!liked);
    } catch (error) {
      console.error('Beğeni işlemi başarısız:', error);
    }
  };

  // Yorum işlemleri
  const handleAddComment = async (content) => {
    // TODO: API'ye yorum ekle
    console.log('Yeni yorum:', content);
    // await addComment({ blog: params.id, content });
    // loadComments(); // Yorumları yeniden yükle
  };

  const handleReplyComment = async (parentCommentId, content) => {
    // TODO: API'ye cevap ekle
    console.log('Cevap:', { parentCommentId, content });
    // await addComment({ blog: params.id, content, parentComment: parentCommentId });
    // loadComments();
  };

  const handleEditComment = async (commentId, content) => {
    // TODO: Yorumu güncelle
    console.log('Düzenle:', { commentId, content });
    // await updateComment(commentId, { content });
    // loadComments();
  };

  const handleDeleteComment = async (commentId) => {
    if (!confirm('Yorumu silmek istediğinize emin misiniz?')) return;
    
    // TODO: Yorumu sil
    console.log('Sil:', commentId);
    // await deleteComment(commentId);
    // loadComments();
  };

  const handleLikeComment = async (commentId) => {
    // TODO: Yorumu beğen
    console.log('Yorum beğen:', commentId);
    // await likeComment(commentId);
    // loadComments();
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
          <p className="text-center text-red-600 dark:text-red-400">Hata: {error}</p>
        </div>
      </div>
    );
  }

  if (!currentBlog) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <p className="text-center text-gray-500">Blog bulunamadı.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Geri Butonu */}
      <Link href="/">
        <Button variant="outline" className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Geri Dön
        </Button>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Ana İçerik */}
        <div className="lg:col-span-2">
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 md:p-8"
          >
            {/* Kategori Badges */}
            {currentBlog.categories && currentBlog.categories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {currentBlog.categories.map((category, idx) => (
                  <Link
                    key={idx}
                    href={`/category/${encodeURIComponent(category.name)}`}
                    className="inline-block px-3 py-1 text-sm font-semibold text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-300 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                  >
                    📁 {category.name}
                  </Link>
                ))}
              </div>
            )}

            {/* Başlık */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              {currentBlog.title}
            </h1>

            {/* Meta Bilgiler */}
            <div className="flex flex-wrap items-center gap-4 md:gap-6 mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
              {/* Tarih */}
              {currentBlog.createdAt && (
                <div className="flex items-center text-sm md:text-base text-gray-600 dark:text-gray-400">
                  <Calendar className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                  <span>{format(new Date(currentBlog.createdAt), 'd MMMM yyyy', { locale: tr })}</span>
                </div>
              )}

              {/* Okuma Süresi */}
              {currentBlog.readTime && (
                <div className="flex items-center text-sm md:text-base text-gray-600 dark:text-gray-400">
                  <Clock className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                  <span>{currentBlog.readTime} dk okuma</span>
                </div>
              )}

              {/* Görüntülenme */}
              <div className="flex items-center text-sm md:text-base text-gray-600 dark:text-gray-400">
                <Eye className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                <span>{currentBlog.views || 0}</span>
              </div>

              {/* Beğeni */}
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 text-sm md:text-base transition-colors ${
                  liked 
                    ? 'text-red-600' 
                    : 'text-gray-600 dark:text-gray-400 hover:text-red-600'
                }`}
              >
                <Heart className={`w-4 h-4 md:w-5 md:h-5 ${liked ? 'fill-current' : ''}`} />
                <span>{currentBlog.likesCount || 0}</span>
              </button>

              {/* Paylaş (gelecekte eklenecek) */}
              <button
                className="ml-auto flex items-center gap-2 text-sm md:text-base text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors"
                title="Paylaş"
              >
                <Share2 className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            </div>

            {/* Özet */}
            {currentBlog.excerpt && (
              <div className="mb-8 p-4 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 rounded">
                <p className="text-gray-700 dark:text-gray-300 italic">
                  {currentBlog.excerpt}
                </p>
              </div>
            )}

            {/* İçerik */}
            <div 
              className="prose prose-lg dark:prose-invert max-w-none mb-8"
              dangerouslySetInnerHTML={{ __html: currentBlog.content }}
            />

            {/* Etiketler */}
            {currentBlog.tags && currentBlog.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                {currentBlog.tags.map((tag, index) => {
                  const tagName = typeof tag === 'string' ? tag : (tag.name || tag.slug || tag);
                  const tagSlug = typeof tag === 'string' ? tag : (tag.slug || tag.name || tag);
                  
                  return (
                    <Link
                      key={index}
                      href={`/tag/${encodeURIComponent(tagSlug)}`}
                      className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      #{tagName}
                    </Link>
                  );
                })}
              </div>
            )}
          </motion.article>

          {/* Yorumlar Bölümü */}
          <CommentSection
            blogId={params.id}
            comments={comments}
            currentUserId={user?._id}
            onAddComment={handleAddComment}
            onReplyComment={handleReplyComment}
            onEditComment={handleEditComment}
            onDeleteComment={handleDeleteComment}
            onLikeComment={handleLikeComment}
            isLoading={commentsLoading}
          />
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          {/* Yazar Kartı */}
          {currentBlog.author && (
            <AuthorCard 
              author={currentBlog.author} 
              createdAt={currentBlog.createdAt} 
            />
          )}
        </div>
      </div>

      {/* Benzer Yazılar */}
      <SimilarBlogs 
        blogs={similarBlogs} 
        isLoading={similarLoading} 
      />
    </div>
  );
}


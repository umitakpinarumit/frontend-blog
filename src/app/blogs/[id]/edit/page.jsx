'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBlogById, updateBlog } from '@/lib/redux/slices/blogSlice';
import { motion } from 'framer-motion';
import BlogEditor from '@/components/blog/BlogEditor';
import { ArrowLeft, Loader } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui';

/**
 * Blog Güncelleme Sayfası
 * Mevcut bir blog yazısını düzenle
 * 
 * Route: /blogs/[id]/edit
 */

export default function EditBlogPage() {
  const router = useRouter();
  const params = useParams();
  const dispatch = useDispatch();
  
  const { currentBlog, isLoading, error } = useSelector((state) => state.blog);
  const { user } = useSelector((state) => state.auth);
  
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  // Blog verisini yükle
  useEffect(() => {
    if (params.id) {
      dispatch(fetchBlogById(params.id));
    }
  }, [params.id, dispatch]);

  // Yetki kontrolü
  useEffect(() => {
    if (currentBlog && user) {
      // Kullanıcı blog sahibi veya admin değilse yönlendir
      const isOwner = currentBlog.author?._id === user._id;
      const isAdmin = user.role === 'admin';
      
      if (!isOwner && !isAdmin) {
        router.push(`/blogs/${params.id}`);
      }
    }
  }, [currentBlog, user, router, params.id]);

  // Güncelle
  const handleSave = async (blogData) => {
    setIsSaving(true);
    setSaveMessage('Güncelleniyor...');
    
    try {
      await dispatch(updateBlog({ 
        id: params.id, 
        data: blogData 
      })).unwrap();
      
      router.push(`/blogs/${params.id}`);
      
    } catch (error) {
      console.error('❌ Güncelleme hatası:', error);
      setSaveMessage('❌ Güncelleme başarısız');
      setTimeout(() => setSaveMessage(''), 3000);
    } finally {
      setIsSaving(false);
      setSaveMessage('');
    }
  };

  // Taslak Olarak Kaydet
  const handleSaveDraft = (blogData) => {
    if (typeof window === 'undefined') return;
    
    try {
      const draft = {
        ...blogData,
        id: params.id,
        savedAt: new Date().toISOString(),
      };

      console.log('💾 Taslak kaydediliyor:', draft);
      
      // LocalStorage'a kaydet
      localStorage.setItem(`blogDraft_${params.id}`, JSON.stringify(draft));
      
      // Kullanıcıya bilgi ver
      setSaveMessage('💾 Taslak kaydedildi!');
      setTimeout(() => setSaveMessage(''), 3000);
      
      console.log('✅ Taslak başarıyla kaydedildi!');
      
    } catch (error) {
      console.error('❌ Taslak kaydetme hatası:', error);
      setSaveMessage('❌ Taslak kaydedilemedi');
      setTimeout(() => setSaveMessage(''), 3000);
    }
  };

  // Loading State
  if (isLoading || !currentBlog) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Blog yükleniyor...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
          <p className="text-center text-red-600 dark:text-red-400">
            Hata: {error}
          </p>
          <div className="mt-4 text-center">
            <Link href="/">
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Ana Sayfaya Dön
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Giriş Kontrolü
  if (!user) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
          <p className="text-center text-yellow-800 dark:text-yellow-300 mb-4">
            Blog düzenlemek için giriş yapmalısınız.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/login">
              <Button>Giriş Yap</Button>
            </Link>
            <Link href="/">
              <Button variant="outline">Ana Sayfaya Dön</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      {/* Geri Butonu */}
      <Link href={`/blogs/${params.id}`}>
        <Button variant="outline" className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Blog Detayına Dön
        </Button>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Blog Düzenle
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          "{currentBlog.title}" yazınızı güncelleyin
        </p>

        {/* Bilgi Mesajı */}
        {saveMessage && (
          <div className="mb-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <p className="text-green-800 dark:text-green-300 text-center font-medium">
              {saveMessage}
            </p>
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <BlogEditor 
            onSave={handleSave} 
            onSaveDraft={handleSaveDraft}
            initialData={currentBlog}
          />
        </div>

        {isSaving && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 flex items-center gap-4">
              <Loader className="animate-spin h-8 w-8 text-blue-600" />
              <span className="text-gray-900 dark:text-white">{saveMessage}</span>
            </div>
          </div>
        )}
        
        {/* İpucu */}
        <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <p className="text-sm text-blue-800 dark:text-blue-300">
            💡 <strong>İpucu:</strong> Değişikliklerinizi kaybetmemek için düzenli olarak "Taslak Olarak Kaydet" butonuna tıklayın.
          </p>
        </div>
      </motion.div>
    </div>
  );
}



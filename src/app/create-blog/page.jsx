'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { createBlog } from '@/lib/redux/slices/blogSlice';
import { motion } from 'framer-motion';
import BlogEditor from '@/components/blog/BlogEditor';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui';

/**
 * Blog Oluşturma Sayfası
 * Yeni blog yazısı oluşturma
 * 
 * Özellikler:
 * - Redux ile API entegrasyonu
 * - LocalStorage ile taslak kaydetme
 * - Form validasyonu
 */

export default function CreateBlogPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  // Sayfa yüklendiğinde taslağı kontrol et
  useEffect(() => {
    const draft = localStorage.getItem('blogDraft');
    if (draft) {
      console.log('📝 Taslak bulundu! LocalStorage\'dan yüklenebilir.');
    }
  }, []);

  // Giriş kontrolü
  useEffect(() => {
    if (!user) {
      alert('Blog oluşturmak için giriş yapmalısınız!');
      router.push('/login');
    }
  }, [user, router]);

  // Yayınla (Publish)
  const handleSave = async (blogData) => {
    if (!user) {
      alert('Blog oluşturmak için giriş yapmalısınız!');
      router.push('/login');
      return;
    }

    setIsSaving(true);
    setSaveMessage('Yayınlanıyor...');
    
    try {
      console.log('📤 Blog Yayınlanıyor:', blogData);
      
      // Redux action ile API'ye kaydetme
      const result = await dispatch(createBlog(blogData)).unwrap();
      
      // Taslağı temizle
      localStorage.removeItem('blogDraft');
      
      alert('✅ Blog başarıyla yayınlandı!');
      
      // Blog detay sayfasına yönlendir
      if (result._id) {
        router.push(`/blogs/${result._id}`);
      } else {
        router.push('/');
      }
      
    } catch (error) {
      console.error('❌ Yayınlama hatası:', error);
      const errorMessage = error.message || error || 'Blog yayınlanırken bir hata oluştu!';
      alert(`Hata: ${errorMessage}`);
    } finally {
      setIsSaving(false);
      setSaveMessage('');
    }
  };

  // Taslak Olarak Kaydet
  const handleSaveDraft = (blogData) => {
    try {
      const draft = {
        ...blogData,
        savedAt: new Date().toISOString(),
        id: Date.now().toString() // Benzersiz ID
      };

      console.log('💾 Taslak kaydediliyor:', draft);
      
      // LocalStorage'a kaydet
      localStorage.setItem('blogDraft', JSON.stringify(draft));
      
      // Kullanıcıya bilgi ver
      setSaveMessage('💾 Taslak kaydedildi!');
      setTimeout(() => setSaveMessage(''), 3000);
      
      console.log('✅ Taslak başarıyla kaydedildi!');
      
    } catch (error) {
      console.error('❌ Taslak kaydetme hatası:', error);
      alert('Taslak kaydedilemedi!');
    }
  };

  // Taslağı Yükle
  const loadDraft = () => {
    try {
      const draft = localStorage.getItem('blogDraft');
      if (draft) {
        const parsed = JSON.parse(draft);
        console.log('📂 Taslak yüklendi:', parsed);
        return parsed;
      }
    } catch (error) {
      console.error('❌ Taslak yükleme hatası:', error);
      localStorage.removeItem('blogDraft'); // Bozuk taslağı temizle
    }
    return {}; // Boş obje döndür (null yerine)
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      {/* Geri Butonu */}
      <Link href="/">
        <Button variant="outline" className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Geri Dön
        </Button>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Yeni Blog Yazısı
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Zengin metin editörü ile blog yazınızı oluşturun
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
            initialData={loadDraft()}
          />
        </div>

        {isSaving && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 flex items-center gap-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="text-gray-900 dark:text-white">{saveMessage}</span>
            </div>
          </div>
        )}
        
        {/* Taslak İpucu */}
        <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <p className="text-sm text-blue-800 dark:text-blue-300">
            💡 <strong>İpucu:</strong> Yazınızı kaybetmemek için düzenli olarak "Taslak Olarak Kaydet" butonuna tıklayın. 
            Taslağınız tarayıcınızda güvende saklanır ve sayfayı yenilesenz de kalır.
          </p>
        </div>
      </motion.div>
    </div>
  );
}


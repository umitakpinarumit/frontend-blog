'use client';

import { useState, useRef } from 'react';
import { Button, Input, Modal } from '@/components/ui';
import { Save, Eye, Bold, Italic, List, Link as LinkIcon, Image, Upload } from 'lucide-react';

/**
 * BlogEditor Component
 * Basit HTML editörü
 * 
 * NOT: React Quill React 19 ile uyumlu değil, bu yüzden basit bir editör kullanıyoruz.
 * İlerleye Tiptap gibi modern bir editöre geçilebilir.
 * 
 * Props:
 * - initialData: Düzenleme için başlangıç verisi
 * - onSave: Kaydetme fonksiyonu
 */

export default function BlogEditor({ initialData = {}, onSave, onSaveDraft }) {
  // initialData'nın null olma durumuna karşı güvenlik
  const safeInitialData = initialData || {};
  
  const [formData, setFormData] = useState({
    title: safeInitialData.title || '',
    content: safeInitialData.content || '',
    excerpt: safeInitialData.excerpt || '',
    tags: safeInitialData.tags
      ? Array.isArray(safeInitialData.tags)
        ? safeInitialData.tags.map(tag => typeof tag === 'string' ? tag : (tag.name || tag.slug || '')).join(', ')
        : ''
      : '',
    categories: safeInitialData.categories
      ? Array.isArray(safeInitialData.categories)
        ? safeInitialData.categories.map(cat => typeof cat === 'string' ? cat : (cat.name || cat._id || '')).join(', ')
        : ''
      : '',
    featuredImage: safeInitialData.featuredImage || '',
    status: safeInitialData.status || 'draft',
  });

  const [isPreview, setIsPreview] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  const fileInputRef = useRef(null);

  // Basit formatlamalar için yardımcı fonksiyonlar
  const insertFormatting = (tag) => {
    const textarea = document.getElementById('content-editor');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = formData.content.substring(start, end);
    
    let newText = '';
    if (tag === 'h2') {
      newText = `<h2>${selectedText || 'Başlık'}</h2>`;
    } else if (tag === 'h3') {
      newText = `<h3>${selectedText || 'Alt Başlık'}</h3>`;
    } else if (tag === 'p') {
      newText = `<p>${selectedText || 'Paragraf'}</p>`;
    } else if (tag === 'ul') {
      newText = `<ul>\n  <li>${selectedText || 'Liste öğesi'}</li>\n</ul>`;
    } else if (tag === 'ol') {
      newText = `<ol>\n  <li>${selectedText || 'Numaralı liste'}</li>\n</ol>`;
    } else if (tag === 'code') {
      newText = `<code>${selectedText || 'kod'}</code>`;
    } else {
      newText = `<${tag}>${selectedText}</${tag}>`;
    }

    const newContent = formData.content.substring(0, start) + newText + formData.content.substring(end);
    handleChange('content', newContent);
  };

  // URL ile görsel ekleme
  const insertImageFromUrl = () => {
    if (!imageUrl) {
      console.log('Görsel URL\'si gerekli');
      return;
    }

    const textarea = document.getElementById('content-editor');
    const start = textarea.selectionStart;
    const imgTag = `<img src="${imageUrl}" alt="${imageAlt || 'Blog görseli'}" style="max-width: 100%; height: auto; border-radius: 8px; margin: 16px 0;" />`;
    
    const newContent = formData.content.substring(0, start) + imgTag + formData.content.substring(start);
    handleChange('content', newContent);

    console.log('🖼️ URL ile görsel eklendi:', imageUrl);
    
    // Modal'ı kapat ve temizle
    setIsImageModalOpen(false);
    setImageUrl('');
    setImageAlt('');
  };

  // Dosya yükleyerek görsel ekleme (Base64)
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Dosya boyutu kontrolü (5MB)
    if (file.size > 5 * 1024 * 1024) {
      console.error('Dosya boyutu 5MB\'dan küçük olmalıdır');
      return;
    }

    // Dosya tipi kontrolü
    if (!file.type.startsWith('image/')) {
      console.error('Lütfen bir görsel dosyası seçin');
      return;
    }

    console.log('📤 Görsel yükleniyor:', file.name, 'Boyut:', (file.size / 1024).toFixed(2) + 'KB');

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Image = event.target.result;
      
      const textarea = document.getElementById('content-editor');
      const start = textarea.selectionStart;
      const imgTag = `<img src="${base64Image}" alt="${file.name}" style="max-width: 100%; height: auto; border-radius: 8px; margin: 16px 0;" />`;
      
      const newContent = formData.content.substring(0, start) + imgTag + formData.content.substring(start);
      handleChange('content', newContent);

      console.log('✅ Görsel başarıyla eklendi (Base64)');
    };

    reader.onerror = () => {
      console.error('❌ Görsel yükleme hatası');
    };

    reader.readAsDataURL(file);
    
    // Input'u temizle
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validasyon
    if (!formData.title.trim()) {
      console.error('Blog başlığı gerekli');
      return;
    }
    
    if (!formData.content.trim()) {
      console.error('Blog içeriği gerekli');
      return;
    }
    
    // Tags'i array'e çevir
    const tagsArray = formData.tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    // Categories'i array'e çevir
    const categoriesArray = formData.categories
      .split(',')
      .map(cat => cat.trim())
      .filter(cat => cat.length > 0);

    onSave({
      title: formData.title.trim(),
      content: formData.content,
      excerpt: formData.excerpt.trim(),
      tags: tagsArray,
      categories: categoriesArray,
      featuredImage: formData.featuredImage.trim(),
      status: formData.status,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Başlık */}
      <Input
        label="Blog Başlığı"
        placeholder="Başlık girin..."
        value={formData.title}
        onChange={(e) => handleChange('title', e.target.value)}
        required
      />

      {/* Özet */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Özet (Opsiyonel)
        </label>
        <textarea
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          rows="3"
          placeholder="Blog özeti..."
          value={formData.excerpt}
          onChange={(e) => handleChange('excerpt', e.target.value)}
        />
      </div>

      {/* İçerik Editörü */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            İçerik (HTML Desteği)
          </label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsPreview(!isPreview)}
          >
            <Eye className="w-4 h-4 mr-2" />
            {isPreview ? 'Editör' : 'Önizleme'}
          </Button>
        </div>

        {!isPreview ? (
          <div>
            {/* Basit Formatting Toolbar */}
            <div className="flex flex-wrap gap-2 mb-2 p-2 bg-gray-100 dark:bg-gray-700 rounded-t-lg border border-gray-300 dark:border-gray-600">
              <button
                type="button"
                onClick={() => insertFormatting('h2')}
                className="px-3 py-1 text-sm bg-white dark:bg-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-500 border border-gray-300 dark:border-gray-500"
                title="Başlık (H2)"
              >
                H2
              </button>
              <button
                type="button"
                onClick={() => insertFormatting('h3')}
                className="px-3 py-1 text-sm bg-white dark:bg-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-500 border border-gray-300 dark:border-gray-500"
                title="Alt Başlık (H3)"
              >
                H3
              </button>
              <button
                type="button"
                onClick={() => insertFormatting('p')}
                className="px-3 py-1 text-sm bg-white dark:bg-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-500 border border-gray-300 dark:border-gray-500"
                title="Paragraf"
              >
                P
              </button>
              <button
                type="button"
                onClick={() => insertFormatting('strong')}
                className="px-3 py-1 text-sm bg-white dark:bg-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-500 border border-gray-300 dark:border-gray-500"
                title="Kalın"
              >
                <Bold className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => insertFormatting('em')}
                className="px-3 py-1 text-sm bg-white dark:bg-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-500 border border-gray-300 dark:border-gray-500"
                title="İtalik"
              >
                <Italic className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => insertFormatting('ul')}
                className="px-3 py-1 text-sm bg-white dark:bg-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-500 border border-gray-300 dark:border-gray-500"
                title="Liste"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => insertFormatting('code')}
                className="px-3 py-1 text-sm bg-white dark:bg-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-500 border border-gray-300 dark:border-gray-500"
                title="Kod"
              >
                &lt;/&gt;
              </button>
              
              {/* Görsel Ekleme Butonları */}
              <div className="border-l border-gray-300 dark:border-gray-500 pl-2 ml-2" />
              
              <button
                type="button"
                onClick={() => setIsImageModalOpen(true)}
                className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 border border-blue-600"
                title="URL ile Görsel Ekle"
              >
                <Image className="w-4 h-4" />
              </button>
              
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600 border border-green-600"
                title="Dosya Yükle"
              >
                <Upload className="w-4 h-4" />
              </button>
              
              {/* Gizli file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            <textarea
              id="content-editor"
              className="w-full h-96 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-b-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white font-mono text-sm"
              placeholder="<h2>Blog Başlığı</h2>&#10;<p>Blog içeriğinizi HTML formatında yazın...</p>&#10;&#10;<h3>Alt Başlık</h3>&#10;<p>Paragraf metni...</p>"
              value={formData.content}
              onChange={(e) => handleChange('content', e.target.value)}
              required
            />
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              💡 İpucu: Üstteki butonları kullanarak HTML etiketleri ekleyebilirsiniz. Seçili metne format uygulanır.
            </p>
          </div>
        ) : (
          <div 
            className="prose dark:prose-invert max-w-none bg-white dark:bg-gray-800 rounded-lg p-6 min-h-[400px] border border-gray-300 dark:border-gray-600"
            dangerouslySetInnerHTML={{ __html: formData.content }}
          />
        )}
      </div>

      {/* Kategoriler ve Etiketler - Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Kategoriler */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Kategoriler
          </label>
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="Teknoloji, Yazılım"
            value={formData.categories}
            onChange={(e) => handleChange('categories', e.target.value)}
          />
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            💡 Virgülle ayırın (örn: Teknoloji, Yazılım)
          </p>
        </div>

        {/* Etiketler */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Etiketler
          </label>
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="react, javascript, webdev"
            value={formData.tags}
            onChange={(e) => handleChange('tags', e.target.value)}
          />
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            💡 Virgülle ayırın (örn: react, javascript)
          </p>
        </div>
      </div>

      {/* Öne Çıkan Görsel URL */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Öne Çıkan Görsel URL (Opsiyonel)
        </label>
        <input
          type="url"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          placeholder="https://example.com/image.jpg"
          value={formData.featuredImage}
          onChange={(e) => handleChange('featuredImage', e.target.value)}
        />
        {formData.featuredImage && (
          <div className="mt-2">
            <img 
              src={formData.featuredImage} 
              alt="Önizleme" 
              className="h-32 w-auto rounded border border-gray-300 dark:border-gray-600"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
        )}
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          💡 Blog kartında gösterilecek görsel
        </p>
      </div>

      {/* Durum (Status) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Yayın Durumu
        </label>
        <select
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          value={formData.status}
          onChange={(e) => handleChange('status', e.target.value)}
        >
          <option value="draft">📝 Taslak</option>
          <option value="published">✅ Yayınla</option>
          <option value="archived">📦 Arşivle</option>
        </select>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {formData.status === 'draft' && '💡 Taslak: Sadece siz görebilirsiniz'}
          {formData.status === 'published' && '💡 Yayınla: Herkes görebilir'}
          {formData.status === 'archived' && '💡 Arşivle: Kimse göremez'}
        </p>
      </div>

      {/* Butonlar */}
      <div className="flex gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
        <Button type="submit" size="lg">
          <Save className="w-5 h-5 mr-2" />
          Kaydet ve Yayınla
        </Button>
        <Button 
          type="button" 
          variant="secondary" 
          size="lg"
          onClick={(e) => {
            e.preventDefault();
            if (onSaveDraft) {
              const tagsArray = formData.tags
                .split(',')
                .map(tag => tag.trim())
                .filter(tag => tag.length > 0);
              
              const categoriesArray = formData.categories
                .split(',')
                .map(cat => cat.trim())
                .filter(cat => cat.length > 0);
              
              onSaveDraft({
                title: formData.title.trim(),
                content: formData.content,
                excerpt: formData.excerpt.trim(),
                tags: tagsArray,
                categories: categoriesArray,
                featuredImage: formData.featuredImage.trim(),
                status: formData.status,
              });
            }
          }}
        >
          <Save className="w-5 h-5 mr-2" />
          Taslak Olarak Kaydet
        </Button>
      </div>

      {/* Görsel URL Modal */}
      <Modal
        isOpen={isImageModalOpen}
        onClose={() => {
          setIsImageModalOpen(false);
          setImageUrl('');
          setImageAlt('');
        }}
        title="URL ile Görsel Ekle"
      >
        <div className="space-y-4">
          <Input
            label="Görsel URL'si"
            placeholder="https://example.com/image.jpg"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            required
          />
          
          <Input
            label="Alt Text (Opsiyonel)"
            placeholder="Görselin açıklaması"
            value={imageAlt}
            onChange={(e) => setImageAlt(e.target.value)}
          />

          <div className="bg-gray-50 dark:bg-gray-700 rounded p-3">
            <p className="text-xs text-gray-600 dark:text-gray-400">
              💡 <strong>İpucu:</strong> Ücretsiz görsel için:{' '}
              <a 
                href="https://unsplash.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Unsplash
              </a>
              {' '} veya {' '}
              <a 
                href="https://pexels.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Pexels
              </a>
            </p>
          </div>

          {/* Önizleme */}
          {imageUrl && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Önizleme:
              </label>
              <img 
                src={imageUrl} 
                alt="Önizleme"
                className="max-w-full h-auto rounded border border-gray-300 dark:border-gray-600"
                onError={(e) => {
                  console.error('Görsel yüklenemedi');
                  e.target.style.display = 'none';
                }}
              />
            </div>
          )}

          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setIsImageModalOpen(false);
                setImageUrl('');
                setImageAlt('');
              }}
            >
              İptal
            </Button>
            <Button
              type="button"
              onClick={insertImageFromUrl}
            >
              Ekle
            </Button>
          </div>
        </div>
      </Modal>
    </form>
  );
}


'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card, Button, Modal, Input } from '@/components/ui';
import { 
  Plus, 
  Edit, 
  Trash2, 
  FolderOpen,
  Tag,
  Search,
  MoreVertical 
} from 'lucide-react';

/**
 * Admin Kategori ve Etiket Yönetimi Sayfası
 */

export default function AdminCategoriesPage() {
  const router = useRouter();
  const { user } = useSelector((state) => state.auth);

  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [activeTab, setActiveTab] = useState('categories'); // 'categories' | 'tags'
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [modalType, setModalType] = useState('category'); // 'category' | 'tag'
  const [showMenu, setShowMenu] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    color: '#3B82F6',
    description: ''
  });

  useEffect(() => {
    // Giriş ve admin kontrolü
    if (!user) {
      router.push('/login');
      return;
    }
    
    if (user.role !== 'admin') {
      router.push('/');
      return;
    }
    
    // TODO: API'den kategorileri ve etiketleri çek
    // Geçici mock veri
    setCategories([
      { _id: '1', name: 'Teknoloji', slug: 'teknoloji', color: '#3B82F6', blogCount: 24 },
      { _id: '2', name: 'Yazılım', slug: 'yazilim', color: '#10B981', blogCount: 18 },
      { _id: '3', name: 'Web Design', slug: 'web-design', color: '#F59E0B', blogCount: 12 },
    ]);

    setTags([
      { _id: '1', name: 'react', slug: 'react', color: '#61DAFB', blogCount: 15 },
      { _id: '2', name: 'javascript', slug: 'javascript', color: '#F7DF1E', blogCount: 20 },
      { _id: '3', name: 'nodejs', slug: 'nodejs', color: '#339933', blogCount: 10 },
    ]);
  }, [user, router]);

  const currentData = activeTab === 'categories' ? categories : tags;
  const filteredData = currentData.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Yeni/Düzenle Modal'ı Aç
  const openModal = (type, item = null) => {
    setModalType(type);
    setEditingItem(item);
    if (item) {
      setFormData({
        name: item.name,
        slug: item.slug,
        color: item.color,
        description: item.description || ''
      });
    } else {
      setFormData({
        name: '',
        slug: '',
        color: '#3B82F6',
        description: ''
      });
    }
    setIsModalOpen(true);
  };

  // Kaydet
  const handleSave = () => {
    // TODO: API'ye kaydetme isteği
    console.log('Kaydediliyor:', { modalType, editingItem, formData });
    
    if (modalType === 'category') {
      if (editingItem) {
        setCategories(categories.map(c => 
          c._id === editingItem._id ? { ...c, ...formData } : c
        ));
      } else {
        setCategories([...categories, { _id: Date.now().toString(), ...formData, blogCount: 0 }]);
      }
    } else {
      if (editingItem) {
        setTags(tags.map(t => 
          t._id === editingItem._id ? { ...t, ...formData } : t
        ));
      } else {
        setTags([...tags, { _id: Date.now().toString(), ...formData, blogCount: 0 }]);
      }
    }

    setIsModalOpen(false);
    setEditingItem(null);
    console.log('✅ Başarıyla kaydedildi');
  };

  // Sil
  const handleDelete = (type, id, name) => {
    if (!confirm(`"${name}" ${type === 'category' ? 'kategorisini' : 'etiketini'} silmek istediğinize emin misiniz?`)) {
      return;
    }

    // TODO: API'ye silme isteği
    console.log('Siliniyor:', { type, id });
    
    if (type === 'category') {
      setCategories(categories.filter(c => c._id !== id));
    } else {
      setTags(tags.filter(t => t._id !== id));
    }

    console.log('✅ Başarıyla silindi');
  };

  // Slug oluştur
  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Kategori & Etiket Yönetimi
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Bloglarınız için kategorileri ve etiketleri yönetin
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('categories')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'categories'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <FolderOpen className="w-5 h-5 inline-block mr-2" />
            Kategoriler ({categories.length})
          </button>
          <button
            onClick={() => setActiveTab('tags')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'tags'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <Tag className="w-5 h-5 inline-block mr-2" />
            Etiketler ({tags.length})
          </button>
        </div>

        {/* Filtreler ve Aksiyon */}
        <Card className="mb-6">
          <div className="flex items-center justify-between gap-4">
            {/* Arama */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder={`${activeTab === 'categories' ? 'Kategori' : 'Etiket'} ara...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Yeni Ekle Butonu */}
            <Button onClick={() => openModal(activeTab === 'categories' ? 'category' : 'tag')}>
              <Plus className="w-5 h-5 mr-2" />
              Yeni {activeTab === 'categories' ? 'Kategori' : 'Etiket'}
            </Button>
          </div>

          {/* Sonuç Sayısı */}
          <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            {filteredData.length} {activeTab === 'categories' ? 'kategori' : 'etiket'} bulundu
          </div>
        </Card>

        {/* Liste */}
        {filteredData.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                {activeTab === 'categories' ? 'Kategori' : 'Etiket'} bulunamadı.
              </p>
              <Button onClick={() => openModal(activeTab === 'categories' ? 'category' : 'tag')}>
                <Plus className="w-5 h-5 mr-2" />
                İlk {activeTab === 'categories' ? 'Kategoriyi' : 'Etiketi'} Oluşturun
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredData.map((item, index) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      {/* Renk */}
                      <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold"
                        style={{ backgroundColor: item.color }}
                      >
                        {activeTab === 'categories' ? (
                          <FolderOpen className="w-6 h-6" />
                        ) : (
                          <Tag className="w-6 h-6" />
                        )}
                      </div>

                      {/* Bilgiler */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                          {item.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                          /{item.slug}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                          {item.blogCount} blog
                        </p>
                      </div>
                    </div>

                    {/* Menü */}
                    <div className="relative">
                      <button
                        onClick={() => setShowMenu(showMenu === item._id ? null : item._id)}
                        className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <MoreVertical className="w-5 h-5" />
                      </button>

                      {showMenu === item._id && (
                        <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                          <button
                            onClick={() => {
                              setShowMenu(null);
                              openModal(activeTab === 'categories' ? 'category' : 'tag', item);
                            }}
                            className="w-full flex items-center gap-2 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <Edit className="w-4 h-4" />
                            Düzenle
                          </button>
                          <button
                            onClick={() => {
                              setShowMenu(null);
                              handleDelete(activeTab === 'categories' ? 'category' : 'tag', item._id, item.name);
                            }}
                            className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <Trash2 className="w-4 h-4" />
                            Sil
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingItem(null);
          }}
          title={editingItem ? `${modalType === 'category' ? 'Kategori' : 'Etiket'} Düzenle` : `Yeni ${modalType === 'category' ? 'Kategori' : 'Etiket'}`}
        >
          <div className="space-y-4">
            <Input
              label="Ad"
              placeholder={modalType === 'category' ? 'Teknoloji' : 'react'}
              value={formData.name}
              onChange={(e) => {
                const name = e.target.value;
                setFormData({
                  ...formData,
                  name,
                  slug: generateSlug(name)
                });
              }}
              required
            />

            <Input
              label="Slug (URL)"
              placeholder={modalType === 'category' ? 'teknoloji' : 'react'}
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Renk
              </label>
              <div className="flex gap-3">
                <input
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="h-10 w-20 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="#3B82F6"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Açıklama (Opsiyonel)
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Açıklama..."
              />
            </div>

            <div className="flex gap-3 justify-end pt-4">
              <Button
                variant="secondary"
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingItem(null);
                }}
              >
                İptal
              </Button>
              <Button onClick={handleSave}>
                {editingItem ? 'Güncelle' : 'Oluştur'}
              </Button>
            </div>
          </div>
        </Modal>
      </motion.div>
    </div>
  );
}

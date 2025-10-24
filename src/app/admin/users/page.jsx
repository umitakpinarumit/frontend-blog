'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card, Button, Modal, Input } from '@/components/ui';
import { 
  UserPlus, 
  Search, 
  Edit, 
  Trash2, 
  Shield, 
  Mail,
  Calendar,
  MoreVertical 
} from 'lucide-react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

/**
 * Admin Kullanıcı Yönetimi Sayfası
 * Kullanıcı CRUD işlemleri
 */

export default function AdminUsersPage() {
  const router = useRouter();
  const { user } = useSelector((state) => state.auth);

  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [showMenu, setShowMenu] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    // Admin kontrolü
    if (user && user.role !== 'admin') {
      alert('Bu sayfaya erişim yetkiniz yok!');
      router.push('/');
      return;
    }
    
    // TODO: API'den kullanıcıları çek
    // Geçici mock veri
    setUsers([
      {
        _id: '1',
        name: 'Admin Kullanıcı',
        email: 'admin@example.com',
        role: 'admin',
        createdAt: new Date().toISOString(),
        blogCount: 24,
      },
      {
        _id: '2',
        name: 'Yazar Kullanıcı',
        email: 'yazar@example.com',
        role: 'user',
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        blogCount: 12,
      },
    ]);
  }, [user, router]);

  // Filtreleme
  const filteredUsers = users.filter(u => {
    const matchesSearch = searchQuery
      ? u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    
    const matchesRole = roleFilter !== 'all'
      ? u.role === roleFilter
      : true;

    return matchesSearch && matchesRole;
  });

  // Kullanıcı Silme
  const handleDelete = async (userId, userName) => {
    if (!confirm(`"${userName}" kullanıcısını silmek istediğinize emin misiniz?`)) {
      return;
    }

    try {
      // TODO: API'ye silme isteği
      console.log('Kullanıcı siliniyor:', userId);
      setUsers(users.filter(u => u._id !== userId));
      alert('✅ Kullanıcı başarıyla silindi!');
    } catch (error) {
      console.error('Silme hatası:', error);
      alert('Kullanıcı silinirken bir hata oluştu!');
    }
  };

  // Rol Değiştirme
  const handleRoleChange = async (userId, newRole) => {
    try {
      // TODO: API'ye rol güncelleme isteği
      console.log('Rol değiştiriliyor:', { userId, newRole });
      setUsers(users.map(u => 
        u._id === userId ? { ...u, role: newRole } : u
      ));
      alert('✅ Kullanıcı rolü güncellendi!');
    } catch (error) {
      console.error('Rol güncelleme hatası:', error);
      alert('Rol güncellenirken bir hata oluştu!');
    }
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
              Kullanıcı Yönetimi
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Tüm kullanıcıları görüntüleyin ve yönetin
            </p>
          </div>
          
          <Button size="lg" onClick={() => setIsModalOpen(true)}>
            <UserPlus className="w-5 h-5 mr-2" />
            Yeni Kullanıcı
          </Button>
        </div>

        {/* Filtreler */}
        <Card className="mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Arama */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Kullanıcı ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Rol Filtresi */}
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tüm Roller</option>
              <option value="admin">Adminler</option>
              <option value="user">Kullanıcılar</option>
            </select>
          </div>

          {/* Sonuç Sayısı */}
          <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            {filteredUsers.length} kullanıcı bulundu
          </div>
        </Card>

        {/* Kullanıcı Listesi */}
        {filteredUsers.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">
                Kullanıcı bulunamadı.
              </p>
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredUsers.map((u, index) => (
              <motion.div
                key={u._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between">
                    {/* Kullanıcı Bilgileri */}
                    <div className="flex items-center gap-4">
                      {/* Avatar */}
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                        {u.name.charAt(0).toUpperCase()}
                      </div>

                      {/* Detaylar */}
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                            {u.name}
                          </h3>
                          {u.role === 'admin' && (
                            <span className="px-2 py-1 text-xs bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 rounded flex items-center gap-1">
                              <Shield className="w-3 h-3" />
                              Admin
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                          <span className="flex items-center gap-1">
                            <Mail className="w-4 h-4" />
                            {u.email}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {format(new Date(u.createdAt), 'd MMM yyyy', { locale: tr })}
                          </span>
                          <span>•</span>
                          <span>{u.blogCount} blog</span>
                        </div>
                      </div>
                    </div>

                    {/* Aksiyon Menüsü */}
                    <div className="relative">
                      <button
                        onClick={() => setShowMenu(showMenu === u._id ? null : u._id)}
                        className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <MoreVertical className="w-5 h-5" />
                      </button>

                      {showMenu === u._id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                          <button
                            onClick={() => {
                              setShowMenu(null);
                              setEditingUser(u);
                              setIsModalOpen(true);
                            }}
                            className="w-full flex items-center gap-2 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <Edit className="w-4 h-4" />
                            Düzenle
                          </button>
                          
                          <button
                            onClick={() => {
                              setShowMenu(null);
                              const newRole = u.role === 'admin' ? 'user' : 'admin';
                              handleRoleChange(u._id, newRole);
                            }}
                            className="w-full flex items-center gap-2 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <Shield className="w-4 h-4" />
                            {u.role === 'admin' ? 'Kullanıcı Yap' : 'Admin Yap'}
                          </button>

                          <button
                            onClick={() => {
                              setShowMenu(null);
                              handleDelete(u._id, u.name);
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

        {/* Kullanıcı Ekleme/Düzenleme Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingUser(null);
          }}
          title={editingUser ? 'Kullanıcı Düzenle' : 'Yeni Kullanıcı'}
        >
          <div className="space-y-4">
            <Input
              label="Ad Soyad"
              placeholder="John Doe"
              defaultValue={editingUser?.name}
            />
            <Input
              label="E-posta"
              type="email"
              placeholder="john@example.com"
              defaultValue={editingUser?.email}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Rol
              </label>
              <select
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                defaultValue={editingUser?.role || 'user'}
              >
                <option value="user">Kullanıcı</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {!editingUser && (
              <Input
                label="Şifre"
                type="password"
                placeholder="••••••••"
              />
            )}

            <div className="flex gap-3 justify-end pt-4">
              <Button
                variant="secondary"
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingUser(null);
                }}
              >
                İptal
              </Button>
              <Button onClick={() => {
                // TODO: Kaydetme işlemi
                alert('Kaydedildi! (TODO: API entegrasyonu)');
                setIsModalOpen(false);
                setEditingUser(null);
              }}>
                {editingUser ? 'Güncelle' : 'Oluştur'}
              </Button>
            </div>
          </div>
        </Modal>
      </motion.div>
    </div>
  );
}

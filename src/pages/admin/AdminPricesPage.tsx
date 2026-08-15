import React, { useState, useEffect } from 'react';
import { supabaseService } from '../../services/supabaseService';
import type { WasteTypeWithCategory, WasteCategory } from '../../types';
import { formatRupiah } from '../../lib/utils';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Tag, Edit3, Trash2, Plus, Search, Loader2, CheckCircle2, AlertCircle, EyeOff, Power } from 'lucide-react';
import confetti from 'canvas-confetti';

export const AdminPricesPage: React.FC = () => {
  const [wasteTypes, setWasteTypes] = useState<WasteTypeWithCategory[]>([]);
  const [categories, setCategories] = useState<WasteCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  // Add / Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingType, setEditingType] = useState<WasteTypeWithCategory | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [price, setPrice] = useState<number | string>(100);
  const [unit, setUnit] = useState<'kg' | 'liter' | 'pcs'>('kg');
  const [isActive, setIsActive] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState(false);

  // Delete / Deactivate Confirmation Modal State
  const [deletingType, setDeletingType] = useState<WasteTypeWithCategory | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'info' | 'error'; message: string } | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [typesRes, catRes] = await Promise.all([
        supabaseService.getWasteTypes(),
        supabaseService.getWasteCategories()
      ]);
      setWasteTypes(typesRes);
      setCategories(catRes);
      if (catRes.length > 0 && !categoryId) {
        setCategoryId(catRes[0].id);
      }
    } catch (err) {
      console.error('Error loading waste types:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Auto-dismiss notification after 6 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 6000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleOpenAddModal = () => {
    setEditingType(null);
    setName('');
    if (categories.length > 0) setCategoryId(categories[0].id);
    setPrice(100);
    setUnit('kg');
    setIsActive(true);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (wt: WasteTypeWithCategory) => {
    setEditingType(wt);
    setName(wt.name);
    setCategoryId(wt.category_id);
    setPrice(wt.price_per_kg);
    setUnit(wt.unit);
    setIsActive(wt.is_active ?? true);
    setIsModalOpen(true);
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();

    const numericPrice = typeof price === 'number' ? price : (Number(price) || 0);

    if (numericPrice < 100) {
      setNotification({
        type: 'error',
        message: 'Batas minimum harga beli adalah Rp 100.'
      });
      return;
    }

    try {
      setSubmitting(true);
      if (editingType) {
        // Update existing waste type
        await supabaseService.updateWasteType(editingType.id, {
          name,
          category_id: categoryId,
          price_per_kg: numericPrice,
          unit,
          is_active: isActive
        });
        setNotification({
          type: 'success',
          message: `Perubahan data '${name}' berhasil disimpan.`
        });
      } else {
        // Add new waste type
        await supabaseService.createWasteType({
          name,
          category_id: categoryId,
          price_per_kg: numericPrice,
          unit,
          is_active: isActive
        });
        confetti({ particleCount: 40, spread: 40, origin: { y: 0.7 } });
        setNotification({
          type: 'success',
          message: `Jenis sampah '${name}' berhasil ditambahkan.`
        });
      }

      await loadData();
      setIsModalOpen(false);
    } catch (err: any) {
      console.error('Error saving waste type:', err);
      setNotification({
        type: 'error',
        message: err.message || 'Gagal menyimpan jenis sampah'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (wt: WasteTypeWithCategory) => {
    const nextStatus = !wt.is_active;
    try {
      setSubmitting(true);
      await supabaseService.toggleWasteTypeStatus(wt.id, nextStatus);
      await loadData();
      setNotification({
        type: 'info',
        message: `'${wt.name}' sekarang berstatus: ${nextStatus ? 'AKTIF (Tersedia untuk transaksi)' : 'NONAKTIF (Arsip)'}`
      });
    } catch (err: any) {
      console.error('Error toggling waste type status:', err);
      setNotification({
        type: 'error',
        message: err.message || 'Gagal mengubah status jenis sampah'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteWasteType = async () => {
    if (!deletingType) return;
    try {
      setSubmitting(true);
      const result = await supabaseService.deleteWasteType(deletingType.id);
      await loadData();

      if (result.mode === 'deactivated') {
        setNotification({
          type: 'info',
          message: `Jenis sampah '${deletingType.name}' berhasil dinonaktifkan (disimpan sebagai arsip karena terdapat riwayat transaksi setor nasabah).`
        });
      } else {
        setNotification({
          type: 'success',
          message: `Jenis sampah '${deletingType.name}' berhasil dihapus permanen.`
        });
      }

      setDeletingType(null);
    } catch (err: any) {
      console.error('Error deleting waste type:', err);
      setNotification({
        type: 'error',
        message: err.message || 'Gagal menghapus jenis sampah'
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Filtered waste types based on search, category, and is_active status
  const filteredTypes = wasteTypes.filter(wt => {
    const matchesSearch = wt.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          wt.category?.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategoryFilter === 'all' || wt.category_id === selectedCategoryFilter;
    
    const wtIsActive = wt.is_active ?? true;
    const matchesStatus = 
      statusFilter === 'all' ? true :
      statusFilter === 'active' ? wtIsActive : !wtIsActive;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const activeCount = wasteTypes.filter(wt => (wt.is_active ?? true)).length;
  const inactiveCount = wasteTypes.filter(wt => !(wt.is_active ?? true)).length;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-pink-100 shadow-xs">
        <div>
          <Badge variant="pink" size="md">MANAJEMEN STANDAR HARGA</Badge>
          <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight mt-1">
            Kelola Jenis Sampah & Harga Beli
          </h1>
          <p className="text-xs text-slate-500">
            Tambah, perbarui tarif harga per kg (minimum Rp 100), serta atur status aktif/nonaktif jenis sampah di Posko Bank Sampah Desa Rowotamtu.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          icon={<Plus className="w-4 h-4" />}
          onClick={handleOpenAddModal}
          className="cursor-pointer"
        >
          Tambah Jenis Sampah Baru
        </Button>
      </div>

      {/* Notification Banner */}
      {notification && (
        <div className={`p-4 rounded-2xl border text-xs font-semibold flex items-center justify-between gap-3 animate-fade-in ${
          notification.type === 'success' 
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
            : notification.type === 'error'
            ? 'bg-rose-50 border-rose-200 text-rose-800'
            : 'bg-sky-50 border-sky-200 text-sky-800'
        }`}>
          <div className="flex items-center gap-2">
            {notification.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
            {notification.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />}
            {notification.type === 'info' && <AlertCircle className="w-4 h-4 text-sky-600 shrink-0" />}
            <p>{notification.message}</p>
          </div>
          <button 
            onClick={() => setNotification(null)}
            className="text-xs opacity-60 hover:opacity-100 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="space-y-3 bg-white p-4 rounded-2xl border border-pink-100">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Cari jenis sampah..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>

          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                statusFilter === 'all'
                  ? 'bg-white text-slate-800 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Semua ({wasteTypes.length})
            </button>
            <button
              onClick={() => setStatusFilter('active')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                statusFilter === 'active'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-emerald-700 hover:bg-emerald-50'
              }`}
            >
              Aktif ({activeCount})
            </button>
            <button
              onClick={() => setStatusFilter('inactive')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                statusFilter === 'inactive'
                  ? 'bg-slate-700 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              Nonaktif ({inactiveCount})
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 border-t border-slate-100">
          <button
            onClick={() => setSelectedCategoryFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer shrink-0 ${
              selectedCategoryFilter === 'all'
                ? 'bg-pink-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-pink-50 hover:text-pink-600'
            }`}
          >
            Semua Kategori
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategoryFilter(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer shrink-0 ${
                selectedCategoryFilter === cat.id
                  ? 'bg-pink-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-pink-50 hover:text-pink-600'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Waste Types List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[250px] gap-3 text-pink-600">
          <Loader2 className="w-8 h-8 animate-spin" />
          <p className="text-xs font-semibold text-slate-600">Memuat katalog jenis sampah...</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTypes.length > 0 ? (
            filteredTypes.map(wt => {
              const isItemActive = wt.is_active ?? true;
              return (
                <Card 
                  key={wt.id} 
                  className={`p-4 flex flex-wrap items-center justify-between gap-4 transition-colors ${
                    isItemActive 
                      ? 'border-pink-100 hover:border-pink-200 bg-white' 
                      : 'border-slate-200 bg-slate-50/80 opacity-85'
                  }`}
                >
                  <div className="space-y-1.5 max-w-md">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant={isItemActive ? 'pink' : 'outline'}>
                        {(wt.category?.name || 'UMUM').toUpperCase()}
                      </Badge>
                      
                      {isItemActive ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                          Aktif
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 bg-slate-200/80 px-2 py-0.5 rounded-md">
                          <EyeOff className="w-3 h-3" />
                          Nonaktif (Arsip)
                        </span>
                      )}

                      <h3 className={`font-bold text-sm ${isItemActive ? 'text-slate-800' : 'text-slate-500 line-through'}`}>
                        {wt.name}
                      </h3>
                    </div>
                    <p className="text-xs text-slate-500">{wt.category?.description || 'Sampah terpilah'}</p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className={`text-lg font-extrabold ${isItemActive ? 'text-pink-600' : 'text-slate-400'}`}>
                        {formatRupiah(wt.price_per_kg)}
                      </p>
                      <p className="text-[10px] text-slate-400 font-semibold">per {wt.unit}</p>
                    </div>

                    <div className="flex items-center gap-1.5 border-l border-slate-200 pl-3">
                      {/* Toggle Quick Status */}
                      <button
                        onClick={() => handleToggleStatus(wt)}
                        className={`p-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1 ${
                          isItemActive 
                            ? 'text-slate-400 hover:text-amber-600 hover:bg-amber-50' 
                            : 'text-emerald-600 hover:bg-emerald-50'
                        }`}
                        title={isItemActive ? 'Nonaktifkan (Sembunyikan dari transaksi baru)' : 'Aktifkan Kembali'}
                      >
                        <Power className="w-4 h-4" />
                      </button>

                      {/* Edit Button */}
                      <Button
                        variant="soft"
                        size="sm"
                        icon={<Edit3 className="w-3.5 h-3.5" />}
                        onClick={() => handleOpenEditModal(wt)}
                        className="cursor-pointer"
                      >
                        Edit
                      </Button>

                      {/* Delete Button */}
                      <button
                        onClick={() => setDeletingType(wt)}
                        className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        title="Hapus / Arsipkan Jenis Sampah"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </Card>
              );
            })
          ) : (
            <div className="bg-white p-8 text-center rounded-2xl border border-pink-100 space-y-2">
              <Tag className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-xs text-slate-500 font-medium">Tidak ada jenis sampah yang cocok dengan filter.</p>
            </div>
          )}
        </div>
      )}

      {/* Modal Add / Edit */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingType ? '✏️ Edit Jenis Sampah & Harga' : '➕ Tambah Jenis Sampah Baru'}
        description="Atur nama, kategori, harga beli (min. Rp 100), serta ketersediaan status transaksi"
        maxWidth="md"
      >
        <form onSubmit={handleSubmitForm} className="space-y-4 text-xs">
          <Input
            label="NAMA JENIS SAMPAH"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Cth: Botol Plastik PET Bening"
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">KATEGORI SAMPAH</label>
              <select
                value={categoryId}
                onChange={e => setCategoryId(e.target.value)}
                className="w-full bg-white border border-pink-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:ring-2 focus:ring-pink-400 focus:outline-none"
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">SATUAN</label>
              <select
                value={unit}
                onChange={e => setUnit(e.target.value as any)}
                className="w-full bg-white border border-pink-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:ring-2 focus:ring-pink-400 focus:outline-none"
              >
                <option value="kg">kg (Kilogram)</option>
                <option value="liter">liter (Liter)</option>
                <option value="pcs">pcs (Buah)</option>
              </select>
            </div>
          </div>

          <Input
            label={`HARGA BELI (RP PER ${unit.toUpperCase()})`}
            type="number"
            value={price}
            onChange={e => setPrice(e.target.value === '' ? '' : Math.max(0, Number(e.target.value)))}
            onFocus={e => e.target.select()}
            placeholder="100"
            min="100"
            step="100"
            helperText="Batas minimum harga beli adalah Rp 100 per satuan"
            required
          />

          {/* Status Selection */}
          <div className="p-3 bg-pink-50/60 rounded-xl border border-pink-100 space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">STATUS KETERSEDIAAN</label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                <input
                  type="radio"
                  name="isActive"
                  checked={isActive === true}
                  onChange={() => setIsActive(true)}
                  className="text-pink-600 focus:ring-pink-400"
                />
                <span>Aktif (Tersedia untuk disetor)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-500">
                <input
                  type="radio"
                  name="isActive"
                  checked={isActive === false}
                  onChange={() => setIsActive(false)}
                  className="text-pink-600 focus:ring-pink-400"
                />
                <span>Nonaktif (Arsip / Disembunyikan)</span>
              </label>
            </div>
          </div>

          <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
            <Button variant="ghost" size="sm" type="button" onClick={() => setIsModalOpen(false)}>
              Batal
            </Button>
            <Button variant="primary" size="sm" type="submit" disabled={submitting}>
              {submitting ? 'Menyimpan...' : editingType ? 'Simpan Perubahan' : 'Tambah Jenis Sampah'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal Delete Confirmation */}
      {deletingType && (
        <Modal
          isOpen={Boolean(deletingType)}
          onClose={() => setDeletingType(null)}
          title="⚠️ Konfirmasi Hapus / Nonaktifkan"
          description={`Apakah Anda yakin ingin menghapus '${deletingType.name}'?`}
          maxWidth="sm"
        >
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-800 space-y-1">
              <p className="font-bold">💡 Informasi Keamanan Database:</p>
              <p className="text-[11px] leading-relaxed">
                Jika jenis sampah ini sudah pernah memiliki riwayat transaksi timbangan nasabah, sistem akan <strong>otomatis menonaktifkannya (soft delete)</strong> agar histori saldo dan laporan keuangan desa tetap aman dan tidak rusak.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <Button variant="ghost" size="sm" onClick={() => setDeletingType(null)}>
                Batal
              </Button>
              <Button variant="danger" size="sm" onClick={handleDeleteWasteType} disabled={submitting}>
                {submitting ? 'Memproses...' : 'Ya, Hapus / Nonaktifkan'}
              </Button>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
};

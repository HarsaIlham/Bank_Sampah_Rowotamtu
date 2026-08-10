import React, { useState, useEffect } from 'react';
import { supabaseService } from '../../services/supabaseService';
import type { WasteTypeWithCategory, WasteCategory } from '../../types';
import { formatRupiah } from '../../lib/utils';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Tag, Edit3, Trash2, Plus, Search, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export const AdminPricesPage: React.FC = () => {
  const [wasteTypes, setWasteTypes] = useState<WasteTypeWithCategory[]>([]);
  const [categories, setCategories] = useState<WasteCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');

  // Add / Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingType, setEditingType] = useState<WasteTypeWithCategory | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [price, setPrice] = useState<number | string>(3000);
  const [unit, setUnit] = useState<'kg' | 'liter' | 'pcs'>('kg');
  const [submitting, setSubmitting] = useState(false);

  // Delete Confirmation Modal State
  const [deletingType, setDeletingType] = useState<WasteTypeWithCategory | null>(null);

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

  const handleOpenAddModal = () => {
    setEditingType(null);
    setName('');
    if (categories.length > 0) setCategoryId(categories[0].id);
    setPrice(3000);
    setUnit('kg');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (wt: WasteTypeWithCategory) => {
    setEditingType(wt);
    setName(wt.name);
    setCategoryId(wt.category_id);
    setPrice(wt.price_per_kg);
    setUnit(wt.unit);
    setIsModalOpen(true);
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();

    const numericPrice = typeof price === 'number' ? price : (Number(price) || 0);

    try {
      setSubmitting(true);
      if (editingType) {
        // Update existing waste type
        await supabaseService.updateWasteType(editingType.id, {
          name,
          category_id: categoryId,
          price_per_kg: numericPrice,
          unit
        });
      } else {
        // Add new waste type
        await supabaseService.createWasteType({
          name,
          category_id: categoryId,
          price_per_kg: numericPrice,
          unit
        });
        confetti({ particleCount: 40, spread: 40, origin: { y: 0.7 } });
      }

      await loadData();
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error saving waste type:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteWasteType = async () => {
    if (!deletingType) return;
    try {
      setSubmitting(true);
      await supabaseService.deleteWasteType(deletingType.id);
      await loadData();
      setDeletingType(null);
    } catch (err) {
      console.error('Error deleting waste type:', err);
    } finally {
      setSubmitting(false);
    }
  };

  // Filtered waste types based on search and category
  const filteredTypes = wasteTypes.filter(wt => {
    const matchesSearch = wt.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          wt.category?.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategoryFilter === 'all' || wt.category_id === selectedCategoryFilter;
    return matchesSearch && matchesCategory;
  });

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
            Tambah, edit nama, kategori, serta perbarui tarif harga per kg yang berlaku di Posko Bank Sampah Desa Rowotamtu.
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

      {/* Filter & Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-pink-100">
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

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setSelectedCategoryFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
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
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
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
            filteredTypes.map(wt => (
              <Card key={wt.id} className="p-4 flex flex-wrap items-center justify-between gap-4 border-pink-100 hover:border-pink-200 transition-colors">
                <div className="space-y-1 max-w-md">
                  <div className="flex items-center gap-2">
                    <Badge variant="pink">
                      {(wt.category?.name || 'UMUM').toUpperCase()}
                    </Badge>
                    <h3 className="font-bold text-slate-800 text-sm">{wt.name}</h3>
                  </div>
                  <p className="text-xs text-slate-500">{wt.category?.description || 'Sampah terpilah'}</p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-lg font-extrabold text-pink-600">{formatRupiah(wt.price_per_kg)}</p>
                    <p className="text-[10px] text-slate-400 font-semibold">per {wt.unit}</p>
                  </div>

                  <div className="flex items-center gap-1.5 border-l border-slate-100 pl-3">
                    <Button
                      variant="soft"
                      size="sm"
                      icon={<Edit3 className="w-3.5 h-3.5" />}
                      onClick={() => handleOpenEditModal(wt)}
                      className="cursor-pointer"
                    >
                      Edit
                    </Button>

                    <button
                      onClick={() => setDeletingType(wt)}
                      className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                      title="Hapus Jenis Sampah"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="bg-white p-8 text-center rounded-2xl border border-pink-100 space-y-2">
              <Tag className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-xs text-slate-500 font-medium">Tidak ada jenis sampah yang cocok.</p>
            </div>
          )}
        </div>
      )}

      {/* Modal Add / Edit */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingType ? '✏️ Edit Jenis Sampah & Harga' : '➕ Tambah Jenis Sampah Baru'}
        description="Atur nama, kategori, dan harga beli per kg untuk sistem kas posko"
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
            placeholder="0"
            min="0"
            step="100"
            required
          />

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
          title="⚠️ Konfirmasi Hapus Jenis Sampah"
          description={`Apakah Anda yakin ingin menghapus '${deletingType.name}'?`}
          maxWidth="sm"
        >
          <div className="space-y-4 text-xs">
            <p className="text-slate-600">
              Jenis sampah ini tidak akan dapat dipilih lagi dalam transaksi penimbangan baru.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <Button variant="ghost" size="sm" onClick={() => setDeletingType(null)}>
                Batal
              </Button>
              <Button variant="danger" size="sm" onClick={handleDeleteWasteType} disabled={submitting}>
                {submitting ? 'Menghapus...' : 'Ya, Hapus'}
              </Button>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
};

import React, { useState } from 'react';
import { useWasteTypes, useWasteCategories } from '../../hooks/useAppQueries';
import { formatRupiah } from '../../lib/utils';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Search, Tag, Calculator, Loader2 } from 'lucide-react';

interface CatalogPageProps {
  onOpenCalculator: () => void;
}

export const CatalogPage: React.FC<CatalogPageProps> = ({ onOpenCalculator }) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('semua');

  const { data: wasteTypes = [], isLoading: loadingTypes } = useWasteTypes();
  const { data: categories = [], isLoading: loadingCats } = useWasteCategories();

  const loading = loadingTypes || loadingCats;

  const filteredTypes = wasteTypes.filter(wt => {
    const matchesSearch = wt.name.toLowerCase().includes(search.toLowerCase()) || 
                          (wt.category?.name || '').toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'semua' || wt.category_id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8">
      
      {/* Page Header */}
      <div className="bg-gradient-to-r from-pink-500 to-[#EC4899] text-white p-6 md:p-8 rounded-3xl shadow-md space-y-3">
        <Badge variant="secondary" size="md" className="bg-white/20 text-white border-white/30">
          KATALOG RESMI BANK SAMPAH DESA ROWOTAMTU
        </Badge>
        <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight">
          Daftar Harga & Jenis Sampah Daur Ulang
        </h1>
        <p className="text-xs md:text-sm text-pink-100 max-w-2xl leading-relaxed">
          Harga di bawah ini merupakan nilai standar tabungan yang berlaku di Posko Bank Sampah Desa Rowotamtu. Bersihkan & pilah sampah Anda untuk mendapatkan nilai maksimal.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="w-full md:w-80">
          <Input
            placeholder="Cari jenis sampah (cth: botol, kardus)..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            icon={<Search className="w-4 h-4 text-slate-400" />}
          />
        </div>

        {/* Group / Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 no-scrollbar">
          <button
            onClick={() => setSelectedCategory('semua')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              selectedCategory === 'semua'
                ? 'bg-[#EC4899] text-white shadow-sm'
                : 'bg-white text-slate-600 border border-pink-100 hover:bg-pink-50'
            }`}
          >
            Semua Kategori
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-[#EC4899] text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-pink-100 hover:bg-pink-50'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Categories / Types Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[300px] gap-3 text-pink-600">
          <Loader2 className="w-8 h-8 animate-spin" />
          <p className="text-xs font-semibold text-slate-600">Memuat katalog sampah...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTypes.map(wt => (
            <Card key={wt.id} hoverable className="flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="pink">
                    {(wt.category?.name || 'UMUM').toUpperCase()}
                  </Badge>

                  <div className="text-right">
                    <span className="text-lg font-extrabold text-pink-600">{formatRupiah(wt.price_per_kg)}</span>
                    <span className="text-xs text-slate-500 font-medium"> / {wt.unit}</span>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
                    <Tag className="w-4 h-4 text-pink-500 shrink-0" />
                    {wt.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {wt.category?.description || 'Sampah terpilah siap daur ulang'}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <Button
                  variant="soft"
                  size="sm"
                  className="w-full text-xs font-semibold cursor-pointer"
                  icon={<Calculator className="w-3.5 h-3.5" />}
                  onClick={onOpenCalculator}
                >
                  Hitung Simulasi Tabungan Ini
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {!loading && filteredTypes.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-pink-200">
          <p className="text-slate-500 text-sm font-medium">Tidak ada jenis sampah yang cocok dengan pencarian "{search}"</p>
        </div>
      )}

    </div>
  );
};

import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabaseService } from '../../services/supabaseService';
import { resolveImageUrl } from '../../lib/utils';
import { 
  Clock, 
  BookOpen, 
  Search, 
  Sparkles, 
  ArrowRight, 
  GraduationCap, 
  PiggyBank, 
  ChevronRight,
} from 'lucide-react';

const CATEGORIES = [
  'Semua',
  'Edukasi Dasar',
  'Tentang Bank Sampah',
  'Tips 3R',
  'Panduan Menabung',
  'Motivasi'
] as const;

export const EducationPage: React.FC = () => {
  const articles = supabaseService.getArticles();
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredArticles = useMemo(() => {
    return articles.filter(art => {
      const matchCategory = selectedCategory === 'Semua' || art.category === selectedCategory;
      const matchSearch = searchQuery.trim() === '' || 
        art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCategory && matchSearch;
    });
  }, [articles, selectedCategory, searchQuery]);

  return (
    <div className="max-w-5xl mx-auto space-y-10 py-2 md:py-6">
      
      {/* Blog Hero Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto pt-2">
        <div className="inline-flex items-center gap-2 bg-pink-100/80 text-pink-700 font-extrabold text-xs px-3.5 py-1.5 rounded-full border border-pink-200 shadow-xs">
          <GraduationCap className="w-4 h-4 text-pink-600" />
          <span>PUSAT EDUKASI & PANDUAN WARGA DESA ROWOTAMTU</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          Pilah Sampah Jadi <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500">Berkah & Tabungan</span>
        </h1>
        <p className="text-sm md:text-base text-slate-600 leading-relaxed">
          Kumpulan panduan praktis dan artikel ringan dari Tim Mahasiswa KKN-K ROWOTAMTU untuk membantu seluruh warga mengenal, memilah, dan menabung sampah dengan mudah.
        </p>
      </div>

      {/* Interactive Learning Steps Bar (Alur Belajar Warga) */}
      <div className="bg-gradient-to-br from-pink-50 via-rose-50/50 to-white p-5 rounded-3xl border border-pink-200/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-pink-500 text-white shadow-sm shadow-pink-200">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-black text-slate-800">Alur Belajar Menabung Sampah</h2>
              <p className="text-xs text-slate-500">Urutan panduan langkah demi langkah untuk warga Desa Rowotamtu</p>
            </div>
          </div>
          <span className="text-[11px] font-bold text-pink-700 bg-pink-100/70 px-2.5 py-1 rounded-full border border-pink-200">
            6 Materi Ringkas
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-1">
          {articles.map((art, idx) => (
            <button
              key={art.id}
              onClick={() => navigate(`/edukasi/${art.id}`)}
              className="p-3 rounded-2xl bg-white border border-pink-100/80 hover:border-pink-300 hover:shadow-md transition-all text-left group flex flex-col justify-between cursor-pointer"
            >
              <div className="space-y-1">
                <span className="text-[10px] font-black px-1.5 py-0.5 rounded-md bg-pink-50 text-pink-600 group-hover:bg-pink-500 group-hover:text-white transition-colors inline-block">
                  Langkah {idx + 1}
                </span>
                <p className="text-[11px] font-bold text-slate-800 group-hover:text-pink-600 transition-colors line-clamp-2 leading-tight">
                  {art.title.replace(/^Artikel \d+:\s*/, '')}
                </p>
              </div>
              <span className="text-[10px] text-pink-500 font-semibold flex items-center gap-0.5 mt-2 pt-2 border-t border-slate-100">
                Baca <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Search & Category Filter */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          
          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {CATEGORIES.map(cat => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    isSelected 
                      ? 'bg-pink-600 text-white shadow-md shadow-pink-200' 
                      : 'bg-white text-slate-600 hover:bg-pink-50 hover:text-pink-600 border border-slate-200/80'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[240px]">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Cari topik atau kata kunci..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-pink-500 placeholder:text-slate-400 font-medium"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-[10px] text-slate-400 hover:text-slate-600 absolute right-3 top-2.5 font-bold"
              >
                ✕
              </button>
            )}
          </div>

        </div>
      </div>

      {/* Filter Result or Empty State */}
      {filteredArticles.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-3xl border border-pink-100 p-8 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-pink-50 text-pink-500 flex items-center justify-center mx-auto">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">Tidak ada artikel yang cocok</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Coba kata kunci pencarian lain atau pilih kategori "Semua" untuk melihat seluruh artikel edukasi.
          </p>
          <button
            onClick={() => { setSelectedCategory('Semua'); setSearchQuery(''); }}
            className="text-xs font-bold text-pink-600 hover:underline pt-2 inline-block cursor-pointer"
          >
            Reset Filter Pencarian
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          
          {/* Main Grid of Articles */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((art) => (
              <article
                key={art.id}
                onClick={() => navigate(`/edukasi/${art.id}`)}
                className="group bg-white rounded-3xl border border-pink-100/90 overflow-hidden shadow-xs hover:shadow-xl hover:border-pink-300 transition-all duration-300 flex flex-col justify-between cursor-pointer"
              >
                <div>
                  {/* Thumbnail Image */}
                  <div className="relative h-48 overflow-hidden bg-slate-100">
                    <img
                      src={resolveImageUrl(art.imageUrl)}
                      alt={art.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="bg-white/95 backdrop-blur-xs text-pink-700 font-extrabold text-[10px] px-2.5 py-1 rounded-lg shadow-sm border border-pink-100">
                        {art.category}
                      </span>
                    </div>
                  </div>

                  {/* Article Info */}
                  <div className="p-5 space-y-2.5">
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 font-medium">
                      <span className="flex items-center gap-1 text-slate-500 font-semibold">
                        <Clock className="w-3.5 h-3.5 text-pink-500" /> {art.readTime}
                      </span>
                      <span>•</span>
                      <span>{art.author}</span>
                    </div>

                    <h3 className="text-base font-extrabold text-slate-800 group-hover:text-pink-600 transition-colors leading-snug">
                      {art.title}
                    </h3>

                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                      {art.summary}
                    </p>
                  </div>
                </div>

                {/* Footer with Tags & Read Link */}
                <div className="px-5 pb-5 pt-2 border-t border-slate-50 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {art.tags.slice(0, 2).map((t, tidx) => (
                      <span key={tidx} className="text-[10px] font-medium bg-slate-50 text-slate-500 px-2 py-0.5 rounded-md border border-slate-100">
                        #{t}
                      </span>
                    ))}
                  </div>
                  <span className="text-xs font-bold text-pink-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Baca <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </article>
            ))}
          </div>

        </div>
      )}

      {/* Bottom Invitation Banner for Residents */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 text-pink-400 text-xs font-bold uppercase tracking-wider">
            <PiggyBank className="w-4 h-4 text-pink-400" /> Siap Menabung Sampah?
          </div>
          <h3 className="text-xl sm:text-2xl font-black tracking-tight">
            Mulai Pilah Sampah Rumah Tangga Hari Ini!
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
            Kunjungi Posko Utama Balai Desa Rowotamtu untuk mendaftar akun nasabah, menimbang sampah terpilah, dan melihat saldo kas digital Anda bertambah.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
          <button
            onClick={() => navigate('/katalog')}
            className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-white text-slate-900 hover:bg-pink-50 font-extrabold text-xs transition-colors cursor-pointer text-center shadow-md"
          >
            Lihat Daftar Harga Sampah →
          </button>
        </div>
      </div>

    </div>
  );
};

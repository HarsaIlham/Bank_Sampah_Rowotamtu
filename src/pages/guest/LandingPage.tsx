import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useReports, useWasteTypes } from '../../hooks/useAppQueries';
import { supabaseService } from '../../services/supabaseService';
import type { EducationalArticle } from '../../types';
import { formatRupiah, formatWeight } from '../../lib/utils';
import { StatCard } from '../../components/ui/StatCard';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { 
  Recycle, 
  Users, 
  Coins, 
  Scale, 
  Calculator,  
  Clock, 
  ChevronRight,
  HeartHandshake,
  LogIn,
  ArrowRight
} from 'lucide-react';

interface LandingPageProps {
  onOpenCalculator: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenCalculator }) => {
  const navigate = useNavigate();
  const { data: reports = null } = useReports();
  const { data: allWasteTypes = [] } = useWasteTypes();
  const wasteTypes = allWasteTypes.slice(0, 4);
  const articles: EducationalArticle[] = supabaseService.getArticles().slice(0, 2);

  return (
    <div className="space-y-12">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-pink-500 via-pink-600 to-rose-700 text-white p-6 md:p-12 shadow-xl shadow-pink-200">
        
        {/* Background Overlay Art */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 rounded-full bg-amber-300/20 blur-2xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-6">
            <Badge variant="rose" size="md" className="bg-rose-900/40 text-pink-100 border-rose-400/30">
              PROGRAM KERJA KKN-K DESA ROWOTAMTU
            </Badge>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
              Ubah Sampah Jadi <span className="text-amber-300 underline decoration-pink-300 decoration-wavy">Tabungan Berkah</span> Desa Rowotamtu
            </h1>

            <p className="text-sm md:text-base text-pink-100 leading-relaxed font-normal max-w-xl">
              Sistem pencatatan digital tabungan sampah warga. Transparan, aman berdasarkan NIK KTP, dan dapat ditarik tunai fisik di Posko Bank Sampah.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button
                variant="secondary"
                size="lg"
                onClick={onOpenCalculator}
                icon={<Calculator className="w-5 h-5 text-pink-700" />}
                className="bg-white text-pink-700 hover:bg-pink-50 shadow-lg border-0 font-extrabold cursor-pointer"
              >
                Kalkulator Tabungan Sampah
              </Button>

              <Link to="/katalog">
                <Button
                  variant="outline"
                  size="lg"
                  icon={<Recycle className="w-5 h-5" />}
                  className="bg-pink-700/40 border-white/40 text-white hover:bg-pink-700/60 font-bold cursor-pointer"
                >
                  Lihat Katalog Harga Beli
                </Button>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 flex justify-center">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 sm:p-7 rounded-3xl space-y-4 w-full max-w-sm text-center shadow-2xl hover:border-white/40 transition-all duration-300 group">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl flex items-center justify-center mx-auto text-white shadow-lg group-hover:scale-110 transition-transform">
                <LogIn className="w-7 h-7" />
              </div>
              <div className="space-y-1.5">
                <Badge variant="pink" size="sm" className="bg-white/20 text-white border-white/30">
                  PORTAL AKUN NASABAH
                </Badge>
                <h3 className="font-extrabold text-lg text-white tracking-tight">
                  Sudah Terdaftar Sebagai Nasabah?
                </h3>
                <p className="text-xs text-pink-100/90 leading-relaxed">
                  Masuk dengan NIK KTP Anda untuk memantau saldo tabungan, riwayat penimbangan sampah, dan catatan pencairan tunai secara real-time.
                </p>
              </div>
              <div className="space-y-2 pt-1">
                <Link to="/login" className="block">
                  <Button 
                    variant="secondary" 
                    size="md" 
                    className="w-full font-extrabold shadow-lg bg-white text-pink-700 hover:bg-pink-50 hover:shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>Masuk ke Akun Saya</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <p className="text-[11px] text-pink-200">
                  Belum punya akun? Hubungi petugas di posko Bank Sampah.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Stats Grid */}
      <section className="space-y-4">
        <div className="text-center space-y-1">
          <Badge variant="pink" size="sm">STATISTIK POSKO UTAMA</Badge>
          <h2 className="text-xl md:text-2xl font-extrabold text-slate-800">Dampak Gerakan Bank Sampah</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Nasabah Terdaftar"
            value={reports ? `${reports.totalNasabahCount} Warga` : '...'}
            subtitle="Memiliki nomor simpanan"
            icon={<Users className="w-6 h-6 text-pink-600" />}
            colorBg="bg-pink-100 text-pink-700"
          />

          <StatCard
            title="Total Nilai Tabungan"
            value={reports ? formatRupiah(reports.totalNasabahShareRp) : '...'}
            subtitle="Akumulasi tabungan nasabah"
            icon={<Coins className="w-6 h-6 text-emerald-600" />}
            colorBg="bg-emerald-100 text-emerald-800"
          />

          <StatCard
            title="Total Sampah Terkumpul"
            value={reports ? formatWeight(reports.totalWasteKgCollected) : '...'}
            subtitle="Tercegah dari lingkungan"
            icon={<Scale className="w-6 h-6 text-blue-600" />}
            colorBg="bg-blue-100 text-blue-800"
          />

          <StatCard
            title="Total Penarikan Tunai"
            value={reports ? formatRupiah(reports.totalWithdrawalRp) : '...'}
            subtitle="Diserahkan tunai di posko"
            icon={<HeartHandshake className="w-6 h-6 text-amber-600" />}
            colorBg="bg-amber-100 text-amber-800"
          />
        </div>
      </section>

      {/* Featured Waste Categories */}
      <section className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <Badge variant="pink" size="sm">STANDAR HARGA POSKO</Badge>
            <h2 className="text-xl md:text-2xl font-extrabold text-slate-800 tracking-tight mt-1">
              Jenis Sampah Bernilai Tinggi
            </h2>
          </div>
          <Link to="/katalog" className="text-xs font-bold text-pink-600 hover:underline flex items-center gap-1">
            Lihat Semua Katalog Sampah <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {wasteTypes.map(wt => (
            <Card key={wt.id} hoverable className="p-4 space-y-3 border-pink-100 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant="pink">
                    {(wt.category?.name || 'SAMPAH').toUpperCase()}
                  </Badge>
                  <span className="text-xs font-mono font-bold text-pink-600">/{wt.unit}</span>
                </div>
                <h3 className="font-bold text-slate-800 text-sm">{wt.name}</h3>
                <p className="text-xs text-slate-500 line-clamp-2">{wt.category?.description || 'Sampah terpilah bersih'}</p>
              </div>

              <div className="pt-2 border-t border-pink-100 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">Harga beli:</span>
                <span className="text-base font-extrabold text-pink-600">{formatRupiah(wt.price_per_kg)}</span>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* How it Works / Workflow */}
      <section className="bg-white p-6 md:p-8 rounded-3xl border border-pink-100 space-y-6 shadow-xs">
        <div className="text-center space-y-1 max-w-lg mx-auto">
          <Badge variant="pink" size="sm">ALUR PELAYANAN</Badge>
          <h2 className="text-xl md:text-2xl font-extrabold text-slate-800">
            Cara Menabung Sampah di Posko Desa Rowotamtu
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl bg-pink-50/50 border border-pink-100 space-y-3 text-center">
            <div className="w-10 h-10 rounded-full bg-[#EC4899] text-white font-extrabold flex items-center justify-center mx-auto text-sm">
              1
            </div>
            <h3 className="font-bold text-slate-800 text-sm">Pilah Sampah Dapur</h3>
            <p className="text-xs text-slate-500">
              Bersihkan botol plastik, kumpulkan kardus atau kaleng bekas di rumah.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-pink-50/50 border border-pink-100 space-y-3 text-center">
            <div className="w-10 h-10 rounded-full bg-[#EC4899] text-white font-extrabold flex items-center justify-center mx-auto text-sm">
              2
            </div>
            <h3 className="font-bold text-slate-800 text-sm">Timbang di Posko</h3>
            <p className="text-xs text-slate-500">
              Bawa sampah ke Balai Desa, sebutkan NIK KTP Anda kepada pengurus.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-pink-50/50 border border-pink-100 space-y-3 text-center">
            <div className="w-10 h-10 rounded-full bg-[#EC4899] text-white font-extrabold flex items-center justify-center mx-auto text-sm">
              3
            </div>
            <h3 className="font-bold text-slate-800 text-sm">Saldo Bertambah</h3>
            <p className="text-xs text-slate-500">
              Pengurus menginput hasil timbangan dan saldo tabungan Anda langsung bertambah.
            </p>
          </div>
        </div>
      </section>

      {/* Latest Articles */}
      <section className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <Badge variant="pink" size="sm">JURNAL KKN-K</Badge>
            <h2 className="text-xl md:text-2xl font-extrabold text-slate-800 tracking-tight mt-1">
              Artikel & Edukasi Lingkungan
            </h2>
          </div>
          <Link to="/edukasi" className="text-xs font-bold text-pink-600 hover:underline flex items-center gap-1">
            Lihat Semua Artikel <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {articles.map(art => (
            <Card
              key={art.id}
              hoverable
              onClick={() => navigate(`/edukasi/${art.id}`)}
              className="p-4 flex flex-col sm:flex-row gap-4 border-pink-100 cursor-pointer"
            >
              <img
                src={art.imageUrl}
                alt={art.title}
                className="w-full sm:w-36 h-32 object-cover rounded-xl shrink-0"
              />
              <div className="space-y-2 flex-1 flex flex-col justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="pink" size="sm">{art.category}</Badge>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-pink-500" /> {art.readTime}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-800 text-sm line-clamp-2">{art.title}</h3>
                </div>
                <p className="text-xs text-slate-500 line-clamp-2">{art.summary}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

    </div>
  );
};

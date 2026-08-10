import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNasabahSummary, useDeposits, useWithdrawals } from '../../hooks/useAppQueries';
import { formatRupiah, formatWeight, formatDateTime } from '../../lib/utils';
import { StatCard } from '../../components/ui/StatCard';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { 
  Coins, 
  Scale, 
  ArrowDownCircle, 
  ArrowUpCircle, 
  History,
  ShieldCheck,
  User,
  Tag,
  BookOpen,
  Loader2
} from 'lucide-react';

export const NasabahDashboardPage: React.FC = () => {
  const { profile, nasabah } = useAuth();

  const { data: summary = null, isLoading: loadingSummary } = useNasabahSummary(nasabah?.id);
  const { data: deposits = [], isLoading: loadingDeposits } = useDeposits(nasabah?.id);
  const { data: withdrawals = [], isLoading: loadingWithdrawals } = useWithdrawals(nasabah?.id);

  const loading = loadingSummary || loadingDeposits || loadingWithdrawals;

  if (!profile) return null;

  const currentNasabah = nasabah || {
    id: profile.id,
    profile_id: profile.id,
    member_number: 'BS-BARU',
    nik: 'Nasabah',
    address: 'Desa Rowotamtu',
    rt_rw: '01/01',
    dusun: 'Rowotamtu',
    join_date: new Date().toISOString().split('T')[0],
    status: 'active' as const,
    created_at: new Date().toISOString()
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] gap-3 text-pink-600">
        <Loader2 className="w-8 h-8 animate-spin" />
        <p className="text-xs font-semibold text-slate-600">Memuat data tabungan...</p>
      </div>
    );
  }

  const balance = summary?.balance || 0;
  const totalDepositAmount = summary?.total_deposit_amount || 0;
  const totalNasabahAmount = summary?.total_nasabah_amount || 0;
  const totalWithdrawalAmount = summary?.total_withdrawal_amount || 0;
  const totalKg = summary?.total_kg || 0;

  return (
    <div className="space-y-8">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-pink-500 via-pink-600 to-rose-700 text-white p-6 md:p-8 rounded-3xl shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" size="sm" className="bg-white/20 text-white border-white/30">
                TRANSPARANSI TABUNGAN NASABAH
              </Badge>
              <span className="text-xs font-mono font-bold text-amber-300">NIK: {currentNasabah.nik}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Selamat Datang, {profile.full_name}!
            </h1>
            <p className="text-xs md:text-sm text-pink-100">
              {currentNasabah.dusun || 'Desa Rowotamtu'} • RT/RW {currentNasabah.rt_rw || '01/01'}
            </p>
          </div>
        </div>
      </div>

      {/* Primary Financial Transparency Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Saldo Tabungan Saat Ini"
          value={formatRupiah(balance)}
          subtitle="Dapat ditarik tunai di posko"
          icon={<Coins className="w-6 h-6 text-pink-600" />}
          colorBg="bg-pink-100 text-pink-700"
        />
        <StatCard
          title="Total Nilai Setor Sampah"
          value={formatRupiah(totalNasabahAmount)}
          subtitle={totalDepositAmount !== totalNasabahAmount ? `Dari bruto ${formatRupiah(totalDepositAmount)}` : 'Akumulasi hasil penimbangan'}
          icon={<ArrowDownCircle className="w-6 h-6 text-emerald-600" />}
          colorBg="bg-emerald-100 text-emerald-800"
        />
        <StatCard
          title="Total Penarikan Tunai"
          value={formatRupiah(totalWithdrawalAmount)}
          subtitle="Total tunai yang sudah diambil"
          icon={<ArrowUpCircle className="w-6 h-6 text-amber-600" />}
          colorBg="bg-amber-100 text-amber-800"
        />
        <StatCard
          title="Total Berat Sampah"
          value={formatWeight(totalKg)}
          subtitle="Tercegah dari lingkungan"
          icon={<Scale className="w-6 h-6 text-blue-600" />}
          colorBg="bg-blue-100 text-blue-800"
        />
      </div>

      {/* Quick Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-pink-100">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-pink-600" />
          <span className="text-xs font-bold text-slate-800">Catatan Saldo Terbaca Otomatis dari Database Posko</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link to="/katalog">
            <Button variant="outline" size="sm" icon={<Tag className="w-4 h-4 text-pink-600" />}>
              Katalog Harga Sampah
            </Button>
          </Link>
          <Link to="/edukasi">
            <Button variant="outline" size="sm" icon={<BookOpen className="w-4 h-4 text-pink-600 text-[#EC4899]" />}>
              Panduan Edukasi
            </Button>
          </Link>
          <Link to="/nasabah/transaksi">
            <Button variant="outline" size="sm" icon={<History className="w-4 h-4" />}>
              Riwayat Transaksi
            </Button>
          </Link>
          <Link to="/nasabah/profil">
            <Button variant="soft" size="sm" icon={<User className="w-4 h-4" />}>
              Profil
            </Button>
          </Link>
        </div>
      </div>

      {/* Recent Deposits & Withdrawals Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Recent Deposits */}
        <section className="bg-white p-5 rounded-2xl border border-pink-100 space-y-3">
          <div className="flex items-center justify-between border-b border-pink-100 pb-2">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
              <ArrowDownCircle className="w-4 h-4 text-pink-600" /> Setoran Sampah Terakhir
            </h3>
            <span className="text-[11px] font-bold text-pink-600">{deposits.length} Kali Setor</span>
          </div>

          {deposits.length > 0 ? (
            <div className="space-y-2">
              {deposits.slice(0, 4).map(dep => (
                <div key={dep.id} className="p-3 rounded-xl bg-pink-50/40 border border-pink-100 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-slate-800">
                      {dep.items.map(i => i.waste_type_name || 'Sampah').join(', ')}
                    </p>
                    <p className="text-[10px] text-slate-400">{formatDateTime(dep.created_at)} • {formatWeight(dep.total_kg)}</p>
                  </div>
                  <span className="font-extrabold text-pink-600">+{formatRupiah(dep.total_amount)}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-slate-400 text-xs">Belum ada riwayat setoran.</div>
          )}
        </section>

        {/* Recent Withdrawals */}
        <section className="bg-white p-5 rounded-2xl border border-pink-100 space-y-3">
          <div className="flex items-center justify-between border-b border-pink-100 pb-2">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
              <ArrowUpCircle className="w-4 h-4 text-amber-600" /> Penarikan Tunai Terakhir
            </h3>
            <span className="text-[11px] font-bold text-amber-700">{withdrawals.length} Kali Tarik</span>
          </div>

          {withdrawals.length > 0 ? (
            <div className="space-y-2">
              {withdrawals.slice(0, 4).map(wth => (
                <div key={wth.id} className="p-3 rounded-xl bg-amber-50/40 border border-amber-100 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-slate-800">Penarikan Tunai Fisik Posko</p>
                    <p className="text-[10px] text-slate-400">{formatDateTime(wth.created_at)}</p>
                  </div>
                  <span className="font-extrabold text-amber-800">-{formatRupiah(wth.amount)}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-slate-400 text-xs">Belum ada riwayat penarikan tunai.</div>
          )}
        </section>

      </div>

    </div>
  );
};

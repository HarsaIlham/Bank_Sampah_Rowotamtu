import React from 'react';
import { Link } from 'react-router-dom';
import { useReports, useDeposits, useWithdrawals } from '../../hooks/useAppQueries';
import { formatRupiah, formatWeight, formatDateTime } from '../../lib/utils';
import { StatCard } from '../../components/ui/StatCard';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { 
  Users, 
  Coins, 
  PlusCircle, 
  Tag, 
  HandCoins,
  FileText,
  TrendingUp,
  ArrowDownCircle,
  ArrowUpCircle,
  Loader2,
  PieChart,
  Landmark,
  Settings
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const { data: reports = null, isLoading: loadingReports } = useReports();
  const { data: deposits = [], isLoading: loadingDeposits } = useDeposits();
  const { data: withdrawals = [], isLoading: loadingWithdrawals } = useWithdrawals();

  const loading = loadingReports || loadingDeposits || loadingWithdrawals;

  if (loading || !reports) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3 text-pink-600">
        <Loader2 className="w-8 h-8 animate-spin" />
        <p className="text-xs font-semibold text-slate-600">Memuat statistik posko...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-pink-950 to-slate-900 text-white p-6 md:p-8 rounded-3xl shadow-lg border border-pink-900/40">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <Badge variant="rose" size="sm" className="bg-rose-900/60 text-pink-200 border-rose-700">
              PANEL DOKUMEN PENGURUS BANK SAMPAH
            </Badge>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-1">
              Pengelolaan Bank Sampah Desa Rowotamtu
            </h1>
            <p className="text-xs md:text-sm text-slate-300 mt-1">
              Program KKN-K ROWOTAMTU • Pencatatan Digital Buku Kas & Penimbangan Posko
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link to="/admin/setor">
              <Button
                variant="primary"
                size="md"
                icon={<PlusCircle className="w-5 h-5" />}
                className="shadow-lg font-bold cursor-pointer"
              >
                + Setor Sampah
              </Button>
            </Link>

            <Link to="/admin/penarikan">
              <Button
                variant="secondary"
                size="md"
                icon={<HandCoins className="w-5 h-5 text-amber-900" />}
                className="shadow-lg font-bold bg-amber-100 text-amber-900 hover:bg-amber-200 cursor-pointer"
              >
                + Penarikan Tunai
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Primary Financial Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          title="Total Nasabah Terdaftar"
          value={`${reports.totalNasabahCount} Warga`}
          subtitle="Pemilik akun tabungan"
          icon={<Users className="w-6 h-6" />}
        />
        <StatCard
          title="Total Bruto Sampah (Setor)"
          value={formatRupiah(reports.totalDepositRp)}
          subtitle="Akumulasi hasil timbangan"
          icon={<Coins className="w-6 h-6 text-pink-600" />}
          colorBg="bg-pink-100 text-pink-700"
        />
        <StatCard
          title="Saldo Simpanan Beredar"
          value={formatRupiah(reports.currentBalanceDisbursedRp)}
          subtitle="Kewajiban kas nasabah"
          icon={<TrendingUp className="w-6 h-6 text-emerald-600" />}
          colorBg="bg-emerald-100 text-emerald-800"
        />
      </div>

      {/* Revenue Sharing Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Bagian Nasabah"
          value={formatRupiah(reports.totalNasabahShareRp)}
          subtitle="Total masuk tabungan nasabah"
          icon={<Coins className="w-6 h-6 text-pink-600" />}
          colorBg="bg-pink-50 text-pink-700"
        />
        <StatCard
          title="Komisi Pengurus"
          value={formatRupiah(reports.totalPengurusShareRp)}
          subtitle="Total komisi operasional"
          icon={<PieChart className="w-6 h-6 text-violet-600" />}
          colorBg="bg-violet-100 text-violet-800"
        />
        <StatCard
          title="Kas Operasional"
          value={formatRupiah(reports.totalKasShareRp)}
          subtitle="Dana operasional bank sampah"
          icon={<Landmark className="w-6 h-6 text-sky-600" />}
          colorBg="bg-sky-100 text-sky-800"
        />
      </div>

      {/* Action Shortcuts Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
        <Link to="/admin/setor">
          <Button variant="outline" className="w-full justify-start text-xs font-bold py-3 bg-white cursor-pointer" icon={<PlusCircle className="w-4 h-4 text-pink-600" />}>
            Setor Sampah
          </Button>
        </Link>
        <Link to="/admin/penarikan">
          <Button variant="outline" className="w-full justify-start text-xs font-bold py-3 bg-white cursor-pointer" icon={<HandCoins className="w-4 h-4 text-amber-600" />}>
            Penarikan Tunai
          </Button>
        </Link>
        <Link to="/admin/nasabah">
          <Button variant="outline" className="w-full justify-start text-xs font-bold py-3 bg-white cursor-pointer" icon={<Users className="w-4 h-4 text-blue-600" />}>
            Data Nasabah
          </Button>
        </Link>
        <Link to="/admin/harga">
          <Button variant="outline" className="w-full justify-start text-xs font-bold py-3 bg-white cursor-pointer" icon={<Tag className="w-4 h-4 text-purple-600" />}>
            Jenis Sampah
          </Button>
        </Link>
        <Link to="/admin/laporan">
          <Button variant="outline" className="w-full justify-start text-xs font-bold py-3 bg-white cursor-pointer" icon={<FileText className="w-4 h-4 text-emerald-600" />}>
            Laporan Kas
          </Button>
        </Link>
        <Link to="/admin/pengaturan">
          <Button variant="outline" className="w-full justify-start text-xs font-bold py-3 bg-white cursor-pointer" icon={<Settings className="w-4 h-4 text-slate-600" />}>
            Pengaturan
          </Button>
        </Link>
      </div>

      {/* Recent Activity Ledger Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Recent Deposits */}
        <section className="bg-white p-6 rounded-2xl border border-pink-100 space-y-4">
          <div className="flex items-center justify-between border-b border-pink-100 pb-3">
            <div className="flex items-center gap-2">
              <ArrowDownCircle className="w-5 h-5 text-pink-600" />
              <h3 className="text-lg font-bold text-slate-800">Setoran Sampah Terakhir</h3>
            </div>
            <Link to="/admin/laporan" className="text-xs font-bold text-pink-600 hover:underline">
              Lihat Laporan →
            </Link>
          </div>

          <div className="space-y-3">
            {deposits.slice(0, 4).map(dep => (
              <div key={dep.id} className="p-3.5 rounded-xl bg-pink-50/40 border border-pink-100 flex items-center justify-between text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800">{dep.customer_name}</span>
                    <span className="text-[10px] text-pink-600 font-mono font-bold bg-pink-100 px-1.5 py-0.5 rounded">{dep.customer_nik}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {formatDateTime(dep.created_at)} • {formatWeight(dep.total_kg)}
                  </p>
                </div>
                <span className="font-extrabold text-pink-600 text-sm">+{formatRupiah(dep.total_amount)}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Recent Withdrawals */}
        <section className="bg-white p-6 rounded-2xl border border-pink-100 space-y-4">
          <div className="flex items-center justify-between border-b border-pink-100 pb-3">
            <div className="flex items-center gap-2">
              <ArrowUpCircle className="w-5 h-5 text-amber-600" />
              <h3 className="text-lg font-bold text-slate-800">Penarikan Tunai Terakhir</h3>
            </div>
            <Link to="/admin/laporan" className="text-xs font-bold text-amber-700 hover:underline">
              Lihat Laporan →
            </Link>
          </div>

          <div className="space-y-3">
            {withdrawals.slice(0, 4).map(wth => (
              <div key={wth.id} className="p-3.5 rounded-xl bg-amber-50/40 border border-amber-100 flex items-center justify-between text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800">{wth.customer_name}</span>
                    <span className="text-[10px] text-amber-800 font-mono font-bold bg-amber-100 px-1.5 py-0.5 rounded">{wth.customer_nik}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {formatDateTime(wth.created_at)} • {wth.notes || 'Penarikan Fisik'}
                  </p>
                </div>
                <span className="font-extrabold text-amber-800 text-sm">-{formatRupiah(wth.amount)}</span>
              </div>
            ))}
          </div>
        </section>

      </div>

    </div>
  );
};

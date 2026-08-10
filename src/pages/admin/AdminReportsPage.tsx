import React from 'react';
import { useReports, useDeposits } from '../../hooks/useAppQueries';
import { formatRupiah, formatWeight, formatDateTime } from '../../lib/utils';
import { StatCard } from '../../components/ui/StatCard';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { FileText, Printer, Scale, Coins, Layers, TrendingUp, Loader2, PieChart } from 'lucide-react';

export const AdminReportsPage: React.FC = () => {
  const { data: reports = null, isLoading: loadingReports } = useReports();
  const { data: deposits = [], isLoading: loadingDeposits } = useDeposits();

  const loading = loadingReports || loadingDeposits;

  const handlePrint = () => {
    window.print();
  };

  if (loading || !reports) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[350px] gap-3 text-pink-600">
        <Loader2 className="w-8 h-8 animate-spin" />
        <p className="text-xs font-semibold text-slate-600">Memuat laporan kas bank sampah...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-pink-100 shadow-xs">
        <div>
          <Badge variant="pink" size="md">LAPORAN REKAPITULASI BUKU KAS</Badge>
          <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight mt-1">
            Laporan Operasional Bank Sampah Desa Rowotamtu
          </h1>
          <p className="text-xs text-slate-500">
            Dokumen resmi rekapitulasi penimbangan sampah, total tabungan, dan penarikan tunai warga.
          </p>
        </div>

        <Button
          variant="outline"
          size="md"
          icon={<Printer className="w-4 h-4" />}
          onClick={handlePrint}
          className="bg-white cursor-pointer"
        >
          Cetak Laporan / Export PDF
        </Button>
      </div>

      {/* Main Financial Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Bruto Penyetoran"
          value={formatRupiah(reports.totalDepositRp)}
          subtitle="Akumulasi nilai sampah ditimbang"
          icon={<Coins className="w-6 h-6 text-pink-600" />}
          colorBg="bg-pink-100 text-pink-700"
        />
        <StatCard
          title="Total Penarikan (Tarik)"
          value={formatRupiah(reports.totalWithdrawalRp)}
          subtitle="Uang tunai diserahkan ke nasabah"
          icon={<Coins className="w-6 h-6 text-amber-600" />}
          colorBg="bg-amber-100 text-amber-800"
        />
        <StatCard
          title="Saldo Tabungan Beredar"
          value={formatRupiah(reports.currentBalanceDisbursedRp)}
          subtitle="Kewajiban kas simpanan nasabah"
          icon={<TrendingUp className="w-6 h-6 text-emerald-600" />}
          colorBg="bg-emerald-100 text-emerald-800"
        />
        <StatCard
          title="Total Sampah Terkumpul"
          value={formatWeight(reports.totalWasteKgCollected)}
          subtitle="Tercegah pencemaran lingkungan"
          icon={<Scale className="w-6 h-6 text-blue-600" />}
          colorBg="bg-blue-100 text-blue-800"
        />
      </div>

      {/* Revenue Sharing Breakdown */}
      <section className="bg-white p-6 rounded-2xl border border-pink-100 space-y-4">
        <div className="flex items-center gap-2 border-b border-pink-100 pb-3">
          <PieChart className="w-5 h-5 text-pink-600" />
          <h3 className="text-lg font-bold text-slate-800">Rekapitulasi Bagi Hasil</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-pink-50/60 border border-pink-100 space-y-1">
            <span className="text-[10px] font-bold uppercase text-pink-600 tracking-wider">Bagian Nasabah</span>
            <p className="text-xl font-extrabold text-slate-800">{formatRupiah(reports.totalNasabahShareRp)}</p>
            <p className="text-[11px] text-slate-500">Total yang masuk tabungan nasabah</p>
          </div>
          <div className="p-4 rounded-xl bg-violet-50/60 border border-violet-100 space-y-1">
            <span className="text-[10px] font-bold uppercase text-violet-600 tracking-wider">Komisi Pengurus</span>
            <p className="text-xl font-extrabold text-slate-800">{formatRupiah(reports.totalPengurusShareRp)}</p>
            <p className="text-[11px] text-slate-500">Total komisi pengurus bank sampah</p>
          </div>
          <div className="p-4 rounded-xl bg-sky-50/60 border border-sky-100 space-y-1">
            <span className="text-[10px] font-bold uppercase text-sky-600 tracking-wider">Kas Operasional</span>
            <p className="text-xl font-extrabold text-slate-800">{formatRupiah(reports.totalKasShareRp)}</p>
            <p className="text-[11px] text-slate-500">Dana operasional bank sampah</p>
          </div>
        </div>
      </section>

      {/* Breakdown per Waste Category */}
      <section className="bg-white p-6 rounded-2xl border border-pink-100 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-pink-100 pb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-pink-600" />
            <div>
              <h3 className="text-lg font-bold text-slate-800">Rekapitulasi Berat & Nilai per Kategori Sampah</h3>
              <p className="text-xs text-slate-500">Akumulasi riil seluruh transaksi penimbangan sampah yang tercatat di database</p>
            </div>
          </div>
          <Badge variant="pink" size="sm">
            {reports.wasteByCategory.length} Kategori Terdaftar
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {reports.wasteByCategory.map(cat => {
            const pct = reports.totalWasteKgCollected > 0 
              ? Math.round((cat.totalKg / reports.totalWasteKgCollected) * 100) 
              : 0;

            return (
              <div 
                key={cat.category_id} 
                className={`p-4 rounded-2xl border transition-all ${
                  cat.totalKg > 0 
                    ? 'bg-gradient-to-br from-pink-50/60 to-rose-50/20 border-pink-200 shadow-xs' 
                    : 'bg-slate-50/60 border-slate-200 opacity-75'
                } space-y-2.5`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-extrabold uppercase tracking-wide text-pink-800">
                    {cat.category_name}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    cat.totalKg > 0 
                      ? 'bg-white border-pink-200 text-pink-700 font-mono' 
                      : 'bg-white border-slate-200 text-slate-400 font-mono'
                  }`}>
                    {formatWeight(cat.totalKg)}
                  </span>
                </div>

                <div className="flex items-baseline justify-between gap-2">
                  <p className="text-lg font-black text-slate-800 tracking-tight">
                    {formatRupiah(cat.totalRp)}
                  </p>
                  {cat.totalKg > 0 ? (
                    <span className="text-[10px] font-semibold text-pink-600 bg-pink-100/70 px-1.5 py-0.5 rounded">
                      {pct}% dari total
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-400 font-medium">
                      Belum ada setor
                    </span>
                  )}
                </div>

                {/* Progress bar per category */}
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-pink-500 to-rose-500 h-1.5 rounded-full transition-all duration-500" 
                    style={{ width: `${Math.min(pct, 100)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Recent Ledger History Table */}
      <section className="bg-white p-6 rounded-2xl border border-pink-100 space-y-4">
        <div className="flex items-center justify-between border-b border-pink-100 pb-3">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-pink-600" />
            <h3 className="text-lg font-bold text-slate-800">Catatan Transaksi Setor Terakhir</h3>
          </div>
          <span className="text-xs text-slate-400 font-semibold">{deposits.length} Transaksi Setor</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 border-collapse">
            <thead>
              <tr className="border-b border-pink-100 bg-pink-50/50 text-slate-500 font-bold uppercase text-[10px]">
                <th className="py-2.5 px-3">ID / Tanggal</th>
                <th className="py-2.5 px-3">Nasabah</th>
                <th className="py-2.5 px-3">Rincian Sampah</th>
                <th className="py-2.5 px-3 text-right">Berat</th>
                <th className="py-2.5 px-3 text-right">Nilai Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-pink-100">
              {deposits.map(dep => (
                <tr key={dep.id} className="hover:bg-pink-50/30">
                  <td className="py-3 px-3">
                    <p className="font-mono font-bold text-pink-600">{dep.id.substring(0, 8)}...</p>
                    <p className="text-[10px] text-slate-400">{formatDateTime(dep.created_at)}</p>
                  </td>
                  <td className="py-3 px-3 font-semibold text-slate-800">
                    {dep.customer_name}
                    <p className="text-[10px] font-mono text-slate-400">NIK: {dep.customer_nik}</p>
                  </td>
                  <td className="py-3 px-3">
                    {dep.items.map(i => `${i.waste_type_name || 'Sampah'} (${i.weight}kg)`).join(', ')}
                  </td>
                  <td className="py-3 px-3 text-right font-bold">{formatWeight(dep.total_kg)}</td>
                  <td className="py-3 px-3 text-right font-extrabold text-pink-600">{formatRupiah(dep.total_amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

    </div>
  );
};

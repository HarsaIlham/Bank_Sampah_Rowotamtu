import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabaseService } from '../../services/supabaseService';
import { formatRupiah, formatWeight, formatDateTime } from '../../lib/utils';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import type { DepositWithItems, WithdrawalWithDetails } from '../../types';
import { Search, Loader2 } from 'lucide-react';

type CombinedTransaction = 
  | (DepositWithItems & { type: 'setor'; amountValue: number })
  | (WithdrawalWithDetails & { type: 'tarik'; amountValue: number });

export const NasabahTransactionsPage: React.FC = () => {
  const { profile, nasabah } = useAuth();
  const [filterType, setFilterType] = useState<string>('semua');
  const [search, setSearch] = useState<string>('');
  const [selectedTrx, setSelectedTrx] = useState<CombinedTransaction | null>(null);

  const [deposits, setDeposits] = useState<DepositWithItems[]>([]);
  const [withdrawals, setWithdrawals] = useState<WithdrawalWithDetails[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    if (!nasabah?.id) return;

    const fetchTrx = async () => {
      try {
        setLoading(true);
        const [depRes, wthRes] = await Promise.all([
          supabaseService.getDeposits(nasabah.id),
          supabaseService.getWithdrawals(nasabah.id)
        ]);

        if (isMounted) {
          setDeposits(depRes);
          setWithdrawals(wthRes);
        }
      } catch (err) {
        console.error('Error fetching transactions:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchTrx();

    return () => {
      isMounted = false;
    };
  }, [nasabah?.id]);

  if (!profile || !nasabah) return null;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] gap-3 text-pink-600">
        <Loader2 className="w-8 h-8 animate-spin" />
        <p className="text-xs font-semibold text-slate-600">Memuat riwayat transaksi...</p>
      </div>
    );
  }

  const combined: CombinedTransaction[] = [
    ...deposits.map(d => ({ ...d, type: 'setor' as const, amountValue: d.total_nasabah_amount })),
    ...withdrawals.map(w => ({ ...w, type: 'tarik' as const, amountValue: w.amount }))
  ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const filtered = combined.filter(trx => {
    const matchesType = filterType === 'semua' || trx.type === filterType;
    const matchesSearch = (trx.notes || '').toLowerCase().includes(search.toLowerCase()) ||
                          trx.id.toLowerCase().includes(search.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-pink-100 shadow-xs space-y-2">
        <Badge variant="pink" size="md">REKAPITULASI DOKUMEN</Badge>
        <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">
          Riwayat Transaksi Tabungan Sampah
        </h1>
        <p className="text-xs text-slate-500">
          Catatan lengkap seluruh transaksi setor sampah dan penarikan saldo Anda.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="w-full sm:w-72">
          <Input
            placeholder="Cari transaksi..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            icon={<Search className="w-4 h-4 text-slate-400" />}
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {['semua', 'setor', 'tarik'].map(t => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold capitalize transition-colors cursor-pointer ${
                filterType === t
                  ? 'bg-[#EC4899] text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-pink-100 hover:bg-pink-50'
              }`}
            >
              {t === 'semua' ? 'Semua' : t === 'setor' ? '➕ Setor Sampah' : '💸 Penarikan'}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions List */}
      <div className="space-y-3">
        {filtered.map(trx => (
          <Card
            key={trx.id}
            hoverable
            onClick={() => setSelectedTrx(trx)}
            className="p-4 flex flex-wrap items-center justify-between gap-4 border-pink-100 cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shrink-0 ${
                trx.type === 'setor' ? 'bg-[#EC4899]' : 'bg-slate-800'
              }`}>
                {trx.type === 'setor' ? '+' : '-'}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-slate-800 text-sm">
                    {trx.type === 'setor' ? 'Setor Sampah Posko' : 'Penarikan Saldo Tunai'}
                  </h4>
                  <Badge variant="emerald" size="sm">Selesai</Badge>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {formatDateTime(trx.created_at)} • <span className="font-mono text-slate-400">{trx.id.substring(0, 8)}...</span>
                </p>
                {trx.notes && <p className="text-xs text-slate-600 mt-1 italic">"{trx.notes}"</p>}
              </div>
            </div>

            <div className="text-right">
              <p className={`text-base font-extrabold ${trx.type === 'setor' ? 'text-pink-600' : 'text-slate-800'}`}>
                {trx.type === 'setor' ? '+' : '-'}{formatRupiah(trx.amountValue)}
              </p>
              {'total_kg' in trx && trx.total_kg && (
                <p className="text-xs text-slate-500 font-semibold">{formatWeight(trx.total_kg)}</p>
              )}
            </div>
          </Card>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-pink-200 text-slate-400 text-xs">
            Tidak ada data transaksi yang ditemukan.
          </div>
        )}
      </div>

      {/* Transaction Detail Receipt Modal */}
      {selectedTrx && (
        <Modal
          isOpen={Boolean(selectedTrx)}
          onClose={() => setSelectedTrx(null)}
          title={`🧾 Resi Transaksi ${selectedTrx.id.substring(0, 8)}`}
          description={`Tanggal: ${formatDateTime(selectedTrx.created_at)}`}
          maxWidth="md"
        >
          <div className="space-y-4 text-xs text-slate-700">
            <div className="p-4 rounded-xl bg-pink-50 border border-pink-100 flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase font-bold text-pink-600">NAMA NASABAH</p>
                <p className="font-extrabold text-slate-800 text-sm">{profile.full_name}</p>
                <p className="font-mono text-[11px] text-pink-700">NIK: {nasabah.nik}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase font-bold text-pink-600">SALDO DIKREDITKAN</p>
                <p className="font-extrabold text-pink-600 text-lg">{formatRupiah(selectedTrx.amountValue)}</p>
                {'total_amount' in selectedTrx && selectedTrx.total_amount !== selectedTrx.amountValue && (
                  <p className="text-[10px] text-slate-400">Bruto: {formatRupiah(selectedTrx.total_amount)}</p>
                )}
              </div>
            </div>

            {'items' in selectedTrx && selectedTrx.items && selectedTrx.items.length > 0 && (
              <div className="space-y-2">
                <p className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">Rincian Timbangan Sampah:</p>
                <div className="border border-pink-100 rounded-xl overflow-hidden divide-y divide-pink-100">
                  {selectedTrx.items.map((item, idx) => (
                    <div key={idx} className="p-3 flex items-center justify-between bg-white">
                      <div>
                        <p className="font-bold text-slate-800">{item.waste_type_name || 'Sampah'}</p>
                        <p className="text-[11px] text-slate-400">
                          {formatWeight(item.weight)} x {formatRupiah(item.price_per_kg)}/kg
                        </p>
                      </div>
                      <p className="font-bold text-pink-600">{formatRupiah(item.subtotal)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {'total_nasabah_amount' in selectedTrx && selectedTrx.total_amount !== selectedTrx.total_nasabah_amount && (
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 space-y-0.5">
                <p className="font-bold text-slate-700 uppercase text-[10px] tracking-wider">Rincian Bagi Hasil:</p>
                <p>Bruto Timbangan: {formatRupiah(selectedTrx.total_amount)}</p>
                <p>Saldo Dikreditkan ({selectedTrx.items[0]?.nasabah_share_pct ?? 85}%): <strong className="text-pink-600">{formatRupiah(selectedTrx.total_nasabah_amount)}</strong></p>
              </div>
            )}

            <div className="pt-3 border-t border-slate-100 text-[11px] space-y-1">
              <p><strong>Dicatat Oleh:</strong> {selectedTrx.recorded_by_name || 'Pengurus KKN-K ROWOTAMTU'}</p>
              <p><strong>Catatan:</strong> {selectedTrx.notes || '-'}</p>
            </div>

            <div className="pt-2 flex justify-end">
              <Button variant="primary" size="sm" onClick={() => setSelectedTrx(null)}>
                Tutup Resi
              </Button>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
};

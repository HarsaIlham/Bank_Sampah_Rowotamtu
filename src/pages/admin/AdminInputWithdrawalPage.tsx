import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNasabahSummaries, useCreateWithdrawal } from '../../hooks/useAppQueries';
import { formatRupiah } from '../../lib/utils';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { NasabahSelect } from '../../components/common/NasabahSelect';
import { Coins, CheckCircle, AlertTriangle, HandCoins, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export const AdminInputWithdrawalPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: nasabahList = [], isLoading: loading } = useNasabahSummaries();
  const createWithdrawalMutation = useCreateWithdrawal();

  const [selectedNasabahId, setSelectedNasabahId] = useState<string>('');
  const [amount, setAmount] = useState<number | ''>('');
  const [notes, setNotes] = useState<string>('Pencairan tunai di Posko Utama Bank Sampah');
  const [error, setError] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const submitting = createWithdrawalMutation.isPending;

  const selectedNasabah = nasabahList.find(n => n.id === selectedNasabahId);

  const handleQuickAmount = (val: number) => {
    setAmount(val);
  };

  const handleWithdrawAll = () => {
    if (selectedNasabah) {
      setAmount(selectedNasabah.balance);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!selectedNasabahId || !selectedNasabah) {
      setError('Silakan pilih akun nasabah yang melakukan penarikan terlebih dahulu.');
      return;
    }

    const numAmount = typeof amount === 'number' ? amount : Number(amount) || 0;

    if (numAmount <= 0) {
      setError('Nominal penarikan harus lebih besar dari Rp 0.');
      return;
    }

    if (numAmount > selectedNasabah.balance) {
      setError(`Saldo nasabah (${formatRupiah(selectedNasabah.balance)}) tidak mencukupi untuk penarikan ${formatRupiah(numAmount)}`);
      return;
    }

    try {
      await createWithdrawalMutation.mutateAsync({
        customer_id: selectedNasabahId,
        amount: numAmount,
        notes
      });

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      setIsSuccess(true);
    } catch (err: any) {
      console.error('Error recording withdrawal:', err);
      setError(err.message || 'Gagal mencatat transaksi penarikan');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[350px] gap-3 text-pink-600">
        <Loader2 className="w-8 h-8 animate-spin" />
        <p className="text-xs font-semibold text-slate-600">Memuat formulir penarikan...</p>
      </div>
    );
  }

  if (isSuccess) {
    const numAmount = typeof amount === 'number' ? amount : Number(amount) || 0;
    return (
      <div className="max-w-xl mx-auto space-y-6 pt-6">
        <Card className="p-8 text-center space-y-4 border-amber-200 bg-white">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto text-amber-600">
            <CheckCircle className="w-10 h-10" />
          </div>

          <div className="space-y-1">
            <Badge variant="amber" size="md">PENARIKAN BERHASIL DICATAT</Badge>
            <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">
              Penarikan Tunai Berhasil
            </h2>
            <p className="text-xs text-slate-500">
              Penarikan tunai sebesar <strong className="text-amber-800 font-extrabold">{formatRupiah(numAmount)}</strong> atas nama{' '}
              <strong className="text-slate-800">{selectedNasabah?.full_name}</strong> telah dicatat dalam buku kas.
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <Button
              variant="outline"
              size="md"
              onClick={() => {
                setIsSuccess(false);
                setSelectedNasabahId('');
                setAmount('');
              }}
              className="cursor-pointer"
            >
              + Input Penarikan Lagi
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={() => navigate('/admin/laporan')}
              className="cursor-pointer"
            >
              Lihat Laporan Kas →
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-pink-100 shadow-xs space-y-2">
        <Badge variant="pink" size="md">PENCATATAN PENARIKAN TUNAI FISIK</Badge>
        <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">
          Form Penarikan Tabungan Nasabah
        </h1>
        <p className="text-xs text-slate-500">
          Pengurus memberikan uang tunai secara langsung di posko, lalu mencatat transaksi penarikan di sistem untuk memperbarui saldo nasabah.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Step 1: Select Nasabah */}
        <Card className="p-6 space-y-4 border-pink-100">
          <NasabahSelect
            options={nasabahList}
            value={selectedNasabahId}
            onChange={setSelectedNasabahId}
            label="Pilih Akun Nasabah Yang Menarik Uang"
          />

          {selectedNasabah && (
            <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 flex items-center justify-between">
              <div>
                <p className="text-[10px] text-amber-800 font-bold uppercase">SALDO TERSEDIA SAAT INI</p>
                <p className="text-xl font-extrabold text-amber-900">{formatRupiah(selectedNasabah.balance)}</p>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleWithdrawAll}
                className="bg-white border-amber-300 text-amber-900 hover:bg-amber-100 font-bold text-xs cursor-pointer"
              >
                Tarik Seluruh Saldo
              </Button>
            </div>
          )}
        </Card>

        {/* Step 2: Withdrawal Amount */}
        <Card className="p-6 space-y-4 border-pink-100">
          <Input
            label="NOMINAL PENARIKAN TUNAI (RP)"
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
            placeholder="Masukkan nominal (contoh: 50000)"
            step="1000"
            required
            icon={<Coins className="w-4 h-4 text-amber-600" />}
          />

          {/* Quick Amount Pills */}
          <div className="space-y-1.5">
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">PILIHAN NOMINAL CEPAT:</p>
            <div className="flex flex-wrap items-center gap-2">
              {[10000, 20000, 50000, 100000, 200000, 500000].map(val => (
                <button
                  key={val}
                  type="button"
                  onClick={() => handleQuickAmount(val)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                    amount === val
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-amber-100 hover:text-amber-900'
                  }`}
                >
                  {formatRupiah(val)}
                </button>
              ))}
            </div>
          </div>

          <Input
            label="CATATAN / KETERANGAN PENARIKAN"
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Keterangan penarikan..."
          />

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <Button variant="ghost" size="md" type="button" onClick={() => navigate('/admin')}>
              Batal
            </Button>

            <Button
              variant="primary"
              size="md"
              type="submit"
              icon={<HandCoins className="w-5 h-5 text-white" />}
              disabled={submitting}
              className="bg-amber-600 hover:bg-amber-700 text-white font-extrabold shadow-md cursor-pointer"
            >
              {submitting ? 'Memproses...' : 'Konfirmasi Penarikan Tunai →'}
            </Button>
          </div>
        </Card>

      </form>

    </div>
  );
};

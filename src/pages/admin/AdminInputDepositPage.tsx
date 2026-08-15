import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNasabahSummaries, useWasteTypes, useCreateDeposit } from '../../hooks/useAppQueries';
import { useSettings } from '../../context/SettingsContext';
import { formatRupiah, formatWeight } from '../../lib/utils';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { NasabahSelect } from '../../components/common/NasabahSelect';
import { PlusCircle, Trash2, Plus, CheckCircle, Scale, Sparkles, Loader2, PieChart } from 'lucide-react';
import confetti from 'canvas-confetti';

interface InputDepositRow {
  wasteTypeId: string;
  weight: number | string;
}

export const AdminInputDepositPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: users = [], isLoading: loadingUsers } = useNasabahSummaries();
  const { data: wasteTypes = [], isLoading: loadingTypes } = useWasteTypes(undefined, true);
  const { settings } = useSettings();
  const createDepositMutation = useCreateDeposit();

  const [selectedNasabahId, setSelectedNasabahId] = useState<string>('');
  const [rows, setRows] = useState<InputDepositRow[]>([]);
  const [notes, setNotes] = useState<string>('Penimbangan Posko Utama Desa Rowotamtu');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const loading = loadingUsers || loadingTypes;
  const submitting = createDepositMutation.isPending;

  const shareSettings = {
    nasabah: settings?.nasabah_share_pct ?? 85,
    pengurus: settings?.pengurus_share_pct ?? 10,
    kas: settings?.kas_share_pct ?? 5
  };

  useEffect(() => {
    if (wasteTypes.length > 0 && rows.length === 0) {
      setRows([{ wasteTypeId: wasteTypes[0].id, weight: '' }]);
    }
  }, [wasteTypes]);

  const selectedNasabah = users.find(u => u.id === selectedNasabahId);

  const handleAddRow = () => {
    if (wasteTypes.length === 0) return;
    setRows([...rows, { wasteTypeId: wasteTypes[0].id, weight: '' }]);
  };

  const handleRemoveRow = (index: number) => {
    if (rows.length > 1) {
      setRows(rows.filter((_, i) => i !== index));
    }
  };

  const handleTypeChange = (index: number, wasteTypeId: string) => {
    const updated = [...rows];
    updated[index].wasteTypeId = wasteTypeId;
    setRows(updated);
  };

  const handleWeightChange = (index: number, val: string) => {
    const updated = [...rows];
    if (val === '') {
      updated[index].weight = '';
    } else {
      const num = parseFloat(val);
      updated[index].weight = isNaN(num) ? '' : Math.max(0, num);
    }
    setRows(updated);
  };

  // Calculations
  const calculatedItems = rows.map(r => {
    const wt = wasteTypes.find(w => w.id === r.wasteTypeId);
    const pricePerKg = wt?.price_per_kg || 0;
    const numWeight = typeof r.weight === 'number' ? r.weight : (parseFloat(r.weight) || 0);
    const subtotal = pricePerKg * numWeight;
    return {
      waste_type_id: r.wasteTypeId,
      wasteTypeName: wt?.name || 'Sampah',
      weight: numWeight,
      price_per_kg: pricePerKg,
      subtotal
    };
  });

  const grandTotalAmount = calculatedItems.reduce((acc, item) => acc + item.subtotal, 0);
  const grandTotalKg = calculatedItems.reduce((acc, item) => acc + item.weight, 0);

  // Revenue sharing calculations (auto from settings)
  const nasabahAmount = Math.round(grandTotalAmount * shareSettings.nasabah / 100);
  const pengurusAmount = Math.round(grandTotalAmount * shareSettings.pengurus / 100);
  const kasAmount = grandTotalAmount - nasabahAmount - pengurusAmount; // remainder to avoid rounding errors

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!selectedNasabahId) {
      setErrorMsg('Silakan pilih akun nasabah terlebih dahulu sebelum menyimpan transaksi.');
      return;
    }

    if (grandTotalKg <= 0 || grandTotalAmount <= 0) {
      setErrorMsg('Masukkan berat timbangan sampah yang valid (lebih besar dari 0 kg).');
      return;
    }

    try {
      await createDepositMutation.mutateAsync({
        customer_id: selectedNasabahId,
        items: calculatedItems.filter(item => item.weight > 0).map(item => ({
          waste_type_id: item.waste_type_id,
          weight: item.weight,
          price_per_kg: item.price_per_kg
        })),
        notes
      });

      setIsSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
    } catch (err: any) {
      console.error('Error submitting deposit:', err);
      setErrorMsg(err.message || 'Gagal menyimpan transaksi penimbangan sampah');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[350px] gap-3 text-pink-600">
        <Loader2 className="w-8 h-8 animate-spin" />
        <p className="text-xs font-semibold text-slate-600">Memuat formulir penimbangan...</p>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="max-w-xl mx-auto space-y-6 pt-6">
        <Card className="p-8 text-center space-y-4 border-pink-200 bg-white">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
            <CheckCircle className="w-10 h-10" />
          </div>

          <div className="space-y-1">
            <Badge variant="emerald" size="md">TRANSAKSI BERHASIL DICATAT</Badge>
            <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">
              Setoran Sampah Berhasil Diterbitkan
            </h2>
            <p className="text-xs text-slate-500">
              Saldo tabungan atas nama <strong className="text-slate-800">{selectedNasabah?.full_name}</strong> telah bertambah sebesar{' '}
              <strong className="text-pink-600 font-extrabold">{formatRupiah(nasabahAmount)}</strong>
              <span className="text-slate-400"> (dari bruto {formatRupiah(grandTotalAmount)})</span>.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-pink-50 border border-pink-100 text-xs space-y-1 text-left">
            <p><strong>Total Bruto Timbangan:</strong> {formatRupiah(grandTotalAmount)}</p>
            <p><strong>Bagian Nasabah ({shareSettings.nasabah}%):</strong> <span className="text-pink-600 font-extrabold">{formatRupiah(nasabahAmount)}</span></p>
            <p><strong>Komisi Pengurus ({shareSettings.pengurus}%):</strong> {formatRupiah(pengurusAmount)}</p>
            <p><strong>Kas Operasional ({shareSettings.kas}%):</strong> {formatRupiah(kasAmount)}</p>
            <p className="pt-1 border-t border-pink-200"><strong>Total Berat Sampah:</strong> {formatWeight(grandTotalKg)} • {calculatedItems.length} Jenis</p>
            <p><strong>Catatan Kas:</strong> {notes}</p>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <Button
              variant="outline"
              size="md"
              onClick={() => {
                setIsSuccess(false);
                setSelectedNasabahId('');
                if (wasteTypes.length > 0) {
                  setRows([{ wasteTypeId: wasteTypes[0].id, weight: '' }]);
                }
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="cursor-pointer"
            >
              + Input Penimbangan Lagi
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
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-pink-100 shadow-xs space-y-1">
        <Badge variant="pink" size="md">FORMULIR PENIMBANGAN POSKO</Badge>
        <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">
          Pencatatan Setor Sampah Nasabah
        </h1>
        <p className="text-xs text-slate-500">
          Masukkan rincian timbangan sampah warga Desa Rowotamtu untuk mengkalkulasi saldo tabungan secara otomatis.
        </p>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Step 1: Select Nasabah */}
        <Card className="p-6 space-y-4 border-pink-100">
          <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b border-pink-100 pb-3">
            <Sparkles className="w-4 h-4 text-pink-600" /> 1. Pilih Pemilik Akun Nasabah
          </h3>

          <NasabahSelect
            options={users}
            value={selectedNasabahId}
            onChange={setSelectedNasabahId}
            label="Pencarian Berdasarkan NIK atau Nama Warga"
          />
        </Card>

        {/* Step 2: Item Rows */}
        <Card className="p-6 space-y-4 border-pink-100">
          <div className="flex items-center justify-between border-b border-pink-100 pb-3">
            <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Scale className="w-4 h-4 text-pink-600" /> 2. Rincian Penimbangan Sampah
            </h3>
            <span className="text-xs font-bold text-pink-600">{rows.length} Baris Sampah</span>
          </div>

          <div className="space-y-3">
            {rows.map((row, idx) => {
              const itemDetail = calculatedItems[idx];
              return (
                <div key={idx} className="p-4 rounded-2xl bg-pink-50/50 border border-pink-100 flex flex-wrap items-center gap-3">
                  <div className="flex-1 min-w-[220px]">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Pilih Jenis Sampah</label>
                    <select
                      value={row.wasteTypeId}
                      onChange={e => handleTypeChange(idx, e.target.value)}
                      className="w-full bg-white border border-pink-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-pink-400 focus:outline-none"
                    >
                      {wasteTypes.map(wt => (
                        <option key={wt.id} value={wt.id}>
                          {wt.name} ({formatRupiah(wt.price_per_kg)}/{wt.unit})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="w-32">
                    <Input
                      label="Berat (kg)"
                      type="number"
                      step="0.1"
                      min="0"
                      placeholder="0"
                      value={row.weight}
                      onChange={e => handleWeightChange(idx, e.target.value)}
                      onFocus={e => e.target.select()}
                    />
                  </div>

                  <div className="text-right min-w-[120px]">
                    <p className="text-[10px] text-slate-400 font-bold uppercase">SUB-TOTAL HARGA</p>
                    <p className="text-base font-extrabold text-pink-600">{formatRupiah(itemDetail.subtotal)}</p>
                  </div>

                  {rows.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveRow(idx)}
                      className="p-2.5 rounded-xl text-rose-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Hapus baris ini"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          <button
            type="button"
            onClick={handleAddRow}
            className="w-full py-3 border-2 border-dashed border-pink-200 rounded-xl text-xs font-bold text-pink-600 hover:bg-pink-50 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Tambah Baris Sampah Lainnya
          </button>
        </Card>

        {/* Step 3: Summary, Revenue Sharing & Notes */}
        <Card className="p-6 space-y-4 border-pink-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <div className="space-y-4">
              <Input
                label="CATATAN PENIMBANGAN / LOKASI POSKO"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Penimbangan Posko Utama"
              />

              {/* Revenue Sharing Breakdown */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center gap-1.5">
                  <PieChart className="w-4 h-4 text-slate-500" />
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Rincian Bagi Hasil (Otomatis)</p>
                </div>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Bagian Nasabah ({shareSettings.nasabah}%)</span>
                    <span className="font-extrabold text-pink-600">{formatRupiah(nasabahAmount)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Komisi Pengurus ({shareSettings.pengurus}%)</span>
                    <span className="font-bold text-slate-700">{formatRupiah(pengurusAmount)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Kas Operasional ({shareSettings.kas}%)</span>
                    <span className="font-bold text-slate-700">{formatRupiah(kasAmount)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-pink-500 to-[#EC4899] text-white shadow-md text-right space-y-1">
                <p className="text-[11px] text-pink-100 uppercase font-bold tracking-wider">SALDO DITAMBAHKAN KE NASABAH</p>
                <h3 className="text-3xl font-extrabold tracking-tight">{formatRupiah(nasabahAmount)}</h3>
                <p className="text-xs text-pink-100 font-semibold">
                  Bruto: {formatRupiah(grandTotalAmount)} • {formatWeight(grandTotalKg)}
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <Button
              variant="ghost"
              size="md"
              type="button"
              onClick={() => navigate('/admin')}
            >
              Batal
            </Button>

            <Button
              variant="primary"
              size="md"
              type="submit"
              icon={<PlusCircle className="w-5 h-5" />}
              disabled={submitting}
              className="shadow-md font-extrabold cursor-pointer"
            >
              {submitting ? 'Menyimpan...' : 'Simpan Transaksi Setoran Sampah →'}
            </Button>
          </div>
        </Card>

      </form>

    </div>
  );
};

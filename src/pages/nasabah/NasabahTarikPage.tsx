import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { supabaseService } from '../../services/supabaseService';
import { formatRupiah } from '../../lib/utils';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Coins, HandCoins, Loader2 } from 'lucide-react';

export const NasabahTarikPage: React.FC = () => {
  const { nasabah } = useAuth();
  const navigate = useNavigate();
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    const fetchSummary = async () => {
      if (!nasabah?.id) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const summary = await supabaseService.getNasabahSummary(nasabah.id);
        if (isMounted && summary) {
          setBalance(summary.balance);
        }
      } catch (err) {
        console.error('Error fetching nasabah summary for withdraw page:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchSummary();

    return () => {
      isMounted = false;
    };
  }, [nasabah?.id]);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-pink-100 shadow-xs space-y-2">
        <Badge variant="pink" size="md">INFORMASI PENARIKAN SALDO TUNAI</Badge>
        <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">
          Panduan Penarikan Saldo Tabungan
        </h1>
        <p className="text-xs text-slate-500">
          Penarikan saldo tabungan dilakukan secara fisik langsung di Posko Utama Bank Sampah Desa Rowotamtu.
        </p>
      </div>

      {/* Balance Summary Header Card */}
      <div className="bg-gradient-to-r from-pink-500 to-[#EC4899] text-white p-6 rounded-3xl shadow-lg flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-pink-100 uppercase tracking-wider">SALDO SIMPANAN TERSEDIA</p>
          <p className="text-3xl md:text-4xl font-extrabold mt-1">
            {loading ? (
              <span className="inline-flex items-center gap-2 text-xl">
                <Loader2 className="w-5 h-5 animate-spin" /> Memuat...
              </span>
            ) : (
              formatRupiah(balance)
            )}
          </p>
          <p className="text-xs text-pink-100 mt-1">Dapat diambil tunai kapan saja di Posko</p>
        </div>
        <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
          <Coins className="w-8 h-8 text-amber-300" />
        </div>
      </div>

      {/* Process Card */}
      <Card className="p-6 md:p-8 space-y-5 border-pink-100">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-pink-100 text-[#EC4899] flex items-center justify-center font-bold shrink-0">
            <HandCoins className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-slate-800 text-base">Alur Penarikan Uang Tunai di Posko</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Demi keamanan dan kemudahan pengurus desa, transaksi penarikan dilakukan secara tunai fisik langsung di posko. Pengurus akan menyerahkan uang tunai dan mencatatnya ke dalam sistem digital.
            </p>
          </div>
        </div>

        <div className="space-y-3 pt-2 border-t border-pink-100 text-xs text-slate-700">
          <div className="p-3.5 rounded-xl bg-pink-50/50 border border-pink-100 flex items-center gap-3">
            <span className="w-7 h-7 rounded-full bg-[#EC4899] text-white font-bold flex items-center justify-center shrink-0 text-xs">1</span>
            <span>Datang ke Posko Bank Sampah di Balai Desa Rowotamtu pada jam operasional.</span>
          </div>

          <div className="p-3.5 rounded-xl bg-pink-50/50 border border-pink-100 flex items-center gap-3">
            <span className="w-7 h-7 rounded-full bg-[#EC4899] text-white font-bold flex items-center justify-center shrink-0 text-xs">2</span>
            <span>Sebutkan NIK KTP Anda kepada Pengurus untuk pencocokan data saldo.</span>
          </div>

          <div className="p-3.5 rounded-xl bg-pink-50/50 border border-pink-100 flex items-center gap-3">
            <span className="w-7 h-7 rounded-full bg-[#EC4899] text-white font-bold flex items-center justify-center shrink-0 text-xs">3</span>
            <span>Pengurus menyerahkan uang tunai sesuai jumlah penarikan & memperbarui saldo Anda.</span>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <Button
            variant="outline"
            size="md"
            onClick={() => navigate('/nasabah/riwayat')}
            className="cursor-pointer"
          >
            Lihat Riwayat Transaksi Saya →
          </Button>
        </div>
      </Card>

    </div>
  );
};

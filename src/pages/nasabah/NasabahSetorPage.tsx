import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { MapPin, Clock, CheckCircle2, HeartHandshake } from 'lucide-react';

export const NasabahSetorPage: React.FC = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();

  if (!profile) return null;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-500 via-pink-600 to-rose-700 text-white p-6 md:p-8 rounded-3xl shadow-lg space-y-3">
        <Badge variant="secondary" size="md" className="bg-white/20 text-white border-white/30">
          PANDUAN PENYETORAN SAMPAH POSKO
        </Badge>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
          Cara Setor Sampah Langsung ke Bank Sampah
        </h1>
        <p className="text-xs md:text-sm text-pink-100 leading-relaxed max-w-xl">
          Warga Desa Rowotamtu dapat membawa sampah terpilah dari rumah secara langsung ke Posko Utama Balai Desa. Pengurus siap menimbang dan menginput saldo tabungan Anda!
        </p>
      </div>

      {/* 3 Easy Steps */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <HeartHandshake className="w-5 h-5 text-pink-600" /> 3 Langkah Mudah Menabung Sampah
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-5 space-y-2 border-pink-200 bg-white">
            <div className="w-9 h-9 rounded-xl bg-pink-100 text-[#EC4899] font-extrabold flex items-center justify-center text-sm">
              1
            </div>
            <h4 className="font-bold text-slate-800 text-sm">Pilah dari Dapur Rumah</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Pisahkan botol plastik, kardus, minyak jelantah, dan kaleng alumunium dalam wadah/karung terpisah.
            </p>
          </Card>

          <Card className="p-5 space-y-2 border-pink-200 bg-white">
            <div className="w-9 h-9 rounded-xl bg-pink-100 text-[#EC4899] font-extrabold flex items-center justify-center text-sm">
              2
            </div>
            <h4 className="font-bold text-slate-800 text-sm">Bawa ke Posko Utama</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Kunjungi Posko Bank Sampah Desa Rowotamtu di Balai Desa pada jam operasional penimbangan.
            </p>
          </Card>

          <Card className="p-5 space-y-2 border-pink-200 bg-white">
            <div className="w-9 h-9 rounded-xl bg-pink-100 text-[#EC4899] font-extrabold flex items-center justify-center text-sm">
              3
            </div>
            <h4 className="font-bold text-slate-800 text-sm">Sebutkan NIK & Terima Saldo</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Sebutkan NIK KTP Anda kepada pengurus, pengurus menimbang sampah dan saldo otomatis masuk ke sistem!
            </p>
          </Card>
        </div>
      </div>

      {/* Operational Hours & Location */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-5 space-y-3 border-pink-100 bg-pink-50/40">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-pink-600" />
            <h4 className="font-bold text-slate-800 text-sm">Jam Operasional Posko Penimbangan</h4>
          </div>
          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded-lg bg-white border border-pink-100 flex justify-between items-center">
              <span className="font-semibold text-slate-700">Senin - Kamis</span>
              <span className="font-bold text-pink-600">08:00 - 14:00 WIB</span>
            </div>
            <div className="p-2.5 rounded-lg bg-white border border-pink-100 flex justify-between items-center">
              <span className="font-semibold text-slate-700">Jumat & Sabtu</span>
              <span className="font-bold text-pink-600">08:30 - 15:00 WIB</span>
            </div>
          </div>
        </Card>

        <Card className="p-5 space-y-3 border-pink-100 bg-pink-50/40">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-pink-600" />
            <h4 className="font-bold text-slate-800 text-sm">Lokasi Posko Bank Sampah</h4>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Halaman Utama Balai Desa Rowotamtu / Posko KKN-K ROWOTAMTU Dusun 01 RT 02 RW 01.
          </p>
          <div className="pt-2 text-xs font-semibold text-pink-700 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-pink-500" /> Tersedia timbangan digital presisi
          </div>
        </Card>
      </div>

      <div className="pt-4 flex justify-between items-center border-t border-slate-100">
        <Button variant="ghost" size="sm" onClick={() => navigate('/nasabah')}>
          ← Kembali ke Dashboard
        </Button>
        <Button variant="primary" size="sm" onClick={() => navigate('/katalog')}>
          Cek Katalog Harga Sampah →
        </Button>
      </div>

    </div>
  );
};

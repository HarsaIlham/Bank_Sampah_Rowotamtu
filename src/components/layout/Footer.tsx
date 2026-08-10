import React from 'react';
import { MapPin, Phone, Clock, Heart, Mail } from 'lucide-react';
import logoBank from '../../assets/logo-bank.png';
import { useSettings } from '../../context/SettingsContext';

export const Footer: React.FC = () => {
  const { settings } = useSettings();

  const operatingDays = settings?.operating_hours?.days || 'Senin - Sabtu';
  const operatingHours = settings?.operating_hours?.hours || '08.00 - 15.00 WIB';

  return (
    <footer className="bg-white border-t border-pink-100 pt-12 pb-24 md:pb-12 text-slate-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          
          {/* Brand info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-white p-1 border border-pink-100 flex items-center justify-center shadow-xs overflow-hidden shrink-0">
                <img 
                  src={settings?.logo_url || logoBank} 
                  alt="Logo Bank Sampah" 
                  className="w-full h-full object-contain" 
                  onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                />
              </div>
              <span className="font-extrabold text-slate-800 text-base">
                {settings?.bank_name || 'Bank Sampah Desa Rowotamtu'}
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              {settings?.description || 'Program digitalisasi pengelolaan sampah dan pemberdayaan ekonomi warga Desa Rowotamtu.'}
            </p>
            <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-pink-600 bg-pink-50 px-3 py-1 rounded-full border border-pink-200">
              <Heart className="w-3.5 h-3.5 fill-pink-500 text-pink-500" /> KKN-K ROWOTAMTU 2026
            </div>
          </div>

          {/* Operational Info */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Jam Operasional Posko</h4>
            <div className="space-y-1.5 text-xs text-slate-600">
              <p className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-pink-500 shrink-0" />
                <span>{operatingDays}: {operatingHours}</span>
              </p>
              <p className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-pink-500 shrink-0" />
                <span>Minggu: Penimbangan Rutin Dusun</span>
              </p>
            </div>
          </div>

          {/* Posko Location & Contact */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Lokasi Posko & Kontak</h4>
            <div className="space-y-1.5 text-xs text-slate-600">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-pink-500 shrink-0 mt-0.5" />
                <span>{settings?.address || 'Balai Desa Rowotamtu / Posko KKN-K ROWOTAMTU Dusun 01 RT 02 RW 01'}</span>
              </p>
              {settings?.phone && (
                <p className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-pink-500 shrink-0" />
                  <span>WA Posko: {settings.phone}</span>
                </p>
              )}
              {settings?.email && (
                <p className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-pink-500 shrink-0" />
                  <span>Email: {settings.email}</span>
                </p>
              )}
            </div>
          </div>

          {/* Social & Vision */}
          <div className="space-y-2 bg-gradient-to-br from-pink-50 to-[#FFF7FB] p-4 rounded-xl border border-pink-100">
            <h4 className="text-xs font-bold text-[#EC4899] uppercase tracking-wider">Media & Informasi</h4>
            <p className="text-xs text-slate-600 italic">
              "Sampah terkelola, lingkungan tertata, ekonomi warga Desa Rowotamtu semakin sejahtera."
            </p>
            {settings?.instagram && (
              <p className="text-xs font-medium text-pink-600 pt-1">
                Instagram: {settings.instagram}
              </p>
            )}
          </div>
        </div>

        <div className="border-t border-pink-100 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
          <p>© 2026 {settings?.bank_name || 'Bank Sampah Digital Desa Rowotamtu'}. Hak Cipta Dilindungi.</p>
          <p className="font-medium text-pink-600">Dibuat Oleh: Tim Mahasiswa KKN-K ROWOTAMTU 2026</p>
        </div>
      </div>
    </footer>
  );
};

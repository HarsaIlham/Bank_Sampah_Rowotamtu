import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';
import { supabaseService } from '../../services/supabaseService';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import type { Settings } from '../../types';
import { 
  Building2, 
  PieChart, 
  Save, 
  Loader2, 
  CheckCircle, 
  AlertTriangle, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Globe, 
  Sparkles,
  Layers,
  ExternalLink,
  LogOut,
  ShieldCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

const InstagramIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4 text-pink-500' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const FacebookIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4 text-pink-500' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

export const AdminSettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { profile, signOut } = useAuth();
  const { refreshSettings } = useSettings();
  const [, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'profile' | 'operational' | 'social' | 'revenue'>('profile');

  // Form states for Profil Lembaga
  const [bankName, setBankName] = useState<string>('Bank Sampah Digital Desa Rowotamtu');
  const [description, setDescription] = useState<string>('Buku Kas Digital dan Pengelolaan Tabungan Sampah Warga Desa Rowotamtu KKN-K 2026.');
  const [address, setAddress] = useState<string>('Balai Desa Rowotamtu / Posko KKN-K Dusun 01 RT 02 RW 01, Kec. Rambipuji, Kab. Jember');
  const [phone, setPhone] = useState<string>('081234567890');
  const [email, setEmail] = useState<string>('banksampah.rowotamtu@gmail.com');
  const [logoUrl, setLogoUrl] = useState<string>('');

  // Form states for Operasional & Maps
  const [operatingDays, setOperatingDays] = useState<string>('Senin - Sabtu');
  const [operatingHours, setOperatingHours] = useState<string>('08:00 - 15:00 WIB');
  const [mapsUrl, setMapsUrl] = useState<string>('https://maps.google.com');

  // Form states for Social Media
  const [instagram, setInstagram] = useState<string>('@banksampah.rowotamtu');
  const [facebook, setFacebook] = useState<string>('Bank Sampah Desa Rowotamtu');

  // Form states for Revenue Sharing
  const [nasabahPct, setNasabahPct] = useState<number>(85);
  const [pengurusPct, setPengurusPct] = useState<number>(10);
  const [kasPct, setKasPct] = useState<number>(5);

  useEffect(() => {
    let isMounted = true;

    const fetchSettings = async () => {
      try {
        setLoading(true);
        const data = await supabaseService.getSettings();
        if (isMounted && data) {
          setSettings(data);
          if (data.bank_name) setBankName(data.bank_name);
          if (data.description) setDescription(data.description);
          if (data.address) setAddress(data.address);
          if (data.phone) setPhone(data.phone);
          if (data.email) setEmail(data.email);
          if (data.logo_url) setLogoUrl(data.logo_url);
          if (data.maps_url) setMapsUrl(data.maps_url);
          if (data.instagram) setInstagram(data.instagram);
          if (data.facebook) setFacebook(data.facebook);
          
          if (data.operating_hours) {
            const op = typeof data.operating_hours === 'object' ? data.operating_hours : {};
            if (op.days) setOperatingDays(op.days);
            if (op.hours) setOperatingHours(op.hours);
          }

          setNasabahPct(data.nasabah_share_pct ?? 85);
          setPengurusPct(data.pengurus_share_pct ?? 10);
          setKasPct(data.kas_share_pct ?? 5);
        }
      } catch (err) {
        console.error('Error loading settings:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchSettings();
    return () => { isMounted = false; };
  }, []);

  const totalPct = nasabahPct + pengurusPct + kasPct;
  const isValidTotal = Math.abs(totalPct - 100) < 0.01;

  const handleSaveAll = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSaveSuccess(false);

    if (!isValidTotal) {
      setErrorMsg(`Total persentase bagi hasil harus tepat 100%. Saat ini: ${totalPct.toFixed(2)}%`);
      setActiveTab('revenue');
      return;
    }

    if (!bankName.trim()) {
      setErrorMsg('Nama Bank Sampah tidak boleh kosong');
      setActiveTab('profile');
      return;
    }

    try {
      setSaving(true);
      const updated = await supabaseService.updateSettings({
        bank_name: bankName.trim(),
        description: description.trim(),
        address: address.trim(),
        phone: phone.trim(),
        email: email.trim(),
        logo_url: logoUrl.trim(),
        maps_url: mapsUrl.trim(),
        instagram: instagram.trim(),
        facebook: facebook.trim(),
        operating_hours: {
          days: operatingDays.trim(),
          hours: operatingHours.trim()
        },
        nasabah_share_pct: nasabahPct,
        pengurus_share_pct: pengurusPct,
        kas_share_pct: kasPct
      });

      setSettings(updated);
      await refreshSettings();
      setSaveSuccess(true);
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err: any) {
      console.error('Error saving settings to database:', err);
      setErrorMsg(err.message || 'Gagal menyimpan pengaturan ke database Supabase');
    } finally {
      setSaving(false);
    }
  };

  const handlePctChange = (field: 'nasabah' | 'pengurus' | 'kas', value: string) => {
    const num = parseFloat(value) || 0;
    const clamped = Math.max(0, Math.min(100, num));

    if (field === 'nasabah') setNasabahPct(clamped);
    else if (field === 'pengurus') setPengurusPct(clamped);
    else setKasPct(clamped);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3 text-pink-600">
        <Loader2 className="w-9 h-9 animate-spin text-pink-600" />
        <p className="text-xs font-bold text-slate-600">Memuat konfigurasi web dari database...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-pink-600 to-rose-600 text-white p-6 md:p-8 rounded-3xl shadow-lg relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1.5 z-10 max-w-xl">
          <Badge variant="secondary" size="sm" className="bg-white/20 text-white border-white/30 tracking-wider">
            ADMINISTRATOR PANEL
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Pengaturan & Konfigurasi Web
          </h1>
          <p className="text-xs text-pink-100 leading-relaxed">
            Kelola profil resmi bank sampah, kontak, jam operasional, media sosial, dan persentase bagi hasil yang tersimpan di database.
          </p>
        </div>

        <div className="z-10 shrink-0">
          <Button
            variant="secondary"
            size="md"
            icon={saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            onClick={handleSaveAll}
            disabled={saving || !isValidTotal}
            className="bg-white text-pink-600 hover:bg-pink-50 font-extrabold shadow-md cursor-pointer"
          >
            {saving ? 'Menyimpan...' : 'Simpan Semua Perubahan'}
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        <button
          type="button"
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            activeTab === 'profile'
              ? 'bg-pink-600 text-white shadow-md shadow-pink-200'
              : 'bg-white text-slate-600 hover:bg-pink-50 hover:text-pink-600 border border-pink-100'
          }`}
        >
          <Building2 className="w-4 h-4" /> Profil Lembaga & Kontak
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('operational')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            activeTab === 'operational'
              ? 'bg-pink-600 text-white shadow-md shadow-pink-200'
              : 'bg-white text-slate-600 hover:bg-pink-50 hover:text-pink-600 border border-pink-100'
          }`}
        >
          <Clock className="w-4 h-4" /> Jam Posko & Maps
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('social')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            activeTab === 'social'
              ? 'bg-pink-600 text-white shadow-md shadow-pink-200'
              : 'bg-white text-slate-600 hover:bg-pink-50 hover:text-pink-600 border border-pink-100'
          }`}
        >
          <Globe className="w-4 h-4" /> Media Sosial & Tautan
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('revenue')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            activeTab === 'revenue'
              ? 'bg-pink-600 text-white shadow-md shadow-pink-200'
              : 'bg-white text-slate-600 hover:bg-pink-50 hover:text-pink-600 border border-pink-100'
          }`}
        >
          <PieChart className="w-4 h-4" /> Bagi Hasil ({totalPct.toFixed(0)}%)
        </button>
      </div>

      {/* Notifications */}
      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-bold flex items-center gap-2 shadow-xs">
          <AlertTriangle className="w-5 h-5 shrink-0 text-rose-500" />
          <span>{errorMsg}</span>
        </div>
      )}

      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 font-bold flex items-center gap-2 shadow-xs">
          <CheckCircle className="w-5 h-5 shrink-0 text-emerald-600" />
          <span>Seluruh pengaturan website berhasil disimpan ke database Supabase!</span>
        </div>
      )}

      {/* Form Content */}
      <form onSubmit={handleSaveAll} className="space-y-6">

        {/* TAB 1: Profil Lembaga & Kontak */}
        {activeTab === 'profile' && (
          <Card className="p-6 sm:p-8 space-y-6 border-pink-100">
            <div className="flex items-center gap-2.5 border-b border-pink-100 pb-4">
              <div className="w-8 h-8 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center font-bold">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-800">Profil Resmi Bank Sampah</h3>
                <p className="text-xs text-slate-500">Informasi utama yang ditampilkan pada footer dan halaman profil umum</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <Input
                  label="Nama Bank Sampah / Instansi"
                  value={bankName}
                  onChange={e => setBankName(e.target.value)}
                  placeholder="Contoh: Bank Sampah Digital Desa Rowotamtu"
                  required
                />
              </div>

              <div className="md:col-span-2 space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">Deskripsi / Visi Singkat</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Tuliskan deskripsi ringkas kegiatan bank sampah..."
                  className="w-full bg-white border border-pink-200 rounded-2xl p-3 text-xs text-slate-800 focus:ring-2 focus:ring-pink-400 focus:outline-none leading-relaxed"
                />
              </div>

              <div className="md:col-span-2">
                <Input
                  label="Alamat Posko Utama / Lokasi Penimbangan"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  placeholder="Alamat lengkap posko desa"
                  icon={<MapPin className="w-4 h-4 text-pink-500" />}
                />
              </div>

              <div>
                <Input
                  label="Nomor WhatsApp / Telepon Posko"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="Contoh: 081234567890"
                  icon={<Phone className="w-4 h-4 text-pink-500" />}
                />
              </div>

              <div>
                <Input
                  label="Email Resmi Bank Sampah"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Contoh: banksampah.rowotamtu@gmail.com"
                  icon={<Mail className="w-4 h-4 text-pink-500" />}
                />
              </div>

              <div className="md:col-span-2">
                <Input
                  label="URL Logo Kustom (Opsional)"
                  value={logoUrl}
                  onChange={e => setLogoUrl(e.target.value)}
                  placeholder="https://example.com/logo.png (Biarkan kosong untuk menggunakan logo bawaan)"
                  icon={<Sparkles className="w-4 h-4 text-pink-500" />}
                />
              </div>
            </div>
          </Card>
        )}

        {/* TAB 2: Jam Posko & Maps */}
        {activeTab === 'operational' && (
          <Card className="p-6 sm:p-8 space-y-6 border-pink-100">
            <div className="flex items-center gap-2.5 border-b border-pink-100 pb-4">
              <div className="w-8 h-8 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center font-bold">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-800">Jadwal Operasional & Lokasi Posko</h3>
                <p className="text-xs text-slate-500">Atur hari dan jam pelayanan penimbangan serta tautan Google Maps</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <Input
                  label="Hari Layanan Penimbangan"
                  value={operatingDays}
                  onChange={e => setOperatingDays(e.target.value)}
                  placeholder="Contoh: Senin - Sabtu atau Setiap Minggu Pagi"
                  icon={<Clock className="w-4 h-4 text-pink-500" />}
                />
              </div>

              <div>
                <Input
                  label="Jam Buka Pelayanan"
                  value={operatingHours}
                  onChange={e => setOperatingHours(e.target.value)}
                  placeholder="Contoh: 08:00 - 15:00 WIB"
                  icon={<Clock className="w-4 h-4 text-pink-500" />}
                />
              </div>

              <div className="md:col-span-2">
                <Input
                  label="Link Google Maps Lokasi Posko"
                  value={mapsUrl}
                  onChange={e => setMapsUrl(e.target.value)}
                  placeholder="https://maps.app.goo.gl/..."
                  icon={<ExternalLink className="w-4 h-4 text-pink-500" />}
                />
                <p className="text-[11px] text-slate-400 mt-1.5">
                  Link ini akan dibuka saat warga mengeklik tombol navigasi lokasi posko.
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* TAB 3: Media Sosial */}
        {activeTab === 'social' && (
          <Card className="p-6 sm:p-8 space-y-6 border-pink-100">
            <div className="flex items-center gap-2.5 border-b border-pink-100 pb-4">
              <div className="w-8 h-8 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center font-bold">
                <Globe className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-800">Akun Media Sosial & Publikasi</h3>
                <p className="text-xs text-slate-500">Tautan sosial media untuk publikasi dan transparansi kegiatan dusun</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <Input
                  label="Akun Instagram"
                  value={instagram}
                  onChange={e => setInstagram(e.target.value)}
                  placeholder="@banksampah.rowotamtu"
                  icon={<InstagramIcon className="w-4 h-4 text-pink-500" />}
                />
              </div>

              <div>
                <Input
                  label="Halaman Facebook"
                  value={facebook}
                  onChange={e => setFacebook(e.target.value)}
                  placeholder="Bank Sampah Desa Rowotamtu"
                  icon={<FacebookIcon className="w-4 h-4 text-pink-500" />}
                />
              </div>
            </div>
          </Card>
        )}

        {/* TAB 4: Persentase Bagi Hasil */}
        {activeTab === 'revenue' && (
          <Card className="p-6 sm:p-8 space-y-6 border-pink-100">
            <div className="flex items-center gap-2.5 border-b border-pink-100 pb-4">
              <div className="w-8 h-8 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center font-bold">
                <PieChart className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-800">Persentase Bagi Hasil Penimbangan</h3>
                <p className="text-xs text-slate-500">Skema otomatisasi pembagian bruto transaksi setor sampah warga</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Nasabah */}
              <div className="p-4 rounded-2xl bg-pink-50/70 border border-pink-200 space-y-2">
                <label className="block text-[10px] font-extrabold text-pink-600 uppercase tracking-wider">
                  Bagian Tabungan Nasabah
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.5"
                    value={nasabahPct}
                    onChange={e => handlePctChange('nasabah', e.target.value)}
                    className="w-full bg-white border border-pink-300 rounded-xl px-3 py-2.5 text-xl font-black text-pink-600 text-center focus:ring-2 focus:ring-pink-400 focus:outline-none"
                  />
                  <span className="text-lg font-bold text-pink-400">%</span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium">Masuk saldo tabungan warga</p>
              </div>

              {/* Pengurus */}
              <div className="p-4 rounded-2xl bg-violet-50/70 border border-violet-200 space-y-2">
                <label className="block text-[10px] font-extrabold text-violet-600 uppercase tracking-wider">
                  Komisi Kader / Pengurus
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.5"
                    value={pengurusPct}
                    onChange={e => handlePctChange('pengurus', e.target.value)}
                    className="w-full bg-white border border-violet-300 rounded-xl px-3 py-2.5 text-xl font-black text-violet-600 text-center focus:ring-2 focus:ring-violet-400 focus:outline-none"
                  />
                  <span className="text-lg font-bold text-violet-400">%</span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium">Honor & operasional kader</p>
              </div>

              {/* Kas Operasional */}
              <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-200 space-y-2">
                <label className="block text-[10px] font-extrabold text-sky-600 uppercase tracking-wider">
                  Kas Operasional Posko
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.5"
                    value={kasPct}
                    onChange={e => handlePctChange('kas', e.target.value)}
                    className="w-full bg-white border border-sky-300 rounded-xl px-3 py-2.5 text-xl font-black text-sky-600 text-center focus:ring-2 focus:ring-sky-400 focus:outline-none"
                  />
                  <span className="text-lg font-bold text-sky-400">%</span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium">Dana cadangan & perlengkapan</p>
              </div>
            </div>

            {/* Total Indicator */}
            <div className={`p-3.5 rounded-2xl flex items-center justify-between text-xs font-extrabold ${
              isValidTotal
                ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
                : 'bg-rose-50 border border-rose-200 text-rose-700'
            }`}>
              <div className="flex items-center gap-2">
                {isValidTotal ? <CheckCircle className="w-4 h-4 text-emerald-600" /> : <AlertTriangle className="w-4 h-4 text-rose-600" />}
                <span>Total Persentase: {totalPct.toFixed(2)}%</span>
              </div>
              <Badge variant={isValidTotal ? 'secondary' : 'rose'} size="sm">
                {isValidTotal ? '✓ Akurat (100%)' : '✗ Harus Berjumlah 100%'}
              </Badge>
            </div>
          </Card>
        )}

        {/* Action Save Bar */}
        <div className="bg-white p-4 rounded-2xl border border-pink-100 shadow-xs flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Layers className="w-4 h-4 text-pink-500" />
            <span>Perubahan akan langsung tersinkronisasi ke seluruh halaman website.</span>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="md"
            icon={saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            disabled={saving || !isValidTotal}
            className="font-extrabold shadow-md cursor-pointer"
          >
            {saving ? 'Menyimpan...' : 'Simpan Semua Pengaturan'}
          </Button>
        </div>

      </form>

      {/* Account & Session Management Card */}
      <Card className="p-6 border-rose-100 bg-rose-50/30 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 border border-rose-200 flex items-center justify-center text-rose-600 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-slate-800 text-sm">Akun & Sesi Administrator</h3>
                <Badge variant="rose" size="sm">Admin Master</Badge>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Masuk sebagai: <strong className="text-slate-700">{profile?.full_name || 'Admin Posko'}</strong>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={async () => {
              await signOut();
              navigate('/login');
            }}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-rose-200 text-rose-600 hover:bg-rose-600 hover:text-white font-extrabold text-xs shadow-xs transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" /> Keluar / Logout Akun Admin
          </button>
        </div>
      </Card>

    </div>
  );
};

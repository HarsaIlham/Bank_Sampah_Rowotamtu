import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import logoBank from '../../assets/logo-bank.png';
import bgImage from '../../assets/botol-di-tempat-sampah.jpg';
import {
  User,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  Sparkles,
  AlertCircle,
  Building2,
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const [activeTab, setActiveTab] = useState<'nasabah' | 'admin'>('nasabah');

  // Form states for Nasabah
  const [nasabahNik, setNasabahNik] = useState('');
  const [nasabahPassword, setNasabahPassword] = useState('');
  const [showNasabahPass, setShowNasabahPass] = useState(false);

  // Form states for Admin
  const [adminIdentifier, setAdminIdentifier] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminPass, setShowAdminPass] = useState(false);

  // Feedback states
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleNasabahLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const cleanNik = nasabahNik.trim();

    if (!cleanNik) {
      setErrorMsg('Silakan masukkan Nomor Induk Kependudukan (NIK).');
      return;
    }

    if (!nasabahPassword) {
      setErrorMsg('Silakan masukkan kata sandi.');
      return;
    }

    setIsLoading(true);

    try {
      await signIn(cleanNik, nasabahPassword);
      navigate('/nasabah');
    } catch (err: any) {
      console.error('Nasabah login error:', err);
      setErrorMsg(err.message || 'Gagal masuk. Periksa NIK dan kata sandi Anda.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const cleanIdentifier = adminIdentifier.trim();

    if (!cleanIdentifier) {
      setErrorMsg('Silakan masukkan NIK / ID Pengurus.');
      return;
    }

    if (!adminPassword) {
      setErrorMsg('Silakan masukkan kata sandi pengurus.');
      return;
    }

    setIsLoading(true);

    try {
      await signIn(cleanIdentifier, adminPassword);
      navigate('/admin');
    } catch (err: any) {
      console.error('Admin login error:', err);
      setErrorMsg(err.message || 'Gagal masuk. Periksa NIK/ID dan kata sandi pengurus.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative w-full min-h-[calc(100vh-4.5rem)] px-4 py-8 md:py-12 flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center filter blur-[3px] scale-105 transform opacity-90"
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/45 via-pink-950/35 to-slate-950/55" />
      <div className="relative z-10 max-w-md w-full mx-auto space-y-6">

        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center">
            <img src={logoBank} alt="Logo Bank Sampah Desa Rowotamtu" className="w-28 h-28 md:w-32 md:h-32 object-contain drop-shadow-xl" />
          </div>
          <div>
            <Badge variant="pink" size="md" className="font-bold tracking-wider uppercase mb-1 shadow-md bg-white/90 text-pink-700 border-white">
              MASUK
            </Badge>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight drop-shadow-md">
              Bank Sampah Desa Rowotamtu
            </h1>
            <p className="text-xs text-pink-100 max-w-xs mx-auto mt-1 font-medium drop-shadow-sm">
              Buku Kas Digital & Penimbangan Sampah KKN-K ROWOTAMTU 2026
            </p>
          </div>
        </div>

        {/* Segmented Tab Selector */}
        <div className="bg-white/90 backdrop-blur-md p-1.5 rounded-2xl flex items-center justify-between border border-pink-100 shadow-md">
          <button
            type="button"
            onClick={() => {
              setActiveTab('nasabah');
              setErrorMsg('');
            }}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${activeTab === 'nasabah'
              ? 'bg-gradient-to-r from-pink-500 to-[#EC4899] text-white shadow-md shadow-pink-200'
              : 'text-slate-600 hover:text-slate-900'
              }`}
          >
            <User className="w-4 h-4" /> Login Nasabah (Warga)
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('admin');
              setErrorMsg('');
            }}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${activeTab === 'admin'
              ? 'bg-slate-900 text-white shadow-md shadow-slate-300'
              : 'text-slate-600 hover:text-slate-900'
              }`}
          >
            <ShieldCheck className="w-4 h-4" /> Login Pengurus (Admin)
          </button>
        </div>

        {/* Main Login Card */}
        <Card className="p-6 md:p-8 space-y-6 border-pink-100/90 shadow-xl bg-white/95 backdrop-blur-md">

          {/* Error Alert */}
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* NASABAH LOGIN FORM */}
          {activeTab === 'nasabah' && (
            <form onSubmit={handleNasabahLogin} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-pink-600" /> NIK (NOMOR INDUK KEPENDUDUKAN)
                </label>
                <input
                  type="text"
                  maxLength={16}
                  value={nasabahNik}
                  onChange={e => setNasabahNik(e.target.value.replace(/\D/g, ''))}
                  placeholder="Masukkan 16 digit NIK KTP Anda..."
                  className="w-full bg-white border border-pink-200 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-slate-800 placeholder:text-slate-400 placeholder:font-sans focus:outline-none focus:ring-2 focus:ring-pink-400"
                  required
                />
                <p className="text-[10px] text-slate-400 font-medium">
                  Gunakan NIK 16 digit yang terdaftar di buku kas posko.
                </p>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-pink-600" /> PASSWORD / PIN
                </label>
                <div className="relative">
                  <input
                    type={showNasabahPass ? 'text' : 'password'}
                    value={nasabahPassword}
                    onChange={e => setNasabahPassword(e.target.value)}
                    placeholder="Masukkan password Anda..."
                    className="w-full bg-white border border-pink-200 rounded-xl pl-3.5 pr-10 py-2.5 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNasabahPass(!showNasabahPass)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showNasabahPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[10px] text-pink-600 font-medium">
                  *Default demo password: <span className="font-mono font-bold">123456</span>
                </p>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full justify-center shadow-md shadow-pink-200 mt-2"
                disabled={isLoading}
              >
                {isLoading ? 'Memverifikasi Data...' : 'Masuk ke Akun Nasabah →'}
              </Button>

              {/* Quick Fill Demo Section */}
              <div className="pt-4 border-t border-slate-100 space-y-2.5">
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center flex items-center justify-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Pilihan Uji Coba Cepat (Akun Demo):
                </p>
                <div className="space-y-1.5">
                  {[
                    { name: 'Ibu Siti Aminah', nik: '3213015408850001', dusun: 'Rowotamtu Mekar' },
                    { name: 'Pak Budi Santoso', nik: '3213011204780002', dusun: 'Rowotamtu Asri' },
                    { name: 'Teh Rina Karlina', nik: '3213012109920003', dusun: 'Rowotamtu Rahayu' }
                  ].map(nasabah => (
                    <button
                      key={nasabah.nik}
                      type="button"
                      onClick={() => {
                        setNasabahNik(nasabah.nik);
                        setNasabahPassword('123456');
                        setErrorMsg('');
                      }}
                      className="w-full text-left p-2.5 rounded-xl bg-pink-50/60 hover:bg-pink-100/70 border border-pink-100 transition-colors flex items-center justify-between text-xs cursor-pointer group"
                    >
                      <div>
                        <p className="font-bold text-slate-800 group-hover:text-pink-700">{nasabah.name}</p>
                        <p className="text-[10px] text-slate-500 font-mono">NIK: {nasabah.nik} • {nasabah.dusun}</p>
                      </div>
                      <span className="text-[10px] font-bold text-pink-600 bg-white px-2 py-0.5 rounded-md border border-pink-200">
                        Pilih
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </form>
          )}

          {/* ADMIN LOGIN FORM */}
          {activeTab === 'admin' && (
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div className="p-3 rounded-xl bg-slate-900 text-white space-y-1">
                <Badge variant="rose" size="sm" className="bg-rose-900 text-pink-200 border-rose-700">
                  PANEL DOKUMEN PENGURUS POSKO
                </Badge>
                <p className="text-xs text-slate-300">
                  Khusus untuk Tim Mahasiswa KKN-K ROWOTAMTU & Pengurus Posko Desa Rowotamtu.
                </p>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-700" /> NIK / USERNAME ADMIN
                </label>
                <input
                  type="text"
                  value={adminIdentifier}
                  onChange={e => setAdminIdentifier(e.target.value)}
                  placeholder="Masukkan NIK/Username Pengurus..."
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-slate-800 placeholder:text-slate-400 placeholder:font-sans focus:outline-none focus:ring-2 focus:ring-slate-800"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-slate-700" /> KATA SANDI PENGURUS
                </label>
                <div className="relative">
                  <input
                    type={showAdminPass ? 'text' : 'password'}
                    value={adminPassword}
                    onChange={e => setAdminPassword(e.target.value)}
                    placeholder="Masukkan password admin..."
                    className="w-full bg-white border border-slate-300 rounded-xl pl-3.5 pr-10 py-2.5 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-800"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowAdminPass(!showAdminPass)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showAdminPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs shadow-md transition-colors flex items-center justify-center gap-1.5 cursor-pointer mt-2"
              >
                {isLoading ? 'Memverifikasi Pengurus...' : 'Masuk ke Panel Admin →'}
              </button>

              {/* Admin Quick Fill */}
              <div className="pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setAdminIdentifier('3213010101950001');
                    setAdminPassword('123456');
                    setErrorMsg('');
                  }}
                  className="w-full text-left p-3 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors flex items-center justify-between text-xs cursor-pointer"
                >
                  <div>
                    <p className="font-bold text-slate-900">Pengurus KKN-K ROWOTAMTU</p>
                    <p className="text-[10px] text-slate-500 font-mono">NIK Admin: 3213010101950001</p>
                  </div>
                  <span className="text-[10px] font-bold text-slate-800 bg-white px-2 py-0.5 rounded-md border border-slate-300">
                    Isi Otomatis
                  </span>
                </button>
              </div>
            </form>
          )}

        </Card>

        {/* Info Registration Footer */}
        <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-pink-100 space-y-2 text-center text-xs text-slate-600 shadow-sm">
          <p className="font-semibold text-slate-800 flex items-center justify-center gap-1">
            <Building2 className="w-4 h-4 text-pink-600" /> Belum memiliki akun nasabah?
          </p>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Pendaftaran akun nasabah dilakukan di Posko Utama Balai Desa Rowotamtu menggunakan KTP/NIK oleh Pengurus Bank Sampah.
          </p>
          <div className="pt-1">
            <Link to="/tentang-kami" className="text-pink-600 font-bold hover:underline">
              Lihat Informasi Posko & Struktur Organisasi →
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { getSavedAccountsByRole, saveAccount, removeAccount } from '../../services/savedAccountsService';
import type { SavedAccount } from '../../types';
import logoBank from '../../assets/logo-bank.png';
import bgImage from '../../assets/botol-di-tempat-sampah.jpg';
import {
  User,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  AlertCircle,
  Building2,
  Bookmark,
  Trash2,
  AlertTriangle,
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const [activeTab, setActiveTab] = useState<'nasabah' | 'admin'>('nasabah');

  // Form states for Nasabah
  const [nasabahNik, setNasabahNik] = useState('');
  const [nasabahPassword, setNasabahPassword] = useState('');
  const [showNasabahPass, setShowNasabahPass] = useState(false);
  const [rememberNasabah, setRememberNasabah] = useState(true);

  // Form states for Admin
  const [adminIdentifier, setAdminIdentifier] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminPass, setShowAdminPass] = useState(false);
  const [rememberAdmin, setRememberAdmin] = useState(true);

  // Feedback states
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Saved accounts
  const [savedNasabah, setSavedNasabah] = useState<SavedAccount[]>([]);
  const [savedAdmin, setSavedAdmin] = useState<SavedAccount[]>([]);

  // Delete confirmation
  const [accountToDelete, setAccountToDelete] = useState<SavedAccount | null>(null);

  // Load saved accounts on mount
  useEffect(() => {
    setSavedNasabah(getSavedAccountsByRole('nasabah'));
    setSavedAdmin(getSavedAccountsByRole('admin'));
  }, []);

  const refreshSavedAccounts = () => {
    setSavedNasabah(getSavedAccountsByRole('nasabah'));
    setSavedAdmin(getSavedAccountsByRole('admin'));
  };

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
      const { profile, nasabah } = await signIn(cleanNik, nasabahPassword);

      // Save account identity & password if checkbox is checked
      if (rememberNasabah) {
        saveAccount({
          nik: cleanNik,
          fullName: profile.full_name || 'Nasabah',
          role: 'nasabah',
          dusun: nasabah?.dusun || '',
          password: nasabahPassword,
          savedAt: new Date().toISOString()
        });
      }

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
      const { profile } = await signIn(cleanIdentifier, adminPassword);

      // Save account identity & password if checkbox is checked
      if (rememberAdmin) {
        saveAccount({
          nik: cleanIdentifier,
          fullName: profile.full_name || 'Pengurus',
          role: 'admin',
          password: adminPassword,
          savedAt: new Date().toISOString()
        });
      }

      navigate('/admin');
    } catch (err: any) {
      console.error('Admin login error:', err);
      setErrorMsg(err.message || 'Gagal masuk. Periksa NIK/ID dan kata sandi pengurus.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectSavedAccount = (account: SavedAccount) => {
    if (account.role === 'nasabah') {
      setNasabahNik(account.nik);
      setNasabahPassword(account.password || '');
      setActiveTab('nasabah');
    } else {
      setAdminIdentifier(account.nik);
      setAdminPassword(account.password || '');
      setActiveTab('admin');
    }
    setErrorMsg('');
  };

  const handleConfirmDelete = () => {
    if (!accountToDelete) return;
    removeAccount(accountToDelete.nik);
    refreshSavedAccounts();
    setAccountToDelete(null);
  };

  const currentSavedAccounts = activeTab === 'nasabah' ? savedNasabah : savedAdmin;

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
              </div>

              {/* Remember Account Checkbox */}
              <label className="flex items-start gap-2.5 cursor-pointer select-none group">
                <input
                  type="checkbox"
                  checked={rememberNasabah}
                  onChange={e => setRememberNasabah(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-pink-300 text-pink-600 focus:ring-pink-400 cursor-pointer accent-pink-600"
                />
                <div>
                  <p className="text-xs font-semibold text-slate-700 group-hover:text-pink-700 transition-colors">
                    Ingat akun & kata sandi di perangkat ini
                  </p>
                  <p className="text-[10px] text-slate-400 leading-tight">
                    Menyimpan NIK & PIN agar dapat masuk cepat di perangkat ini.
                  </p>
                </div>
              </label>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full justify-center shadow-md shadow-pink-200 mt-2"
                disabled={isLoading}
              >
                {isLoading ? 'Memverifikasi Data...' : 'Masuk ke Akun Nasabah →'}
              </Button>

              {/* Saved Accounts Section — Nasabah */}
              <SavedAccountsSection
                accounts={currentSavedAccounts}
                onSelect={handleSelectSavedAccount}
                onDelete={setAccountToDelete}
                roleLabel="Nasabah"
              />
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

              {/* Remember Account Checkbox */}
              <label className="flex items-start gap-2.5 cursor-pointer select-none group">
                <input
                  type="checkbox"
                  checked={rememberAdmin}
                  onChange={e => setRememberAdmin(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-slate-300 text-slate-800 focus:ring-slate-600 cursor-pointer accent-slate-800"
                />
                <div>
                  <p className="text-xs font-semibold text-slate-700 group-hover:text-slate-900 transition-colors">
                    Ingat akun & kata sandi di perangkat ini
                  </p>
                  <p className="text-[10px] text-slate-400 leading-tight">
                    Menyimpan NIK & password agar dapat masuk cepat di perangkat ini.
                  </p>
                </div>
              </label>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs shadow-md transition-colors flex items-center justify-center gap-1.5 cursor-pointer mt-2"
              >
                {isLoading ? 'Memverifikasi Pengurus...' : 'Masuk ke Panel Admin →'}
              </button>

              {/* Saved Accounts Section — Admin */}
              <SavedAccountsSection
                accounts={currentSavedAccounts}
                onSelect={handleSelectSavedAccount}
                onDelete={setAccountToDelete}
                roleLabel="Pengurus"
              />
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

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(accountToDelete)}
        onClose={() => setAccountToDelete(null)}
        title="Hapus Akun Tersimpan?"
        description="Akun ini akan dihapus dari daftar akun tersimpan di perangkat ini."
        maxWidth="sm"
      >
        {accountToDelete && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-2.5 text-xs">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold text-slate-800">
                  {accountToDelete.fullName}
                </p>
                <p className="text-slate-500 font-mono text-[11px]">
                  NIK: {accountToDelete.nik}
                  {accountToDelete.dusun && ` • ${accountToDelete.dusun}`}
                </p>
                <p className="text-amber-700 font-medium mt-1">
                  Akun ini hanya akan dihapus dari daftar cepat login perangkat ini. Akun database Anda tetap aman.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setAccountToDelete(null)}
              >
                Batal
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleConfirmDelete}
                className="bg-rose-600 hover:bg-rose-700 shadow-rose-200"
                icon={<Trash2 className="w-3.5 h-3.5" />}
              >
                Hapus dari Perangkat
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

// ============================================================================
// Saved Accounts Section (extracted sub-component)
// ============================================================================

interface SavedAccountsSectionProps {
  accounts: SavedAccount[];
  onSelect: (account: SavedAccount) => void;
  onDelete: (account: SavedAccount) => void;
  roleLabel: string;
}

const SavedAccountsSection: React.FC<SavedAccountsSectionProps> = ({
  accounts,
  onSelect,
  onDelete,
  roleLabel
}) => {
  return (
    <div className="pt-4 border-t border-slate-100 space-y-2.5">
      <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center flex items-center justify-center gap-1.5">
        <Bookmark className="w-3.5 h-3.5 text-pink-500" /> Akun {roleLabel} Tersimpan di Perangkat Ini
      </p>

      {accounts.length > 0 ? (
        <div className="space-y-1.5">
          {accounts.map(account => (
            <div
              key={account.nik}
              className="w-full p-2.5 rounded-xl bg-pink-50/60 hover:bg-pink-100/70 border border-pink-100 transition-colors flex items-center justify-between text-xs group"
            >
              <button
                type="button"
                onClick={() => onSelect(account)}
                className="flex-1 text-left cursor-pointer"
              >
                <div className="flex items-center gap-1.5">
                  <p className="font-bold text-slate-800 group-hover:text-pink-700 transition-colors">
                    {account.fullName}
                  </p>
                  {account.password && (
                    <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100/80 px-1.5 py-0.2 rounded">
                      PIN Siap
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-slate-500 font-mono">
                  NIK: {account.nik}
                  {account.dusun && ` • ${account.dusun}`}
                </p>
              </button>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(account);
                  }}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  title="Hapus akun tersimpan"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <span
                  onClick={() => onSelect(account)}
                  className="text-[10px] font-bold text-pink-600 bg-white px-2 py-0.5 rounded-md border border-pink-200 cursor-pointer hover:bg-pink-50 transition-colors"
                >
                  Pilih
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-3 px-4 rounded-xl bg-slate-50/60 border border-slate-100">
          <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
            Belum ada akun tersimpan.
            <br />
            Centang <strong>"Ingat akun & kata sandi"</strong> saat login untuk menyimpan akun Anda di perangkat ini.
          </p>
        </div>
      )}
    </div>
  );
};

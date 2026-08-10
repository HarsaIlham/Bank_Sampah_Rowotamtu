import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Home, 
  Tag, 
  BookOpen, 
  Calculator, 
  LayoutDashboard, 
  History, 
  Menu, 
  X, 
  Users, 
  PlusCircle, 
  FileText, 
  User, 
  HandCoins, 
  Info, 
  Settings as SettingsIcon,
  LogOut
} from 'lucide-react';
import logoBank from '../../assets/logo-bank.png';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { ConfirmLogoutModal } from '../common/ConfirmLogoutModal';

interface NavbarProps {
  onOpenCalculator?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCalculator }) => {
  const { currentRole, profile, nasabah, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-pink-100/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand Name */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-white p-1  border border-pink-100 flex items-center justify-center shadow-md shadow-pink-100 group-hover:scale-105 transition-transform overflow-hidden">
              <img src={logoBank} alt="Logo Bank Sampah Desa Rowotamtu" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg text-slate-800 tracking-tight">Bank Sampah</span>
                <span className="text-[#EC4899] font-bold text-xs bg-pink-100 px-2 py-0.5 rounded-full">Desa Rowotamtu</span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium">Buku Kas Digital KKN-K ROWOTAMTU</p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {currentRole === 'guest' && (
              <>
                <Link
                  to="/"
                  className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                    isActive('/') ? 'bg-pink-50 text-[#EC4899]' : 'text-slate-600 hover:text-[#EC4899] hover:bg-pink-50/50'
                  }`}
                >
                  <Home className="w-4 h-4" /> Beranda
                </Link>
                <Link
                  to="/katalog"
                  className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                    isActive('/katalog') ? 'bg-pink-50 text-[#EC4899]' : 'text-slate-600 hover:text-[#EC4899] hover:bg-pink-50/50'
                  }`}
                >
                  <Tag className="w-4 h-4" /> Jenis Sampah
                </Link>
                <Link
                  to="/edukasi"
                  className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                    isActive('/edukasi') ? 'bg-pink-50 text-[#EC4899]' : 'text-slate-600 hover:text-[#EC4899] hover:bg-pink-50/50'
                  }`}
                >
                  <BookOpen className="w-4 h-4" /> Edukasi & FAQ
                </Link>
                <Link
                  to="/tentang-kami"
                  className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                    isActive('/tentang-kami') ? 'bg-pink-50 text-[#EC4899]' : 'text-slate-600 hover:text-[#EC4899] hover:bg-pink-50/50'
                  }`}
                >
                  <Info className="w-4 h-4" /> Tentang Kami
                </Link>
                {onOpenCalculator && (
                  <button
                    onClick={onOpenCalculator}
                    className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-[#EC4899] hover:bg-pink-50/50 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Calculator className="w-4 h-4 text-pink-500" /> Kalkulator
                  </button>
                )}
              </>
            )}

            {currentRole === 'nasabah' && (
              <>
                <Link
                  to="/nasabah"
                  className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                    isActive('/nasabah') ? 'bg-pink-50 text-[#EC4899]' : 'text-slate-600 hover:text-[#EC4899]'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" /> Beranda
                </Link>
                <Link
                  to="/katalog"
                  className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                    isActive('/katalog') ? 'bg-pink-50 text-[#EC4899]' : 'text-slate-600 hover:text-[#EC4899]'
                  }`}
                >
                  <Tag className="w-4 h-4" /> Jenis Sampah
                </Link>
                <Link
                  to="/edukasi"
                  className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                    isActive('/edukasi') ? 'bg-pink-50 text-[#EC4899]' : 'text-slate-600 hover:text-[#EC4899]'
                  }`}
                >
                  <BookOpen className="w-4 h-4" /> Edukasi
                </Link>
                <Link
                  to="/nasabah/transaksi"
                  className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                    isActive('/nasabah/transaksi') ? 'bg-pink-50 text-[#EC4899]' : 'text-slate-600 hover:text-[#EC4899]'
                  }`}
                >
                  <History className="w-4 h-4" /> Riwayat Transaksi
                </Link>
                <Link
                  to="/tentang-kami"
                  className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                    isActive('/tentang-kami') ? 'bg-pink-50 text-[#EC4899]' : 'text-slate-600 hover:text-[#EC4899]'
                  }`}
                >
                  <Info className="w-4 h-4" /> Tentang Kami
                </Link>
                <Link
                  to="/nasabah/profil"
                  className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                    isActive('/nasabah/profil') ? 'bg-pink-50 text-[#EC4899]' : 'text-slate-600 hover:text-[#EC4899]'
                  }`}
                >
                  <User className="w-4 h-4" /> Profil & Password
                </Link>
              </>
            )}

            {currentRole === 'admin' && (
              <>
                <Link
                  to="/admin"
                  className={`px-2.5 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 ${
                    isActive('/admin') ? 'bg-pink-50 text-[#EC4899]' : 'text-slate-600 hover:text-[#EC4899]'
                  }`}
                >
                  <LayoutDashboard className="w-3.5 h-3.5" /> Beranda
                </Link>
                <Link
                  to="/admin/nasabah"
                  className={`px-2.5 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 ${
                    isActive('/admin/nasabah') ? 'bg-pink-50 text-[#EC4899]' : 'text-slate-600 hover:text-[#EC4899]'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" /> Nasabah
                </Link>
                <Link
                  to="/admin/harga"
                  className={`px-2.5 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 ${
                    isActive('/admin/harga') ? 'bg-pink-50 text-[#EC4899]' : 'text-slate-600 hover:text-[#EC4899]'
                  }`}
                >
                  <Tag className="w-3.5 h-3.5" /> Harga Sampah
                </Link>

                {/* PROMINENT ACTION BUTTONS: SETOR & PENARIKAN */}
                <Link
                  to="/admin/setor"
                  className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer ${
                    isActive('/admin/setor')
                      ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-md shadow-pink-200 ring-2 ring-pink-400 scale-105'
                      : 'bg-pink-100/90 text-pink-700 hover:bg-pink-600 hover:text-white hover:shadow-md'
                  }`}
                >
                  <PlusCircle className="w-4 h-4" /> Setor Sampah
                </Link>
                <Link
                  to="/admin/penarikan"
                  className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer ${
                    isActive('/admin/penarikan')
                      ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-white shadow-md shadow-amber-200 ring-2 ring-amber-400 scale-105'
                      : 'bg-amber-100/90 text-amber-800 hover:bg-amber-500 hover:text-white hover:shadow-md'
                  }`}
                >
                  <HandCoins className="w-4 h-4" /> Tarik Tunai
                </Link>

                <Link
                  to="/admin/laporan"
                  className={`px-2.5 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 ${
                    isActive('/admin/laporan') ? 'bg-pink-50 text-[#EC4899]' : 'text-slate-600 hover:text-[#EC4899]'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" /> Laporan
                </Link>
                <Link
                  to="/admin/pengaturan"
                  className={`px-2.5 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 ${
                    isActive('/admin/pengaturan') ? 'bg-pink-50 text-[#EC4899]' : 'text-slate-600 hover:text-[#EC4899]'
                  }`}
                >
                  <SettingsIcon className="w-3.5 h-3.5" /> Pengaturan
                </Link>
              </>
            )}
          </nav>

          {/* Action Buttons Right (Desktop) */}
          <div className="hidden md:flex items-center gap-3">
            {currentRole === 'guest' ? (
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate('/login')}
              >
                Masuk / Login
              </Button>
            ) : currentRole === 'nasabah' ? (
              <div className="flex items-center gap-3">
                <div className="text-right pl-2 border-l border-pink-200">
                  <p className="text-xs font-bold text-slate-800">{profile?.full_name}</p>
                  <p className="text-[10px] text-pink-600 font-mono font-semibold">NIK: {nasabah?.nik || '-'}</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  icon={<LogOut className="w-3.5 h-3.5 text-rose-500" />}
                  onClick={() => setShowLogoutConfirm(true)}
                  className="text-rose-600 border-rose-200 hover:bg-rose-50 font-bold cursor-pointer"
                >
                  Keluar
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Badge variant="rose" size="md" className="font-bold">
                  Admin: {profile?.full_name || 'Pengurus'}
                </Badge>
                <Button 
                  variant="outline" 
                  size="sm" 
                  icon={<LogOut className="w-3.5 h-3.5 text-rose-500" />}
                  onClick={() => setShowLogoutConfirm(true)}
                  className="text-rose-600 border-rose-200 hover:bg-rose-50 font-bold cursor-pointer"
                >
                  Keluar
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-pink-50 text-pink-700 hover:bg-pink-100 focus:outline-none cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-pink-100 px-4 pt-2 pb-5 space-y-2.5">
          {currentRole === 'guest' && (
            <>
              <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-pink-50">
                🏠 Beranda (Profile Desa)
              </Link>
              <Link to="/katalog" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-pink-50">
                🏷️ Jenis Sampah & Harga
              </Link>
              <Link to="/edukasi" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-pink-50">
                📖 Edukasi & FAQ
              </Link>
              <Link to="/tentang-kami" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-pink-50">
                ℹ️ Tentang Kami (Struktur Posko)
              </Link>
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2.5 rounded-xl text-sm font-bold text-pink-600 bg-pink-50 hover:bg-pink-100 text-center">
                🔑 Masuk ke Akun (Login)
              </Link>
            </>
          )}

          {currentRole === 'nasabah' && (
            <>
              <div className="p-3 bg-pink-50/70 rounded-2xl border border-pink-100 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-800">{profile?.full_name}</p>
                  <p className="text-[10px] text-pink-600 font-mono">NIK: {nasabah?.nik || '-'}</p>
                </div>
                <Badge variant="secondary" size="sm">Nasabah</Badge>
              </div>

              <Link to="/nasabah" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-pink-50">
                📊 Beranda Nasabah
              </Link>
              <Link to="/katalog" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-pink-50">
                🏷️ Jenis Sampah & Harga
              </Link>
              <Link to="/edukasi" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-pink-50">
                📖 Edukasi & FAQ
              </Link>
              <Link to="/nasabah/transaksi" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-pink-50">
                📜 Riwayat Transaksi
              </Link>
              <Link to="/tentang-kami" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-pink-50">
                ℹ️ Tentang Kami (Struktur Posko)
              </Link>
              <Link to="/nasabah/profil" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-pink-50">
                👤 Profil & Password
              </Link>

              <div className="pt-2 border-t border-slate-100">
                <button
                  onClick={() => { setMobileMenuOpen(false); setShowLogoutConfirm(true); }}
                  className="w-full flex items-center justify-center gap-2 p-3 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-extrabold text-xs transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" /> Keluar dari Akun Nasabah
                </button>
              </div>
            </>
          )}

          {currentRole === 'admin' && (
            <>
              {/* Admin Profile Info Card */}
              <div className="p-3 bg-pink-50/80 rounded-2xl border border-pink-100 flex items-center justify-between">
                <div>
                  <p className="text-xs font-extrabold text-slate-800">{profile?.full_name || 'Admin Posko'}</p>
                  <p className="text-[10px] text-pink-600 font-medium">Administrator Sesi Aktif</p>
                </div>
                <Badge variant="rose" size="sm">Admin</Badge>
              </div>

              {/* Primary Mobile Action Buttons for Admin */}
              <div className="grid grid-cols-2 gap-2 my-2 pt-1 pb-1">
                <Link
                  to="/admin/setor"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-3 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-600 text-white font-black text-xs flex flex-col items-center gap-1.5 shadow-md shadow-pink-200 text-center cursor-pointer"
                >
                  <PlusCircle className="w-5 h-5" />
                  <span>➕ Setor Sampah</span>
                </Link>
                <Link
                  to="/admin/penarikan"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-white font-black text-xs flex flex-col items-center gap-1.5 shadow-md shadow-amber-200 text-center cursor-pointer"
                >
                  <HandCoins className="w-5 h-5" />
                  <span>💸 Tarik Tunai</span>
                </Link>
              </div>

              <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-pink-50">
                ⚡ Beranda
              </Link>
              <Link to="/admin/nasabah" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-pink-50">
                👥 Nasabah
              </Link>
              <Link to="/admin/harga" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-pink-50">
                🏷️ Jenis Sampah & Harga
              </Link>
              <Link to="/admin/laporan" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-pink-50">
                📄 Laporan & Rekap
              </Link>
              <Link to="/admin/pengaturan" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-pink-50">
                ⚙️ Pengaturan Web
              </Link>

              {/* Dedicated Admin Logout Button in Drawer */}
              <div className="pt-2 border-t border-slate-100">
                <button
                  onClick={() => { setMobileMenuOpen(false); setShowLogoutConfirm(true); }}
                  className="w-full flex items-center justify-center gap-2 p-3 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-extrabold text-xs transition-colors cursor-pointer border border-rose-100"
                >
                  <LogOut className="w-4 h-4" /> Keluar dari Akun Admin
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmLogoutModal
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleSignOut}
        title="Konfirmasi Keluar Akun"
        message={`Apakah Anda yakin ingin keluar dari sesi ${currentRole === 'admin' ? 'Administrator' : 'Nasabah'}? Anda harus memasukkan kembali NIK dan password untuk login.`}
      />
    </header>
  );
};

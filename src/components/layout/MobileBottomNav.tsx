import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Home, 
  Tag, 
  BookOpen, 
  LayoutDashboard, 
  History, 
  User, 
  Users, 
  PlusCircle, 
  HandCoins, 
  FileText,
  Info,
  Settings as SettingsIcon
} from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const { currentRole } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-pink-100 shadow-lg px-1 py-1.5 flex items-center justify-around">
      {currentRole === 'guest' && (
        <>
          <Link
            to="/"
            className={`flex flex-col items-center gap-1 p-2 rounded-xl text-[11px] font-medium transition-colors ${
              isActive('/') ? 'text-[#EC4899] font-bold' : 'text-slate-500'
            }`}
          >
            <Home className="w-5 h-5" />
            <span>Beranda</span>
          </Link>
          <Link
            to="/katalog"
            className={`flex flex-col items-center gap-1 p-2 rounded-xl text-[11px] font-medium transition-colors ${
              isActive('/katalog') ? 'text-[#EC4899] font-bold' : 'text-slate-500'
            }`}
          >
            <Tag className="w-5 h-5" />
            <span>Jenis Sampah</span>
          </Link>
          <Link
            to="/edukasi"
            className={`flex flex-col items-center gap-1 p-2 rounded-xl text-[11px] font-medium transition-colors ${
              isActive('/edukasi') ? 'text-[#EC4899] font-bold' : 'text-slate-500'
            }`}
          >
            <BookOpen className="w-5 h-5" />
            <span>Edukasi</span>
          </Link>
          <Link
            to="/tentang-kami"
            className={`flex flex-col items-center gap-1 p-2 rounded-xl text-[11px] font-medium transition-colors ${
              isActive('/tentang-kami') ? 'text-[#EC4899] font-bold' : 'text-slate-500'
            }`}
          >
            <Info className="w-5 h-5" />
            <span>Tentang</span>
          </Link>
        </>
      )}

      {currentRole === 'nasabah' && (
        <>
          <Link
            to="/nasabah"
            className={`flex flex-col items-center gap-1 p-1.5 rounded-xl text-[10px] font-medium transition-colors ${
              isActive('/nasabah') ? 'text-[#EC4899] font-bold' : 'text-slate-500'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Beranda</span>
          </Link>
          <Link
            to="/katalog"
            className={`flex flex-col items-center gap-1 p-1.5 rounded-xl text-[10px] font-medium transition-colors ${
              isActive('/katalog') ? 'text-[#EC4899] font-bold' : 'text-slate-500'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>Harga</span>
          </Link>
          <Link
            to="/edukasi"
            className={`flex flex-col items-center gap-1 p-1.5 rounded-xl text-[10px] font-medium transition-colors ${
              isActive('/edukasi') ? 'text-[#EC4899] font-bold' : 'text-slate-500'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Edukasi</span>
          </Link>
          <Link
            to="/nasabah/transaksi"
            className={`flex flex-col items-center gap-1 p-1.5 rounded-xl text-[10px] font-medium transition-colors ${
              isActive('/nasabah/transaksi') ? 'text-[#EC4899] font-bold' : 'text-slate-500'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Riwayat</span>
          </Link>
          <Link
            to="/nasabah/profil"
            className={`flex flex-col items-center gap-1 p-1.5 rounded-xl text-[10px] font-medium transition-colors ${
              isActive('/nasabah/profil') ? 'text-[#EC4899] font-bold' : 'text-slate-500'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profil</span>
          </Link>
        </>
      )}

      {currentRole === 'admin' && (
        <>
          <Link
            to="/admin"
            className={`flex flex-col items-center gap-0.5 p-1 rounded-xl text-[10px] font-medium transition-colors ${
              isActive('/admin') ? 'text-[#EC4899] font-bold' : 'text-slate-500'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Beranda</span>
          </Link>
          <Link
            to="/admin/nasabah"
            className={`flex flex-col items-center gap-0.5 p-1 rounded-xl text-[10px] font-medium transition-colors ${
              isActive('/admin/nasabah') ? 'text-[#EC4899] font-bold' : 'text-slate-500'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Nasabah</span>
          </Link>

          {/* PRIMARY FLOATING ACTION BUTTONS */}
          <Link
            to="/admin/setor"
            className={`flex flex-col items-center justify-center -mt-4 px-2.5 py-1.5 rounded-2xl transition-all shadow-md cursor-pointer ${
              isActive('/admin/setor')
                ? 'bg-gradient-to-tr from-pink-600 to-rose-500 text-white scale-110 shadow-pink-300 ring-2 ring-pink-200 font-black'
                : 'bg-pink-500 text-white shadow-pink-200 hover:scale-105 font-bold'
            }`}
          >
            <PlusCircle className="w-5 h-5" />
            <span className="text-[10px] tracking-tight">Setor</span>
          </Link>

          <Link
            to="/admin/penarikan"
            className={`flex flex-col items-center justify-center -mt-4 px-2.5 py-1.5 rounded-2xl transition-all shadow-md cursor-pointer ${
              isActive('/admin/penarikan')
                ? 'bg-gradient-to-tr from-amber-600 to-amber-500 text-white scale-110 shadow-amber-300 ring-2 ring-amber-200 font-black'
                : 'bg-amber-500 text-white shadow-amber-200 hover:scale-105 font-bold'
            }`}
          >
            <HandCoins className="w-5 h-5" />
            <span className="text-[10px] tracking-tight">Tarik</span>
          </Link>

          <Link
            to="/admin/laporan"
            className={`flex flex-col items-center gap-0.5 p-1 rounded-xl text-[10px] font-medium transition-colors ${
              isActive('/admin/laporan') ? 'text-[#EC4899] font-bold' : 'text-slate-500'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Laporan</span>
          </Link>
          <Link
            to="/admin/pengaturan"
            className={`flex flex-col items-center gap-0.5 p-1 rounded-xl text-[10px] font-medium transition-colors ${
              isActive('/admin/pengaturan') ? 'text-[#EC4899] font-bold' : 'text-slate-500'
            }`}
          >
            <SettingsIcon className="w-4 h-4" />
            <span>Setting</span>
          </Link>
        </>
      )}
    </nav>
  );
};

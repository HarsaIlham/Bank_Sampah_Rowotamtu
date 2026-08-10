import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { User, Lock, Phone, MapPin, CheckCircle, LogOut } from 'lucide-react';
import confetti from 'canvas-confetti';

export const NasabahProfilePage: React.FC = () => {
  const { profile, nasabah, signOut } = useAuth();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  if (!profile || !nasabah) return null;

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await signOut();
      navigate('/login', { replace: true });
    } catch (err) {
      console.error('Error logging out:', err);
    } finally {
      setLoggingOut(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (newPassword.length < 6) {
      setError('Password baru minimal 6 karakter');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Konfirmasi password baru tidak cocok');
      return;
    }

    try {
      setLoading(true);
      const { error: updateErr } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (updateErr) throw updateErr;

      setSuccessMsg('Kata sandi berhasil diperbarui!');
      setNewPassword('');
      setConfirmPassword('');
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    } catch (err: any) {
      setError(err.message || 'Gagal memperbarui kata sandi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* Header with Logout Button */}
      <div className="bg-white p-6 rounded-3xl border border-pink-100 shadow-xs flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <img
            src={profile.photo_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nasabah'}
            alt={profile.full_name}
            className="w-16 h-16 rounded-2xl border-2 border-pink-200 bg-pink-50 object-cover shrink-0"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-slate-800">{profile.full_name}</h1>
              <Badge variant="pink" size="sm">NIK: {nasabah.nik}</Badge>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Dusun {nasabah.dusun || 'Rowotamtu'} • RT/RW {nasabah.rt_rw || '01/01'}
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          size="md"
          onClick={handleLogout}
          disabled={loggingOut}
          className="border-rose-200 text-rose-600 hover:bg-rose-50 hover:border-rose-300 font-bold flex items-center gap-2 cursor-pointer"
        >
          <LogOut className="w-4 h-4 text-rose-500" />
          {loggingOut ? 'Keluar...' : 'Keluar / Logout'}
        </Button>
      </div>

      {/* Profile Details Card */}
      <Card className="p-6 space-y-4">
        <h3 className="text-base font-bold text-slate-800 flex items-center gap-2 border-b border-pink-100 pb-3">
          <User className="w-5 h-5 text-pink-600" /> Informasi Data Akun Nasabah
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1 bg-pink-50/50 p-3 rounded-xl border border-pink-100">
            <p className="text-[10px] text-slate-400 font-bold uppercase">NIK (NOMOR INDUK KEPENDUDUKAN)</p>
            <p className="font-mono font-extrabold text-pink-600 text-sm">{nasabah.nik}</p>
          </div>

          <div className="space-y-1 bg-pink-50/50 p-3 rounded-xl border border-pink-100">
            <p className="text-[10px] text-slate-400 font-bold uppercase">NOMOR TELEPON / WHATSAPP</p>
            <p className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-pink-500" /> {profile.phone || '-'}
            </p>
          </div>

          <div className="sm:col-span-2 space-y-1 bg-pink-50/50 p-3 rounded-xl border border-pink-100">
            <p className="text-[10px] text-slate-400 font-bold uppercase">ALAMAT TERDAFTAR</p>
            <p className="font-semibold text-slate-800 text-xs flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-pink-500" /> {nasabah.address || '-'}
            </p>
          </div>
        </div>
      </Card>

      {/* Change Password Card */}
      <Card className="p-6 space-y-4">
        <h3 className="text-base font-bold text-slate-800 flex items-center gap-2 border-b border-pink-100 pb-3">
          <Lock className="w-5 h-5 text-pink-600" /> Ubah Password Akun
        </h3>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" /> {successMsg}
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
          <Input
            label="Password Baru"
            type="password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            placeholder="Minimal 6 karakter"
            required
          />

          <Input
            label="Konfirmasi Password Baru"
            type="password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            placeholder="Ulangi password baru"
            required
          />

          <Button type="submit" variant="primary" size="md" className="font-bold" disabled={loading}>
            {loading ? 'Menyimpan...' : 'Simpan Password Baru'}
          </Button>
        </form>
      </Card>

      {/* Bottom Logout Card */}
      <Card className="p-6 border-rose-100 bg-rose-50/30 flex items-center justify-between gap-4">
        <div>
          <h4 className="font-bold text-slate-800 text-sm">Ingin Keluar Dari Akun Ini?</h4>
          <p className="text-xs text-slate-500 mt-0.5">
            Sesi autentikasi Anda akan dihapus secara bersih dari browser ini.
          </p>
        </div>
        <Button
          variant="outline"
          size="md"
          onClick={handleLogout}
          disabled={loggingOut}
          className="border-rose-300 text-rose-700 hover:bg-rose-100 font-bold shrink-0 flex items-center gap-2 cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          {loggingOut ? 'Keluar...' : 'Logout Akun'}
        </Button>
      </Card>

    </div>
  );
};

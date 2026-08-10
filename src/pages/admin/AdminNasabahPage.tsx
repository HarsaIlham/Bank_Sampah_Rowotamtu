import React, { useState } from 'react';
import { useNasabahSummaries, useCreateNasabah } from '../../hooks/useAppQueries';
import { formatRupiah, formatWeight } from '../../lib/utils';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { DUSUN_ROWOTAMTU } from '../../types';
import { Search, UserPlus, Phone, MapPin, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export const AdminNasabahPage: React.FC = () => {
  const { data: users = [], isLoading: loading } = useNasabahSummaries();
  const createNasabahMutation = useCreateNasabah();

  const [search, setSearch] = useState<string>('');
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Form states for new Nasabah
  const [name, setName] = useState('');
  const [nik, setNik] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('123456');
  const [dusun, setDusun] = useState<string>(DUSUN_ROWOTAMTU[0]);
  const [rtRw, setRtRw] = useState('01/01');
  const [address, setAddress] = useState('');

  const submitting = createNasabahMutation.isPending;

  const filteredUsers = users.filter(u => 
    u.full_name.toLowerCase().includes(search.toLowerCase()) ||
    u.nik.toLowerCase().includes(search.toLowerCase()) ||
    (u.dusun || '').toLowerCase().includes(search.toLowerCase())
  );

  const handleAddNasabah = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanNik = nik.trim();
    if (cleanNik.length < 16) {
      setErrorMsg('NIK harus 16 digit angka');
      return;
    }

    try {
      await createNasabahMutation.mutateAsync({
        nik: cleanNik,
        full_name: name,
        phone,
        password,
        dusun,
        rt_rw: rtRw,
        address: address || `Dusun ${dusun}, RT ${rtRw}`
      });

      setIsAddModalOpen(false);

      // Reset form
      setName('');
      setNik('');
      setPhone('');
      setPassword('123456');
      setDusun(DUSUN_ROWOTAMTU[0]);
      setRtRw('01/01');
      setAddress('');

      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    } catch (err: any) {
      console.error('Error creating nasabah:', err);
      setErrorMsg(err.message || 'Gagal meregistrasi nasabah');
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-pink-100 shadow-xs">
        <div>
          <Badge variant="pink" size="md">MANAJEMEN ANGGOTA DESA</Badge>
          <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight mt-1">
            Data Akun Nasabah Bank Sampah
          </h1>
          <p className="text-xs text-slate-500">
            Daftar warga Desa Rowotamtu yang terdaftar menggunakan NIK (Nomor Induk Kependudukan).
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          icon={<UserPlus className="w-4 h-4" />}
          onClick={() => setIsAddModalOpen(true)}
          className="cursor-pointer"
        >
          + Registrasi Nasabah Baru
        </Button>
      </div>

      {/* Search */}
      <div className="w-full sm:w-80">
        <Input
          placeholder="Cari nama atau NIK warga..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          icon={<Search className="w-4 h-4 text-slate-400" />}
        />
      </div>

      {/* Users Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[250px] gap-3 text-pink-600">
          <Loader2 className="w-8 h-8 animate-spin" />
          <p className="text-xs font-semibold text-slate-600">Memuat data nasabah...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredUsers.map(user => (
            <Card key={user.id} hoverable className="p-5 flex items-start justify-between gap-4 border-pink-100">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <img
                    src={user.photo_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nasabah'}
                    alt={user.full_name}
                    className="w-10 h-10 rounded-full border border-pink-200 bg-pink-50 shrink-0"
                  />
                  <div>
                    <h3 className="font-bold text-slate-800 text-base">{user.full_name}</h3>
                    <span className="text-xs font-mono font-bold text-pink-600 bg-pink-100 px-2 py-0.5 rounded-md">
                      NIK: {user.nik}
                    </span>
                  </div>
                </div>

                <div className="space-y-1 text-xs text-slate-500 pt-1">
                  <p className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-pink-500" /> {user.phone || '-'}</p>
                  <p className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-pink-500" /> {user.address || '-'}</p>
                </div>
              </div>

              <div className="text-right space-y-1 bg-pink-50/50 p-3 rounded-xl border border-pink-100 shrink-0">
                <p className="text-[10px] text-slate-400 uppercase font-semibold">SALDO TABUNGAN</p>
                <p className="text-base font-extrabold text-pink-600">{formatRupiah(user.balance)}</p>
                <p className="text-[11px] text-slate-500 font-semibold">{formatWeight(user.total_kg)} disetor</p>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal Add Nasabah */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="➕ Registrasi Akun Nasabah Baru"
        description="Daftarkan warga Desa Rowotamtu berdasarkan NIK (Nomor Induk Kependudukan)"
        maxWidth="md"
      >
        <form onSubmit={handleAddNasabah} className="space-y-4 text-xs">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          <Input
            label="NAMA LENGKAP WARGA"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Cth: Ibu Heni Suhartini"
            required
          />

          <Input
            label="NIK (16 DIGIT NOMOR INDUK KEPENDUDUKAN)"
            value={nik}
            onChange={e => setNik(e.target.value)}
            placeholder="Cth: 3213015408850001"
            maxLength={16}
            required
          />

          <Input
            label="KATA SANDI AWAL (DEFAULT: 123456)"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Default 123456"
            required
          />

          <Input
            label="NOMOR WHATSAPP / TELEPON"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            placeholder="Cth: 081234567890"
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">DUSUN</label>
              <select
                value={dusun}
                onChange={e => setDusun(e.target.value)}
                className="w-full bg-white border border-pink-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:ring-2 focus:ring-pink-400 focus:outline-none"
              >
                {DUSUN_ROWOTAMTU.map(item => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </div>

            <Input
              label="RT / RW"
              value={rtRw}
              onChange={e => setRtRw(e.target.value)}
              placeholder="02/01"
              required
            />
          </div>

          <Input
            label="ALAMAT LENGKAP RUMAH"
            value={address}
            onChange={e => setAddress(e.target.value)}
            placeholder="Cth: Dusun Rowotamtu Mekar, Dekat Pos Ronda RT 02"
          />

          <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
            <Button variant="ghost" size="sm" type="button" onClick={() => setIsAddModalOpen(false)}>
              Batal
            </Button>
            <Button variant="primary" size="sm" type="submit" disabled={submitting}>
              {submitting ? 'Menyimpan...' : 'Simpan & Terbitkan Rekening NIK'}
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
};

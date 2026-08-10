import React from 'react';
import { useSettings } from '../../context/SettingsContext';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { 
  Award, 
  Crown, 
  UserCheck, 
  FileText, 
  Wallet, 
  Scale, 
  Megaphone, 
  Sparkles, 
  Heart, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  Building2,
} from 'lucide-react';

interface TreeNodeProps {
  title: string;
  name: string;
  role: string;
  badge: string;
  badgeVariant?: 'pink' | 'secondary' | 'rose' | 'outline';
  icon: React.ReactNode;
  responsibilities?: string[];
  isTop?: boolean;
}

const TreeNode: React.FC<TreeNodeProps> = ({
  title,
  name,
  role,
  badge,
  badgeVariant = 'pink',
  icon,
  responsibilities,
  isTop = false
}) => {
  return (
    <div className="relative group w-full max-w-sm mx-auto">
      <Card 
        hoverable 
        className={`p-5 space-y-3 border-pink-200/80 bg-white/95 backdrop-blur-xs relative overflow-hidden transition-all duration-300 ${
          isTop 
            ? 'ring-2 ring-pink-400 shadow-md bg-gradient-to-b from-pink-50/80 to-white' 
            : 'shadow-xs hover:shadow-md hover:-translate-y-1'
        }`}
      >
        {/* Decorative Top Accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-400 via-rose-500 to-pink-500" />

        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 text-white flex items-center justify-center font-bold shadow-md shadow-pink-200 shrink-0">
              {icon}
            </div>
            <div>
              <p className="text-[10px] font-bold text-pink-600 uppercase tracking-wider">{title}</p>
              <h3 className="text-sm font-extrabold text-slate-800 tracking-tight">{name}</h3>
            </div>
          </div>
          <Badge variant={badgeVariant} size="sm" className="font-bold text-[10px] shrink-0">
            {badge}
          </Badge>
        </div>

        <p className="text-[11px] font-semibold text-slate-500 bg-pink-50/60 px-2.5 py-1 rounded-lg border border-pink-100/50">
          {role}
        </p>

        {responsibilities && responsibilities.length > 0 && (
          <div className="pt-2 border-t border-slate-100 space-y-1">
            {responsibilities.map((resp, idx) => (
              <p key={idx} className="text-[11px] text-slate-600 flex items-start gap-1.5 leading-snug">
                <CheckCircle2 className="w-3 h-3 text-pink-500 shrink-0 mt-0.5" />
                <span>{resp}</span>
              </p>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export const AboutUsPage: React.FC = () => {
  const { settings } = useSettings();
  const rawPhone = (settings?.phone || '081234567890').replace(/\D/g, '');
  const waPhone = rawPhone.startsWith('0') ? `62${rawPhone.slice(1)}` : rawPhone;
  const operatingDays = settings?.operating_hours?.days || 'Senin - Sabtu';
  const operatingHours = settings?.operating_hours?.hours || '08.00 - 15.00 WIB';

  return (
    <div className="space-y-12 max-w-6xl mx-auto py-2 md:py-6">
      
      {/* Hero Header */}
      <div className="relative bg-gradient-to-br from-pink-500 via-pink-600 to-rose-700 text-white p-8 md:p-12 rounded-3xl shadow-xl overflow-hidden space-y-4 text-center md:text-left">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute right-1/4 -top-10 w-48 h-48 bg-amber-300/20 rounded-full blur-xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-3">
          <Badge variant="secondary" size="md" className="bg-white/20 text-white border-white/30 tracking-wider">
            STRUKTUR ORGANISASI POSKO & PROFIL
          </Badge>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
            Bank Sampah Digital Desa Rowotamtu
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-pink-100 leading-relaxed">
            Struktur kepengurusan resmi Bank Sampah KKN-K ROWOTAMTU 2026 yang mengelola operasional penimbangan, transparansi keuangan digital, serta edukasi kebersihan lingkungan warga.
          </p>
        </div>
      </div>

      {/* Visi & Misi Section */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <Badge variant="pink" size="sm" className="font-bold">LANDASAN UTAMA</Badge>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">Visi & Misi Program</h2>
          <p className="text-xs text-slate-500">Komitmen kami untuk mewujudkan Desa Rowotamtu yang asri, sehat, dan sejahtera.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 space-y-3 border-pink-100 bg-gradient-to-br from-white to-pink-50/40">
            <div className="w-10 h-10 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base font-extrabold text-slate-800">Visi Utama</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              "Terwujudnya Desa Rowotamtu yang bersih, bebas dari tumpukan sampah liar, serta mandiri secara ekonomi melalui inovasi digitalisasi tabungan sampah."
            </p>
          </Card>

          <Card className="p-6 space-y-3 border-pink-100 bg-gradient-to-br from-white to-pink-50/40">
            <div className="w-10 h-10 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-base font-extrabold text-slate-800">Transparansi Digital</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Menyediakan sistem pencatatan saldo tabungan berbasis NIK yang transparan, mudah diakses kapan saja, dan terintegrasi secara realtime di posko desa.
            </p>
          </Card>

          <Card className="p-6 space-y-3 border-pink-100 bg-gradient-to-br from-white to-pink-50/40">
            <div className="w-10 h-10 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center font-bold">
              <Heart className="w-5 h-5" />
            </div>
            <h3 className="text-base font-extrabold text-slate-800">Pemberdayaan Warga</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Mengubah persepsi sampah menjadi komoditas bernilai ekonomi yang mendukung pendapatan harian dan kesejahteraan keluarga warga desa.
            </p>
          </Card>
        </div>
      </section>

      {/* Organization Tree Structure Section */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <Badge variant="pink" size="sm" className="font-bold">BAGAN POHON ORGANISASI</Badge>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">Struktur Kepengurusan Bank Sampah</h2>
          <p className="text-xs text-slate-500">Hierarki kepemimpinan dan pembagian tugas dari Penasihat hingga Divisi Pelaksana Posko.</p>
        </div>

        {/* Tree Container */}
        <div className="bg-gradient-to-b from-pink-50/50 via-white to-pink-50/30 p-6 md:p-10 rounded-3xl border border-pink-100 shadow-sm space-y-8 relative overflow-hidden">
          
          {/* LEVEL 0: Pelindung & Penasihat */}
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="h-px w-12 bg-pink-300" />
              <span className="text-[11px] font-extrabold text-pink-600 uppercase tracking-widest bg-pink-100/80 px-3 py-1 rounded-full">
                1. Pelindung & Penasihat
              </span>
              <span className="h-px w-12 bg-pink-300" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              <TreeNode
                title="Pelindung Wilayah"
                name="Kepala Desa Rowotamtu"
                role="Pemerintah Desa Rowotamtu"
                badge="Pengarah Utama"
                badgeVariant="rose"
                icon={<Building2 className="w-5 h-5" />}
                responsibilities={[
                  'Pelindung regulasi desa & pengarah program.',
                  'Fasilitator sarana posko di Balai Desa.'
                ]}
              />

              <TreeNode
                title="Dosen Pembimbing Lapangan"
                name="DPL KKN-K ROWOTAMTU"
                role="Civitas Akademika"
                badge="Pembimbing Lapangan"
                badgeVariant="rose"
                icon={<Award className="w-5 h-5" />}
                responsibilities={[
                  'Pembimbing teknis kerja mahasiswa KKN.',
                  'Evaluator dampak sosial & keberlanjutan.'
                ]}
              />
            </div>
          </div>

          {/* Connector Down to Leadership */}
          <div className="flex flex-col items-center justify-center">
            <div className="w-0.5 h-8 bg-gradient-to-b from-pink-300 to-pink-500" />
            <div className="w-3 h-3 rounded-full bg-pink-500 ring-4 ring-pink-100" />
          </div>

          {/* LEVEL 1: Ketua & Wakil Ketua */}
          <div className="space-y-6">
            <div className="flex items-center justify-center gap-2">
              <span className="h-px w-12 bg-pink-300" />
              <span className="text-[11px] font-extrabold text-pink-600 uppercase tracking-widest bg-pink-100/80 px-3 py-1 rounded-full">
                2. Pimpinan Posko (Ketua & Wakil)
              </span>
              <span className="h-px w-12 bg-pink-300" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              <TreeNode
                isTop
                title="Ketua Bank Sampah"
                name="Kordes Tim KKN-K ROWOTAMTU"
                role="Koordinator Utama Posko"
                badge="Ketua Umum"
                badgeVariant="pink"
                icon={<Crown className="w-5 h-5" />}
                responsibilities={[
                  'Penanggung jawab utama operasional bank sampah.',
                  'Memonitor aliran kas & koordinasi dengan pihak desa.'
                ]}
              />

              <TreeNode
                isTop
                title="Wakil Ketua Bank Sampah"
                name="Wakordes KKN-K ROWOTAMTU"
                role="Wakil Koordinator Posko"
                badge="Wakil Ketua"
                badgeVariant="pink"
                icon={<UserCheck className="w-5 h-5" />}
                responsibilities={[
                  'Mendampingi Ketua dalam pengawasan divisi.',
                  'Penanggung jawab operasional harian penimbangan.'
                ]}
              />
            </div>
          </div>

          {/* Branching Lines from Leadership to Secretary & Treasurer */}
          <div className="relative max-w-4xl mx-auto hidden md:block">
            <div className="flex flex-col items-center">
              <div className="w-0.5 h-6 bg-pink-400" />
              <div className="w-3/4 h-0.5 bg-pink-400 border-t border-pink-400" />
            </div>
            <div className="flex justify-between w-3/4 mx-auto">
              <div className="w-0.5 h-6 bg-pink-400" />
              <div className="w-0.5 h-6 bg-pink-400" />
            </div>
          </div>

          {/* LEVEL 2: Sekretaris & Bendahara */}
          <div className="space-y-6">
            <div className="flex items-center justify-center gap-2">
              <span className="h-px w-12 bg-pink-300" />
              <span className="text-[11px] font-extrabold text-pink-600 uppercase tracking-widest bg-pink-100/80 px-3 py-1 rounded-full">
                3. Pengurus Inti (Sekretaris & Bendahara)
              </span>
              <span className="h-px w-12 bg-pink-300" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              <TreeNode
                title="Sekretaris Bank Sampah"
                name="Divisi Administrasi & IT"
                role="Pengelola Data Digital NIK"
                badge="Sekretaris"
                badgeVariant="secondary"
                icon={<FileText className="w-5 h-5 text-pink-600" />}
                responsibilities={[
                  'Pencatatan data nasabah & input transaksi digital.',
                  'Penyusunan rekapitulasi laporan berkala posko.'
                ]}
              />

              <TreeNode
                title="Bendahara Bank Sampah"
                name="Divisi Keuangan Posko"
                role="Pengelola Kas & Saldo Warga"
                badge="Bendahara"
                badgeVariant="secondary"
                icon={<Wallet className="w-5 h-5 text-pink-600" />}
                responsibilities={[
                  'Pengelolaan arus kas masuk & penarikan tunai.',
                  'Verifikasi pembayaran fisik saldo simpanan nasabah.'
                ]}
              />
            </div>
          </div>

          {/* Branching Lines to Operational Divisions */}
          <div className="relative max-w-4xl mx-auto hidden md:block">
            <div className="flex flex-col items-center">
              <div className="w-0.5 h-6 bg-pink-400" />
              <div className="w-3/4 h-0.5 bg-pink-400 border-t border-pink-400" />
            </div>
            <div className="flex justify-between w-3/4 mx-auto">
              <div className="w-0.5 h-6 bg-pink-400" />
              <div className="w-0.5 h-6 bg-pink-400" />
            </div>
          </div>

          {/* LEVEL 3: Divisi Pelaksana Lapangan */}
          <div className="space-y-6">
            <div className="flex items-center justify-center gap-2">
              <span className="h-px w-12 bg-pink-300" />
              <span className="text-[11px] font-extrabold text-pink-600 uppercase tracking-widest bg-pink-100/80 px-3 py-1 rounded-full">
                4. Divisi Pelaksana Lapangan Posko
              </span>
              <span className="h-px w-12 bg-pink-300" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              <TreeNode
                title="Divisi Penimbangan & Sortir"
                name="Tim Operasional Penimbangan"
                role="Pemeriksa & Timbangan Sampah"
                badge="Div. Penimbangan"
                icon={<Scale className="w-5 h-5 text-pink-600" />}
                responsibilities={[
                  'Memeriksa kebersihan & jenis kategori sampah.',
                  'Penimbangan fisik sampah terpilah di posko.'
                ]}
              />

              <TreeNode
                title="Divisi Edukasi & Logistik"
                name="Tim Penyuluhan & Mitrasip"
                role="Sosialisasi & Pengangkutan"
                badge="Div. Humas & Logistik"
                icon={<Megaphone className="w-5 h-5 text-pink-600" />}
                responsibilities={[
                  'Penyuluhan pemilahan sampah ke rumah tangga RT/RW.',
                  'Koordinasi pengangkutan daur ulang ke pengepul.'
                ]}
              />
            </div>
          </div>

        </div>
      </section>

      {/* Operational Posko Location */}
      <section className="bg-white p-8 rounded-3xl border border-pink-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <Badge variant="pink" size="sm">LOKASI POSKO UTAMA</Badge>
          <h3 className="text-xl font-extrabold text-slate-800">Kunjungi Posko {settings?.bank_name || 'Bank Sampah Desa Rowotamtu'}</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Ingin menyetorkan sampah, membuka rekening tabungan baru, atau bertanya seputar jadwal penimbangan di dusun Anda? Kunjungi posko utama kami.
          </p>
          <div className="pt-2 space-y-1.5 text-xs font-semibold text-slate-700">
            <p className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-pink-600 shrink-0" /> {settings?.address || 'Balai Desa Rowotamtu / Posko KKN-K Dusun 01 RT 02 RW 01'}
            </p>
            <p className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-pink-600 shrink-0" /> Jam Buka: {operatingDays} ({operatingHours})
            </p>
          </div>
        </div>

        <div className="w-full md:w-auto shrink-0">
          <a
            href={`https://wa.me/${waPhone}?text=Halo%20Pengurus%20Bank%20Sampah,%20saya%20ingin%20bertanya%20seputar%20tabungan%20sampah`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
          >
            💬 Hubungi Pengurus Via WhatsApp
          </a>
        </div>
      </section>

    </div>
  );
};

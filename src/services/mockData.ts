import type { WasteCategory, UserProfile, DepositTransaction, WithdrawalTransaction, EducationalArticle } from '../types';

export const INITIAL_WASTE_CATEGORIES: WasteCategory[] = [
  {
    id: 'cat-1',
    name: 'Botol Plastik Bening (PET)',
    group: 'plastik',
    pricePerKg: 3500,
    unit: 'kg',
    description: 'Botol air mineral bersih, tanpa tutup & label dicopot.',
    tips: 'Bilas bersih dan remukkan botol untuk efisiensi wadah.'
  },
  {
    id: 'cat-2',
    name: 'Plastik HD / Emberan',
    group: 'plastik',
    pricePerKg: 2500,
    unit: 'kg',
    description: 'Ember bekas, gayung, baskom, dan mainan plastik keras.',
    tips: 'Bersihkan sisa tanah atau oli.'
  },
  {
    id: 'cat-3',
    name: 'Kardus Bekas (Gelombang)',
    group: 'kertas',
    pricePerKg: 2000,
    unit: 'kg',
    description: 'Kardus cokelat kemasan, dipipihkan dan dikikat rapi.',
    tips: 'Keringkan jika basah, copot lakban berlebih.'
  },
  {
    id: 'cat-4',
    name: 'Kertas HVS / Buku / Majalah',
    group: 'kertas',
    pricePerKg: 2800,
    unit: 'kg',
    description: 'Kertas dokumen, HVS bekas print, buku pelajaran.',
    tips: 'Pisahkan kertas polos hvs dan kertas berminyak.'
  },
  {
    id: 'cat-5',
    name: 'Kaleng Alumunium Minuman',
    group: 'logam',
    pricePerKg: 13000,
    unit: 'kg',
    description: 'Kaleng minuman ringan alumunium.',
    tips: 'Pipihkan kaleng untuk efisiensi timbangan.'
  },
  {
    id: 'cat-6',
    name: 'Besi Padat / Seng Bekas',
    group: 'logam',
    pricePerKg: 4500,
    unit: 'kg',
    description: 'Pipa besi, paku, potongan atap seng.',
    tips: 'Bersihkan dari kotoran semen atau cat keras.'
  },
  {
    id: 'cat-7',
    name: 'Botol Kaca Bening / Kecap',
    group: 'kaca',
    pricePerKg: 1200,
    unit: 'kg',
    description: 'Botol utuh sirup, kecap, atau selai kaca.',
    tips: 'Pastikan botol tidak retak atau pecah.'
  },
  {
    id: 'cat-8',
    name: 'Minyak Jelantah (UCO)',
    group: 'minyak',
    pricePerKg: 6000,
    unit: 'liter',
    description: 'Minyak goreng bekas pakai rumah tangga dalam botol/jerigen.',
    tips: 'Saring ampas gorengan sebelum ditaruh botol.'
  }
];

export const INITIAL_USERS: UserProfile[] = [
  {
    id: 'usr-admin',
    name: 'Pengurus KKN-K ROWOTAMTU',
    phone: '081234567890',
    address: 'Posko Utama KKN-K ROWOTAMTU, Dusun 01 RT 02 / RW 01',
    nik: '3213010101950001',
    role: 'admin',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    createdAt: '2026-07-01'
  },
  {
    id: 'usr-nasabah-1',
    name: 'Ibu Siti Aminah',
    phone: '085712345678',
    address: 'Dusun Rowotamtu Mekar, RT 03 / RW 01',
    rtRw: '03/01',
    dusun: 'Rowotamtu Mekar',
    nik: '3213015408850001',
    role: 'nasabah',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=250',
    createdAt: '2026-07-10'
  },
  {
    id: 'usr-nasabah-2',
    name: 'Pak Budi Santoso',
    phone: '081987654321',
    address: 'Dusun Rowotamtu Asri, RT 01 / RW 02',
    rtRw: '01/02',
    dusun: 'Rowotamtu Asri',
    nik: '3213011204780002',
    role: 'nasabah',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    createdAt: '2026-07-15'
  },
  {
    id: 'usr-nasabah-3',
    name: 'Teh Rina Karlina',
    phone: '082199887766',
    address: 'Dusun Rowotamtu Rahayu, RT 04 / RW 02',
    rtRw: '04/02',
    dusun: 'Rowotamtu Rahayu',
    nik: '3213012109920003',
    role: 'nasabah',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250',
    createdAt: '2026-07-18'
  }
];

export const INITIAL_DEPOSITS: DepositTransaction[] = [
  {
    id: 'dep-101',
    nasabahId: 'usr-nasabah-1',
    nasabahName: 'Ibu Siti Aminah',
    nik: '3213015408850001',
    items: [
      { categoryId: 'cat-1', categoryName: 'Botol Plastik Bening (PET)', weight: 5.0, pricePerKg: 3500, subtotal: 17500 },
      { categoryId: 'cat-3', categoryName: 'Kardus Bekas (Gelombang)', weight: 10.0, pricePerKg: 2000, subtotal: 20000 }
    ],
    totalAmount: 37500,
    totalKg: 15.0,
    recordedBy: 'Pengurus KKN-K ROWOTAMTU',
    createdAt: '2026-08-01T09:30:00Z',
    notes: 'Penimbangan Posko Dusun Rowotamtu Mekar'
  },
  {
    id: 'dep-102',
    nasabahId: 'usr-nasabah-2',
    nasabahName: 'Pak Budi Santoso',
    nik: '3213011204780002',
    items: [
      { categoryId: 'cat-5', categoryName: 'Kaleng Alumunium Minuman', weight: 2.0, pricePerKg: 13000, subtotal: 26000 },
      { categoryId: 'cat-8', categoryName: 'Minyak Jelantah (UCO)', weight: 5.0, pricePerKg: 6000, subtotal: 30000 }
    ],
    totalAmount: 56000,
    totalKg: 7.0,
    recordedBy: 'Pengurus KKN-K ROWOTAMTU',
    createdAt: '2026-08-02T14:15:00Z',
    notes: 'Penimbangan Posko Utama'
  },
  {
    id: 'dep-103',
    nasabahId: 'usr-nasabah-1',
    nasabahName: 'Ibu Siti Aminah',
    nik: '3213015408850001',
    items: [
      { categoryId: 'cat-2', categoryName: 'Plastik HD / Emberan', weight: 8.0, pricePerKg: 2500, subtotal: 20000 },
      { categoryId: 'cat-4', categoryName: 'Kertas HVS / Buku / Majalah', weight: 15.0, pricePerKg: 2800, subtotal: 42000 }
    ],
    totalAmount: 62000,
    totalKg: 23.0,
    recordedBy: 'Pengurus KKN-K ROWOTAMTU',
    createdAt: '2026-08-03T11:00:00Z',
    notes: 'Penimbangan Rutin Dusun 01'
  }
];

export const INITIAL_WITHDRAWALS: WithdrawalTransaction[] = [
  {
    id: 'wth-201',
    nasabahId: 'usr-nasabah-1',
    nasabahName: 'Ibu Siti Aminah',
    nik: '3213015408850001',
    amount: 50000,
    recordedBy: 'Pengurus KKN-K ROWOTAMTU',
    createdAt: '2026-08-03T13:00:00Z',
    notes: 'Penarikan tunai fisik di Posko Balai Desa'
  }
];

export const INITIAL_ARTICLES: EducationalArticle[] = [
  {
    id: 'art-1',
    title: 'Cara Mudah Memilah Sampah Rumah Tangga di Desa Rowotamtu',
    category: 'Panduan',
    summary: 'Langkah praktis memisahkan sampah organik, anorganik, dan B3 dari dapur rumah tangga untuk disetor ke Bank Sampah.',
    content: `Memilah sampah dari rumah merupakan langkah paling krusial untuk mensukseskan program Bank Sampah Desa Rowotamtu.\n\n### 3 Kelompok Utama Pemilahan:\n1. **Plastik Bening & Keras**: Cuci bersih botol plastik dan remukkan agar tidak memakan tempat.\n2. **Kertas & Kardus**: Pastikan tetap dalam keadaan kering dan diikat rapi.\n3. **Minyak Jelantah**: Simpan di botol bekas untuk disetor menjadi bahan daur ulang.`,
    author: 'Tim KKN-K ROWOTAMTU',
    date: '2026-07-25',
    readTime: '3 mnt baca',
    imageUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=600',
    tags: ['Edukasi', 'Pemilahan', 'Lingkungan']
  },
  {
    id: 'art-2',
    title: 'Transformasi Sampah Jadi Tabungan: Dampak Positif untuk Ekonomi Warga',
    category: 'Berita KKN',
    summary: 'Bagaimana program Bank Sampah KKN-K ROWOTAMTU membantu puluhan kepala keluarga menambah penghasilan harian dengan membawa sampah langsung ke Posko.',
    content: `Melalui pencatatan digital Bank Sampah Desa Rowotamtu, setiap warga kini dapat memantau saldo tabungan sampah mereka secara transparan saat menyetorkan sampah di Posko Utama Balai Desa.`,
    author: 'Mahasiswa KKN-K ROWOTAMTU',
    date: '2026-07-30',
    readTime: '4 mnt baca',
    imageUrl: 'https://media.istockphoto.com/id/2219166847/id/foto/simbol-daur-ulang-hijau-pada-peningkatan-penumpukan-koin-dan-grafik-keuangan-untuk-mengurangi.webp?a=1&b=1&s=612x612&w=0&k=20&c=OItubMT_xvG2AV0uRrn3Qzd6IRaO-asxBTiesv8hkmE=',
    tags: ['EkonomiKreatif', 'KKNKRowotamtu', 'TabunganSampah']
  }
];

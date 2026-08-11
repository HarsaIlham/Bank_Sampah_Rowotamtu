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
    address: 'Dusun Paseban, RT 03 / RW 01',
    rtRw: '03/01',
    dusun: 'Paseban',
    nik: '3213015408850001',
    role: 'nasabah',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=250',
    createdAt: '2026-07-10'
  },
  {
    id: 'usr-nasabah-2',
    name: 'Pak Budi Santoso',
    phone: '081987654321',
    address: 'Dusun Glagasan, RT 01 / RW 02',
    rtRw: '01/02',
    dusun: 'Glagasan',
    nik: '3213011204780002',
    role: 'nasabah',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    createdAt: '2026-07-15'
  },
  {
    id: 'usr-nasabah-3',
    name: 'Teh Rina Karlina',
    phone: '082199887766',
    address: 'Dusun Karanganyar, RT 04 / RW 02',
    rtRw: '04/02',
    dusun: 'Karanganyar',
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
    title: 'Kenalan Dulu, Yuk: Sebenarnya Sampah Itu Apa?',
    category: 'Edukasi Dasar',
    summary: 'Setiap hari kita menghasilkan sisa makanan, kemasan jajan, hingga botol plastik. Memahami jenis dan asal sampah adalah langkah awal menuju lingkungan desa yang bersih dan bernilai ekonomi.',
    content: 'Setiap hari kita menghasilkan sampah dari sisa makanan, bungkus jajan, sampai botol minum. Mengenal jenis dan asal sampah adalah langkah pertama sebelum kita bisa mengelolanya dengan benar. Sampah organik dan anorganik yang tercampur jadi sulit diolah, padahal kalau dipisah dari awal, keduanya sama-sama memiliki manfaat dan nilai ekonomi.',
    sections: [
      {
        title: 'Apa Itu Sampah?',
        body: 'Sampah adalah bagian dari sesuatu yang sudah tidak dipakai atau tidak diinginkan lagi, dan biasanya dibuang dari kegiatan rumah tangga, perdagangan, industri, sampai pertanian. Sederhananya: apa pun yang sudah selesai masa pakainya di tangan kita.'
      },
      {
        title: 'Tiga Jenis Sampah yang Perlu Diketahui',
        items: [
          {
            title: 'Sampah Organik',
            desc: 'Sisa makanan, guguran daun, dan bahan alami lain yang mudah terurai oleh alam. Sangat baik diolah menjadi pupuk kompos untuk tanaman pekarangan.',
            badge: 'Organik'
          },
          {
            title: 'Sampah Anorganik',
            desc: 'Plastik, kaleng, botol kaca, dan styrofoam. Bahan ini sulit terurai secara alami, tetapi memiliki nilai jual tinggi jika disetorkan ke bank sampah.',
            badge: 'Bernilai Jual'
          },
          {
            title: 'Sampah B3 (Bahan Berbahaya & Beracun)',
            desc: 'Limbah berbahaya seperti bekas obat, baterai, wadah pestisida, atau limbah industri yang membutuhkan penanganan khusus dan tidak boleh dicampur sembarangan.',
            badge: 'Penanganan Khusus'
          }
        ]
      },
      {
        title: 'Dari Mana Asal Sampah?',
        items: [
          {
            title: 'Sampah Domestik',
            desc: 'Dihasilkan langsung dari aktivitas harian rumah tangga dan lingkungan permukiman warga.'
          },
          {
            title: 'Sampah Non-Domestik',
            desc: 'Berasal dari perkantoran, warung, restoran, kawasan pariwisata, industri, serta area pertanian.'
          }
        ]
      }
    ],
    takeaway: 'Mengenal jenis dan asal sampah adalah langkah pertama sebelum kita bisa mengelolanya dengan benar. Sampah organik dan anorganik yang tercampur akan sulit diolah, padahal jika dipisah sejak dari rumah, keduanya sama-sama memiliki manfaat dan bernilai ekonomi.',
    author: 'Tim KKN-K ROWOTAMTU',
    date: '2026-08-01',
    readTime: '3 menit baca',
    imageUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=600',
    tags: ['EdukasiDasar', 'JenisSampah', 'DesaRowotamtu']
  },
  {
    id: 'art-2',
    title: 'Kenapa Sih Harus Ada Bank Sampah?',
    category: 'Tentang Bank Sampah',
    summary: 'Pernah mendengar istilah bank sampah tapi masih bingung apa bedanya dengan tempat sampah biasa? Yuk pelajari definisi, manfaat, dan cara pandang baru dalam mengelola sampah.',
    content: 'Bank sampah bukan sekadar tempat pembuangan, melainkan sistem pengelolaan sampah berbasis masyarakat yang memberikan nilai ekonomi langsung dari sampah yang dipilah.',
    sections: [
      {
        title: 'Definisi Resmi Bank Sampah',
        isCallout: true,
        body: 'Menurut Peraturan Menteri Lingkungan Hidup RI No. 13 Tahun 2012, Bank Sampah adalah tempat pemilahan dan pengumpulan sampah yang dapat didaur ulang dan/atau digunakan ulang, serta memiliki nilai ekonomi bagi masyarakat.'
      },
      {
        title: 'Tujuan Dibentuknya Bank Sampah',
        body: 'Tujuannya agar pengelolaan sampah dimulai langsung dari sumbernya melalui prinsip 3R (Reduce, Reuse, Recycle). Sampah yang masih bernilai dapat ditabung atau disetorkan ke bank sampah untuk menambah pendapatan keluarga warga desa.'
      },
      {
        title: 'Manfaat Nyata untuk Warga Desa Rowotamtu',
        items: [
          { desc: 'Mengurangi pencemaran lingkungan dan bau tidak sedap di sekitar tempat tinggal.' },
          { desc: 'Mengurangi timbunan volume sampah yang harus dibuang ke Tempat Pemrosesan Akhir (TPA).' },
          { desc: 'Menciptakan lingkungan desa yang bersih, asri, dan sehat untuk keluarga.' },
          { desc: 'Mendidik masyarakat agar lebih peduli dan bertanggung jawab atas sampah yang dihasilkan.' },
          { desc: 'Meningkatkan rasa gotong royong serta menambah saldo tabungan kas keluarga.' }
        ]
      },
      {
        title: 'Perubahan Cara Pandang Pengelolaan Sampah',
        isSteps: true,
        items: [
          {
            title: 'Paradigma Lama: Kumpul – Angkut – Buang',
            desc: 'Sampah dicampur, diangkut petugas ke TPS, lalu dibuang begitu saja ke TPA tanpa proses pengolahan.'
          },
          {
            title: 'Paradigma Baru: Kurangi – Pilah – Olah Jadi Berkah',
            desc: 'Sampah dipilah sejak dari rumah tangga sebelum disetorkan ke posko bank sampah. Jauh lebih ramah lingkungan dan menghasilkan pemasukan nyata.'
          }
        ]
      }
    ],
    takeaway: 'Bank sampah adalah cara kita mengubah kebiasaan lama "buang lalu lupa" menjadi kebiasaan baru "pilah, kelola, dan dapat manfaat". Ini bukan hanya soal menjaga kebersihan lingkungan, melainkan juga tentang menumbuhkan perekonomian keluarga secara mandiri.',
    author: 'Tim KKN-K ROWOTAMTU',
    date: '2026-08-03',
    readTime: '3 menit baca',
    imageUrl: 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&q=80&w=600',
    tags: ['TentangBankSampah', 'ParadigmaBaru', 'ManfaatWarga']
  },
  {
    id: 'art-3',
    title: 'Kenalan dengan Prinsip 3R (Reduce, Reuse, Recycle)',
    category: 'Tips 3R',
    summary: 'Tiga prinsip sederhana yang dapat dipraktikkan langsung di rumah untuk mengurangi volume sampah dan menghemat pengeluaran keluarga.',
    content: 'Sebelum sampah sampai ke bank sampah, ada satu prinsip dasar yang perlu kita kuasai bersama: 3R. Tiga langkah ini saling melengkapi untuk menciptakan lingkungan yang lestari.',
    sections: [
      {
        title: 'Tiga Pilar Utama Prinsip 3R',
        items: [
          {
            title: '1. REDUCE (Mengurangi)',
            desc: 'Langkah pencegahan sejak awal. Contoh: membawa tas belanja sendiri saat ke pasar, memilih produk kemasan isi ulang, dan menghindari penggunaan plastik sekali pakai.',
            badge: 'Pencegahan'
          },
          {
            title: '2. REUSE (Menggunakan Kembali)',
            desc: 'Memaksimalkan masa pakai barang. Contoh: menggunakan toples kaca untuk tempat bumbu dapur, memakai botol minum yang bisa diisi ulang, dan memanfaatkan kertas bekas untuk catatan.',
            badge: 'Gunakan Lagi'
          },
          {
            title: '3. RECYCLE (Mendaur Ulang)',
            desc: 'Mengubah barang bekas menjadi produk baru yang berguna. Contoh: menyetorkan kardus, kaleng, dan botol plastik ke Bank Sampah Desa Rowotamtu untuk diproses industri daur ulang.',
            badge: 'Daur Ulang'
          }
        ]
      },
      {
        title: 'Keuntungan Memilah Sampah dari Rumah',
        body: 'Jika sampah sudah dipisahkan dari dapur, pengelolaannya jauh lebih optimal. Sampah organik dapat diolah menjadi kompos alami, sedangkan sampah anorganik disetorkan ke bank sampah untuk menambah saldo tabungan kas digital.'
      }
    ],
    takeaway: 'Prinsip 3R bukanlah teori yang rumit, melainkan kebiasaan kecil yang bisa langsung dipraktikkan hari ini. Mulailah dari memilah dua wadah sederhana di rumah: satu untuk organik (sisa makanan) dan satu untuk anorganik (plastik, kertas, kaleng).',
    author: 'Tim KKN-K ROWOTAMTU',
    date: '2026-08-05',
    readTime: '3 menit baca',
    imageUrl: 'https://images.unsplash.com/photo-1604187351574-c75ca79f5807?auto=format&fit=crop&q=80&w=600',
    tags: ['Tips3R', 'Reduce', 'Reuse', 'Recycle']
  },
  {
    id: 'art-4',
    title: 'Sampah Apa Saja yang Bisa Ditabung?',
    category: 'Panduan Menabung',
    summary: 'Panduan lengkap mengenai kategori sampah yang diterima di Posko Bank Sampah Desa Rowotamtu serta peran pengurus posko dalam melayani nasabah.',
    content: 'Tidak semua sampah dibuang begitu saja. Sebagian besar sampah anorganik memiliki nilai rupiah yang jelas dan siap diterima di Posko Bank Sampah Desa Rowotamtu.',
    sections: [
      {
        title: '4 Kategori Sampah yang Diterima di Posko',
        items: [
          {
            title: 'Kategori Plastik',
            desc: 'Botol air mineral PET bening, gelas plastik minuman, ember bekas, gayung, baskom pecah, dan perabotan plastik keras lainnya.',
            badge: 'Plastik'
          },
          {
            title: 'Kategori Besi & Logam',
            desc: 'Kaleng minuman alumunium, kaleng biskuit/susu kental manis, potongan pipa besi, seng bekas, paku, dan kawat.',
            badge: 'Logam'
          },
          {
            title: 'Kategori Kertas & Kardus',
            desc: 'Kardus cokelat bergelombang, kertas HVS bekas cetak, buku tulis/pelajaran lama, koran, dan majalah.',
            badge: 'Kertas'
          },
          {
            title: 'Kategori Botol Kaca',
            desc: 'Botol kaca bening utuh, botol sirup, botol kecap, dan toples kaca dalam kondisi bersih serta tidak pecah.',
            badge: 'Kaca'
          }
        ]
      },
      {
        title: 'Struktur Pengurus Posko Bank Sampah',
        isSteps: true,
        items: [
          {
            title: '1. Ketua & Pengarah',
            desc: 'Mengawasi jalannya operasional, menyusun program kerja, dan bertanggung jawab atas kelancaran posko.'
          },
          {
            title: '2. Administrasi & Teller',
            desc: 'Melayani pendaftaran nasabah baru, menginput data timbangan, dan mencatat transaksi ke buku kas digital.'
          },
          {
            title: '3. Bendahara',
            desc: 'Mengelola laporan keuangan posko dan memproses permohonan penarikan saldo tunai nasabah.'
          },
          {
            title: '4. Pengepul',
            desc: 'mengambil, menimbang, dan mencatat sampah dari nasabah.'
          }
        ]
      }
    ],
    takeaway: 'Sebelum membawa sampah ke posko, pastikan sampah sudah dipilah sesuai 4 kategori di atas serta dalam keadaan bersih dan kering. Semakin rapi pilahan Anda, semakin cepat proses penimbangan dan pencatatannya.',
    author: 'Tim KKN-K ROWOTAMTU',
    date: '2026-08-07',
    readTime: '3 menit baca',
    imageUrl: "../assets/waste_bank.avif",
    tags: ['PanduanMenabung', 'KategoriSampah', 'BankSampah']
  },
  {
    id: 'art-5',
    title: 'Cara Menabung Sampah, Gampang Kok!',
    category: 'Panduan Menabung',
    summary: 'Masih bingung alur menyetorkan sampah di Posko Balai Desa? Simak 5 langkah praktis dari pemilahan di rumah sampai saldo masuk ke akun digital.',
    content: 'Menabung sampah di Bank Sampah Desa Rowotamtu sangat mudah dan mirip seperti menabung di bank konvensional, hanya saja yang disetorkan berupa sampah terpilah.',
    sections: [
      {
        title: 'Lima Langkah Praktis Menabung Sampah',
        isSteps: true,
        items: [
          {
            title: 'Langkah 1: Pemilahan Mandiri di Rumah',
            desc: 'Kumpulkan dan pisahkan sampah anorganik (plastik, kertas, kaleng, botol kaca) ke dalam wadah atau kantong terpisah.'
          },
          {
            title: 'Langkah 2: Datang ke Posko Balai Desa',
            desc: 'Bawa sampah terpilah ke Posko Utama Balai Desa Rowotamtu pada jadwal penimbangan dan isi daftar absensi nasabah.'
          },
          {
            title: 'Langkah 3: Penimbangan Akurat',
            desc: 'Petugas posko akan menimbang masing-masing jenis sampah menggunakan timbangan digital secara transparan.'
          },
          {
            title: 'Langkah 4: Pencatatan ke Buku Kas Digital',
            desc: 'Petugas teller menginput hasil timbangan dan nilai rupiah langsung masuk ke buku tabungan digital akun Anda.'
          },
          {
            title: 'Langkah 5: Saldo Bertambah & Siap Ditarik',
            desc: 'Nasabah menerima konfirmasi saldo bertambah yang dapat dipantau setiap saat dan ditarik tunai ketika dibutuhkan.'
          }
        ]
      }
    ],
    takeaway: 'Semakin rutin Anda menabung sampah, saldo kas digital Anda akan terus bertambah. Selain menciptakan lingkungan desa yang bersih dan sehat, hasilnya dapat menjadi tambahan penghasilan nyata bagi keluarga.',
    author: 'Tim KKN-K ROWOTAMTU',
    date: '2026-08-09',
    readTime: '4 menit baca',
    imageUrl: '../assets/simulasi_bank_sampah.avif',
    tags: ['PanduanMenabung', 'CaraSetor', 'TabunganDigital']
  },
  {
    id: 'art-6',
    title: 'Dari Sampah, Sekarang Jadi Berkah',
    category: 'Motivasi',
    summary: 'Dulu sampah hanya dianggap sebagai barang buangan yang mengotori desa. Kini dengan bank sampah, sampah berubah menjadi tabungan dan berkah ekonomi bagi seluruh warga.',
    content: 'Transformasi pola pikir dari sekadar membuang sampah menjadi mengelola sampah terbukti mampu memberikan dampak ekonomi nyata sekaligus menjaga kelestarian Desa Rowotamtu.',
    sections: [
      {
        title: 'Mengubah Masalah Menjadi Berkah Bersama',
        body: 'Dulu sampah kerap menumpuk di pekarangan atau selokan hingga menimbulkan banjir dan sarang penyakit. Kini melalui program Bank Sampah Desa Rowotamtu, setiap kilogram sampah terpilah memiliki nilai tukar rupiah yang dapat dicairkan langsung oleh warga.'
      },
      {
        title: 'Tiga Langkah Nyata Menjadi Warga Peduli Lingkungan',
        items: [
          {
            title: 'Pilah Sampah Sejak dari Dapur',
            desc: 'Pisahkan sampah yang bisa didaur ulang segera setelah selesai digunakan di rumah.'
          },
          {
            title: 'Terapkan Gaya Hidup 3R Setiap Hari',
            desc: 'Kurangi kantong kresek sekali pakai dan rawat barang-barang agar memiliki masa pakai lebih lama.'
          },
          {
            title: 'Rutin Menabung ke Posko Desa',
            desc: 'Ajak keluarga dan tetangga di dusun untuk bersama-sama menyetorkan sampah ke posko setiap pekan.'
          }
        ]
      }
    ],
    takeaway: 'Bank Sampah Desa Rowotamtu hadir untuk membuktikan bahwa dari sampah bisa lahir berkah. Perubahan besar selalu berawal dari kebiasaan kecil di rumah. Mari bersama-sama kita wujudkan Desa Rowotamtu yang bersih, sehat, hijau, dan sejahtera!',
    author: 'Tim KKN-K ROWOTAMTU',
    date: '2026-08-11',
    readTime: '2 menit baca',
    imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=600',
    tags: ['Motivasi', 'SampahJadiBerkah', 'RowotamtuBersih']
  }
];

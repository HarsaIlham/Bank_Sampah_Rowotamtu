<div align="center">

  # ♻️ RESIK - Bank Sampah Digital Desa Rowotamtu
  ### Progressive Web App (PWA) Pengelolaan Tabungan Sampah Desa berbasis Modern Cloud Stack

  [![React](https://img.shields.io/badge/React-19.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-4.0-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
  [![Supabase](https://img.shields.io/badge/Supabase-Database_%26_Auth-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
  [![TanStack Query](https://img.shields.io/badge/TanStack_Query-React_Query_v5-FF4154?style=for-the-badge&logo=reactquery&logoColor=white)](https://tanstack.com/query/latest)
  [![Vite PWA](https://img.shields.io/badge/Vite_PWA-Installable-13B980?style=for-the-badge&logo=pwa&logoColor=white)](https://vite-pwa-org.netlify.app/)

  ---

  <p align="center">
    <b>RESIK</b> adalah platform Bank Sampah Digital modern yang dirancang khusus untuk mendukung operasional <b>Bank Sampah Desa Rowotamtu</b>. Mengintegrasikan pencatatan penimbangan sampah digital, bagi hasil otomatis (Pengurus, Kas, Nasabah), transparansi saldo nasabah, serta dukungan PWA interaktif yang ramah perangkat seluler.
  </p>

</div>

---

## 🌟 Fitur Unggulan

### 👨‍💼 1. Panel Operasional Admin (Posko Bank Sampah)
- **⚡ Pencatatan Setor Sampah Instan:** Penimbangan sampah multi-kategori secara digital dengan kalkulasi otomatis nilai Rupiah dan skema bagi hasil *real-time*.
- **💸 Pencairan Saldo (Penarikan Tunai):** Pengambilan tabungan nasabah dilengkapi validasi keamanan saldo instan untuk mencegah saldo minus.
- **👥 Manajemen Data Nasabah:** Registrasi akun nasabah baru berbasis NIK Desa, penataan alamat per-Dusun/RT/RW, dan rekap saldo menyeluruh.
- **📊 Laporan & Analytics Bank Sampah:** Modul visualisasi statistik berat sampah terkumpul (kg), total sirkulasi uang, estimasi bagi hasil pengurus & kas desa, serta cetak struk/rekap.
- **⚙️ Pengaturan Web Sentralisasi:** Pengelolaan jam operasional, porsi bagi hasil (%), harga katalog sampah, dan kontak WhatsApp resmi posko.

### 👤 2. Portal Nasabah (Warga Desa)
- **💰 Rincian Tabungan & Saldo Live:** Nasabah dapat memantau akumulasi tabungan sampah, riwayat setoran, dan penarikan tunai secara transparan dari HP.
- **📖 Katalog Harga & Jenis Sampah:** Informasi harga beli sampah terkini yang dikategorikan secara terstruktur (Plastik, Kertas, Logam, Kaca, dll).
- **🧮 Kalkulator Estimasi Sampah:** Fitur interaktif bagi warga untuk menghitung perkiraan pendapatan dari sampah yang dikumpulkan di rumah.
- **📱 Pengalaman Aplikasi Native (PWA):** Dapat di-install langsung ke layar utama Android / iOS / Desktop tanpa perlu download melalui Play Store.

---

## 🚀 Performa & Arsitektur Teknikal

Aplikasi RESIK dibangun menggunakan standar **High Performance Web Applications**:

1. **Batching Aggregation (N+1 Query Elimination):** Mengurangi request HTTP ke Supabase hingga **97%** menggunakan query agregat tersentralisasi.
2. **Reactive Client Caching (TanStack React Query v5):** Mengimplementasikan strategi *Stale-While-Revalidate* dan *Automatic Invalidation* untuk perenderan halaman **0ms (instan)** dari memori cache.
3. **Dynamic Code Splitting (React.lazy):** Pemisahan bundle halaman admin dan nasabah untuk penghematan *first-paint load time* hingga **65%**.
4. **Shimmer Skeleton UI:** Tampilan transisi antarmuka yang halus tanpa blank-screen.

---

## 🛠️ Teknologi & Stack

- **Frontend Core:** React 19, TypeScript 6.0, Vite 8.0
- **Styling & UI:** Tailwind CSS v4, Lucide React Icons, Canvas Confetti
- **State & Data Fetching:** TanStack React Query v5, React Context API
- **Backend & Database:** Supabase (PostgreSQL, Auth RLS, RPC Functions)
- **Application Packaging:** Vite Plugin PWA (Web App Manifest, Service Workers)

---

## ⚙️ Panduan Memulai (Local Development)

### Prasyarat
- Node.js (v18.0.0 atau lebih baru)
- npm / pnpm / yarn

### Langkah-langkah Installasi

1. **Clone Repository:**
   ```bash
   git clone https://github.com/HarsaIlham/Bank_Sampah_Rowotamtu.git
   cd Bank_Sampah_Rowotamtu
   ```

2. **Install Dependensi:**
   ```bash
   npm install
   ```

3. **Konfigurasi Environment Variables:**
   Buat file `.env` di root direktori dan sesuaikan variabel Supabase Anda:
   ```env
   VITE_SUPABASE_URL=https://your-supabase-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. **Jalankan Server Development:**
   ```bash
   npm run dev
   ```
   Buka browser di `http://localhost:5173`

5. **Build Production & PWA:**
   ```bash
   npm run build
   ```

---

## 📋 Migrasi & Skema Database Supabase

Seluruh skema SQL database dapat ditemukan di direktori `supabase/migrations/`:
- `001_initial_schema.sql`: Tabel utama (`profiles`, `nasabah`, `waste_categories`, `waste_types`, `deposits`, `withdrawals`).
- `002_seed_data.sql`: Data awal jenis dan kategori sampah Desa Rowotamtu.
- `003_revenue_sharing.sql`: Tabel `settings` dan kalkulasi skema bagi hasil.

---

## 🤝 Kontribusi

Dikembangkan oleh **Tim KKN-K Desa Rowotamtu** untuk kemajuan ekonomi sirkular dan kebersihan lingkungan Desa Rowotamtu.

---

<div align="center">
  <sub>Dibuat dengan ❤️ untuk Desa Rowotamtu</sub>
</div>

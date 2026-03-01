# 💰 FinTrack — Personal Finance Tracker

<p align="center">
  <strong>Kelola keuangan pribadi Anda dengan mudah, cerdas, dan aman.</strong>
</p>

<p align="center">
  <a href="https://duckterkru29.github.io/FinTrack/">🌐 Live Demo</a> •
  <a href="#fitur">✨ Fitur</a> •
  <a href="#cara-penggunaan">📖 Cara Penggunaan</a> •
  <a href="#teknologi">🛠 Teknologi</a>
</p>

---

## 🌐 Akses Aplikasi

**Website:** [https://duckterkru29.github.io/FinTrack/](https://duckterkru29.github.io/FinTrack/)

Aplikasi ini dapat diakses langsung melalui browser — **tidak perlu install** apapun.

---

## ✨ Fitur

### 📊 Dashboard Keuangan
- Ringkasan **saldo, pemasukan, dan pengeluaran** dalam satu tampilan
- Pilih **"Semua Bulan"** untuk melihat rekap gabungan, atau pilih bulan tertentu
- Statistik detail: Gaji, Tukin, Uang Makan, Selisih

### 💰 Budget Plan (Perencanaan Anggaran)
- Atur pemasukan bulanan (Gaji, Tukin, Uang Makan, Lainnya)
- Kelola 4 kategori pengeluaran utama:
  - 🟢 **Biaya Hidup** (40%)
  - 🔵 **Cicilan / Tagihan / Hutang** (30%)
  - 🟣 **Tabungan / Dana Darurat / Investasi** (20%)
  - 🟡 **Kebaikan** (10%)
- Setiap kategori memiliki sub-kategori yang bisa ditambah, edit, dan hapus
- Budget **Ideal** vs **Real** dengan progress bar visual

### 📝 Tambah Transaksi
- **Budget Monitoring** — pantau sisa budget per kategori secara real-time
- Tambah transaksi via **popup modal** yang praktis
- Preview budget sebelum menyimpan transaksi
- Dropdown pemilih bulan langsung di halaman

### 📈 Grafik Keuangan
- **Mode Semua Bulan:** Area chart menampilkan tren pemasukan vs pengeluaran
- **Mode Per Bulan:** Bar chart perbandingan alokasi ideal vs realisasi per kategori

### 🎯 Alokasi Anggaran
- **Donut chart** interaktif dengan tooltip detail
- **Detail anggaran** per kategori dengan progress bar animasi
- Badge status kesehatan budget (% terpakai)
- Mini-cards ringkasan: Total Ideal, Total Real, Selisih

### 📋 Riwayat Transaksi
- Daftar transaksi dengan **search** dan **filter** (Pemasukan / Pengeluaran)
- Tampilkan semua transaksi atau per bulan
- **Hapus semua** transaksi per bulan dengan konfirmasi

---

## 📖 Cara Penggunaan

### 1️⃣ Mulai dengan Budget Plan
1. Buka menu **Budget Plan**
2. Set pemasukan bulanan (Gaji, Tukin, dll)
3. Tambahkan sub-kategori di setiap kategori pengeluaran
4. Atur budget **Ideal** dan **Real** untuk masing-masing

### 2️⃣ Tambah Bulan Baru
1. Di menu **Budget Plan**, klik **"Tambah Bulan"**
2. Masukkan nama bulan dan tahun
3. Bulan akan otomatis terurut secara kronologis

### 3️⃣ Catat Transaksi
1. Buka menu **Tambah Transaksi**
2. Pilih bulan yang diinginkan via dropdown
3. Klik **"Tambah"** untuk membuka form transaksi
4. Pilih tipe (Pemasukan/Pengeluaran), kategori, nominal, dan tanggal
5. Budget monitoring akan terupdate otomatis

### 4️⃣ Pantau Dashboard
1. Buka menu **Dashboard**
2. Pilih **"Semua Bulan"** untuk rekap keseluruhan
3. Atau pilih bulan tertentu untuk detail spesifik
4. Semua section (Grafik, Alokasi, Riwayat) mengikuti pilihan

---

## 🔒 Privasi & Penyimpanan Data

> **Semua data tersimpan di perangkat Anda (localStorage browser), BUKAN di server.**

| Aspek | Penjelasan |
|-------|-----------|
| 📍 **Lokasi Data** | `localStorage` di browser perangkat masing-masing |
| 🔒 **Privasi** | Data keuangan **tidak pernah dikirim** ke server manapun |
| 👤 **Per Pengguna** | Setiap orang memiliki data tersendiri di perangkatnya |
| 🌐 **Offline** | Setelah halaman loaded, bisa digunakan tanpa internet |
| ⚠️ **Perhatian** | Data akan **hilang** jika Anda menghapus data browser (clear cache/cookies) |
| 📱 **Multi-Perangkat** | Data **tidak sinkron** antar perangkat (HP ≠ Laptop ≠ PC) |

### Tips Menjaga Data:
- Jangan clear `localStorage` / site data untuk domain ini
- Data aman selama Anda tidak menghapus data browser
- Gunakan browser yang sama di perangkat yang sama untuk konsistensi

---

## 🛠 Teknologi

| Teknologi | Kegunaan |
|-----------|----------|
| [React 19](https://react.dev/) | UI Framework |
| [TypeScript](https://www.typescriptlang.org/) | Type Safety |
| [Vite 7](https://vite.dev/) | Build Tool |
| [Tailwind CSS 3](https://tailwindcss.com/) | Styling |
| [Framer Motion](https://www.framer.com/motion/) | Animasi |
| [Recharts](https://recharts.org/) | Grafik & Chart |
| [Radix UI](https://www.radix-ui.com/) | Komponen UI |
| [Lucide React](https://lucide.dev/) | Ikon |
| [Sonner](https://sonner.emilkowal.dev/) | Toast Notification |
| [GitHub Pages](https://pages.github.com/) | Hosting (Gratis) |
| [GitHub Actions](https://github.com/features/actions) | CI/CD Auto Deploy |

---

## 💻 Development (Untuk Developer)

### Prasyarat
- [Node.js](https://nodejs.org/) v20+
- [npm](https://www.npmjs.com/) v10+

### Instalasi & Jalankan Lokal

```bash
# Clone repository
git clone https://github.com/duckterkru29/FinTrack.git
cd FinTrack

# Install dependencies
npm install

# Jalankan development server
npm run dev
```

Buka [http://localhost:5173](http://localhost:5173) di browser.

### Build Production

```bash
npm run build
```

Hasil build ada di folder `dist/`.

### Struktur Project

```
FinTrack/
├── .github/workflows/    # GitHub Actions (auto deploy)
├── src/
│   ├── components/ui/    # Komponen UI (shadcn/ui)
│   ├── data/             # Data awal & utility
│   ├── hooks/            # Custom hooks (useFinance)
│   ├── sections/         # Halaman/section utama
│   │   ├── DashboardHero.tsx      # Dashboard ringkasan
│   │   ├── ExpenseBreakdown.tsx   # Budget Plan
│   │   ├── AddTransaction.tsx     # Tambah Transaksi
│   │   ├── BudgetAllocation.tsx   # Alokasi Anggaran (Pie Chart)
│   │   ├── FinancialChart.tsx     # Grafik Keuangan
│   │   ├── TransactionHistory.tsx # Riwayat Transaksi
│   │   ├── Navigation.tsx         # Navbar
│   │   └── Footer.tsx             # Footer
│   ├── types/            # TypeScript types
│   ├── App.tsx           # Main app
│   └── main.tsx          # Entry point
├── vite.config.ts        # Vite configuration
└── package.json
```

---

## 🚀 Deployment

Aplikasi ini ter-deploy otomatis menggunakan **GitHub Actions** ke **GitHub Pages**.

Setiap kali push ke branch `main`:
1. ✅ GitHub Actions build project (`npm ci` → `npm run build`)
2. ✅ Deploy folder `dist/` ke GitHub Pages
3. ✅ Website ter-update dalam ~2-3 menit

**Tidak perlu deploy manual** — cukup push kode dan website otomatis terupdate.

---

## 📄 Lisensi

Project ini bersifat open source dan bebas digunakan untuk keperluan pribadi.

---

<p align="center">
  Dibuat dengan ❤️ untuk pengelolaan keuangan yang lebih baik
</p>

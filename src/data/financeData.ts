import type { MonthlyData, Transaction, ChartData } from '@/types/finance';

export const monthlyData: MonthlyData[] = [
  {
    month: 'Januari',
    year: 2026,
    income: {
      gaji: 2758200,
      tukin: 2655200,
      makan: 667850,
      lainnya: 0,
      total: 6081250
    },
    expenses: [
      {
        id: '1',
        name: 'Biaya Hidup',
        percentage: 40,
        idealAmount: 2432500,
        realAmount: 2067000,
        difference: 365500,
        color: '#4ade80',
        subcategories: [
          { id: '1-1', name: 'Makan: Masak', idealAmount: 900000, realAmount: 900000, notes: '25k/hari, bumbu 5k/hari' },
          { id: '1-2', name: 'Makan: Beras', idealAmount: 300000, realAmount: 300000, notes: '5kg/1minggu' },
          { id: '1-3', name: 'Makan: Minyak', idealAmount: 40000, realAmount: 40000, notes: '2l/bulan' },
          { id: '1-4', name: 'Gas', idealAmount: 23000, realAmount: 23000 },
          { id: '1-5', name: 'Air', idealAmount: 60000, realAmount: 60000, notes: '3 galon/minggu' },
          { id: '1-6', name: 'Listrik', idealAmount: 202000, realAmount: 202000 },
          { id: '1-7', name: 'Pulsa Teguh', idealAmount: 0, realAmount: 0 },
          { id: '1-8', name: 'Pulsa Ayun', idealAmount: 0, realAmount: 0 },
          { id: '1-9', name: 'Internet', idealAmount: 0, realAmount: 0 },
          { id: '1-10', name: 'Transportasi', idealAmount: 300000, realAmount: 300000 },
          { id: '1-11', name: 'Kebutuhan Rumah', idealAmount: 0, realAmount: 0, notes: 'pembalut, nescafe, sendal, komix, bodrex' },
          { id: '1-12', name: 'Kebutuhan Anak', idealAmount: 177000, realAmount: 177000, notes: 'Pempers Aqlan' },
          { id: '1-13', name: 'Iuran RT', idealAmount: 35000, realAmount: 35000 },
          { id: '1-14', name: 'Lainnya', idealAmount: 30000, realAmount: 30000, notes: 'ngaji safira, piting, trf arin, mie ayam, roti bakar PUP' }
        ]
      },
      {
        id: '2',
        name: 'Cicilan / Tagihan / Hutang',
        percentage: 30,
        idealAmount: 1824375,
        realAmount: 2641593,
        difference: -817218,
        color: '#60a5fa',
        subcategories: [
          { id: '2-1', name: 'Rumah', idealAmount: 1246838, realAmount: 1246838, notes: 'BTN GVC, GNR, Admin' },
          { id: '2-2', name: 'BSI', idealAmount: 1394755, realAmount: 1394755, notes: 'Shopee Teguh' }
        ]
      },
      {
        id: '3',
        name: 'Tabungan-Dana Darurat-Investasi',
        percentage: 20,
        idealAmount: 1216250,
        realAmount: 0,
        difference: 1216250,
        color: '#a78bfa',
        subcategories: [
          { id: '3-1', name: 'Tabungan', idealAmount: 0, realAmount: 0 },
          { id: '3-2', name: 'Investasi Saham/Emas/Property', idealAmount: 0, realAmount: 0 },
          { id: '3-3', name: 'Dana Darurat', idealAmount: 0, realAmount: 0 }
        ]
      },
      {
        id: '4',
        name: 'Kebaikan',
        percentage: 10,
        idealAmount: 608125,
        realAmount: 50000,
        difference: 558125,
        color: '#fbbf24',
        subcategories: [
          { id: '4-1', name: 'Zakat', idealAmount: 0, realAmount: 0 },
          { id: '4-2', name: 'Orang Tua', idealAmount: 0, realAmount: 0 },
          { id: '4-3', name: 'Infaq Rajab', idealAmount: 50000, realAmount: 50000 },
          { id: '4-4', name: 'Shodaqoh', idealAmount: 0, realAmount: 0 }
        ]
      }
    ],
    totalIdeal: 6081250,
    totalReal: 4758593,
    totalDifference: 1322657
  },
  {
    month: 'Februari',
    year: 2026,
    income: {
      gaji: 2758200,
      tukin: 2651924,
      makan: 632700,
      lainnya: 0,
      total: 6032824
    },
    expenses: [
      {
        id: '1',
        name: 'Biaya Hidup',
        percentage: 40,
        idealAmount: 2413130,
        realAmount: 2428100,
        difference: -14970,
        color: '#4ade80',
        subcategories: [
          { id: '1-1', name: 'Makan: Masak', idealAmount: 900000, realAmount: 900000, notes: '25k/hari, bumbu 5k/hari' },
          { id: '1-2', name: 'Makan: Beras', idealAmount: 300000, realAmount: 300000, notes: '5kg/1minggu' },
          { id: '1-3', name: 'Makan: Minyak', idealAmount: 40000, realAmount: 40000, notes: '2l/bulan' },
          { id: '1-4', name: 'Gas', idealAmount: 23000, realAmount: 23000 },
          { id: '1-5', name: 'Air', idealAmount: 60000, realAmount: 60000, notes: '3 galon/minggu' },
          { id: '1-6', name: 'Listrik', idealAmount: 202000, realAmount: 202000 },
          { id: '1-7', name: 'Pulsa Teguh', idealAmount: 0, realAmount: 0 },
          { id: '1-8', name: 'Pulsa Ayun', idealAmount: 0, realAmount: 0 },
          { id: '1-9', name: 'Internet', idealAmount: 234100, realAmount: 234100 },
          { id: '1-10', name: 'Transportasi', idealAmount: 350000, realAmount: 350000 },
          { id: '1-11', name: 'Kebutuhan Rumah', idealAmount: 0, realAmount: 0 },
          { id: '1-12', name: 'Kebutuhan Anak', idealAmount: 150000, realAmount: 150000, notes: 'Pempers Aqlan' },
          { id: '1-13', name: 'Iuran RT', idealAmount: 35000, realAmount: 35000 },
          { id: '1-14', name: 'Lainnya', idealAmount: 134000, realAmount: 134000, notes: 'ngaji safira, piting, trf arin, mie ayam, roti bakar PUP' }
        ]
      },
      {
        id: '2',
        name: 'Cicilan / Tagihan / Hutang',
        percentage: 30,
        idealAmount: 1809847,
        realAmount: 2613941,
        difference: -804094,
        color: '#60a5fa',
        subcategories: [
          { id: '2-1', name: 'Rumah', idealAmount: 1246838, realAmount: 1246838, notes: 'BTN GVC, GNR, Admin' },
          { id: '2-2', name: 'BSI', idealAmount: 1367103, realAmount: 1367103, notes: 'KTA 30jt' },
          { id: '2-3', name: 'Shopee', idealAmount: 0, realAmount: 0 }
        ]
      },
      {
        id: '3',
        name: 'Tabungan-Dana Darurat-Investasi',
        percentage: 20,
        idealAmount: 1206565,
        realAmount: 1000000,
        difference: 206565,
        color: '#a78bfa',
        subcategories: [
          { id: '3-1', name: 'Tabungan', idealAmount: 0, realAmount: 0 },
          { id: '3-2', name: 'Investasi Saham/Emas/Property', idealAmount: 1000000, realAmount: 1000000, notes: 'Reksadana Principal Index IDX30 Kelas O' },
          { id: '3-3', name: 'Dana Darurat', idealAmount: 0, realAmount: 0 }
        ]
      },
      {
        id: '4',
        name: 'Kebaikan',
        percentage: 10,
        idealAmount: 603282,
        realAmount: 50000,
        difference: 553282,
        color: '#fbbf24',
        subcategories: [
          { id: '4-1', name: 'Zakat', idealAmount: 0, realAmount: 0 },
          { id: '4-2', name: 'Infaq Syaaban', idealAmount: 50000, realAmount: 50000 },
          { id: '4-3', name: 'Shodaqoh', idealAmount: 0, realAmount: 0 },
          { id: '4-4', name: 'Orang Tua', idealAmount: 0, realAmount: 0 }
        ]
      }
    ],
    totalIdeal: 6032824,
    totalReal: 6092041,
    totalDifference: -59217
  },
  {
    month: 'Maret',
    year: 2026,
    income: {
      gaji: 2758200,
      tukin: 0,
      makan: 0,
      lainnya: 0,
      total: 2758200
    },
    expenses: [
      {
        id: '1',
        name: 'Biaya Hidup',
        percentage: 40,
        idealAmount: 1103280,
        realAmount: 2244100,
        difference: -1140820,
        color: '#4ade80',
        subcategories: [
          { id: '1-1', name: 'Makan: Masak', idealAmount: 900000, realAmount: 900000, notes: '25k/hari, bumbu 5k/hari' },
          { id: '1-2', name: 'Makan: Beras', idealAmount: 300000, realAmount: 300000, notes: '5kg/1minggu' },
          { id: '1-3', name: 'Makan: Minyak', idealAmount: 40000, realAmount: 40000, notes: '2l/bulan' },
          { id: '1-4', name: 'Gas', idealAmount: 23000, realAmount: 23000 },
          { id: '1-5', name: 'Air', idealAmount: 60000, realAmount: 60000, notes: '3 galon/minggu' },
          { id: '1-6', name: 'Listrik', idealAmount: 202000, realAmount: 202000 },
          { id: '1-7', name: 'Pulsa Teguh', idealAmount: 0, realAmount: 0 },
          { id: '1-8', name: 'Pulsa Ayun', idealAmount: 0, realAmount: 0 },
          { id: '1-9', name: 'Internet', idealAmount: 234100, realAmount: 234100 },
          { id: '1-10', name: 'Transportasi', idealAmount: 300000, realAmount: 300000 },
          { id: '1-11', name: 'Kebutuhan Rumah', idealAmount: 0, realAmount: 0 },
          { id: '1-12', name: 'Kebutuhan Anak', idealAmount: 150000, realAmount: 150000, notes: 'Pempers Aqlan' },
          { id: '1-13', name: 'Iuran RT', idealAmount: 35000, realAmount: 35000 },
          { id: '1-14', name: 'Lainnya', idealAmount: 0, realAmount: 0, notes: 'ngaji safira, piting, trf arin, mie ayam, roti bakar PUP' }
        ]
      },
      {
        id: '2',
        name: 'Cicilan / Tagihan / Hutang',
        percentage: 30,
        idealAmount: 827460,
        realAmount: 6231926,
        difference: -5404466,
        color: '#60a5fa',
        subcategories: [
          { id: '2-1', name: 'Rumah', idealAmount: 1246838, realAmount: 1246838, notes: 'BTN GVC, GNR, Admin' },
          { id: '2-2', name: 'BSI', idealAmount: 1367103, realAmount: 1367103, notes: 'KTA 30jt' },
          { id: '2-3', name: 'Shopee', idealAmount: 617985, realAmount: 617985 },
          { id: '2-4', name: 'Sardi/Azis/Bu Dewi', idealAmount: 3000000, realAmount: 3000000 }
        ]
      },
      {
        id: '3',
        name: 'Tabungan-Dana Darurat-Investasi',
        percentage: 20,
        idealAmount: 551640,
        realAmount: 200000,
        difference: 351640,
        color: '#a78bfa',
        subcategories: [
          { id: '3-1', name: 'Tabungan', idealAmount: 0, realAmount: 0 },
          { id: '3-2', name: 'Investasi Saham/Emas/Property', idealAmount: 200000, realAmount: 200000, notes: 'Reksadana Principal Index IDX30 Kelas O' },
          { id: '3-3', name: 'Dana Darurat', idealAmount: 0, realAmount: 0 }
        ]
      },
      {
        id: '4',
        name: 'Kebaikan',
        percentage: 10,
        idealAmount: 275820,
        realAmount: 600000,
        difference: -324180,
        color: '#fbbf24',
        subcategories: [
          { id: '4-1', name: 'Zakat Fitrah', idealAmount: 0, realAmount: 0 },
          { id: '4-2', name: 'Infaq Ramadhan', idealAmount: 100000, realAmount: 100000 },
          { id: '4-3', name: 'Shodaqoh Lebaran', idealAmount: 500000, realAmount: 500000 },
          { id: '4-4', name: 'Orang Tua', idealAmount: 0, realAmount: 0 }
        ]
      }
    ],
    totalIdeal: 2758200,
    totalReal: 9276026,
    totalDifference: -6517826
  }
];

export const transactions: Transaction[] = [
  // Januari 2026
  { id: '1', date: '2026-01-01', description: 'Gaji Bulanan', category: 'Pendapatan', amount: 2758200, type: 'income' },
  { id: '2', date: '2026-01-01', description: 'Tukin', category: 'Pendapatan', amount: 2655200, type: 'income' },
  { id: '3', date: '2026-01-01', description: 'Uang Makan', category: 'Pendapatan', amount: 667850, type: 'income' },
  { id: '4', date: '2026-01-05', description: 'Makan: Masak', category: 'Biaya Hidup', subcategory: 'Makan', amount: 900000, type: 'expense' },
  { id: '5', date: '2026-01-05', description: 'Makan: Beras', category: 'Biaya Hidup', subcategory: 'Makan', amount: 300000, type: 'expense' },
  { id: '6', date: '2026-01-05', description: 'Makan: Minyak', category: 'Biaya Hidup', subcategory: 'Makan', amount: 40000, type: 'expense' },
  { id: '7', date: '2026-01-10', description: 'Gas', category: 'Biaya Hidup', amount: 23000, type: 'expense' },
  { id: '8', date: '2026-01-10', description: 'Air', category: 'Biaya Hidup', amount: 60000, type: 'expense' },
  { id: '9', date: '2026-01-10', description: 'Listrik', category: 'Biaya Hidup', amount: 202000, type: 'expense' },
  { id: '10', date: '2026-01-15', description: 'Transportasi', category: 'Biaya Hidup', amount: 300000, type: 'expense' },
  { id: '11', date: '2026-01-15', description: 'Kebutuhan Anak', category: 'Biaya Hidup', amount: 177000, type: 'expense', notes: 'Pempers Aqlan' },
  { id: '12', date: '2026-01-15', description: 'Iuran RT', category: 'Biaya Hidup', amount: 35000, type: 'expense' },
  { id: '13', date: '2026-01-20', description: 'Lainnya', category: 'Biaya Hidup', amount: 30000, type: 'expense', notes: 'ngaji safira, piting, trf arin, mie ayam, roti bakar PUP' },
  { id: '14', date: '2026-01-01', description: 'Cicilan Rumah', category: 'Cicilan', amount: 1246838, type: 'expense', notes: 'BTN GVC, GNR, Admin' },
  { id: '15', date: '2026-01-01', description: 'BSI', category: 'Cicilan', amount: 1394755, type: 'expense', notes: 'Shopee Teguh' },
  { id: '16', date: '2026-01-15', description: 'Infaq Rajab', category: 'Kebaikan', amount: 50000, type: 'expense' },

  // Februari 2026
  { id: '17', date: '2026-02-01', description: 'Gaji Bulanan', category: 'Pendapatan', amount: 2758200, type: 'income' },
  { id: '18', date: '2026-02-01', description: 'Tukin', category: 'Pendapatan', amount: 2651924, type: 'income' },
  { id: '19', date: '2026-02-01', description: 'Uang Makan', category: 'Pendapatan', amount: 632700, type: 'income' },
  { id: '20', date: '2026-02-05', description: 'Makan: Masak', category: 'Biaya Hidup', subcategory: 'Makan', amount: 900000, type: 'expense' },
  { id: '21', date: '2026-02-05', description: 'Makan: Beras', category: 'Biaya Hidup', subcategory: 'Makan', amount: 300000, type: 'expense' },
  { id: '22', date: '2026-02-05', description: 'Makan: Minyak', category: 'Biaya Hidup', subcategory: 'Makan', amount: 40000, type: 'expense' },
  { id: '23', date: '2026-02-10', description: 'Gas', category: 'Biaya Hidup', amount: 23000, type: 'expense' },
  { id: '24', date: '2026-02-10', description: 'Air', category: 'Biaya Hidup', amount: 60000, type: 'expense' },
  { id: '25', date: '2026-02-10', description: 'Listrik', category: 'Biaya Hidup', amount: 202000, type: 'expense' },
  { id: '26', date: '2026-02-10', description: 'Internet', category: 'Biaya Hidup', amount: 234100, type: 'expense' },
  { id: '27', date: '2026-02-15', description: 'Transportasi', category: 'Biaya Hidup', amount: 350000, type: 'expense' },
  { id: '28', date: '2026-02-15', description: 'Kebutuhan Anak', category: 'Biaya Hidup', amount: 150000, type: 'expense', notes: 'Pempers Aqlan' },
  { id: '29', date: '2026-02-15', description: 'Iuran RT', category: 'Biaya Hidup', amount: 35000, type: 'expense' },
  { id: '30', date: '2026-02-20', description: 'Lainnya', category: 'Biaya Hidup', amount: 134000, type: 'expense', notes: 'ngaji safira, piting, trf arin, mie ayam, roti bakar PUP' },
  { id: '31', date: '2026-02-01', description: 'Cicilan Rumah', category: 'Cicilan', amount: 1246838, type: 'expense', notes: 'BTN GVC, GNR, Admin' },
  { id: '32', date: '2026-02-01', description: 'BSI', category: 'Cicilan', amount: 1367103, type: 'expense', notes: 'KTA 30jt' },
  { id: '33', date: '2026-02-15', description: 'Investasi Reksadana', category: 'Tabungan', amount: 1000000, type: 'expense', notes: 'Reksadana Principal Index IDX30 Kelas O' },
  { id: '34', date: '2026-02-15', description: 'Infaq Syaaban', category: 'Kebaikan', amount: 50000, type: 'expense' },

  // Maret 2026
  { id: '35', date: '2026-03-01', description: 'Gaji Bulanan', category: 'Pendapatan', amount: 2758200, type: 'income' },
  { id: '36', date: '2026-03-05', description: 'Makan: Masak', category: 'Biaya Hidup', subcategory: 'Makan', amount: 900000, type: 'expense' },
  { id: '37', date: '2026-03-05', description: 'Makan: Beras', category: 'Biaya Hidup', subcategory: 'Makan', amount: 300000, type: 'expense' },
  { id: '38', date: '2026-03-05', description: 'Makan: Minyak', category: 'Biaya Hidup', subcategory: 'Makan', amount: 40000, type: 'expense' },
  { id: '39', date: '2026-03-10', description: 'Gas', category: 'Biaya Hidup', amount: 23000, type: 'expense' },
  { id: '40', date: '2026-03-10', description: 'Air', category: 'Biaya Hidup', amount: 60000, type: 'expense' },
  { id: '41', date: '2026-03-10', description: 'Listrik', category: 'Biaya Hidup', amount: 202000, type: 'expense' },
  { id: '42', date: '2026-03-10', description: 'Internet', category: 'Biaya Hidup', amount: 234100, type: 'expense' },
  { id: '43', date: '2026-03-15', description: 'Transportasi', category: 'Biaya Hidup', amount: 300000, type: 'expense' },
  { id: '44', date: '2026-03-15', description: 'Kebutuhan Anak', category: 'Biaya Hidup', amount: 150000, type: 'expense', notes: 'Pempers Aqlan' },
  { id: '45', date: '2026-03-15', description: 'Iuran RT', category: 'Biaya Hidup', amount: 35000, type: 'expense' },
  { id: '46', date: '2026-03-01', description: 'Cicilan Rumah', category: 'Cicilan', amount: 1246838, type: 'expense', notes: 'BTN GVC, GNR, Admin' },
  { id: '47', date: '2026-03-01', description: 'BSI', category: 'Cicilan', amount: 1367103, type: 'expense', notes: 'KTA 30jt' },
  { id: '48', date: '2026-03-01', description: 'Shopee', category: 'Cicilan', amount: 617985, type: 'expense' },
  { id: '49', date: '2026-03-01', description: 'Sardi/Azis/Bu Dewi', category: 'Cicilan', amount: 3000000, type: 'expense' },
  { id: '50', date: '2026-03-15', description: 'Investasi Reksadana', category: 'Tabungan', amount: 200000, type: 'expense', notes: 'Reksadana Principal Index IDX30 Kelas O' },
  { id: '51', date: '2026-03-15', description: 'Infaq Ramadhan', category: 'Kebaikan', amount: 100000, type: 'expense' },
  { id: '52', date: '2026-03-15', description: 'Shodaqoh Lebaran', category: 'Kebaikan', amount: 500000, type: 'expense' }
];

export const getChartData = (): ChartData[] => {
  return monthlyData.map(data => ({
    name: data.month,
    pemasukan: data.income.total,
    pengeluaran: data.totalReal
  }));
};

export const getBudgetData = (monthIndex: number = 0) => {
  const data = monthlyData[monthIndex];
  return data.expenses.map(exp => ({
    name: exp.name,
    value: exp.realAmount,
    ideal: exp.idealAmount,
    color: exp.color
  }));
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

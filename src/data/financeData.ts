import type { MonthlyData, Transaction, ChartData } from '@/types/finance';

export const monthlyData: MonthlyData[] = [
  {
    month: 'Maret',
    year: 2026,
    income: {
      gaji: 0,
      tukin: 0,
      makan: 0,
      lainnya: 0,
      total: 0
    },
    expenses: [
      {
        id: '1',
        name: 'Biaya Hidup',
        percentage: 40,
        idealAmount: 0,
        realAmount: 0,
        difference: 0,
        color: '#4ade80',
        subcategories: [
          { id: '1-1', name: 'Makan: Masak', idealAmount: 0, realAmount: 0, notes: '' },
          { id: '1-2', name: 'Makan: Beras', idealAmount: 0, realAmount: 0, notes: '' },
          { id: '1-3', name: 'Makan: Minyak', idealAmount: 0, realAmount: 0, notes: '' },
          { id: '1-4', name: 'Gas', idealAmount: 0, realAmount: 0, notes: '' },
          { id: '1-5', name: 'Air', idealAmount: 0, realAmount: 0, notes: '' },
          { id: '1-6', name: 'Listrik', idealAmount: 0, realAmount: 0, notes: '' },
          { id: '1-7', name: 'Pulsa Teguh', idealAmount: 0, realAmount: 0, notes: '' },
          { id: '1-8', name: 'Pulsa Ayun', idealAmount: 0, realAmount: 0, notes: '' },
          { id: '1-9', name: 'Internet', idealAmount: 0, realAmount: 0, notes: '' },
          { id: '1-10', name: 'Transportasi', idealAmount: 0, realAmount: 0, notes: '' },
          { id: '1-11', name: 'Kebutuhan Rumah', idealAmount: 0, realAmount: 0, notes: '' },
          { id: '1-12', name: 'Kebutuhan Anak', idealAmount: 0, realAmount: 0, notes: '' },
          { id: '1-13', name: 'Iuran RT', idealAmount: 0, realAmount: 0, notes: '' },
          { id: '1-14', name: 'Lainnya', idealAmount: 0, realAmount: 0, notes: '' }
        ]
      },
      {
        id: '2',
        name: 'Cicilan / Tagihan / Hutang',
        percentage: 30,
        idealAmount: 0,
        realAmount: 0,
        difference: 0,
        color: '#60a5fa',
        subcategories: [
          { id: '2-1', name: 'Rumah', idealAmount: 0, realAmount: 0, notes: '' },
          { id: '2-2', name: 'BSI', idealAmount: 0, realAmount: 0, notes: '' },
          { id: '2-3', name: 'Shopee', idealAmount: 0, realAmount: 0, notes: '' },
          { id: '2-4', name: 'Sardi/Azis/Bu Dewi', idealAmount: 0, realAmount: 0, notes: '' }
        ]
      },
      {
        id: '3',
        name: 'Tabungan-Dana Darurat-Simpanan/Investasi',
        percentage: 20,
        idealAmount: 0,
        realAmount: 0,
        difference: 0,
        color: '#a78bfa',
        subcategories: [
          { id: '3-1', name: 'Tabungan', idealAmount: 0, realAmount: 0, notes: '' },
          { id: '3-2', name: 'Investasi Saham/Emas/Property', idealAmount: 0, realAmount: 0, notes: '' },
          { id: '3-3', name: 'Dana Darurat', idealAmount: 0, realAmount: 0, notes: '' }
        ]
      },
      {
        id: '4',
        name: 'Kebaikan',
        percentage: 10,
        idealAmount: 0,
        realAmount: 0,
        difference: 0,
        color: '#fbbf24',
        subcategories: [
          { id: '4-1', name: 'Zakat Fitrah', idealAmount: 0, realAmount: 0, notes: '' },
          { id: '4-2', name: 'Infaq Ramadhan', idealAmount: 0, realAmount: 0, notes: '' },
          { id: '4-3', name: 'Shodaqoh Lebaran', idealAmount: 0, realAmount: 0, notes: '' },
          { id: '4-4', name: 'Orang Tua', idealAmount: 0, realAmount: 0, notes: '' }
        ]
      }
    ],
    totalIdeal: 0,
    totalReal: 0,
    totalDifference: 0
  }
];

export const transactions: Transaction[] = [];

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

export interface Transaction {
  id: string;
  date: string;
  description: string;
  category: string;
  subcategory?: string;
  amount: number;
  type: 'income' | 'expense';
  notes?: string;
}

export interface BudgetCategory {
  id: string;
  name: string;
  percentage: number;
  idealAmount: number;
  realAmount: number;
  difference: number;
  color: string;
  subcategories?: SubCategory[];
}

export interface SubCategory {
  id: string;
  name: string;
  idealAmount: number;
  realAmount: number;
  notes?: string;
}

export interface MonthlyData {
  month: string;
  year: number;
  income: {
    gaji: number;
    tukin: number;
    makan: number;
    lainnya: number;
    total: number;
  };
  expenses: BudgetCategory[];
  totalIdeal: number;
  totalReal: number;
  totalDifference: number;
}

export interface ChartData {
  name: string;
  pemasukan: number;
  pengeluaran: number;
}

export interface DonutData {
  name: string;
  value: number;
  color: string;
}

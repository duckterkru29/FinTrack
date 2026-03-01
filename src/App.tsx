import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import Navigation from '@/sections/Navigation';
import DashboardHero from '@/sections/DashboardHero';
import FinancialChart from '@/sections/FinancialChart';
import BudgetAllocation from '@/sections/BudgetAllocation';
import TransactionHistory from '@/sections/TransactionHistory';
import ExpenseBreakdown from '@/sections/ExpenseBreakdown';
import TransactionForm from '@/sections/TransactionForm';
import Footer from '@/sections/Footer';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';

function App() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [selectedMonth, setSelectedMonth] = useState(0);

  const dashboardRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<HTMLDivElement>(null);
  const budgetRef = useRef<HTMLDivElement>(null);
  const transactionsRef = useRef<HTMLDivElement>(null);
  const breakdownRef = useRef<HTMLDivElement>(null);
  const addRef = useRef<HTMLDivElement>(null);

  const handleNavigate = (section: string) => {
    setActiveSection(section);

    const refs: Record<string, React.RefObject<HTMLDivElement | null>> = {
      dashboard: dashboardRef,
      chart: chartRef,
      budget: budgetRef,
      transactions: transactionsRef,
      breakdown: breakdownRef,
      add: addRef
    };

    const targetRef = refs[section];
    if (targetRef?.current) {
      const offset = 80; // Height of fixed header
      const elementPosition = targetRef.current.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const handleAddTransaction = (transaction: {
    description: string;
    amount: number;
    type: 'income' | 'expense';
    category: string;
    date: string;
    notes: string;
  }) => {
    // In a real app, this would add to the database
    toast.success('Transaksi berhasil ditambahkan!', {
      description: `${transaction.type === 'income' ? 'Pemasukan' : 'Pengeluaran'}: ${transaction.description} - Rp ${transaction.amount.toLocaleString('id-ID')}`,
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Toaster position="top-right" richColors />
      
      <Navigation
        activeSection={activeSection}
        onNavigate={handleNavigate}
      />

      <main className="pt-16 lg:pt-20 pb-20 lg:pb-0">
        {/* Dashboard Hero Section */}
        <div ref={dashboardRef} id="dashboard">
          <DashboardHero
            selectedMonth={selectedMonth}
            onMonthChange={setSelectedMonth}
          />
        </div>

        {/* Financial Chart Section */}
        <div ref={chartRef} id="chart">
          <FinancialChart />
        </div>

        {/* Budget Allocation Section */}
        <div ref={budgetRef} id="budget">
          <BudgetAllocation selectedMonth={selectedMonth} />
        </div>

        {/* Expense Breakdown Section */}
        <div ref={breakdownRef} id="breakdown">
          <ExpenseBreakdown selectedMonth={selectedMonth} />
        </div>

        {/* Transaction History Section */}
        <div ref={transactionsRef} id="transactions">
          <TransactionHistory selectedMonth={selectedMonth} />
        </div>

        {/* Transaction Form Section */}
        <div ref={addRef} id="add">
          <TransactionForm onAddTransaction={handleAddTransaction} />
        </div>

        {/* Footer */}
        <Footer />
      </main>

      {/* Floating Action Button for Mobile */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: 'spring' }}
        onClick={() => handleNavigate('add')}
        className="fixed bottom-24 right-4 lg:hidden w-14 h-14 rounded-full bg-gradient-to-br from-[#4ade80] to-[#60a5fa] text-white shadow-lg flex items-center justify-center z-40"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 12h14" />
          <path d="M12 5v14" />
        </svg>
      </motion.button>
    </div>
  );
}

export default App;

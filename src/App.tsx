import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import Navigation from '@/sections/Navigation';
import DashboardHero from '@/sections/DashboardHero';
import FinancialChart from '@/sections/FinancialChart';
import BudgetAllocation from '@/sections/BudgetAllocation';
import TransactionHistory from '@/sections/TransactionHistory';
import ExpenseBreakdown from '@/sections/ExpenseBreakdown';
import AddTransaction from '@/sections/AddTransaction';
import Footer from '@/sections/Footer';
import { Toaster } from '@/components/ui/sonner';

function App() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [activePage, setActivePage] = useState<'dashboard' | 'breakdown' | 'add-transaction'>('dashboard');

  const dashboardRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<HTMLDivElement>(null);
  const budgetRef = useRef<HTMLDivElement>(null);
  const transactionsRef = useRef<HTMLDivElement>(null);
  const breakdownRef = useRef<HTMLDivElement>(null);

  const handleNavigate = (section: string) => {
    setActiveSection(section);

    if (section === 'breakdown') {
      setActivePage('breakdown');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    } else if (section === 'add-transaction') {
      setActivePage('add-transaction');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    } else {
      setActivePage('dashboard');

      setTimeout(() => {
        const refs: Record<string, React.RefObject<HTMLDivElement | null>> = {
          dashboard: dashboardRef,
          chart: chartRef,
          budget: budgetRef,
          transactions: transactionsRef
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
      }, 50);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Toaster position="top-right" richColors />

      <Navigation
        activeSection={activeSection}
        onNavigate={handleNavigate}
      />

      <main className="pt-16 lg:pt-20 pb-20 lg:pb-0">
        {activePage === 'dashboard' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            {/* Dashboard Hero Section */}
            <div ref={dashboardRef} id="dashboard">
              <DashboardHero />
            </div>

            {/* Financial Chart Section */}
            <div ref={chartRef} id="chart">
              <FinancialChart />
            </div>

            {/* Budget Allocation Section */}
            <div ref={budgetRef} id="budget">
              <BudgetAllocation />
            </div>

            {/* Transaction History Section */}
            <div ref={transactionsRef} id="transactions">
              <TransactionHistory />
            </div>
          </motion.div>
        )}

        {activePage === 'breakdown' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            {/* Expense Breakdown / Budget Plan Section */}
            <div ref={breakdownRef} id="breakdown" className="pt-4 lg:pt-8 min-h-[80vh]">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
                <h2 className="text-3xl font-bold gradient-text">Budget Plan</h2>
                <p className="text-muted-foreground mt-2">Analisis mendalam tentang pengeluaran Anda.</p>
              </div>
              <ExpenseBreakdown />
            </div>
          </motion.div>
        )}

        {activePage === 'add-transaction' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <div className="pt-4 lg:pt-8 min-h-[80vh]">
              <AddTransaction />
            </div>
          </motion.div>
        )}

        {/* Footer */}
        <Footer />
      </main>
    </div>
  );
}

export default App;

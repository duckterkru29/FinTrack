import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Wallet, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/data/financeData';
import { useFinance } from '@/hooks/useFinance';

export default function DashboardHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { data, setSelectedMonth, viewMode, setViewMode } = useFinance();



  // Calculate values based on viewMode
  const isAllMonths = viewMode === -1;

  const totalIncome = isAllMonths
    ? data.reduce((sum, d) => sum + d.income.total, 0)
    : data[viewMode]?.income.total ?? 0;

  const totalExpense = isAllMonths
    ? data.reduce((sum, d) => sum + d.totalReal, 0)
    : data[viewMode]?.totalReal ?? 0;

  const totalIdeal = isAllMonths
    ? data.reduce((sum, d) => sum + d.totalIdeal, 0)
    : data[viewMode]?.totalIdeal ?? 0;

  const totalDifference = isAllMonths
    ? data.reduce((sum, d) => sum + d.totalDifference, 0)
    : data[viewMode]?.totalDifference ?? 0;

  const gaji = isAllMonths
    ? data.reduce((sum, d) => sum + d.income.gaji, 0)
    : data[viewMode]?.income.gaji ?? 0;

  const tukin = isAllMonths
    ? data.reduce((sum, d) => sum + d.income.tukin, 0)
    : data[viewMode]?.income.tukin ?? 0;

  const uangMakan = isAllMonths
    ? data.reduce((sum, d) => sum + d.income.makan, 0)
    : data[viewMode]?.income.makan ?? 0;

  const balance = totalIncome - totalExpense;

  const displayLabel = isAllMonths
    ? `Semua Bulan (${data.length} bulan)`
    : `${data[viewMode]?.month} ${data[viewMode]?.year}`;

  // When user selects a month in the pills, also update the global selectedMonth (unless "All")
  const handleSelectView = (index: number) => {
    setViewMode(index);
    if (index >= 0) {
      setSelectedMonth(index);
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) / 25;
        const y = (e.clientY - rect.top - rect.height / 2) / 25;
        setMousePosition({ x, y });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.15,
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1] as const
      }
    })
  };

  return (
    <section ref={containerRef} className="relative min-h-[60vh] py-12 px-4 sm:px-6 lg:px-8">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background/90 to-background/50 pointer-events-none" />

      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-96 h-96 rounded-full bg-[#4ade80]/5 blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{ top: '10%', left: '10%' }}
        />
        <motion.div
          className="absolute w-96 h-96 rounded-full bg-[#60a5fa]/5 blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{ top: '30%', right: '10%' }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 gradient-text">
            Dashboard Keuangan
          </h1>
          <p className="text-lg text-muted-foreground">
            Ringkasan aktivitas keuangan Anda
          </p>
        </motion.div>

        {/* Month Selector Dropdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="flex justify-center mb-10"
        >
          <div className="flex items-center gap-3 bg-card rounded-xl p-2 px-4 border border-border">
            <Calendar className="w-5 h-5 text-muted-foreground flex-shrink-0" />
            <select
              value={viewMode}
              onChange={(e) => handleSelectView(Number(e.target.value))}
              className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm font-medium text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer min-w-[200px]"
            >
              <option value={-1} className="text-foreground bg-background">📊 Semua Bulan</option>
              {data.map((monthData, index) => (
                <option key={`${monthData.month}-${monthData.year}`} value={index} className="text-foreground bg-background">
                  {monthData.month} {monthData.year}
                </option>
              ))}
            </select>
          </div>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {/* Balance Card */}
          <motion.div
            custom={0}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            key={`balance-${viewMode}`}
            style={{
              transform: `perspective(1000px) rotateX(${-mousePosition.y}deg) rotateY(${mousePosition.x}deg)`
            }}
          >
            <Card className="relative overflow-hidden bg-card glass border border-white/5 card-hover animate-pulse-glow">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#4ade80]/10 rounded-full blur-2xl" />
              <CardContent className="p-6 lg:p-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-[#4ade80]/20 rounded-xl">
                    <Wallet className="w-6 h-6 text-[#4ade80]" />
                  </div>
                  <span className="text-sm text-muted-foreground">{displayLabel}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-1">Total Saldo</p>
                <h2 className={`text-3xl lg:text-4xl font-bold ${balance >= 0 ? 'text-[#4ade80]' : 'text-[#f87171]'}`}>
                  {formatCurrency(balance)}
                </h2>
                <div className="mt-4 flex items-center gap-2">
                  <span className={`text-sm ${balance >= 0 ? 'text-[#4ade80]' : 'text-[#f87171]'}`}>
                    {balance >= 0 ? '+' : ''}{formatCurrency(balance)}
                  </span>
                  <span className="text-sm text-muted-foreground">dari pendapatan</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Income Card */}
          <motion.div
            custom={1}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            key={`income-${viewMode}`}
            style={{
              transform: `perspective(1000px) rotateX(${-mousePosition.y * 0.5}deg) rotateY(${mousePosition.x * 0.5}deg)`
            }}
          >
            <Card className="relative overflow-hidden bg-card glass border border-white/5 card-hover">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#60a5fa]/10 rounded-full blur-2xl" />
              <CardContent className="p-6 lg:p-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-[#60a5fa]/20 rounded-xl">
                    <TrendingUp className="w-6 h-6 text-[#60a5fa]" />
                  </div>
                  <span className="text-sm text-[#60a5fa]">Pemasukan</span>
                </div>
                <p className="text-sm text-muted-foreground mb-1">Total Pemasukan</p>
                <h2 className="text-3xl lg:text-4xl font-bold text-[#60a5fa]">
                  {formatCurrency(totalIncome)}
                </h2>
                <div className="mt-4 flex items-center gap-2">
                  <span className="text-sm text-[#60a5fa]">Gaji + Tukin + Lainnya</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Expense Card */}
          <motion.div
            custom={2}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            key={`expense-${viewMode}`}
            style={{
              transform: `perspective(1000px) rotateX(${-mousePosition.y * 0.5}deg) rotateY(${mousePosition.x * 0.5}deg)`
            }}
          >
            <Card className="relative overflow-hidden bg-card glass border border-white/5 card-hover">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#f87171]/10 rounded-full blur-2xl" />
              <CardContent className="p-6 lg:p-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-[#f87171]/20 rounded-xl">
                    <TrendingDown className="w-6 h-6 text-[#f87171]" />
                  </div>
                  <span className="text-sm text-[#f87171]">Pengeluaran</span>
                </div>
                <p className="text-sm text-muted-foreground mb-1">Total Pengeluaran</p>
                <h2 className="text-3xl lg:text-4xl font-bold text-[#f87171]">
                  {formatCurrency(totalExpense)}
                </h2>
                <div className="mt-4 flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Ideal:</span>
                  <span className="text-sm text-[#f87171]">{formatCurrency(totalIdeal)}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Summary Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4"
          key={`stats-${viewMode}`}
        >
          {[
            { label: 'Selisih', value: totalDifference, color: totalDifference >= 0 ? 'text-[#4ade80]' : 'text-[#f87171]' },
            { label: 'Gaji', value: gaji, color: 'text-[#60a5fa]' },
            { label: 'Tukin', value: tukin, color: 'text-[#a78bfa]' },
            { label: 'Uang Makan', value: uangMakan, color: 'text-[#fbbf24]' }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
              className="glass rounded-xl p-4 text-center"
            >
              <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
              <p className={`text-lg font-semibold ${stat.color}`}>
                {formatCurrency(stat.value)}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

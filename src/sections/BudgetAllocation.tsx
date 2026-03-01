import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts';
import { PieChartIcon, Target, AlertCircle, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/data/financeData';
import { useFinance } from '@/hooks/useFinance';

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    payload: {
      name: string;
      value: number;
      ideal: number;
      color: string;
    };
  }>;
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const percentage = data.ideal > 0 ? (data.value / data.ideal * 100) : 0;
    return (
      <div className="chart-tooltip">
        <p className="text-sm font-semibold mb-2" style={{ color: data.color }}>
          {data.name}
        </p>
        <div className="space-y-1">
          <div className="flex justify-between gap-4">
            <span className="text-sm text-muted-foreground">Real:</span>
            <span className="text-sm font-medium">{formatCurrency(data.value)}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-sm text-muted-foreground">Ideal:</span>
            <span className="text-sm font-medium">{formatCurrency(data.ideal)}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-sm text-muted-foreground">% Ideal:</span>
            <span className={`text-sm font-medium ${percentage > 100 ? 'text-[#f87171]' : 'text-[#4ade80]'}`}>
              {percentage.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export default function BudgetAllocation() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const { data, selectedMonth, viewMode } = useFinance();

  const isAllMonths = viewMode === -1;
  const currentData = data[selectedMonth];

  // Aggregate data based on viewMode
  const budgetData = isAllMonths
    ? currentData.expenses.map((exp, idx) => ({
      name: exp.name,
      value: data.reduce((sum, d) => sum + (d.expenses[idx]?.realAmount ?? 0), 0),
      ideal: data.reduce((sum, d) => sum + (d.expenses[idx]?.idealAmount ?? 0), 0),
      color: exp.color,
      percentage: exp.percentage,
      difference: data.reduce((sum, d) => sum + (d.expenses[idx]?.difference ?? 0), 0)
    }))
    : currentData.expenses.map(exp => ({
      name: exp.name,
      value: exp.realAmount,
      ideal: exp.idealAmount,
      color: exp.color,
      percentage: exp.percentage,
      difference: exp.difference
    }));

  const totalReal = isAllMonths
    ? data.reduce((sum, d) => sum + d.totalReal, 0)
    : currentData.totalReal;

  const totalIdeal = isAllMonths
    ? data.reduce((sum, d) => sum + d.totalIdeal, 0)
    : currentData.totalIdeal;

  const overallPercentage = totalIdeal > 0 ? (totalReal / totalIdeal * 100) : 0;

  const displayLabel = isAllMonths
    ? `Rekap semua bulan (${data.length} bulan)`
    : `${currentData.month} ${currentData.year}`;

  const onPieEnter = (_: unknown, index: number) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(null);
  };

  return (
    <section className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <Card className="bg-card glass shadow-2xl overflow-hidden border border-white/5">
            <CardHeader className="pb-3 sm:pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-gradient-to-br from-[#a78bfa]/20 to-[#7c3aed]/20 rounded-xl">
                    <PieChartIcon className="w-5 h-5 text-[#a78bfa]" />
                  </div>
                  <div>
                    <CardTitle className="text-xl sm:text-2xl font-bold text-foreground">
                      Alokasi Anggaran
                    </CardTitle>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                      {displayLabel}
                    </p>
                  </div>
                </div>
                {/* Overall budget health badge */}
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold self-start sm:self-auto ${overallPercentage <= 100
                    ? 'bg-[#4ade80]/10 text-[#4ade80] border border-[#4ade80]/20'
                    : 'bg-[#f87171]/10 text-[#f87171] border border-[#f87171]/20'
                  }`}>
                  {overallPercentage <= 100 ? (
                    <TrendingDown className="w-3.5 h-3.5" />
                  ) : (
                    <TrendingUp className="w-3.5 h-3.5" />
                  )}
                  {overallPercentage.toFixed(0)}% terpakai
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-2 sm:pt-4">
              {/* Summary mini cards - responsive */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-5 sm:mb-6">
                <div className="bg-white/[0.03] border border-white/5 rounded-xl p-2.5 sm:p-3 text-center">
                  <p className="text-[10px] sm:text-xs text-muted-foreground mb-0.5">Total Ideal</p>
                  <p className="text-xs sm:text-sm font-bold text-[#60a5fa]">{formatCurrency(totalIdeal)}</p>
                </div>
                <div className="bg-white/[0.03] border border-white/5 rounded-xl p-2.5 sm:p-3 text-center">
                  <p className="text-[10px] sm:text-xs text-muted-foreground mb-0.5">Total Real</p>
                  <p className="text-xs sm:text-sm font-bold text-[#a78bfa]">{formatCurrency(totalReal)}</p>
                </div>
                <div className="bg-white/[0.03] border border-white/5 rounded-xl p-2.5 sm:p-3 text-center">
                  <p className="text-[10px] sm:text-xs text-muted-foreground mb-0.5">Selisih</p>
                  <p className={`text-xs sm:text-sm font-bold ${totalIdeal - totalReal >= 0 ? 'text-[#4ade80]' : 'text-[#f87171]'}`}>
                    {formatCurrency(totalIdeal - totalReal)}
                  </p>
                </div>
              </div>

              {/* Main content: Chart + Details */}
              <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
                {/* Donut Chart - centered on mobile */}
                <div className="w-full lg:w-[380px] flex-shrink-0">
                  <div className="h-[280px] sm:h-[320px] relative mx-auto" style={{ maxWidth: '380px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={budgetData}
                          cx="50%"
                          cy="45%"
                          innerRadius="55%"
                          outerRadius="80%"
                          paddingAngle={3}
                          dataKey="value"
                          onMouseEnter={onPieEnter}
                          onMouseLeave={onPieLeave}
                          animationBegin={0}
                          animationDuration={1500}
                        >
                          {budgetData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={entry.color}
                              stroke="transparent"
                              strokeWidth={activeIndex === index ? 2 : 0}
                              style={{
                                filter: activeIndex === index ? `drop-shadow(0 0 8px ${entry.color}80)` : 'none',
                                transform: activeIndex === index ? 'scale(1.04)' : 'scale(1)',
                                transformOrigin: 'center',
                                transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)'
                              }}
                            />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend
                          verticalAlign="bottom"
                          height={32}
                          iconType="circle"
                          iconSize={8}
                          wrapperStyle={{ paddingTop: '12px', fontSize: '11px' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    {/* Center text */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none" style={{ marginBottom: '32px' }}>
                      <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider">Total</p>
                      <p className="text-lg sm:text-xl font-bold text-foreground mt-0.5">
                        {formatCurrency(totalReal)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Detail Anggaran - full width on mobile */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm sm:text-base font-semibold text-foreground flex items-center gap-2 mb-3">
                    <Target className="w-4 h-4 text-[#a78bfa]" />
                    Detail Anggaran
                  </h3>
                  <div className="space-y-2.5">
                    {budgetData.map((expense, index) => {
                      const percentage = expense.ideal > 0
                        ? (expense.value / expense.ideal * 100)
                        : 0;
                      const isOverBudget = percentage > 100;

                      return (
                        <motion.div
                          key={expense.name}
                          initial={{ opacity: 0, x: 15 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.08, duration: 0.4 }}
                          className="bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 rounded-xl p-3 sm:p-3.5 transition-colors duration-200"
                        >
                          {/* Header row */}
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2 min-w-0">
                              <div
                                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                                style={{ backgroundColor: expense.color }}
                              />
                              <span className="text-xs sm:text-sm font-medium text-foreground truncate">
                                {expense.name}
                              </span>
                              <span className="text-[10px] sm:text-xs text-muted-foreground flex-shrink-0">
                                {expense.percentage}%
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 flex-shrink-0">
                              {isOverBudget && (
                                <AlertCircle className="w-3.5 h-3.5 text-[#f87171]" />
                              )}
                              <span className={`text-[10px] sm:text-xs font-semibold px-1.5 py-0.5 rounded-md ${isOverBudget
                                  ? 'bg-[#f87171]/10 text-[#f87171]'
                                  : 'bg-[#4ade80]/10 text-[#4ade80]'
                                }`}>
                                {percentage.toFixed(0)}%
                              </span>
                            </div>
                          </div>

                          {/* Progress bar */}
                          <div className="relative h-1.5 sm:h-2 rounded-full bg-white/5 overflow-hidden mb-2">
                            <motion.div
                              className="absolute top-0 left-0 h-full rounded-full"
                              initial={{ width: 0 }}
                              whileInView={{ width: `${Math.min(percentage, 100)}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.8, delay: index * 0.08 }}
                              style={{
                                backgroundColor: isOverBudget ? '#f87171' : expense.color,
                              }}
                            />
                          </div>

                          {/* Values row */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                              <span className="text-[10px] sm:text-xs text-muted-foreground">Real:</span>
                              <span className="text-[10px] sm:text-xs font-medium text-foreground">
                                {formatCurrency(expense.value)}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="text-[10px] sm:text-xs text-muted-foreground">Ideal:</span>
                              <span className="text-[10px] sm:text-xs font-medium text-foreground">
                                {formatCurrency(expense.ideal)}
                              </span>
                            </div>
                            <span className={`text-[10px] sm:text-xs font-semibold ${expense.difference >= 0 ? 'text-[#4ade80]' : 'text-[#f87171]'}`}>
                              {expense.difference >= 0 ? '+' : ''}{formatCurrency(expense.difference)}
                            </span>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}

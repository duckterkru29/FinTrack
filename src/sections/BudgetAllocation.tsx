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
import { PieChartIcon, Target, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { monthlyData, formatCurrency } from '@/data/financeData';

interface BudgetAllocationProps {
  selectedMonth: number;
}

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

export default function BudgetAllocation({ selectedMonth }: BudgetAllocationProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const currentData = monthlyData[selectedMonth];
  const budgetData = currentData.expenses.map(exp => ({
    name: exp.name,
    value: exp.realAmount,
    ideal: exp.idealAmount,
    color: exp.color,
    percentage: exp.percentage,
    difference: exp.difference
  }));

  const onPieEnter = (_: unknown, index: number) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(null);
  };

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <Card className="bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] border-border overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#a78bfa]/20 rounded-lg">
                  <PieChartIcon className="w-5 h-5 text-[#a78bfa]" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold text-foreground">
                    Alokasi Anggaran
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Pembagian anggaran {currentData.month} 2026
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Donut Chart */}
                <div className="h-[350px] relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={budgetData}
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={120}
                        paddingAngle={4}
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
                            stroke={entry.color}
                            strokeWidth={activeIndex === index ? 3 : 1}
                            style={{
                              filter: activeIndex === index ? `drop-shadow(0 0 10px ${entry.color})` : 'none',
                              transform: activeIndex === index ? 'scale(1.05)' : 'scale(1)',
                              transformOrigin: 'center',
                              transition: 'all 0.3s ease'
                            }}
                          />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend
                        verticalAlign="bottom"
                        height={36}
                        iconType="circle"
                        wrapperStyle={{ paddingTop: '20px' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  {/* Center text */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <p className="text-sm text-muted-foreground">Total</p>
                    <p className="text-xl font-bold text-foreground">
                      {formatCurrency(currentData.totalReal)}
                    </p>
                  </div>
                </div>

                {/* Budget Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <Target className="w-5 h-5 text-[#a78bfa]" />
                    Detail Anggaran
                  </h3>
                  <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2">
                    {currentData.expenses.map((expense, index) => {
                      const percentage = expense.idealAmount > 0
                        ? (expense.realAmount / expense.idealAmount * 100)
                        : 0;
                      const isOverBudget = percentage > 100;

                      return (
                        <motion.div
                          key={expense.id}
                          initial={{ opacity: 0, x: 20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.1, duration: 0.5 }}
                          className="glass rounded-xl p-4"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: expense.color }}
                              />
                              <span className="text-sm font-medium text-foreground">
                                {expense.name}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                ({expense.percentage}%)
                              </span>
                            </div>
                            {isOverBudget && (
                              <AlertCircle className="w-4 h-4 text-[#f87171]" />
                            )}
                          </div>

                          <div className="flex items-center justify-between text-sm mb-2">
                            <span className="text-muted-foreground">
                              Real: {formatCurrency(expense.realAmount)}
                            </span>
                            <span className="text-muted-foreground">
                              Ideal: {formatCurrency(expense.idealAmount)}
                            </span>
                          </div>

                          <div className="relative">
                            <Progress
                              value={Math.min(percentage, 100)}
                              className="h-2"
                              style={{
                                backgroundColor: '#3a3a3a',
                              }}
                            />
                            <div
                              className="absolute top-0 left-0 h-2 rounded-full transition-all duration-500"
                              style={{
                                width: `${Math.min(percentage, 100)}%`,
                                backgroundColor: isOverBudget ? '#f87171' : expense.color
                              }}
                            />
                          </div>

                          <div className="flex items-center justify-between mt-2">
                            <span className={`text-xs ${isOverBudget ? 'text-[#f87171]' : 'text-[#4ade80]'}`}>
                              {percentage.toFixed(1)}% dari ideal
                            </span>
                            <span className={`text-xs ${expense.difference >= 0 ? 'text-[#4ade80]' : 'text-[#f87171]'}`}>
                              Selisih: {formatCurrency(expense.difference)}
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

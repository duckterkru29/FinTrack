import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getChartData, formatCurrency } from '@/data/financeData';

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="chart-tooltip">
        <p className="text-sm font-semibold mb-2">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2 mb-1">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-muted-foreground">{entry.name}:</span>
            <span className="text-sm font-medium" style={{ color: entry.color }}>
              {formatCurrency(entry.value)}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function FinancialChart() {
  const [chartData] = useState(getChartData());
  const [animationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimationComplete(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const totalPemasukan = chartData.reduce((sum, data) => sum + data.pemasukan, 0);
  const totalPengeluaran = chartData.reduce((sum, data) => sum + data.pengeluaran, 0);
  const percentage = totalPemasukan > 0 ? ((totalPemasukan - totalPengeluaran) / totalPemasukan * 100) : 0;

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
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle className="text-2xl font-bold text-foreground">
                    Grafik Keuangan
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Tren pemasukan dan pengeluaran 3 bulan terakhir
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="glass rounded-lg px-4 py-2">
                    <div className="flex items-center gap-2">
                      {percentage >= 0 ? (
                        <TrendingUp className="w-4 h-4 text-[#4ade80]" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-[#f87171]" />
                      )}
                      <span className={`text-sm font-semibold ${percentage >= 0 ? 'text-[#4ade80]' : 'text-[#f87171]'}`}>
                        {percentage >= 0 ? '+' : ''}{percentage.toFixed(1)}%
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">vs total</p>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={chartData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorPemasukan" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#60a5fa" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorPengeluaran" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f87171" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#f87171" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#3a3a3a"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="name"
                      stroke="#6b7280"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#6b7280"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `Rp ${(value / 1000000).toFixed(1)}M`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                      wrapperStyle={{ paddingTop: '20px' }}
                      iconType="circle"
                    />
                    <Area
                      type="monotone"
                      dataKey="pemasukan"
                      name="Pemasukan"
                      stroke="#60a5fa"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorPemasukan)"
                      animationDuration={2000}
                      animationBegin={0}
                    />
                    <Area
                      type="monotone"
                      dataKey="pengeluaran"
                      name="Pengeluaran"
                      stroke="#f87171"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorPengeluaran)"
                      animationDuration={2000}
                      animationBegin={500}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Stats Summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: animationComplete ? 1 : 0, y: animationComplete ? 0 : 20 }}
                  transition={{ delay: 0.2 }}
                  className="glass rounded-xl p-4"
                >
                  <p className="text-xs text-muted-foreground mb-1">Total Pemasukan</p>
                  <p className="text-lg font-semibold text-[#60a5fa]">
                    {formatCurrency(totalPemasukan)}
                  </p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: animationComplete ? 1 : 0, y: animationComplete ? 0 : 20 }}
                  transition={{ delay: 0.3 }}
                  className="glass rounded-xl p-4"
                >
                  <p className="text-xs text-muted-foreground mb-1">Total Pengeluaran</p>
                  <p className="text-lg font-semibold text-[#f87171]">
                    {formatCurrency(totalPengeluaran)}
                  </p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: animationComplete ? 1 : 0, y: animationComplete ? 0 : 20 }}
                  transition={{ delay: 0.4 }}
                  className="glass rounded-xl p-4"
                >
                  <p className="text-xs text-muted-foreground mb-1">Rata-rata Bulanan</p>
                  <p className="text-lg font-semibold text-[#4ade80]">
                    {formatCurrency(totalPemasukan / 3)}
                  </p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: animationComplete ? 1 : 0, y: animationComplete ? 0 : 20 }}
                  transition={{ delay: 0.5 }}
                  className="glass rounded-xl p-4"
                >
                  <p className="text-xs text-muted-foreground mb-1">Selisih Total</p>
                  <p className={`text-lg font-semibold ${totalPemasukan - totalPengeluaran >= 0 ? 'text-[#4ade80]' : 'text-[#f87171]'}`}>
                    {formatCurrency(totalPemasukan - totalPengeluaran)}
                  </p>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}

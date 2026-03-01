import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Layers,
  ChevronDown,
  ChevronUp,
  Target,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { monthlyData, formatCurrency } from '@/data/financeData';

interface ExpenseBreakdownProps {
  selectedMonth: number;
}

export default function ExpenseBreakdown({ selectedMonth }: ExpenseBreakdownProps) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>('1');

  const currentData = monthlyData[selectedMonth];

  const toggleCategory = (categoryId: string) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
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
                <div className="p-2 bg-[#4ade80]/20 rounded-lg">
                  <Layers className="w-5 h-5 text-[#4ade80]" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold text-foreground">
                    Detail Pengeluaran
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Rincian pengeluaran {currentData.month} 2026
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {currentData.expenses.map((category, categoryIndex) => {
                  const isExpanded = expandedCategory === category.id;
                  const categoryPercentage = category.idealAmount > 0
                    ? (category.realAmount / category.idealAmount * 100)
                    : 0;
                  const isOverBudget = categoryPercentage > 100;

                  return (
                    <motion.div
                      key={category.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: categoryIndex * 0.1, duration: 0.5 }}
                      className="glass rounded-xl overflow-hidden"
                    >
                      {/* Category Header */}
                      <div
                        className="p-4 cursor-pointer hover:bg-secondary/30 transition-colors"
                        onClick={() => toggleCategory(category.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-4 h-4 rounded-full"
                              style={{ backgroundColor: category.color }}
                            />
                            <div>
                              <h4 className="font-semibold text-foreground">
                                {category.name}
                              </h4>
                              <p className="text-xs text-muted-foreground">
                                {category.percentage}% dari pendapatan
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className={`font-medium ${isOverBudget ? 'text-[#f87171]' : 'text-[#4ade80]'}`}>
                                {formatCurrency(category.realAmount)}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Ideal: {formatCurrency(category.idealAmount)}
                              </p>
                            </div>
                            {isExpanded ? (
                              <ChevronUp className="w-5 h-5 text-muted-foreground" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-muted-foreground" />
                            )}
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mt-3">
                          <div className="relative h-2 bg-secondary rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.min(categoryPercentage, 100)}%` }}
                              transition={{ duration: 1, delay: 0.3 }}
                              className="absolute top-0 left-0 h-full rounded-full"
                              style={{ backgroundColor: isOverBudget ? '#f87171' : category.color }}
                            />
                          </div>
                          <div className="flex items-center justify-between mt-1">
                            <span className={`text-xs ${isOverBudget ? 'text-[#f87171]' : 'text-muted-foreground'}`}>
                              {categoryPercentage.toFixed(1)}% tercapai
                            </span>
                            <span className={`text-xs ${category.difference >= 0 ? 'text-[#4ade80]' : 'text-[#f87171]'}`}>
                              Selisih: {formatCurrency(category.difference)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Subcategories */}
                      <AnimatePresence>
                        {isExpanded && category.subcategories && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden border-t border-border"
                          >
                            <div className="p-4 space-y-3">
                              <div className="flex items-center gap-2 mb-3">
                                <Target className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">
                                  Sub Kategori
                                </span>
                              </div>
                              {category.subcategories.map((sub, subIndex) => {
                                const subPercentage = sub.idealAmount > 0
                                  ? (sub.realAmount / sub.idealAmount * 100)
                                  : 0;
                                const hasValue = sub.realAmount > 0 || sub.idealAmount > 0;

                                return (
                                  <motion.div
                                    key={sub.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: subIndex * 0.05 }}
                                    className={`p-3 rounded-lg ${hasValue ? 'bg-secondary/50' : 'bg-secondary/20'}`}
                                  >
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-2">
                                        {sub.realAmount > 0 ? (
                                          <CheckCircle2 className="w-4 h-4 text-[#4ade80]" />
                                        ) : sub.idealAmount > 0 ? (
                                          <AlertCircle className="w-4 h-4 text-[#fbbf24]" />
                                        ) : (
                                          <div className="w-4 h-4 rounded-full border border-muted-foreground" />
                                        )}
                                        <span className={`text-sm ${hasValue ? 'text-foreground' : 'text-muted-foreground'}`}>
                                          {sub.name}
                                        </span>
                                      </div>
                                      <div className="text-right">
                                        <p className={`text-sm font-medium ${sub.realAmount > sub.idealAmount ? 'text-[#f87171]' : 'text-foreground'}`}>
                                          {formatCurrency(sub.realAmount)}
                                        </p>
                                        {sub.idealAmount > 0 && (
                                          <p className="text-xs text-muted-foreground">
                                            Ideal: {formatCurrency(sub.idealAmount)}
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                    {sub.idealAmount > 0 && (
                                      <div className="mt-2">
                                        <Progress
                                          value={Math.min(subPercentage, 100)}
                                          className="h-1"
                                        />
                                      </div>
                                    )}
                                    {sub.notes && (
                                      <p className="text-xs text-muted-foreground mt-2 italic">
                                        {sub.notes}
                                      </p>
                                    )}
                                  </motion.div>
                                );
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>

              {/* Total Summary */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="mt-6 pt-6 border-t border-border"
              >
                <div className="glass rounded-xl p-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground mb-1">Total Ideal</p>
                      <p className="text-lg font-semibold text-[#60a5fa]">
                        {formatCurrency(currentData.totalIdeal)}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground mb-1">Total Real</p>
                      <p className="text-lg font-semibold text-[#f87171]">
                        {formatCurrency(currentData.totalReal)}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground mb-1">Selisih</p>
                      <p className={`text-lg font-semibold ${currentData.totalDifference >= 0 ? 'text-[#4ade80]' : 'text-[#f87171]'}`}>
                        {formatCurrency(currentData.totalDifference)}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground mb-1">Efisiensi</p>
                      <p className={`text-lg font-semibold ${
                        (currentData.totalDifference / currentData.totalIdeal * 100) >= 0
                          ? 'text-[#4ade80]'
                          : 'text-[#f87171]'
                      }`}>
                        {currentData.totalIdeal > 0
                          ? `${(currentData.totalDifference / currentData.totalIdeal * 100).toFixed(1)}%`
                          : '0%'}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  History,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Search,
  ChevronDown,
  ChevronUp,
  Trash2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/data/financeData';
import { useFinance } from '@/hooks/useFinance';

const categoryColors: Record<string, string> = {
  'Pendapatan': 'bg-[#60a5fa]/20 text-[#60a5fa]',
  'Biaya Hidup': 'bg-[#4ade80]/20 text-[#4ade80]',
  'Cicilan': 'bg-[#f87171]/20 text-[#f87171]',
  'Tabungan': 'bg-[#a78bfa]/20 text-[#a78bfa]',
  'Kebaikan': 'bg-[#fbbf24]/20 text-[#fbbf24]'
};

const categoryIcons: Record<string, string> = {
  'Pendapatan': '💰',
  'Biaya Hidup': '🏠',
  'Cicilan': '💳',
  'Tabungan': '🏦',
  'Kebaikan': '❤️'
};

export default function TransactionHistory() {
  const { data, selectedMonth, transactions, clearTransactions, viewMode } = useFinance();
  const currentData = data[selectedMonth];
  const isAllMonths = viewMode === -1;
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredTransactions = transactions.filter(transaction => {
    // When viewMode is "Semua" (-1), show all transactions; otherwise filter by month
    if (!isAllMonths) {
      const tDate = new Date(transaction.date);
      const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
      const matchesMonth = currentData ? (tDate.getMonth() === months.indexOf(currentData.month) && tDate.getFullYear() === currentData.year) : false;
      if (!matchesMonth) return false;
    }

    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || transaction.type === filterType;

    return matchesSearch && matchesType;
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
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
          <Card className="bg-card glass shadow-2xl overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#fbbf24]/20 rounded-lg">
                    <History className="w-5 h-5 text-[#fbbf24]" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold text-foreground">
                      Riwayat Transaksi
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {isAllMonths ? `Semua transaksi (${data.length} bulan)` : `Transaksi ${currentData?.month} ${currentData?.year}`}
                    </p>
                  </div>
                </div>

                {/* Clear Button — only for specific month */}
                {!isAllMonths && filteredTransactions.length > 0 && (
                  <button
                    onClick={() => {
                      if (window.confirm(`Hapus semua ${filteredTransactions.length} transaksi bulan ${currentData?.month} ${currentData?.year}? Ini juga akan mengembalikan nilai Budget Plan ke sebelum transaksi.`)) {
                        clearTransactions(selectedMonth);
                      }
                    }}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Hapus Semua
                  </button>
                )}

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Cari transaksi..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-full sm:w-64 bg-secondary border-border"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant={filterType === 'all' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFilterType('all')}
                      className="flex-1 sm:flex-none"
                    >
                      <Filter className="w-4 h-4 mr-2" />
                      Semua
                    </Button>
                    <Button
                      variant={filterType === 'income' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFilterType('income')}
                      className="flex-1 sm:flex-none"
                    >
                      <ArrowUpRight className="w-4 h-4 mr-2" />
                      Masuk
                    </Button>
                    <Button
                      variant={filterType === 'expense' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFilterType('expense')}
                      className="flex-1 sm:flex-none"
                    >
                      <ArrowDownRight className="w-4 h-4 mr-2" />
                      Keluar
                    </Button>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {/* Transaction List */}
              <div className="space-y-3">
                <AnimatePresence mode="popLayout">
                  {filteredTransactions.length > 0 ? (
                    filteredTransactions.map((transaction, index) => (
                      <motion.div
                        key={transaction.id}
                        layout
                        initial={{ opacity: 0, y: 20, rotateX: 5 }}
                        animate={{ opacity: 1, y: 0, rotateX: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{
                          delay: index * 0.05,
                          duration: 0.5,
                          ease: [0.16, 1, 0.3, 1]
                        }}
                        className="glass rounded-xl overflow-hidden cursor-pointer hover:bg-secondary/50 transition-colors"
                        onClick={() => toggleExpand(transaction.id)}
                      >
                        <div className="p-4">
                          <div className="flex items-center justify-between gap-2 sm:gap-4">
                            <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex-shrink-0 flex items-center justify-center text-xl sm:text-2xl ${categoryColors[transaction.category] || 'bg-secondary'}`}>
                                {categoryIcons[transaction.category] || '💵'}
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="font-medium text-sm sm:text-base text-white truncate">
                                  {transaction.description}
                                </p>
                                <div className="flex items-center gap-1.5 sm:gap-2 mt-1">
                                  <Badge variant="secondary" className="text-[9px] sm:text-xs truncate max-w-[80px] sm:max-w-none">
                                    {transaction.category}
                                  </Badge>
                                  {transaction.subcategory && (
                                    <Badge variant="outline" className="text-[9px] sm:text-xs truncate max-w-[80px] sm:max-w-none border-white/10">
                                      {transaction.subcategory}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
                              <div className="text-right">
                                <p className={`font-semibold text-sm sm:text-base whitespace-nowrap ${transaction.type === 'income' ? 'text-[#60a5fa]' : 'text-[#f87171]'
                                  }`}>
                                  {transaction.type === 'income' ? '+' : '-'}
                                  {formatCurrency(transaction.amount)}
                                </p>
                                <p className="text-[10px] sm:text-xs text-muted-foreground whitespace-nowrap">
                                  {new Date(transaction.date).toLocaleDateString('id-ID', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric'
                                  })}
                                </p>
                              </div>
                              {expandedId === transaction.id ? (
                                <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground hidden sm:block" />
                              ) : (
                                <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground hidden sm:block" />
                              )}
                            </div>
                          </div>

                          {/* Expanded Details */}
                          <AnimatePresence>
                            {expandedId === transaction.id && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden"
                              >
                                <div className="pt-4 mt-4 border-t border-border">
                                  <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                      <p className="text-muted-foreground">Tanggal</p>
                                      <p className="text-foreground">
                                        {new Date(transaction.date).toLocaleDateString('id-ID', {
                                          weekday: 'long',
                                          day: 'numeric',
                                          month: 'long',
                                          year: 'numeric'
                                        })}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-muted-foreground">Tipe</p>
                                      <p className={transaction.type === 'income' ? 'text-[#60a5fa]' : 'text-[#f87171]'}>
                                        {transaction.type === 'income' ? 'Pemasukan' : 'Pengeluaran'}
                                      </p>
                                    </div>
                                    {transaction.notes && (
                                      <div className="col-span-2">
                                        <p className="text-muted-foreground">Catatan</p>
                                        <p className="text-foreground">{transaction.notes}</p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-12"
                    >
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary flex items-center justify-center">
                        <History className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <p className="text-muted-foreground">
                        Tidak ada transaksi ditemukan
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Summary */}
              {filteredTransactions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mt-6 pt-6 border-t border-border"
                >
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <p className="text-sm text-muted-foreground">
                      Menampilkan {filteredTransactions.length} transaksi
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Total Pemasukan</p>
                        <p className="text-sm font-semibold text-[#60a5fa]">
                          {formatCurrency(
                            filteredTransactions
                              .filter(t => t.type === 'income')
                              .reduce((sum, t) => sum + t.amount, 0)
                          )}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Total Pengeluaran</p>
                        <p className="text-sm font-semibold text-[#f87171]">
                          {formatCurrency(
                            filteredTransactions
                              .filter(t => t.type === 'expense')
                              .reduce((sum, t) => sum + t.amount, 0)
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}

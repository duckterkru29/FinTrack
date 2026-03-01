import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Layers,
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
  Edit2,
  Save,
  XIcon,
  Calendar
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/data/financeData';
import { useFinance } from '@/hooks/useFinance';
import type { MonthlyData } from '@/types/finance';

export default function ExpenseBreakdown() {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const { data, selectedMonth, setSelectedMonth, updateIncome, addSubcategory, updateSubcategory, deleteSubcategory, addMonth, deleteMonthData } = useFinance();

  const currentData = data[selectedMonth];

  const [editIncomeMode, setEditIncomeMode] = useState(false);
  const [incomeForm, setIncomeForm] = useState(currentData.income);

  const [addingSubTo, setAddingSubTo] = useState<string | null>(null);
  const [newSubForm, setNewSubForm] = useState({ name: '', idealAmount: 0, realAmount: 0, notes: '' });

  const [editingSub, setEditingSub] = useState<{ catId: string, subId: string } | null>(null);
  const [editSubForm, setEditSubForm] = useState({ name: '', idealAmount: 0, realAmount: 0, notes: '' });

  const [isAddingMonth, setIsAddingMonth] = useState(false);
  const [newMonthName, setNewMonthName] = useState('');
  const [newYearName, setNewYearName] = useState(new Date().getFullYear());

  const toggleCategory = (categoryId: string) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  const handleAddMonth = () => {
    if (newMonthName.trim() === '') return;
    addMonth(newMonthName, newYearName);
    setIsAddingMonth(false);
    setNewMonthName('');
  };

  const handleSaveIncome = () => {
    updateIncome(selectedMonth, 'gaji', Number(incomeForm.gaji));
    updateIncome(selectedMonth, 'tukin', Number(incomeForm.tukin));
    updateIncome(selectedMonth, 'makan', Number(incomeForm.makan));
    updateIncome(selectedMonth, 'lainnya', Number(incomeForm.lainnya));
    setEditIncomeMode(false);
  };

  const handleAddSubcategory = (categoryId: string) => {
    if (newSubForm.name.trim() === '') return;
    addSubcategory(selectedMonth, categoryId, newSubForm.name, Number(newSubForm.idealAmount), Number(newSubForm.realAmount), newSubForm.notes);
    setAddingSubTo(null);
    setNewSubForm({ name: '', idealAmount: 0, realAmount: 0, notes: '' });
  };

  const handleSaveSubcategory = (categoryId: string, subId: string) => {
    updateSubcategory(selectedMonth, categoryId, subId, 'name', editSubForm.name);
    updateSubcategory(selectedMonth, categoryId, subId, 'notes', editSubForm.notes);
    updateSubcategory(selectedMonth, categoryId, subId, 'idealAmount', Number(editSubForm.idealAmount));
    updateSubcategory(selectedMonth, categoryId, subId, 'realAmount', Number(editSubForm.realAmount));
    setEditingSub(null);
  };

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Month Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col gap-4 w-full"
        >
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 bg-card rounded-xl p-2 sm:px-4 border border-border">
            <div className="flex items-center gap-2 flex-1">
              <Calendar className="w-5 h-5 text-muted-foreground flex-shrink-0 ml-1" />
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="flex-1 sm:flex-none w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 sm:px-4 text-sm font-medium text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer min-w-[150px] sm:min-w-[180px]"
              >
                {data.map((monthData, index) => (
                  <option key={`${monthData.month}-${monthData.year}-${index}`} value={index} className="text-foreground bg-background">
                    {monthData.month} {monthData.year}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 sm:flex-shrink-0">
              <button
                onClick={() => setIsAddingMonth(true)}
                className="flex-1 sm:flex-none justify-center px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-white/10 transition-all duration-300 flex items-center gap-1.5 border border-white/10"
              >
                <Plus className="w-4 h-4" /> <span className="whitespace-nowrap">Tambah</span>
              </button>

              <button
                onClick={() => {
                  if (window.confirm(`Anda yakin ingin menghapus / mereset semua data simulasi pada bulan ${currentData.month} ${currentData.year}?`)) {
                    deleteMonthData(selectedMonth);
                  }
                }}
                className="flex-1 sm:flex-none justify-center px-3 py-2 rounded-lg text-sm font-medium text-[#f87171] hover:text-[#ef4444] hover:bg-[#f87171]/10 transition-all duration-300 flex items-center gap-1.5 border border-[#f87171]/20"
              >
                <Trash2 className="w-4 h-4" /> <span className="whitespace-nowrap">Reset</span>
              </button>
            </div>
          </div>

          {isAddingMonth && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-card rounded-xl p-3 border border-border w-full sm:w-max"
            >
              <Input
                placeholder="Nama Bulan"
                value={newMonthName}
                onChange={(e) => setNewMonthName(e.target.value)}
                className="w-full sm:w-32 h-9 rounded-lg border-white/10 bg-white/5 text-white focus-visible:ring-2 focus-visible:ring-primary placeholder:text-gray-400 font-medium"
              />
              <Input
                type="number"
                placeholder="Tahun"
                value={newYearName || ''}
                onChange={(e) => setNewYearName(Number(e.target.value))}
                className="w-full sm:w-24 h-9 rounded-lg border-white/10 bg-white/5 text-white focus-visible:ring-2 focus-visible:ring-primary placeholder:text-gray-400 font-medium"
              />
              <div className="flex items-center gap-2 mt-2 sm:mt-0">
                <Button size="sm" className="flex-1 sm:flex-none rounded-lg h-9 px-4 font-semibold hover:bg-primary/90" onClick={handleAddMonth}>Simpan</Button>
                <Button size="sm" variant="ghost" className="flex-1 sm:flex-none rounded-lg h-9 px-4 hover:bg-muted text-muted-foreground bg-white/5" onClick={() => setIsAddingMonth(false)}>Batal</Button>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Income Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <Card className="bg-card glass shadow-2xl overflow-hidden">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#60a5fa]/20 rounded-lg">
                  <Layers className="w-5 h-5 text-[#60a5fa]" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold text-foreground">
                    Pendapatan
                  </CardTitle>
                </div>
              </div>
              {!editIncomeMode ? (
                <Button variant="ghost" size="sm" onClick={() => { setIncomeForm(currentData.income); setEditIncomeMode(true); }}>
                  <Edit2 className="w-4 h-4 mr-2" /> Edit
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => setEditIncomeMode(false)}>
                    Batal
                  </Button>
                  <Button variant="default" size="sm" onClick={handleSaveIncome}>
                    <Save className="w-4 h-4 mr-2" /> Simpan
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {(Object.keys(currentData.income).filter(k => k !== 'total') as Array<keyof MonthlyData['income']>).map(key => (
                  <div key={key} className="glass p-4 rounded-xl">
                    <p className="text-sm text-muted-foreground capitalize mb-2">{key}</p>
                    {editIncomeMode ? (
                      <Input
                        type="number"
                        value={incomeForm[key]}
                        onChange={(e) => setIncomeForm({ ...incomeForm, [key]: Number(e.target.value) })}
                        className="bg-background"
                      />
                    ) : (
                      <p className="text-lg font-semibold text-[#60a5fa]">{formatCurrency(currentData.income[key])}</p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Expenses List */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <Card className="bg-card glass shadow-2xl overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#4ade80]/20 rounded-lg">
                  <Layers className="w-5 h-5 text-[#4ade80]" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold text-foreground">
                    Pengeluaran
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Kustomisasi sub kategori pengeluaran
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {currentData.expenses.map((category) => {
                  const isExpanded = expandedCategory === category.id;
                  const categoryPercentage = category.idealAmount > 0
                    ? (category.realAmount / category.idealAmount * 100)
                    : 0;
                  const isOverBudget = categoryPercentage > 100;

                  return (
                    <motion.div
                      key={category.id}
                      className="glass rounded-xl overflow-hidden"
                    >
                      {/* Category Header */}
                      <div
                        className="p-4 cursor-pointer hover:bg-white/5 transition-colors"
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

                        <div className="mt-3">
                          <div className="relative h-2 bg-secondary rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.min(categoryPercentage, 100)}%` }}
                              transition={{ duration: 1 }}
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
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden border-t border-border"
                          >
                            <div className="p-4 space-y-3">
                              {category.subcategories?.map((sub) => {
                                const isEditing = editingSub?.subId === sub.id && editingSub?.catId === category.id;

                                return (
                                  <div key={sub.id} className="p-3 rounded-lg bg-white/5 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                                    {isEditing ? (
                                      <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-4 gap-3">
                                        <div className="flex flex-col">
                                          <span className="text-xs text-muted-foreground ml-1 mb-1">Nama Sub Kategori</span>
                                          <Input
                                            placeholder="Nama Item"
                                            value={editSubForm.name}
                                            onChange={(e) => setEditSubForm({ ...editSubForm, name: e.target.value })}
                                            className="bg-white/10 border-white/10 text-white placeholder:text-gray-400"
                                          />
                                        </div>
                                        <div className="flex flex-col">
                                          <span className="text-xs text-muted-foreground ml-1 mb-1">Keterangan</span>
                                          <Input
                                            placeholder="Opsional"
                                            value={editSubForm.notes || ''}
                                            onChange={(e) => setEditSubForm({ ...editSubForm, notes: e.target.value })}
                                            className="bg-white/10 border-white/10 text-white placeholder:text-gray-400"
                                          />
                                        </div>
                                        <div className="flex flex-col">
                                          <span className="text-xs text-muted-foreground ml-1 mb-1">Real Amount</span>
                                          <Input
                                            type="number"
                                            placeholder="Real Amount"
                                            value={editSubForm.realAmount}
                                            onChange={(e) => setEditSubForm({ ...editSubForm, realAmount: Number(e.target.value) })}
                                            className="bg-white/10 border-white/10 text-white placeholder:text-gray-400"
                                          />
                                        </div>
                                        <div className="flex gap-2 items-end justify-end mt-4 md:mt-0">
                                          <Button variant="ghost" size="icon" onClick={() => setEditingSub(null)}>
                                            <XIcon className="w-4 h-4" />
                                          </Button>
                                          <Button size="icon" onClick={() => handleSaveSubcategory(category.id, sub.id)}>
                                            <Save className="w-4 h-4" />
                                          </Button>
                                        </div>
                                      </div>
                                    ) : (
                                      <>
                                        <div>
                                          <p className="font-medium text-foreground">{sub.name}</p>
                                          {sub.notes && <p className="text-xs text-muted-foreground">{sub.notes}</p>}
                                          <div className="flex gap-4 text-xs mt-1 text-muted-foreground">
                                            <span>Real: {formatCurrency(sub.realAmount)}</span>
                                          </div>
                                        </div>
                                        <div className="flex gap-2">
                                          <Button variant="ghost" size="icon" onClick={() => {
                                            setEditingSub({ catId: category.id, subId: sub.id });
                                            setEditSubForm({ name: sub.name, idealAmount: sub.idealAmount, realAmount: sub.realAmount, notes: sub.notes || '' });
                                          }}>
                                            <Edit2 className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                                          </Button>
                                          <Button variant="ghost" size="icon" onClick={() => deleteSubcategory(selectedMonth, category.id, sub.id)}>
                                            <Trash2 className="w-4 h-4 text-[#f87171] hover:text-[#ef4444]" />
                                          </Button>
                                        </div>
                                      </>
                                    )}
                                  </div>
                                );
                              })}

                              {/* Add Subcategory Form */}
                              {addingSubTo === category.id ? (
                                <div className="p-3 rounded-lg bg-white/5 border border-white/10 flex flex-col md:flex-row gap-4 items-end">
                                  <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3 w-full">
                                    <div className="flex flex-col">
                                      <span className="text-xs text-muted-foreground ml-1 mb-1">Nama Sub Kategori</span>
                                      <Input
                                        placeholder="Nama Kategori"
                                        value={newSubForm.name}
                                        onChange={(e) => setNewSubForm({ ...newSubForm, name: e.target.value })}
                                        className="bg-white/10 border-white/10 text-white placeholder:text-gray-400"
                                      />
                                    </div>
                                    <div className="flex flex-col">
                                      <span className="text-xs text-muted-foreground ml-1 mb-1">Keterangan</span>
                                      <Input
                                        placeholder="Opsional"
                                        value={newSubForm.notes}
                                        onChange={(e) => setNewSubForm({ ...newSubForm, notes: e.target.value })}
                                        className="bg-white/10 border-white/10 text-white placeholder:text-gray-400"
                                      />
                                    </div>
                                    <div className="flex flex-col">
                                      <span className="text-xs text-muted-foreground ml-1 mb-1">Real Amount</span>
                                      <Input
                                        type="number"
                                        placeholder="Real Amount"
                                        value={newSubForm.realAmount || ''}
                                        onChange={(e) => setNewSubForm({ ...newSubForm, realAmount: Number(e.target.value) })}
                                        className="bg-white/10 border-white/10 text-white placeholder:text-gray-400"
                                      />
                                    </div>
                                  </div>
                                  <div className="flex gap-2">
                                    <Button variant="ghost" onClick={() => setAddingSubTo(null)}>Batal</Button>
                                    <Button onClick={() => handleAddSubcategory(category.id)}>Simpan</Button>
                                  </div>
                                </div>
                              ) : (
                                <Button
                                  variant="outline"
                                  className="w-full mt-2 border-dashed border-2 bg-transparent hover:bg-white/5 border-white/20 text-white"
                                  onClick={() => setAddingSubTo(category.id)}
                                >
                                  <Plus className="w-4 h-4 mr-2" /> Tambah Sub Kategori
                                </Button>
                              )}
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
                      <p className="text-xs text-muted-foreground mb-1">Selisih Total</p>
                      <p className={`text-lg font-semibold ${currentData.totalDifference >= 0 ? 'text-[#4ade80]' : 'text-[#f87171]'}`}>
                        {formatCurrency(currentData.totalDifference)}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground mb-1">Sisa Pendapatan</p>
                      <p className={`text-lg font-semibold ${(currentData.income.total - currentData.totalReal) >= 0 ? 'text-[#4ade80]' : 'text-[#f87171]'}`}>
                        {formatCurrency(currentData.income.total - currentData.totalReal)}
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

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useFinance } from '@/hooks/useFinance';
import { PlusCircle, Info, Wallet, CheckCircle, AlertTriangle, ChevronDown, ChevronUp, X } from 'lucide-react';
import { toast } from 'sonner';
import { formatCurrency } from '@/data/financeData';

export default function AddTransaction() {
    const { data, selectedMonth, setSelectedMonth, addTransaction, transactions } = useFinance();
    const currentData = data[selectedMonth];

    // Form states
    const [showModal, setShowModal] = useState(false);
    const [type, setType] = useState<'income' | 'expense'>('expense');
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [notes, setNotes] = useState('');
    const [date, setDate] = useState(() => {
        const d = new Date();
        return d.toISOString().split('T')[0];
    });
    const [category, setCategory] = useState('');
    const [subcategory, setSubcategory] = useState('');

    // Monitoring states
    const [expandedMonitor, setExpandedMonitor] = useState<string | null>(null);

    const handleCategoryChange = (val: string) => {
        setCategory(val);
        setSubcategory('');
    };

    const resetForm = () => {
        setAmount('');
        setDescription('');
        setNotes('');
        setCategory('');
        setSubcategory('');
        setType('expense');
    };

    const handleSave = () => {
        if (!amount || Number(amount) <= 0 || !description) return;
        if (type === 'expense' && (!category || !subcategory)) return;

        addTransaction({
            date,
            description,
            amount: Number(amount),
            type,
            category: type === 'income' ? 'Pendapatan Lainnya' : category,
            subcategory: type === 'expense' ? subcategory : undefined,
            notes
        });

        resetForm();
        setShowModal(false);
        toast.success('Transaksi berhasil ditambahkan!');
    };

    const selectedCategoryObj = currentData.expenses.find(c => c.name === category);
    const selectedSubObj = selectedCategoryObj?.subcategories?.find(s => s.name === subcategory);

    // Budget preview
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    const alreadySpent = transactions
        .filter(t => {
            if (t.type !== 'expense' || t.category !== category || t.subcategory !== subcategory) return false;
            const tDate = new Date(t.date);
            return tDate.getMonth() === months.indexOf(currentData.month) && tDate.getFullYear() === currentData.year;
        })
        .reduce((sum, t) => sum + t.amount, 0);

    const budgetReal = (selectedSubObj?.realAmount ?? 0) - alreadySpent;
    const previewAmount = Number(amount) || 0;
    const sisaBudget = budgetReal - previewAmount;
    const isOverBudget = previewAmount > 0 && sisaBudget < 0;
    const usedPercent = budgetReal > 0 ? Math.min((previewAmount / budgetReal) * 100, 100) : 0;

    // Budget monitoring summary
    const monthIdx = months.indexOf(currentData.month);
    const monthYear = currentData.year;
    const monthTransactions = transactions.filter(t => {
        const tDate = new Date(t.date);
        return tDate.getMonth() === monthIdx && tDate.getFullYear() === monthYear;
    });

    const budgetSummary = (() => {
        let totalBudget = 0;
        let totalSpent = 0;

        const categories = currentData.expenses.map(cat => {
            let catBudget = 0;
            let catSpent = 0;

            const subs = (cat.subcategories || []).map(sub => {
                const spent = monthTransactions
                    .filter(t => t.type === 'expense' && t.category === cat.name && t.subcategory === sub.name)
                    .reduce((sum, t) => sum + t.amount, 0);
                catBudget += sub.realAmount;
                catSpent += spent;
                return {
                    name: sub.name,
                    budget: sub.realAmount,
                    spent,
                    remaining: sub.realAmount - spent
                };
            });

            totalBudget += catBudget;
            totalSpent += catSpent;

            return {
                name: cat.name,
                color: cat.color,
                percentage: cat.percentage,
                budget: catBudget,
                spent: catSpent,
                remaining: catBudget - catSpent,
                subs
            };
        });

        return {
            totalBudget,
            totalSpent,
            totalRemaining: totalBudget - totalSpent,
            categories
        };
    })();

    return (
        <section className="py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto space-y-8">

                {/* ===== BUDGET MONITORING DASHBOARD (Main View) ===== */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Card className="bg-card glass shadow-2xl overflow-hidden">
                        <CardHeader className="pb-4 border-b border-white/5">
                            <div className="flex items-center justify-between flex-wrap gap-3">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-[#a78bfa]/20 text-[#a78bfa] rounded-lg">
                                        <Wallet className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl">Budget Monitoring</CardTitle>
                                        <p className="text-sm text-muted-foreground mt-0.5">
                                            Sisa budget per kategori
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <select
                                        value={selectedMonth}
                                        onChange={(e) => setSelectedMonth(Number(e.target.value))}
                                        className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs font-medium text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
                                    >
                                        {data.map((monthData: { month: string; year: number }, index: number) => (
                                            <option key={`${monthData.month}-${monthData.year}`} value={index} className="text-foreground bg-background">
                                                {monthData.month} {monthData.year}
                                            </option>
                                        ))}
                                    </select>
                                    <Button
                                        onClick={() => setShowModal(true)}
                                        className="gap-2 font-semibold rounded-xl shadow-lg shadow-primary/20"
                                        size="sm"
                                    >
                                        <PlusCircle className="w-4 h-4" />
                                        Tambah
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="pt-2 sm:pt-4 space-y-4 sm:space-y-6">
                            {/* Summary Cards - Responsive */}
                            <div className="grid grid-cols-3 gap-2 sm:gap-4">
                                <div className="flex flex-col items-center justify-center text-center bg-white/[0.03] rounded-xl p-2 sm:p-4 border border-white/5 shadow-inner">
                                    <p className="text-[9px] sm:text-xs text-muted-foreground mb-0.5 sm:mb-1 uppercase tracking-wider whitespace-nowrap">Total Budget</p>
                                    <p className="text-xs sm:text-lg font-bold text-white truncate w-full">
                                        {formatCurrency(budgetSummary.totalBudget)}
                                    </p>
                                </div>
                                <div className="flex flex-col items-center justify-center text-center bg-white/[0.03] rounded-xl p-2 sm:p-4 border border-white/5 shadow-inner">
                                    <p className="text-[9px] sm:text-xs text-muted-foreground mb-0.5 sm:mb-1 uppercase tracking-wider whitespace-nowrap">Terpakai</p>
                                    <p className="text-xs sm:text-lg font-bold text-[#fbbf24] truncate w-full">
                                        {formatCurrency(budgetSummary.totalSpent)}
                                    </p>
                                </div>
                                <div className="flex flex-col items-center justify-center text-center bg-white/[0.03] rounded-xl p-2 sm:p-4 border border-white/5 shadow-inner">
                                    <p className="text-[9px] sm:text-xs text-muted-foreground mb-0.5 sm:mb-1 uppercase tracking-wider whitespace-nowrap">Sisa</p>
                                    <p className={`text-xs sm:text-lg font-bold truncate w-full ${budgetSummary.totalRemaining < 0 ? 'text-[#f87171]' : 'text-[#60a5fa]'}`}>
                                        {formatCurrency(budgetSummary.totalRemaining)}
                                    </p>
                                </div>
                            </div>

                            {/* Categories List */}
                            <div className="space-y-3">
                                {budgetSummary.categories.map((cat, index) => {
                                    const catPercent = cat.budget > 0 ? Math.min((cat.spent / cat.budget) * 100, 100) : 0;
                                    const catOver = cat.remaining < 0;
                                    const isExpanded = expandedMonitor === cat.name;

                                    return (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            key={cat.name}
                                            className="rounded-xl border border-white/[0.08] bg-white/[0.01] hover:bg-white/[0.03] transition-all duration-300 overflow-hidden"
                                        >
                                            {/* Category Header */}
                                            <button
                                                onClick={() => setExpandedMonitor(isExpanded ? null : cat.name)}
                                                className="w-full p-3 sm:p-4 flex items-center justify-between group"
                                            >
                                                <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                                                    <div
                                                        className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full flex-shrink-0 transition-transform group-hover:scale-110"
                                                        style={{ backgroundColor: cat.color, boxShadow: `0 0 8px ${cat.color}80` }}
                                                    />
                                                    <div className="text-left truncate">
                                                        <p className="text-sm sm:text-base font-semibold text-white truncate">{cat.name}</p>
                                                        <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">{cat.percentage}% alokasi</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0 ml-2">
                                                    <div className="text-right">
                                                        <p className={`text-sm sm:text-base font-bold ${catOver ? 'text-[#f87171]' : 'text-[#60a5fa]'}`}>
                                                            {formatCurrency(cat.remaining)}
                                                        </p>
                                                        <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 uppercase tracking-wider">sisa</p>
                                                    </div>
                                                    <div className="p-1.5 sm:p-2 bg-white/5 rounded-lg group-hover:bg-white/10 transition-colors">
                                                        {isExpanded
                                                            ? <ChevronUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                                                            : <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                                                        }
                                                    </div>
                                                </div>
                                            </button>

                                            {/* Progress bar */}
                                            <div className="px-3 sm:px-4 pb-3 sm:pb-4">
                                                <div className="relative h-1.5 sm:h-2 bg-black/40 rounded-full overflow-hidden border border-white/5">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${catPercent}%` }}
                                                        transition={{ duration: 1, ease: "easeOut" }}
                                                        className={`absolute top-0 left-0 h-full rounded-full ${catOver ? 'bg-[#f87171]' : ''}`}
                                                        style={{
                                                            backgroundColor: catOver ? undefined : cat.color,
                                                            boxShadow: catOver ? undefined : `0 0 10px ${cat.color}80`
                                                        }}
                                                    />
                                                </div>
                                            </div>

                                            {/* Subcategories */}
                                            <AnimatePresence>
                                                {isExpanded && (
                                                    <motion.div
                                                        initial={{ height: 0 }}
                                                        animate={{ height: 'auto' }}
                                                        exit={{ height: 0 }}
                                                        className="overflow-hidden"
                                                    >
                                                        <div className="border-t border-white/5 bg-black/20 pt-1 pb-2">
                                                            {cat.subs.map((sub) => {
                                                                const subOver = sub.remaining < 0;
                                                                const subPercent = sub.budget > 0 ? Math.min((sub.spent / sub.budget) * 100, 100) : 0;
                                                                return (
                                                                    <div key={sub.name} className="px-4 py-2 flex items-center justify-between border-b border-white-[0.03] last:border-b-0 hover:bg-white/[0.02] transition-colors">
                                                                        <div className="flex-1 min-w-0 pr-3">
                                                                            <div className="flex items-center justify-between mb-1.5">
                                                                                <span className="text-[11px] sm:text-xs text-white/80 font-medium truncate">{sub.name}</span>
                                                                                <span className={`text-[11px] sm:text-xs font-semibold whitespace-nowrap ml-2 ${subOver ? 'text-[#f87171]' : 'text-[#4ade80]'}`}>
                                                                                    {formatCurrency(sub.remaining)}
                                                                                </span>
                                                                            </div>
                                                                            <div className="flex items-center gap-2">
                                                                                <div className="flex-1 relative h-1 bg-white/10 rounded-full overflow-hidden">
                                                                                    <div
                                                                                        className={`absolute top-0 left-0 h-full rounded-full transition-all duration-500 ${subOver ? 'bg-[#f87171]' : 'bg-[#a78bfa]'}`}
                                                                                        style={{ width: `${subPercent}%` }}
                                                                                    />
                                                                                </div>
                                                                                <span className="text-[9px] sm:text-[10px] text-muted-foreground whitespace-nowrap min-w-[3.5rem] text-right">
                                                                                    {formatCurrency(sub.spent)} / {formatCurrency(sub.budget)}
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
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
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* ===== MODAL POPUP — Tambah Transaksi ===== */}
            <AnimatePresence>
                {showModal && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                            onClick={() => { setShowModal(false); resetForm(); }}
                        />

                        {/* Modal Content */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                            className="fixed inset-0 z-50 flex items-center justify-center p-4"
                            onClick={(e) => { if (e.target === e.currentTarget) { setShowModal(false); resetForm(); } }}
                        >
                            <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-card border border-white/10 shadow-2xl">
                                {/* Modal Header */}
                                <div className="sticky top-0 bg-card/95 backdrop-blur-sm border-b border-white/5 p-4 flex items-center justify-between rounded-t-2xl z-10">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-primary/20 text-primary rounded-lg">
                                            <PlusCircle className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h2 className="text-lg font-bold text-white">Tambah Transaksi</h2>
                                            <p className="text-xs text-muted-foreground">Catat pemasukan atau pengeluaran baru</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => { setShowModal(false); resetForm(); }}
                                        className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-muted-foreground hover:text-white"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Modal Body */}
                                <div className="p-4 space-y-5">

                                    {/* Type Toggle */}
                                    <div className="flex bg-white/5 border border-white/5 p-1 rounded-xl">
                                        <button
                                            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${type === 'expense' ? 'bg-[#ef4444] text-white' : 'text-muted-foreground hover:text-white'}`}
                                            onClick={() => setType('expense')}
                                        >
                                            Pengeluaran
                                        </button>
                                        <button
                                            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${type === 'income' ? 'bg-[#22c55e] text-white' : 'text-muted-foreground hover:text-white'}`}
                                            onClick={() => setType('income')}
                                        >
                                            Pemasukan
                                        </button>
                                    </div>

                                    {/* Category & Subcategory */}
                                    <div className="space-y-4 rounded-xl bg-white/5 p-4 border border-white/10">
                                        {type === 'expense' && (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                <div className="space-y-1.5">
                                                    <label className="text-xs font-medium ml-1 text-muted-foreground">Kategori Pengeluaran</label>
                                                    <select
                                                        className="flex h-10 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                                        value={category}
                                                        onChange={(e) => handleCategoryChange(e.target.value)}
                                                    >
                                                        <option value="" disabled className="text-foreground bg-background">Pilih Kategori...</option>
                                                        {currentData.expenses.map(cat => (
                                                            <option key={cat.id} value={cat.name} className="text-foreground bg-background">{cat.name}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="space-y-1.5">
                                                    <label className="text-xs font-medium ml-1 text-muted-foreground">Sub Kategori</label>
                                                    <select
                                                        className="flex h-10 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                                        value={subcategory}
                                                        onChange={(e) => setSubcategory(e.target.value)}
                                                        disabled={!category}
                                                    >
                                                        <option value="" disabled className="text-foreground bg-background">Pilih Sub...</option>
                                                        {selectedCategoryObj?.subcategories?.map(sub => (
                                                            <option key={sub.id} value={sub.name} className="text-foreground bg-background">{sub.name}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                        )}

                                        {type === 'income' && (
                                            <div className="flex items-center gap-3 text-sm text-[#4ade80] bg-[#4ade80]/10 p-3 rounded-lg border border-[#4ade80]/20">
                                                <Info className="w-5 h-5 flex-shrink-0" />
                                                <p className="text-xs">Pemasukan akan ditambahkan ke "Pendapatan Lainnya" pada {currentData.month} {currentData.year}.</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Budget Preview */}
                                    <AnimatePresence>
                                        {type === 'expense' && subcategory && selectedSubObj && (
                                            <motion.div
                                                key="budget-preview"
                                                initial={{ opacity: 0, y: -8 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -8 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                <div className={`rounded-xl border p-3 space-y-2 ${isOverBudget ? 'bg-red-500/10 border-red-500/30' : 'bg-primary/5 border-primary/20'}`}>
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <Wallet className={`w-3.5 h-3.5 ${isOverBudget ? 'text-red-400' : 'text-primary'}`} />
                                                            <span className="text-xs font-semibold text-white">Budget — {subcategory}</span>
                                                        </div>
                                                        {previewAmount > 0 && (isOverBudget ? (
                                                            <span className="text-[10px] text-red-400 font-medium bg-red-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                                                                <AlertTriangle className="w-2.5 h-2.5" /> Over!
                                                            </span>
                                                        ) : (
                                                            <span className="text-[10px] text-primary font-medium bg-primary/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                                                                <CheckCircle className="w-2.5 h-2.5" /> Aman
                                                            </span>
                                                        ))}
                                                    </div>

                                                    <div className={`grid ${previewAmount > 0 ? 'grid-cols-2' : 'grid-cols-1'} gap-2`}>
                                                        <div className="text-center bg-white/5 rounded-lg p-2">
                                                            <p className="text-[10px] text-muted-foreground">Budget Tersedia</p>
                                                            <p className="text-sm font-bold text-white">{formatCurrency(budgetReal)}</p>
                                                        </div>
                                                        {previewAmount > 0 && (
                                                            <div className="text-center bg-white/5 rounded-lg p-2">
                                                                <p className="text-[10px] text-muted-foreground">Sisa Setelah</p>
                                                                <p className={`text-sm font-bold ${isOverBudget ? 'text-red-400' : 'text-primary'}`}>
                                                                    {formatCurrency(sisaBudget)}
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {previewAmount > 0 && (
                                                        <div className="relative h-1.5 bg-white/10 rounded-full overflow-hidden">
                                                            <motion.div
                                                                animate={{ width: `${usedPercent}%` }}
                                                                transition={{ duration: 0.3 }}
                                                                className={`absolute top-0 left-0 h-full rounded-full ${isOverBudget ? 'bg-red-500' : 'bg-primary'}`}
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Date & Amount */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-medium ml-1 text-muted-foreground">Tanggal</label>
                                            <Input
                                                type="date"
                                                value={date}
                                                onChange={(e) => setDate(e.target.value)}
                                                className="bg-white/5 border-white/10 text-white"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-medium ml-1 text-muted-foreground">Nominal (Rp)</label>
                                            <Input
                                                type="number"
                                                placeholder="0"
                                                value={amount}
                                                onChange={(e) => setAmount(e.target.value)}
                                                className="bg-white/5 border-white/10 text-white font-medium placeholder:text-gray-400/70"
                                            />
                                        </div>
                                    </div>

                                    {/* Description & Notes */}
                                    <div className="space-y-3">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-medium ml-1 text-muted-foreground">Deskripsi Utama</label>
                                            <Input
                                                placeholder="Contoh: Beli Beras 5KG"
                                                value={description}
                                                onChange={(e) => setDescription(e.target.value)}
                                                className="bg-white/5 border-white/10 text-white placeholder:text-gray-400/70"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-medium ml-1 text-muted-foreground">Keterangan (Opsional)</label>
                                            <Input
                                                placeholder="Toko A"
                                                value={notes}
                                                onChange={(e) => setNotes(e.target.value)}
                                                className="bg-white/5 border-white/10 text-white placeholder:text-gray-400/70"
                                            />
                                        </div>
                                    </div>

                                    {/* Save Button */}
                                    <Button
                                        onClick={handleSave}
                                        className="w-full font-medium"
                                        size="lg"
                                        disabled={!amount || Number(amount) <= 0 || !description || (type === 'expense' && (!category || !subcategory))}
                                    >
                                        Simpan Transaksi
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </section>
    );
}

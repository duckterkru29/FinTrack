import React, { createContext, useContext, useState, useEffect } from 'react';
import lzString from 'lz-string';
import { monthlyData as initialMonthlyData } from '@/data/financeData';
import type { MonthlyData } from '@/types/finance';

interface FinanceContextType {
    data: MonthlyData[];
    selectedMonth: number;
    setSelectedMonth: (index: number) => void;
    viewMode: number; // -1 = all months, >= 0 = specific month
    setViewMode: (mode: number) => void;
    updateIncome: (monthIndex: number, field: keyof MonthlyData['income'], value: number) => void;
    addSubcategory: (monthIndex: number, categoryId: string, subName: string, idealAmount: number, realAmount: number, notes?: string) => void;
    updateSubcategory: (monthIndex: number, categoryId: string, subId: string, field: 'name' | 'idealAmount' | 'realAmount' | 'notes', value: any) => void;
    deleteSubcategory: (monthIndex: number, categoryId: string, subId: string) => void;
    addMonth: (month: string, year: number) => void;
    deleteMonthData: (monthIndex: number) => void;
    transactions: import('@/types/finance').Transaction[];
    addTransaction: (transaction: Omit<import('@/types/finance').Transaction, 'id'>) => void;
    clearTransactions: (monthIndex: number) => void;
    exportDataAsLink: () => string;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

const recalculateTotals = (monthData: MonthlyData): MonthlyData => {
    // Recalculate income total
    const incomeTotal = monthData.income.gaji + monthData.income.tukin + monthData.income.makan + monthData.income.lainnya;

    // Recalculate expenses
    let mTotalIdeal = 0;
    let mTotalReal = 0;

    const updatedExpenses = monthData.expenses.map(cat => {
        let ideal = incomeTotal * (cat.percentage / 100);
        let real = 0;
        if (cat.subcategories) {
            cat.subcategories.forEach(sub => {
                real += sub.realAmount;
            });
        }
        mTotalIdeal += ideal;
        mTotalReal += real;

        return {
            ...cat,
            idealAmount: ideal,
            realAmount: real,
            difference: ideal - real
        };
    });

    return {
        ...monthData,
        income: {
            ...monthData.income,
            total: incomeTotal
        },
        expenses: updatedExpenses,
        totalIdeal: mTotalIdeal,
        totalReal: mTotalReal,
        totalDifference: mTotalIdeal - mTotalReal,
    };
};

const MONTH_ORDER = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

const sortMonths = (arr: MonthlyData[]) =>
    [...arr].sort((a, b) => {
        if (a.year !== b.year) return a.year - b.year;
        return MONTH_ORDER.indexOf(a.month) - MONTH_ORDER.indexOf(b.month);
    });

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [data, setData] = useState<MonthlyData[]>(() => {
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem('fintrack_data_v2');
            if (stored) {
                try {
                    const parsed = JSON.parse(stored) as MonthlyData[];
                    return sortMonths(parsed.map(recalculateTotals));
                } catch (e) {
                    console.error("Failed to parse local storage data", e);
                }
            }
        }
        return sortMonths(initialMonthlyData.map(recalculateTotals));
    });

    const [selectedMonth, setSelectedMonth] = useState<number>(() => {
        if (typeof window !== 'undefined') {
            const storedIndex = localStorage.getItem('fintrack_selected_month_v2');
            if (storedIndex !== null) {
                const idx = parseInt(storedIndex, 10);
                if (!isNaN(idx)) return idx;
            }
        }
        return data.length > 0 ? data.length - 1 : 0;
    });

    // viewMode: -1 = all months recap, >= 0 = specific month index
    const [viewMode, setViewMode] = useState<number>(-1);

    const [transactions, setTransactions] = useState<import('@/types/finance').Transaction[]>(() => {
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem('fintrack_transactions_v2');
            if (stored) {
                try {
                    return JSON.parse(stored);
                } catch (e) {
                    console.error("Failed to parse transactions local storage data", e);
                }
            }
        }
        return [];
    });

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const shareParam = params.get('share');
        if (shareParam) {
            try {
                const decompressed = lzString.decompressFromEncodedURIComponent(shareParam);
                if (decompressed) {
                    const parsedShare = JSON.parse(decompressed);
                    if (parsedShare && parsedShare.data) {
                        setTimeout(() => {
                            if (window.confirm("📦 Ditemukan data FinTrack yang dibagikan via link!\n\nApakah Anda ingin mengimpor data ini? \nPERINGATAN: Semua data lokal Anda saat ini akan tertimpa secara permanen.")) {
                                setData(sortMonths(parsedShare.data.map(recalculateTotals)));
                                if (parsedShare.transactions) {
                                    setTransactions(parsedShare.transactions);
                                }
                            }
                        }, 500); // delay slighty to ensure UI loads before prompt blocking
                    } else {
                        alert("Format link data tidak valid.");
                    }
                } else {
                    alert("Link data rusak atau tidak valid.");
                }
            } catch (e) {
                console.error("Failed to parse shared data", e);
                alert("Gagal mengimpor data dari link. Mungkin link tidak utuh.");
            } finally {
                // remove share from URL to prevent looping
                window.history.replaceState({}, document.title, window.location.pathname);
            }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('fintrack_data_v2', JSON.stringify(data));
    }, [data]);

    useEffect(() => {
        localStorage.setItem('fintrack_selected_month_v2', selectedMonth.toString());
    }, [selectedMonth]);

    useEffect(() => {
        localStorage.setItem('fintrack_transactions_v2', JSON.stringify(transactions));
    }, [transactions]);

    const updateIncome = (monthIndex: number, field: keyof MonthlyData['income'], value: number) => {
        setData(prev => {
            const newData = [...prev];
            newData[monthIndex] = {
                ...newData[monthIndex],
                income: {
                    ...newData[monthIndex].income,
                    [field]: value
                }
            };
            newData[monthIndex] = recalculateTotals(newData[monthIndex]);
            return newData;
        });
    };

    const addSubcategory = (monthIndex: number, categoryId: string, subName: string, idealAmount: number, realAmount: number, notes?: string) => {
        setData(prev => {
            const newData = [...prev];
            const categoryIndex = newData[monthIndex].expenses.findIndex(c => c.id === categoryId);
            if (categoryIndex === -1) return prev;

            const category = newData[monthIndex].expenses[categoryIndex];
            const newSub = {
                id: Date.now().toString(),
                name: subName,
                idealAmount,
                realAmount,
                notes: notes || ''
            };

            const updatedCategory = {
                ...category,
                subcategories: [...(category.subcategories || []), newSub]
            };

            newData[monthIndex].expenses[categoryIndex] = updatedCategory;
            newData[monthIndex] = recalculateTotals(newData[monthIndex]);
            return newData;
        });
    };

    const updateSubcategory = (monthIndex: number, categoryId: string, subId: string, field: 'name' | 'idealAmount' | 'realAmount' | 'notes', value: any) => {
        setData(prev => {
            const newData = [...prev];
            const categoryIndex = newData[monthIndex].expenses.findIndex(c => c.id === categoryId);
            if (categoryIndex === -1) return prev;

            const category = newData[monthIndex].expenses[categoryIndex];
            const updatedSubcategories = (category.subcategories || []).map(sub => {
                if (sub.id === subId) {
                    return { ...sub, [field]: value };
                }
                return sub;
            });

            newData[monthIndex].expenses[categoryIndex] = {
                ...category,
                subcategories: updatedSubcategories
            };
            newData[monthIndex] = recalculateTotals(newData[monthIndex]);
            return newData;
        });
    };

    const deleteSubcategory = (monthIndex: number, categoryId: string, subId: string) => {
        setData(prev => {
            const newData = [...prev];
            const categoryIndex = newData[monthIndex].expenses.findIndex(c => c.id === categoryId);
            if (categoryIndex === -1) return prev;

            const category = newData[monthIndex].expenses[categoryIndex];
            const updatedSubcategories = (category.subcategories || []).filter(sub => sub.id !== subId);

            newData[monthIndex].expenses[categoryIndex] = {
                ...category,
                subcategories: updatedSubcategories
            };
            newData[monthIndex] = recalculateTotals(newData[monthIndex]);
            return newData;
        });
    };

    const addMonth = (month: string, year: number) => {
        const monthOrder = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

        setData(prev => {
            const lastMonth = prev[prev.length - 1];

            const incomeTotal = lastMonth.income.gaji + lastMonth.income.tukin + lastMonth.income.makan + lastMonth.income.lainnya;

            // Deep copy expenses, reset realAmount to 0
            const newExpenses = lastMonth.expenses.map(cat => {
                const subcategories = cat.subcategories ? cat.subcategories.map(sub => ({
                    ...sub,
                    realAmount: 0
                })) : [];

                const ideal = incomeTotal * (cat.percentage / 100);
                const real = 0;

                return {
                    ...cat,
                    idealAmount: ideal,
                    realAmount: real,
                    difference: ideal - real,
                    subcategories
                };
            });

            const newMonth: MonthlyData = {
                month,
                year,
                income: {
                    gaji: lastMonth.income.gaji,
                    tukin: lastMonth.income.tukin,
                    makan: lastMonth.income.makan,
                    lainnya: 0,
                    total: incomeTotal
                },
                expenses: newExpenses,
                totalIdeal: lastMonth.totalIdeal,
                totalReal: 0,
                totalDifference: lastMonth.totalIdeal
            };

            const recalculatedNewMonth = recalculateTotals(newMonth);
            const allData = [...prev, recalculatedNewMonth];

            // Sort chronologically: by year first, then by month order
            allData.sort((a, b) => {
                if (a.year !== b.year) return a.year - b.year;
                return monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month);
            });

            // Find the index of the newly added month after sorting
            const newIndex = allData.findIndex(d => d.month === month && d.year === year);
            setTimeout(() => setSelectedMonth(newIndex >= 0 ? newIndex : allData.length - 1), 0);

            return allData;
        });
    };

    const deleteMonthData = (monthIndex: number) => {
        setData(prev => {
            const newData = [...prev];
            const monthToClear = newData[monthIndex];

            const clearedIncome = {
                gaji: 0, tukin: 0, makan: 0, lainnya: 0, total: 0
            };

            const clearedExpenses = monthToClear.expenses.map(cat => ({
                ...cat,
                idealAmount: 0,
                realAmount: 0,
                difference: 0,
                subcategories: cat.subcategories ? cat.subcategories.map(sub => ({
                    ...sub,
                    realAmount: 0
                })) : []
            }));

            newData[monthIndex] = {
                ...monthToClear,
                income: clearedIncome,
                expenses: clearedExpenses,
            };

            newData[monthIndex] = recalculateTotals(newData[monthIndex]);
            return newData;
        });

        // Also remove transactions for this month/year combo
        setTransactions(prev => prev.filter(t => {
            const tDate = new Date(t.date);
            const mData = data[monthIndex];
            if (!mData) return true;
            return !(tDate.getMonth() === ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'].indexOf(mData.month) && tDate.getFullYear() === mData.year);
        }));
    };

    const addTransaction = (transaction: Omit<import('@/types/finance').Transaction, 'id'>) => {
        const newTx = { ...transaction, id: Date.now().toString() };
        setTransactions(prev => [newTx, ...prev]);

        // Only update budget data for income transactions (adds to "Pendapatan Lainnya")
        // Expense transactions do NOT modify budget plan data — budget preview calculates remaining dynamically
        if (transaction.type === 'income') {
            setData(prev => {
                const newData = [...prev];
                const monthData = { ...newData[selectedMonth] };
                monthData.income = { ...monthData.income, lainnya: monthData.income.lainnya + transaction.amount };
                newData[selectedMonth] = recalculateTotals(monthData);
                return newData;
            });
        }
    };

    const clearTransactions = (monthIndex: number) => {
        const mData = data[monthIndex];
        if (!mData) return;
        const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
        const mMonthIdx = months.indexOf(mData.month);

        // Get transactions to remove (for this month)
        const txToRemove = transactions.filter(t => {
            const tDate = new Date(t.date);
            return tDate.getMonth() === mMonthIdx && tDate.getFullYear() === mData.year;
        });

        // Only reverse income transactions (expense transactions don't modify budget plan)
        const incomeRemoved = txToRemove
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);

        if (incomeRemoved > 0) {
            setData(prev => {
                const newData = [...prev];
                const monthData = { ...newData[monthIndex] };
                monthData.income = { ...monthData.income, lainnya: Math.max(0, monthData.income.lainnya - incomeRemoved) };
                newData[monthIndex] = recalculateTotals(monthData);
                return newData;
            });
        }

        // Remove the transactions
        setTransactions(prev => prev.filter(t => {
            const tDate = new Date(t.date);
            return !(tDate.getMonth() === mMonthIdx && tDate.getFullYear() === mData.year);
        }));
    };

    const exportDataAsLink = () => {
        const payload = { data, transactions };
        const compressed = lzString.compressToEncodedURIComponent(JSON.stringify(payload));
        return `${window.location.origin}${window.location.pathname}?share=${compressed}`;
    };

    return (
        <FinanceContext.Provider value={{
            data, selectedMonth, setSelectedMonth, viewMode, setViewMode, updateIncome, addSubcategory,
            updateSubcategory, deleteSubcategory, addMonth, deleteMonthData,
            transactions, addTransaction, clearTransactions, exportDataAsLink
        }}>
            {children}
        </FinanceContext.Provider>
    );
};

export const useFinance = () => {
    const context = useContext(FinanceContext);
    if (context === undefined) {
        throw new Error('useFinance must be used within a FinanceProvider');
    }
    return context;
};

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Calendar,
  Tag,
  FileText,
  DollarSign,
  CheckCircle2,
  ArrowRightLeft
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

interface TransactionFormProps {
  onAddTransaction?: (transaction: {
    description: string;
    amount: number;
    type: 'income' | 'expense';
    category: string;
    date: string;
    notes: string;
  }) => void;
}

const categories = {
  income: [
    { value: 'Gaji', label: 'Gaji', icon: '💰' },
    { value: 'Tukin', label: 'Tukin', icon: '💵' },
    { value: 'Uang Makan', label: 'Uang Makan', icon: '🍽️' },
    { value: 'Lainnya', label: 'Lainnya', icon: '💎' }
  ],
  expense: [
    { value: 'Biaya Hidup', label: 'Biaya Hidup', icon: '🏠' },
    { value: 'Cicilan', label: 'Cicilan/Tagihan', icon: '💳' },
    { value: 'Tabungan', label: 'Tabungan/Investasi', icon: '🏦' },
    { value: 'Kebaikan', label: 'Kebaikan', icon: '❤️' }
  ]
};

export default function TransactionForm({ onAddTransaction }: TransactionFormProps) {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    type: 'expense' as 'income' | 'expense',
    category: '',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate submission
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (onAddTransaction) {
      onAddTransaction({
        description: formData.description,
        amount: parseFloat(formData.amount),
        type: formData.type,
        category: formData.category,
        date: formData.date,
        notes: formData.notes
      });
    }

    setIsSubmitting(false);
    setShowSuccess(true);

    // Reset form
    setFormData({
      description: '',
      amount: '',
      type: 'expense',
      category: '',
      date: new Date().toISOString().split('T')[0],
      notes: ''
    });

    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (field === 'type') {
      setFormData(prev => ({ ...prev, category: '' }));
    }
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
          <Card className="bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] border-border overflow-hidden max-w-2xl mx-auto">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#4ade80]/20 rounded-lg">
                  <Plus className="w-5 h-5 text-[#4ade80]" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold text-foreground">
                    Tambah Transaksi
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Catat transaksi baru Anda
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Transaction Type Toggle */}
                <div className="flex justify-center">
                  <div className="inline-flex bg-secondary rounded-full p-1">
                    <button
                      type="button"
                      onClick={() => handleChange('type', 'income')}
                      className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                        formData.type === 'income'
                          ? 'bg-[#60a5fa] text-white'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <ArrowRightLeft className="w-4 h-4" />
                      Pemasukan
                    </button>
                    <button
                      type="button"
                      onClick={() => handleChange('type', 'expense')}
                      className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                        formData.type === 'expense'
                          ? 'bg-[#f87171] text-white'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <ArrowRightLeft className="w-4 h-4" />
                      Pengeluaran
                    </button>
                  </div>
                </div>

                {/* Amount and Date */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount" className="text-foreground flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      Jumlah
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        Rp
                      </span>
                      <Input
                        id="amount"
                        type="number"
                        placeholder="0"
                        value={formData.amount}
                        onChange={(e) => handleChange('amount', e.target.value)}
                        className="pl-10 bg-secondary border-border input-glow"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date" className="text-foreground flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Tanggal
                    </Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => handleChange('date', e.target.value)}
                      className="bg-secondary border-border input-glow"
                      required
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-foreground flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Deskripsi
                  </Label>
                  <Input
                    id="description"
                    placeholder="Contoh: Gaji Bulanan, Belanja groceries..."
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    className="bg-secondary border-border input-glow"
                    required
                  />
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-foreground flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    Kategori
                  </Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => handleChange('category', value)}
                  >
                    <SelectTrigger className="bg-secondary border-border input-glow">
                      <SelectValue placeholder="Pilih kategori" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      {categories[formData.type].map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          <div className="flex items-center gap-2">
                            <span>{cat.icon}</span>
                            <span>{cat.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Notes */}
                <div className="space-y-2">
                  <Label htmlFor="notes" className="text-foreground">
                    Catatan (Opsional)
                  </Label>
                  <Textarea
                    id="notes"
                    placeholder="Tambahkan catatan..."
                    value={formData.notes}
                    onChange={(e) => handleChange('notes', e.target.value)}
                    className="bg-secondary border-border input-glow min-h-[80px]"
                  />
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isSubmitting || !formData.category}
                  className={`w-full py-6 text-lg font-semibold transition-all duration-500 ${
                    formData.type === 'income'
                      ? 'bg-[#60a5fa] hover:bg-[#3b82f6]'
                      : 'bg-[#f87171] hover:bg-[#ef4444]'
                  }`}
                >
                  {isSubmitting ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                  ) : showSuccess ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-5 h-5" />
                      Berhasil Disimpan!
                    </motion.div>
                  ) : (
                    <>
                      <Plus className="w-5 h-5 mr-2" />
                      Simpan Transaksi
                    </>
                  )}
                </Button>

                {/* Quick Tags */}
                <div className="pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground mb-3">Transaksi Cepat:</p>
                  <div className="flex flex-wrap gap-2">
                    {['Gaji', 'Makan', 'Transport', 'Listrik', 'Internet'].map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                        onClick={() => handleChange('description', tag)}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}

import { motion } from 'framer-motion';
import {
  Wallet,
  Github,
  Twitter,
  Mail,
  Heart
} from 'lucide-react';
import { useFinance } from '@/hooks/useFinance';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { data, selectedMonth, transactions } = useFinance();

  const currentData = data[selectedMonth];
  const categoriesCount = currentData ? currentData.expenses.length : 0;

  return (
    <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-border">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex flex-col md:flex-row items-center justify-between gap-6"
        >
          {/* Logo and Tagline */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/20 flex items-center justify-center">
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">
                FinTrack
              </span>
            </div>
            <p className="text-sm text-muted-foreground text-center md:text-left">
              Kelola keuangan Anda dengan mudah dan cerdas
            </p>
          </div>

          {/* Quick Stats */}
          <div className="flex items-center gap-8">
            <div className="text-center">
              <p className="text-2xl font-bold text-accent">{data.length}</p>
              <p className="text-xs text-muted-foreground">Bulan Data</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{transactions.length}</p>
              <p className="text-xs text-muted-foreground">Transaksi</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-[#a78bfa]">{categoriesCount}</p>
              <p className="text-xs text-muted-foreground">Kategori</p>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            <motion.a
              href="#"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors"
            >
              <Github className="w-5 h-5" />
            </motion.a>
            <motion.a
              href="#"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors"
            >
              <Twitter className="w-5 h-5" />
            </motion.a>
            <motion.a
              href="#"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors"
            >
              <Mail className="w-5 h-5" />
            </motion.a>
          </div>
        </motion.div>

        {/* Copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mt-8 pt-8 border-t border-border text-center"
        >
          <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
            © {currentYear} FinTrack. Dibuat dengan
            <Heart className="w-4 h-4 text-[#f87171] fill-[#f87171]" />
            untuk pengelolaan keuangan yang lebih baik
          </p>
        </motion.div>
      </div>
    </footer>
  );
}

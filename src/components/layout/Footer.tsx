import { ShieldCheck, Truck, CreditCard, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-slate-50 dark:bg-[#141414] border-t border-slate-200 dark:border-slate-800 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12 border-b border-slate-200 dark:border-slate-800 pb-12">
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <ShieldCheck className="w-8 h-8 text-pumpkin mb-4" />
            <h4 className="font-semibold mb-2">100% Original</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400">Jaminan uang kembali jika produk terbukti tidak asli.</p>
          </div>
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <Truck className="w-8 h-8 text-pumpkin mb-4" />
            <h4 className="font-semibold mb-2">Pengiriman Aman</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400">Asuransi pengiriman terproteksi untuk semua gadget.</p>
          </div>
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <CreditCard className="w-8 h-8 text-pumpkin mb-4" />
            <h4 className="font-semibold mb-2">Cicilan Fleksibel</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400">Tersedia pembayaran TLater dengan bunga rendah.</p>
          </div>
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <RotateCcw className="w-8 h-8 text-pumpkin mb-4" />
            <h4 className="font-semibold mb-2">Retur 7 Hari</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400">Pengembalian dana atau tukar unit baru dalam 7 hari.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="text-xl font-bold font-logo text-pumpkin mb-4">Tecvibe.</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              Platform e-commerce terpercaya untuk kebutuhan gadget dan komponen PC Anda.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Eksplor</h4>
            <ul className="space-y-3 text-sm text-slate-500 dark:text-slate-400">
              <li><a href="#" className="hover:text-pumpkin">Smartphone</a></li>
              <li><a href="#" className="hover:text-pumpkin">Laptop</a></li>
              <li><a href="#" className="hover:text-pumpkin">PC Gaming</a></li>
              <li><a href="#" className="hover:text-pumpkin">Aksesoris</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Bantuan</h4>
            <ul className="space-y-3 text-sm text-slate-500 dark:text-slate-400">
              <li><a href="#" className="hover:text-pumpkin">Cara Belanja</a></li>
              <li><a href="#" className="hover:text-pumpkin">Pengiriman</a></li>
              <li><Link to="/orders" className="hover:text-pumpkin">Lacak Pesanan</Link></li>
              <li><Link to="/care" className="hover:text-pumpkin">Pusat Bantuan</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Pembayaran</h4>
            <div className="flex gap-2 flex-wrap">
              <div className="bg-white dark:bg-black px-2 py-1 border border-slate-200 dark:border-slate-800 rounded text-xs font-mono font-bold">VISA</div>
              <div className="bg-white dark:bg-black px-2 py-1 border border-slate-200 dark:border-slate-800 rounded text-xs font-mono font-bold">Mastercard</div>
              <div className="bg-white dark:bg-black px-2 py-1 border border-slate-200 dark:border-slate-800 rounded text-xs font-mono font-bold text-[#0056A3]">BCA VA</div>
              <div className="bg-white dark:bg-black px-2 py-1 border border-slate-200 dark:border-slate-800 rounded text-xs font-mono font-bold text-red-600">QRIS</div>
              <div className="bg-white dark:bg-black px-2 py-1 border border-tlater-border rounded text-xs font-mono font-bold text-tlater">TLater</div>
            </div>
          </div>
        </div>

        <div className="text-center text-sm text-slate-500 dark:text-slate-400 pt-8 border-t border-slate-200 dark:border-slate-800">
          © 2026 Tech Vibe. Hak Cipta Dilindungi.
        </div>
      </div>
    </footer>
  );
}

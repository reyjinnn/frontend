import { Link } from 'react-router-dom';

export function PromoStrip() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-3">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        
        <button className="text-left p-4 rounded-2xl bg-white dark:bg-[#1A1A1A] border border-pumpkin/30 dark:border-pumpkin/20 shadow-card hover:shadow-card-hover hover:border-pumpkin dark:hover:border-pumpkin transition group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-pumpkin">Flash Sale</span>
            <span className="text-[10px] font-bold text-rose-600 dark:text-rose-500">Terbatas</span>
          </div>
          <p className="text-sm font-extrabold text-slate-900 dark:text-slate-100 group-hover:text-pumpkin transition">Weekend Spesial • Hingga 25%</p>
          <p className="text-[10px] text-slate-500 mt-1">Promo dikelola dari menu Promo & Diskon.</p>
        </button>

        <button className="text-left p-4 rounded-2xl bg-white dark:bg-[#1A1A1A] border border-slate-200 dark:border-slate-800 shadow-card hover:shadow-card-hover hover:border-slate-300 dark:hover:border-slate-600 transition group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-sky-600 dark:text-sky-500">Voucher</span>
            <span className="text-[10px] font-bold text-slate-500">New Member</span>
          </div>
          <p className="text-sm font-extrabold text-slate-900 dark:text-slate-100 group-hover:text-pumpkin transition">NEWVIBE50 • Potongan Rp500.000</p>
          <p className="text-[10px] text-slate-500 mt-1">Masukkan kode saat checkout untuk memeriksa kelayakan.</p>
        </button>

        <Link to="/points" className="block text-left p-4 rounded-2xl bg-white dark:bg-[#1A1A1A] border border-slate-200 dark:border-slate-800 shadow-card hover:shadow-card-hover hover:border-amber-300 dark:hover:border-amber-600 transition group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-500">Vibe Points</span>
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-500">2×</span>
          </div>
          <p className="text-sm font-extrabold text-slate-900 dark:text-slate-100 group-hover:text-pumpkin transition">Cashback Vibe Poin 2×</p>
          <p className="text-[10px] text-slate-500 mt-1">Benefit loyalty mengikuti program yang diatur admin.</p>
        </Link>

      </div>
    </div>
  );
}

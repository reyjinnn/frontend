import { ShieldCheck, Truck, Coins, CreditCard } from 'lucide-react';

export function ValuePropositionBar() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        
        <div className="p-3.5 rounded-xl bg-white dark:bg-[#1A1A1A] border border-slate-200/80 dark:border-slate-800 flex items-center gap-3 shadow-sm transition">
          <ShieldCheck className="w-6 h-6 text-emerald-500 shrink-0" />
          <div>
            <h4 className="text-xs font-bold text-emerald-600 dark:text-emerald-500">100% Original</h4>
            <p className="text-[10px] text-slate-500">Jaminan garansi distributor resmi</p>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-[#1A1A1A] border border-slate-200/80 dark:border-slate-800 flex items-center gap-3 shadow-sm transition">
          <Truck className="w-6 h-6 text-sky-500 shrink-0" />
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">Pengiriman terproteksi</h4>
            <p className="text-[10px] text-slate-500">Paket bernilai tinggi diasuransikan</p>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-[#1A1A1A] border border-slate-200/80 dark:border-slate-800 flex items-center gap-3 shadow-sm transition">
          <Coins className="w-6 h-6 text-amber-500 shrink-0" />
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">Vibe Poin 1%</h4>
            <p className="text-[10px] text-slate-500">Cashback langsung setiap belanja</p>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-[#1A1A1A] border border-slate-200/80 dark:border-slate-800 flex items-center gap-3 shadow-sm transition">
          <CreditCard className="w-6 h-6 text-slate-500 shrink-0" />
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">TLater</h4>
            <p className="text-[10px] text-slate-500">Cicilan tanpa kartu kredit</p>
          </div>
        </div>
        
      </div>
    </div>
  );
}

import { Link } from 'react-router-dom';

export function HeroBanner() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 pb-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Editorial hero: one clear message and one primary action. */}
        <div className="lg:col-span-8 lg:col-start-3 rounded-2xl bg-slate-950 text-white p-8 sm:p-12 flex flex-col items-center justify-between relative overflow-hidden shadow-md min-h-[350px] text-center">
          <div className="absolute inset-y-0 right-0 w-1/2 opacity-60 bg-[radial-gradient(circle_at_70%_35%,#fd802e_0,transparent_32%),radial-gradient(circle_at_80%_75%,#2563eb_0,transparent_38%)]"></div>
          
          <div className="relative z-10 max-w-xl w-full space-y-4 flex flex-col items-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/20 text-white text-[10px] font-extrabold uppercase tracking-[.16em]">
              Pilihan kurasi September
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-[1.05]">
              Teknologi yang tepat untuk ritme kerja Anda.
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed max-w-md mx-auto">
              Jelajahi laptop, smartphone, dan perangkat gaming dari distributor resmi—dengan informasi stok, garansi, dan pengiriman yang transparan.
            </p>
            <div className="pt-2 flex items-center gap-3">
              <Link to="/catalog" className="px-6 py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-900 text-xs font-bold transition shadow-sm">
                Lihat koleksi
              </Link>
              <Link to="/orders" className="px-5 py-3 rounded-xl bg-transparent hover:bg-white/10 text-white text-xs font-bold transition border border-white/25">
                Lacak pesanan
              </Link>
            </div>
          </div>

          <div className="relative z-10 mt-12 flex items-center justify-center gap-6 text-[11px] text-slate-300 text-center w-full">
            <span>Garansi distributor resmi</span>
            <span className="w-1 h-1 rounded-full bg-pumpkin"></span>
            <span>Pengiriman terlindungi</span>
          </div>
        </div>

      </div>
    </div>
  );
}

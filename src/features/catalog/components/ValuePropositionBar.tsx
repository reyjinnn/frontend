import { ShieldCheck, Truck, CreditCard, RotateCcw } from 'lucide-react';

export function ValuePropositionBar() {
  const props = [
    { icon: <ShieldCheck className="w-6 h-6 text-pumpkin" />, title: "100% Original", desc: "Garansi resmi" },
    { icon: <Truck className="w-6 h-6 text-pumpkin" />, title: "Pengiriman Terproteksi", desc: "Aman sampai tujuan" },
    { icon: <CreditCard className="w-6 h-6 text-pumpkin" />, title: "Vibe Poin 1%", desc: "Cashback setiap belanja" },
    { icon: <RotateCcw className="w-6 h-6 text-pumpkin" />, title: "TLater", desc: "Cicilan bunga rendah" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
      <div className="bg-white dark:bg-[#1A1A1A] border border-slate-100 dark:border-slate-800/60 rounded-2xl p-6 shadow-card grid grid-cols-2 md:grid-cols-4 gap-6 divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-800">
        {props.map((p, idx) => (
          <div key={idx} className={`flex items-center gap-4 ${idx > 0 && idx % 2 === 0 ? 'pt-6 md:pt-0' : idx % 2 === 1 ? 'md:pl-6' : ''} ${idx > 1 && idx % 2 === 1 ? 'pt-6 md:pt-0 md:pl-6' : ''}`}>
            {p.icon}
            <div>
              <h4 className="font-semibold text-sm">{p.title}</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">{p.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

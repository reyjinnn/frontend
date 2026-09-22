export function PromoStrip() {
  const promos = [
    { title: "Flash Sale", desc: "Diskon hingga 50% tiap jam 12:00", bg: "bg-red-500", text: "text-white" },
    { title: "Voucher NEWVIBE50", desc: "Potongan 50rb untuk pengguna baru", bg: "bg-pumpkin", text: "text-white" },
    { title: "Poin 2x Cashback", desc: "Khusus pembayaran via TLater", bg: "bg-tlater", text: "text-white" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {promos.map((promo, idx) => (
          <div key={idx} className={`${promo.bg} ${promo.text} rounded-2xl p-6 relative overflow-hidden group cursor-pointer`}>
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/20 rounded-full blur-xl group-hover:bg-white/30 transition-colors"></div>
            <h4 className="font-bold text-lg mb-2 relative z-10">{promo.title}</h4>
            <p className="text-sm opacity-90 relative z-10">{promo.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

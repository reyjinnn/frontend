import { Button } from '../../../components/ui/Button';

export function HeroBanner() {
  return (
    <div className="relative bg-slate-950 rounded-3xl overflow-hidden mt-6 mx-4 sm:mx-6 lg:mx-8">
      {/* Glow Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-pumpkin/20 rounded-full blur-[100px] pointer-events-none"></div>
      
      <div className="relative z-10 px-8 py-16 md:px-16 md:py-24 text-center">
        <h2 className="text-4xl md:text-6xl font-logo font-bold text-white mb-6">
          Teknologi Terbaru, <br className="hidden md:block" /> 
          <span className="text-pumpkin">Hanya di Tech Vibe.</span>
        </h2>
        <p className="text-slate-400 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
          Temukan gadget flagship dan komponen PC terbaik dengan pengiriman cepat, jaminan original 100%, dan cicilan fleksibel.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button variant="primary" size="lg" className="w-full sm:w-auto">Lihat Koleksi</Button>
          <Button variant="outline" size="lg" className="w-full sm:w-auto text-white border-slate-700 hover:bg-slate-800">Lacak Pesanan</Button>
        </div>
      </div>
    </div>
  );
}

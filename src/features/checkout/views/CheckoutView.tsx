import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../../stores/useAuthStore';
import { useCartStore } from '../../cart/useCartStore';
import { useUIStore } from '../../../stores/useUIStore';
import { CheckoutApi } from '../api/checkoutApi';
import type { SplitCheckoutRequest } from '../api/checkoutApi';
import { SplitPaymentSection } from '../components/SplitPaymentSection';
import { PromoModal } from '../components/PromoModal';
import { CheckoutSuccessDialog } from '../components/CheckoutSuccessDialog';
import { Button } from '../../../components/ui/Button';
import { MapPin, ShieldCheck, Ticket, Receipt, ChevronRight } from 'lucide-react';

export function CheckoutView() {
  const { isAuthenticated, user } = useAuthStore();
  const { openLogin } = useUIStore();
  const { items, totalItemAmount, fetchCart } = useCartStore();

  // Redirect if not authenticated (though router should handle it, double checking)
  if (!isAuthenticated) {
    openLogin();
    return <Navigate to="/" replace />;
  }

  // State
  const [shippingCity] = useState("Jakarta Selatan");
  const [shippingFee, setShippingFee] = useState(25000); // Mock default
  const [selectedShipping, setSelectedShipping] = useState('instant');
  const [hasInsurance, setHasInsurance] = useState(false);
  
  // Wallets
  const [pointsBalance, setPointsBalance] = useState(0);
  const [tlaterLimit, setTlaterLimit] = useState(0);
  
  // Split Payment states
  const [usePoints, setUsePoints] = useState(false);
  const [pointsAmount, setPointsAmount] = useState(0);
  const [useTlater, setUseTlater] = useState(false);
  const [tlaterTenor, setTlaterTenor] = useState(1);
  const [cashGateway, setCashGateway] = useState('bca_va');

  // Promo
  const [isPromoOpen, setIsPromoOpen] = useState(false);
  const [appliedPromo, setAppliedPromo] = useState<any | null>(null);

  // Simulation Results
  const [simResult, setSimResult] = useState<any>(null);
  
  // Execution
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successData, setSuccessData] = useState<any>(null);

  // Load Wallets
  useEffect(() => {
    fetchCart();
    CheckoutApi.getPointsWallet().then(res => setPointsBalance(res.availableBalance));
    CheckoutApi.getTlaterAccount().then(res => setTlaterLimit(res.availableLimit));
  }, []);

  // Simulate Checkout
  useEffect(() => {
    const insuranceFee = hasInsurance ? 25000 : 0;
    
    let req: SplitCheckoutRequest = {
      items: items.map(i => ({ productId: i.productId, quantity: i.quantity })),
      shippingCity,
      usePoints: usePoints ? pointsAmount : 0,
      useTlater,
      tlaterTenor
    };

    CheckoutApi.simulateCheckout(req).then(res => {
      // We manually add insurance and promo logic on top of the sim for display simplicity
      let grandTotal = res.grandTotal + insuranceFee;
      let promoDiscount = 0;
      
      if (appliedPromo) {
        if (appliedPromo.discountFixed) {
          promoDiscount = appliedPromo.discountFixed;
        } else if (appliedPromo.discountPercentage) {
          promoDiscount = Math.min(grandTotal * (appliedPromo.discountPercentage / 100), 100000);
        }
      }
      
      grandTotal = Math.max(0, grandTotal - promoDiscount);

      // Re-adjust points/tlater caps based on new grandTotal
      let finalPointsUsed = usePoints ? Math.min(pointsAmount, grandTotal) : 0;
      let remaining = grandTotal - finalPointsUsed;
      
      let finalTlaterPrincipal = useTlater ? Math.min(remaining, tlaterLimit) : 0;
      let finalGatewayCash = remaining - finalTlaterPrincipal;

      let tlaterInterest = 0;
      let tlaterAdmin = 0;
      let monthly = 0;

      if (useTlater && finalTlaterPrincipal > 0) {
        if (tlaterTenor === 1) {
          tlaterAdmin = finalTlaterPrincipal * 0.01;
          monthly = finalTlaterPrincipal + tlaterAdmin;
        } else {
          tlaterInterest = finalTlaterPrincipal * 0.025 * tlaterTenor;
          monthly = (finalTlaterPrincipal + tlaterInterest) / tlaterTenor;
        }
      }

      setSimResult({
        ...res,
        insuranceFee,
        promoDiscount,
        grandTotal,
        pointsDeduction: finalPointsUsed,
        tlaterPrincipal: finalTlaterPrincipal,
        gatewayCashRequired: finalGatewayCash,
        tlaterInterest,
        tlaterAdminFee: tlaterAdmin,
        tlaterMonthlyInstallment: monthly
      });
    });
  }, [items, shippingCity, usePoints, pointsAmount, useTlater, tlaterTenor, hasInsurance, appliedPromo, tlaterLimit]);


  const handleCheckout = async () => {
    if (items.length === 0) return;
    setIsSubmitting(true);
    const idempotencyKey = crypto.randomUUID();
    
    let req: SplitCheckoutRequest = {
      items: items.map(i => ({ productId: i.productId, quantity: i.quantity })),
      shippingCity,
      usePoints: usePoints ? pointsAmount : 0,
      useTlater,
      tlaterTenor
    };

    try {
      const res = await CheckoutApi.checkout(req, idempotencyKey);
      setSuccessData({
        orderNumber: res.order.orderNumber,
        virtualAccount: res.paymentInstructions.virtualAccountNumber,
        grandTotal: res.order.grandTotal,
        expiresAt: res.paymentInstructions.expiresAt
      });
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (successData) {
    return <CheckoutSuccessDialog {...successData} />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <h1 className="text-2xl md:text-3xl font-bold mb-8">Checkout</h1>
      
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* Left Column */}
        <div className="flex-1 space-y-8">
          
          {/* Address */}
          <section className="bg-white dark:bg-[#1A1A1A] border border-slate-100 dark:border-slate-800 rounded-3xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <MapPin className="w-5 h-5 text-pumpkin" />
                Alamat Pengiriman
              </h3>
              <button className="text-sm font-semibold text-pumpkin hover:underline">Ubah Alamat</button>
            </div>
            <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-4">
              <p className="font-bold text-sm mb-1">{user?.name} | <span className="font-normal text-slate-500">081234567890</span></p>
              <p className="text-sm text-slate-600 dark:text-slate-400">Jl. Jendral Sudirman Kav. 52-53, Gedung TechVibe Tower Lt. 12<br/>Senayan, Kebayoran Baru, {shippingCity}, 12190</p>
            </div>
          </section>

          {/* Items & Shipping */}
          <section className="bg-white dark:bg-[#1A1A1A] border border-slate-100 dark:border-slate-800 rounded-3xl p-6">
            <h3 className="font-bold text-lg mb-6">Barang & Pengiriman</h3>
            
            {items.map(item => (
              <div key={item.productId} className="flex gap-4 mb-6 pb-6 border-b border-slate-100 dark:border-slate-800 last:border-0 last:mb-0 last:pb-0">
                <div className="w-20 h-20 bg-slate-50 dark:bg-[#141414] rounded-xl overflow-hidden flex-shrink-0">
                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm line-clamp-2 mb-1">{item.name}</h4>
                  <p className="text-sm text-slate-500 mb-2">{item.quantity} x <span className="font-mono font-bold text-slate-900 dark:text-white">Rp {item.price.toLocaleString('id-ID')}</span></p>
                  <input type="text" placeholder="Catatan untuk penjual (opsional)" className="w-full text-sm border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 bg-transparent" />
                </div>
              </div>
            ))}

            <div className="mt-6">
              <label className="block text-sm font-semibold mb-3">Pilih Opsi Pengiriman</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'instant', name: 'Instant', price: 25000, eta: 'Hari ini' },
                  { id: 'yes', name: 'JNE YES', price: 28000, eta: 'Besok' },
                  { id: 'reg', name: 'SiCepat REG', price: 18000, eta: '2-3 Hari' },
                ].map(opt => (
                  <label key={opt.id} className={`flex flex-col p-3 border rounded-xl cursor-pointer transition-colors ${selectedShipping === opt.id ? 'border-pumpkin bg-pumpkin/5' : 'border-slate-200 dark:border-slate-700 hover:border-pumpkin/50'}`}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-sm">{opt.name}</span>
                      <input type="radio" name="shipping" checked={selectedShipping === opt.id} onChange={() => {setSelectedShipping(opt.id); setShippingFee(opt.price);}} className="accent-pumpkin" />
                    </div>
                    <span className="text-xs text-slate-500 mb-1">Estimasi: {opt.eta}</span>
                    <span className="text-sm font-mono font-bold">Rp {opt.price.toLocaleString('id-ID')}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" checked={hasInsurance} onChange={(e) => setHasInsurance(e.target.checked)} className="mt-1 accent-pumpkin w-4 h-4 rounded" />
                <div>
                  <p className="font-semibold text-sm flex items-center gap-1">Proteksi Elektronik & Asuransi Pengiriman <ShieldCheck className="w-4 h-4 text-green-500"/></p>
                  <p className="text-xs text-slate-500">Lindungi produk dari kerusakan total & kehilangan saat pengiriman (+Rp 25.000)</p>
                </div>
              </label>
            </div>
          </section>

          {/* Split Payment Engine */}
          <section>
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">Metode Pembayaran (Split-Payment)</h3>
            <SplitPaymentSection 
              grandTotal={simResult?.grandTotal || (totalItemAmount + shippingFee + (hasInsurance ? 25000 : 0))}
              pointsBalance={pointsBalance}
              usePoints={usePoints}
              pointsAmount={pointsAmount}
              setUsePoints={setUsePoints}
              setPointsAmount={setPointsAmount}
              tlaterLimit={tlaterLimit}
              useTlater={useTlater}
              tlaterTenor={tlaterTenor}
              setUseTlater={setUseTlater}
              setTlaterTenor={setTlaterTenor}
            />
          </section>

          {/* Cash Gateway required? */}
          {simResult && simResult.gatewayCashRequired > 0 && (
            <section className="bg-white dark:bg-[#1A1A1A] border border-slate-100 dark:border-slate-800 rounded-3xl p-6 animate-in slide-in-from-bottom-2">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">Pilih Metode Tunai untuk Sisa Tagihan</h3>
              <div className="space-y-3">
                {[
                  { id: 'bca_va', label: 'BCA Virtual Account' },
                  { id: 'mandiri_va', label: 'Mandiri Virtual Account' },
                  { id: 'cc', label: 'Kartu Kredit (Visa/Mastercard)' }
                ].map(opt => (
                  <label key={opt.id} className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-colors ${cashGateway === opt.id ? 'border-pumpkin bg-pumpkin/5' : 'border-slate-200 dark:border-slate-700'}`}>
                    <input type="radio" name="gateway" checked={cashGateway === opt.id} onChange={() => setCashGateway(opt.id)} className="w-4 h-4 accent-pumpkin" />
                    <span className="font-semibold">{opt.label}</span>
                  </label>
                ))}
              </div>
            </section>
          )}

        </div>

        {/* Right Column - Summary */}
        <div className="w-full lg:w-[400px] flex-shrink-0">
          <div className="sticky top-24 space-y-6">
            
            {/* Promo Selector */}
            <div 
              className="bg-white dark:bg-[#1A1A1A] border border-slate-200 dark:border-slate-700 rounded-2xl p-4 flex items-center justify-between cursor-pointer hover:border-pumpkin transition-colors"
              onClick={() => setIsPromoOpen(true)}
            >
              <div className="flex items-center gap-3">
                <Ticket className="w-6 h-6 text-pumpkin" />
                <div>
                  <p className="font-bold text-sm">{appliedPromo ? appliedPromo.title : 'Makin hemat pakai promo'}</p>
                  {appliedPromo && <p className="text-xs text-green-500 font-semibold">Promo berhasil digunakan</p>}
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400" />
            </div>

            {/* Bill Summary */}
            <div className="bg-white dark:bg-[#1A1A1A] border border-slate-100 dark:border-slate-800 rounded-3xl p-6">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Receipt className="w-5 h-5 text-slate-500" />
                Ringkasan Belanja
              </h3>
              
              <div className="space-y-3 text-sm text-slate-600 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
                <div className="flex justify-between">
                  <span>Total Harga ({items.length} Barang)</span>
                  <span className="font-mono">Rp {totalItemAmount.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Ongkos Kirim</span>
                  <span className="font-mono">Rp {shippingFee.toLocaleString('id-ID')}</span>
                </div>
                {hasInsurance && (
                  <div className="flex justify-between">
                    <span>Asuransi Pengiriman</span>
                    <span className="font-mono">Rp 25.000</span>
                  </div>
                )}
                {simResult?.promoDiscount > 0 && (
                  <div className="flex justify-between text-green-500 font-semibold">
                    <span>Diskon Promo</span>
                    <span className="font-mono">- Rp {simResult.promoDiscount.toLocaleString('id-ID')}</span>
                  </div>
                )}
              </div>

              {/* Split Breakdown */}
              <div className="space-y-3 text-sm font-semibold border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
                <div className="flex justify-between text-orange-500">
                  <span>Dibayar dengan Poin</span>
                  <span className="font-mono">- Rp {(simResult?.pointsDeduction || 0).toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-tlater">
                  <span>Pinjaman TLater</span>
                  <span className="font-mono">- Rp {(simResult?.tlaterPrincipal || 0).toLocaleString('id-ID')}</span>
                </div>
                
                {useTlater && simResult?.tlaterPrincipal > 0 && (
                  <div className="pl-4 py-2 mt-2 bg-tlater/5 border border-tlater/20 rounded-lg space-y-1 text-xs text-slate-500 font-normal">
                    <p className="flex justify-between"><span>Biaya Layanan/Bunga:</span> <span className="font-mono">Rp {(simResult.tlaterInterest + simResult.tlaterAdminFee).toLocaleString('id-ID')}</span></p>
                    <p className="flex justify-between font-bold text-tlater"><span>Cicilan per Bulan:</span> <span className="font-mono">Rp {simResult.tlaterMonthlyInstallment.toLocaleString('id-ID')} / {tlaterTenor} bln</span></p>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center mb-6">
                <span className="font-bold text-base">Sisa Tagihan (Tunai)</span>
                <span className="text-xl font-bold font-mono text-pumpkin">Rp {(simResult?.gatewayCashRequired || 0).toLocaleString('id-ID')}</span>
              </div>

              <Button 
                variant="primary" 
                className="w-full h-14 text-base font-bold shadow-lg shadow-pumpkin/25"
                onClick={handleCheckout}
                disabled={items.length === 0 || isSubmitting}
              >
                {isSubmitting ? 'Memproses...' : 'Konfirmasi & Buat Pesanan'}
              </Button>
              <p className="text-[10px] text-center text-slate-400 mt-4 flex items-center justify-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Transaksi aman & terenkripsi
              </p>
            </div>
          </div>
        </div>
      </div>

      <PromoModal 
        isOpen={isPromoOpen} 
        onClose={() => setIsPromoOpen(false)} 
        cartTotal={totalItemAmount} 
        onSelectPromo={setAppliedPromo} 
      />
    </div>
  );
}

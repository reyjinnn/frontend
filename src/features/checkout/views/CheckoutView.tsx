import { useEffect, useState, useRef } from 'react';
import { useDemoSnapshot } from '../../../stores/useDemoSnapshot';
import { requireDemoUser, transactDemoDB } from '../../../lib/demoRepository';
import { addressService, type Address } from '../../../services/addressService';
import { useToastStore } from '../../../stores/useToastStore';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../../stores/useAuthStore';
import { useCartStore } from '../../cart/useCartStore';
import { useUIStore } from '../../../stores/useUIStore';
import { CheckoutApi } from '../api/checkoutApi';
import type { SplitCheckoutRequest } from '../api/checkoutApi';
import { SplitPaymentSection } from '../components/SplitPaymentSection';
import { PromoModal } from '../components/PromoModal';
import { CheckoutSuccessDialog } from '../components/CheckoutSuccessDialog';
import { KycModal } from '../../auth/components/KycModal';
import { Button } from '../../../components/ui/Button';
import { MapPin, ShieldCheck, Ticket, Receipt, ChevronRight, Info } from 'lucide-react';

export function CheckoutView() {
  const { isAuthenticated, user } = useAuthStore();
  const { openLogin } = useUIStore();
  const { items, fetchCart } = useCartStore();

  useEffect(() => {
    if (!isAuthenticated) {
      useAuthStore.getState().setIntendedAction('/checkout');
      openLogin();
    }
  }, [isAuthenticated, openLogin]);

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [addressId, setAddressId] = useState('');
  const address = addresses.find(a => a.id === addressId);
  const shippingCity = address?.city ?? '';
  const toast = useToastStore(s => s.addToast);
  const attempt = useRef<string | null>(null);
  const [selectedShipping, setSelectedShipping] = useState('');
  const db = useDemoSnapshot();
  const shippingOptions = db.shipping.length
    ? db.shipping.filter(c => c.isActive).map(c => ({ id: c.id, name: c.name, price: c.fee, eta: 'Estimasi 2–3 hari (simulasi)' }))
    : [{ id: 'regular', name: 'Regular', price: db.settings.shippingFee, eta: 'Estimasi 2–3 hari (simulasi)' }];
  const currentCourier = shippingOptions.find(o => o.id === selectedShipping) ?? shippingOptions[0];
  const shippingFee = currentCourier?.price ?? 0;
  const shippingAvailable = !!currentCourier;
  const [hasInsurance, setHasInsurance] = useState(false);

  const [pointsBalance, setPointsBalance] = useState(0);
  const [tlaterLimit, setTlaterLimit] = useState(0);

  const [usePoints, setUsePoints] = useState(false);
  const [pointsAmount, setPointsAmount] = useState(0);
  const [useTlater, setUseTlater] = useState(false);
  const [tlaterTenor, setTlaterTenor] = useState(1);
  const [cashGateway, setCashGateway] = useState('bca_va');

  const [isKycOpen, setIsKycOpen] = useState(false);

  const [isPromoOpen, setIsPromoOpen] = useState(false);
  const [appliedPromo, setAppliedPromo] = useState<any | null>(null);

  const [simResult, setSimResult] = useState<Awaited<ReturnType<typeof CheckoutApi.simulateCheckout>> | null>(null);
  const [quoteError, setQuoteError] = useState('');
  const quoteRequest = useRef(0);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shippingNotes, setShippingNotes] = useState<Record<string, string>>({});
  const [successData, setSuccessData] = useState<any>(null);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'customer') return;
    fetchCart();
    addressService.getAddresses().then(list => { setAddresses(list); setAddressId(list.find(a => a.isPrimary)?.id ?? list[0]?.id ?? ''); }).catch(() => toast({ title: 'Gagal muat alamat', type: 'error' }));
    CheckoutApi.getPointsWallet().then(res => setPointsBalance(res.availableBalance)).catch(() => {});
    CheckoutApi.getTlaterAccount().then(res => setTlaterLimit(res.availableLimit)).catch(() => {});
  }, [isAuthenticated, user?.role, user?.id, fetchCart, toast]);

  useEffect(() => {
    const request = ++quoteRequest.current;
    setSimResult(null);
    if (!isAuthenticated || items.length === 0 || !shippingAvailable) return;
    const insuranceFee = hasInsurance ? 25000 : 0;
    CheckoutApi.simulateCheckout({
      items: items.map(i => ({ productId: i.productId, quantity: i.quantity })),
      shippingCity,
      shippingFee,
      courier: currentCourier?.name,
      protectionFee: insuranceFee,
      promoCode: appliedPromo?.code ?? appliedPromo?.id,
      usePoints: usePoints ? pointsAmount : 0,
      useTlater,
      tlaterTenor
    }).then(q => {
      if (quoteRequest.current === request) {
        setSimResult(q);
        setQuoteError('');
      }
    }).catch(err => {
      if (quoteRequest.current === request) {
        setSimResult(null);
        setQuoteError(err.message);
      }
    });
  }, [items, shippingCity, shippingFee, currentCourier?.name, hasInsurance, appliedPromo?.code, appliedPromo?.id, usePoints, pointsAmount, useTlater, tlaterTenor, isAuthenticated, shippingAvailable]);

  const handleCheckout = async () => {
    if (items.length === 0 || !address || !simResult || !shippingAvailable || isSubmitting) return;
    setIsSubmitting(true);
    if (!attempt.current) attempt.current = crypto.randomUUID();
    
    let req: SplitCheckoutRequest = {
      items: items.map(i => ({ productId: i.productId, quantity: i.quantity })),
      shippingCity,
      usePoints: usePoints ? pointsAmount : 0,
      useTlater,
      tlaterTenor,
      promoCode: appliedPromo?.code ?? appliedPromo?.id,
      shippingFee,
      protectionFee: hasInsurance ? 25000 : 0,
      shippingAddress: `${address.recipientName}\n${address.phone}\n${address.fullAddress}\n${address.city}, ${address.postalCode}`,
      paymentMethod: cashGateway,
      courier: currentCourier?.name || 'Regular'
    };

    try {
      const res = await CheckoutApi.checkout(req, attempt.current);
      const userId = requireDemoUser('customer').id;
      const notes = Object.entries(shippingNotes).filter(([, text]) => text.trim());
      if (notes.length) {
        await transactDemoDB(db => {
          const order = db.orders.find(o => o.orderNumber === res.order.orderNumber && o.userId === userId);
          if (!order) throw new Error('Order not found');
          for (const item of order.items) {
            const note = shippingNotes[item.productId];
            if (note?.trim()) Object.assign(item, { note: note.trim() });
          }
        });
      }
      setSuccessData({
        orderNumber: res.order.orderNumber,
        virtualAccount: res.paymentInstructions.virtualAccountNumber,
        grandTotal: res.splitBreakdown.gatewayCashAmount,
        expiresAt: res.paymentInstructions.expiresAt
      });
      fetchCart();
    } catch (e: any) {
      toast({ title: 'Gagal membuat pesanan', message: e.message, type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) return null;

  if (successData) {
    return <CheckoutSuccessDialog {...successData} />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <h1 className="text-2xl md:text-3xl font-bold mb-8">Checkout</h1>
      
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        {}
        <div className="flex-1 space-y-8">
          
          {}
          <section className="bg-white dark:bg-[#1A1A1A] border border-slate-100 dark:border-slate-800 rounded-3xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <MapPin className="w-5 h-5 text-pumpkin" />
                Alamat Pengiriman
              </h3>
              <Link to="/profile" className="text-sm font-semibold text-pumpkin hover:underline">Kelola Alamat</Link>
            </div>
            <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-4">
              <select aria-label="Alamat pengiriman" value={addressId} onChange={e => setAddressId(e.target.value)} className="w-full bg-transparent border rounded p-2">
                <option value="">Pilih alamat</option>
                {addresses.map(a => <option key={a.id} value={a.id}>{a.label} — {a.recipientName}</option>)}
              </select>
              <p>{address?.recipientName} {address?.phone}</p>
              <p>{address?.fullAddress}, {address?.city} {address?.postalCode}</p>
            </div>
          </section>

          {}
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
                  <input 
                    type="text" 
                    placeholder="Catatan untuk penjual (opsional)" 
                    value={shippingNotes[item.productId] ?? ''}
                    onChange={e => setShippingNotes(prev => ({ ...prev, [item.productId]: e.target.value }))}
                    className="w-full text-sm border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 bg-transparent" 
                  />
                </div>
              </div>
            ))}

            <div className="mt-6">
              <label className="block text-sm font-semibold mb-3">Pilih Opsi Pengiriman</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {shippingOptions.map(opt => (
                  <label key={opt.id} className={`flex flex-col p-3 border rounded-xl cursor-pointer transition-colors ${currentCourier?.id === opt.id ? 'border-pumpkin bg-pumpkin/5' : 'border-slate-200 dark:border-slate-700 hover:border-pumpkin/50'}`}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-sm">{opt.name}</span>
                      <input type="radio" name="shipping" checked={currentCourier?.id === opt.id} onChange={() => setSelectedShipping(opt.id)} className="accent-pumpkin" />
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

          {}
          <section>
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">Metode Pembayaran (Split-Payment)</h3>
            
            {}
            {user?.kycStatus !== 'verified' && (
              <div className="mb-4 bg-orange-50 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-800 rounded-xl p-4 flex justify-between items-center">
                <div className="flex gap-3">
                  <Info className="w-5 h-5 text-orange-500 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-sm text-orange-900 dark:text-orange-100">Fasilitas TLater Belum Aktif</h4>
                    <p className="text-xs text-orange-800 dark:text-orange-300">Verifikasi identitas (KYC) Anda untuk mengaktifkan limit PayLater.</p>
                  </div>
                </div>
                <Button variant="outline" className="border-orange-500 text-orange-600 hover:bg-orange-50" onClick={() => setIsKycOpen(true)}>
                  Verifikasi Sekarang
                </Button>
              </div>
            )}

            <SplitPaymentSection 
              grandTotal={simResult?.grandTotal || 0}
              quote={simResult}
              settings={db.settings}
              pointsBalance={pointsBalance}
              usePoints={usePoints}
              pointsAmount={pointsAmount}
              setUsePoints={setUsePoints}
              setPointsAmount={setPointsAmount}
              tlaterLimit={tlaterLimit}
              useTlater={useTlater}
              tlaterTenor={tlaterTenor}
              setUseTlater={(val) => {
                if (user?.kycStatus !== 'verified' && val === true) {
                  setIsKycOpen(true);
                } else {
                  setUseTlater(val);
                }
              }}
              setTlaterTenor={setTlaterTenor}
            />
          </section>

          {}
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

        {}
        <div className="w-full lg:w-[400px] flex-shrink-0">
          <div className="sticky top-24 space-y-6">
            
            {}
              <div 
              className="bg-white dark:bg-[#1A1A1A] border border-slate-200 dark:border-slate-700 rounded-2xl p-4 flex items-center justify-between cursor-pointer hover:border-pumpkin transition-colors"
              onClick={() => setIsPromoOpen(true)}
            >
              <div className="flex items-center gap-3">
                <Ticket className="w-6 h-6 text-pumpkin" />
                <div>
                  <p className="font-bold text-sm">{appliedPromo ? appliedPromo.code : 'Makin hemat pakai promo'}</p>
                  {appliedPromo && <p className="text-xs text-green-500 font-semibold">Promo berhasil digunakan</p>}
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400" />
            </div>

            {}
            <div className="bg-white dark:bg-[#1A1A1A] border border-slate-100 dark:border-slate-800 rounded-3xl p-6">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Receipt className="w-5 h-5 text-slate-500" />
                Ringkasan Belanja
              </h3>
              
              <div className="space-y-3 text-sm text-slate-600 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
                <div className="flex justify-between">
                  <span>Total Harga ({items.length} Barang)</span>
                   <span className="font-mono">Rp {(simResult?.totalItemAmount ?? 0).toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Ongkos Kirim</span>
                   <span className="font-mono">Rp {(simResult?.shippingFee ?? 0).toLocaleString('id-ID')}</span>
                </div>
                 {hasInsurance && (
                  <div className="flex justify-between">
                    <span>Asuransi Pengiriman</span>
                    <span className="font-mono">Rp {(simResult?.protectionFee ?? 25000).toLocaleString('id-ID')}</span>
                  </div>
                )}
                {simResult?.promoDiscount > 0 && (
                  <div className="flex justify-between text-green-500 font-semibold">
                    <span>Diskon Promo</span>
                    <span className="font-mono">- Rp {simResult.promoDiscount.toLocaleString('id-ID')}</span>
                  </div>
                )}
              </div>

              {}
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

              {quoteError && <p role="alert" className="text-red-500 mb-3">{quoteError}</p>}
              {!address && <p role="alert" className="text-red-500 mb-3">Pilih atau tambah alamat pengiriman.</p>}
              {!shippingAvailable && <p role="alert" className="text-red-500 mb-3">Pengiriman sedang tidak tersedia.</p>}
              <Button 
                variant="primary" 
                className="w-full h-14 text-base font-bold shadow-lg shadow-pumpkin/25"
                onClick={handleCheckout}
                disabled={items.length === 0 || isSubmitting || !address || !!quoteError || !simResult || !shippingAvailable}
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
        cartTotal={simResult?.totalItemAmount ?? 0} 
        onSelectPromo={async promo => {
          if (promo) await CheckoutApi.simulateCheckout({ items: items.map(i => ({ productId: i.productId, quantity: i.quantity })), shippingCity, shippingFee, courier: currentCourier?.name, protectionFee: hasInsurance ? 25000 : 0, promoCode: promo.id, usePoints: usePoints ? pointsAmount : 0, useTlater, tlaterTenor });
          setAppliedPromo(promo);
        }} 
      />
      <KycModal 
        isOpen={isKycOpen} 
        onClose={() => setIsKycOpen(false)} 
      />
    </div>
  );
}

import { CheckCircle2, Copy } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { OrdersApi } from '../../orders/api/ordersApi';
import { useState } from 'react';

interface CheckoutSuccessProps {
  orderNumber: string;
  virtualAccount: string;
  grandTotal: number;
  expiresAt: string;
}

export function CheckoutSuccessDialog({ orderNumber, virtualAccount, grandTotal, expiresAt }: CheckoutSuccessProps) {
  const navigate = useNavigate();
  const [paymentError, setPaymentError] = useState('');
  const [paid, setPaid] = useState(false);
  const pay = async (success: boolean) => {
    try {
      const order = await OrdersApi.simulatePayment(orderNumber, success);
      setPaid(order.status === 'shipping');
      setPaymentError(success ? '' : 'Simulasi pembayaran gagal. Coba lagi.');
    } catch (e: any) { setPaymentError(e.message); }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-white dark:bg-[#1A1A1A] w-full max-w-md rounded-3xl shadow-2xl p-8 text-center animate-in fade-in zoom-in duration-300">
        <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        
        <h2 className="text-2xl font-bold mb-2">Pesanan Dibuat!</h2>
        <p className="text-xs text-slate-500 mb-1">Order #{orderNumber}</p>
        <p className="text-slate-500 text-sm mb-6">Selesaikan pembayaran Anda sebelum {new Date(expiresAt).toLocaleString('id-ID')}</p>
        
        <div className="bg-slate-50 dark:bg-[#141414] border border-slate-100 dark:border-slate-800 rounded-2xl p-6 mb-8 text-left">
          <p className="text-xs text-slate-500 mb-1">Nomor Virtual Account</p>
          <div className="flex justify-between items-center mb-4">
            <p className="font-mono text-xl font-bold text-pumpkin">{virtualAccount}</p>
            <button onClick={() => navigator.clipboard.writeText(virtualAccount)} className="text-slate-400 hover:text-pumpkin">
              <Copy className="w-5 h-5" />
            </button>
          </div>
          
          <p className="text-xs text-slate-500 mb-1">Total Pembayaran</p>
          <p className="font-mono text-xl font-bold">Rp {grandTotal.toLocaleString('id-ID')}</p>
        </div>
        {paymentError && <p className="text-red-500 text-sm mb-4">{paymentError}</p>}
        {paid ? <p className="text-green-500 font-bold mb-4">Pembayaran sukses! Pesanan siap dikirim.</p> : (
          <div className="flex gap-2 mb-4">
            <Button className="flex-1 text-xs" onClick={() => pay(true)}>Simulasi Sukses</Button>
            <Button variant="outline" className="flex-1 text-xs" onClick={() => pay(false)}>Simulasi Gagal</Button>
          </div>
        )}
        <div className="flex flex-col gap-3">
          <Button variant="primary" className="h-12" onClick={() => navigate(`/orders?order=${encodeURIComponent(orderNumber)}`)}>
            Cek Status Pesanan
          </Button>
          <Button variant="outline" className="h-12 border-2" onClick={() => navigate('/')}>
            Kembali ke Beranda
          </Button>
        </div>
      </div>
    </div>
  );
}

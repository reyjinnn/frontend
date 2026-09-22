import { useState } from 'react';
import { X, CheckCircle2 } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { TlaterApi } from '../api/tlaterApi';

interface RepayModalProps {
  installmentId: number | null;
  amount: number;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function RepayModal({ installmentId, amount, isOpen, onClose, onSuccess }: RepayModalProps) {
  const [method, setMethod] = useState('bca_va');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen || !installmentId) return null;

  const handlePay = async () => {
    setIsSubmitting(true);
    const idempotencyKey = crypto.randomUUID();
    try {
      await TlaterApi.repayInstallment({
        installmentId,
        amount,
        paymentMethod: method
      }, idempotencyKey);
      
      setSuccess(true);
      setTimeout(() => {
        onSuccess(); 
        setSuccess(false);
        onClose();
      }, 2000);
    } catch (e) {
      console.error(e);
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <div className="bg-white dark:bg-[#1A1A1A] w-full max-w-sm rounded-3xl p-8 text-center animate-in zoom-in">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Pembayaran Berhasil!</h2>
          <p className="text-slate-500 text-sm">Angsuran Anda telah lunas dan limit kredit otomatis dipulihkan.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-[#1A1A1A] w-full max-w-md rounded-3xl shadow-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Bayar Angsuran</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-slate-50 dark:bg-[#141414] p-4 rounded-xl mb-6">
          <p className="text-xs text-slate-500 mb-1">Total Tagihan</p>
          <p className="font-mono text-2xl font-bold text-pumpkin">Rp {amount.toLocaleString('id-ID')}</p>
        </div>

        <h3 className="font-semibold text-sm mb-3">Pilih Metode Pembayaran</h3>
        <div className="space-y-3 mb-8">
          {[
            { id: 'bca_va', label: 'BCA Virtual Account' },
            { id: 'mandiri_va', label: 'Mandiri Virtual Account' }
          ].map(opt => (
            <label key={opt.id} className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-colors ${method === opt.id ? 'border-pumpkin bg-pumpkin/5' : 'border-slate-200 dark:border-slate-700'}`}>
              <input type="radio" name="repayMethod" checked={method === opt.id} onChange={() => setMethod(opt.id)} className="w-4 h-4 accent-pumpkin" />
              <span className="font-semibold text-sm">{opt.label}</span>
            </label>
          ))}
        </div>

        <Button variant="primary" className="w-full h-12" onClick={handlePay} disabled={isSubmitting}>
          {isSubmitting ? 'Memproses...' : 'Konfirmasi Pembayaran'}
        </Button>
      </div>
    </div>
  );
}

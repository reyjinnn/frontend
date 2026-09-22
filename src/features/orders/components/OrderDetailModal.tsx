import { X, FileText, AlertTriangle } from 'lucide-react';
import type { Order } from '../types';
import { Button } from '../../../components/ui/Button';

interface OrderDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  onCancelClick: () => void;
}

export function OrderDetailModal({ isOpen, onClose, order, onCancelClick }: OrderDetailModalProps) {
  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-fade-in-up flex flex-col max-h-[90vh]">
        
        {}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-xl font-bold">Detail Pesanan</h2>
            <p className="text-sm text-slate-500 font-mono mt-1">{order.orderNumber}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        {}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {}
          {order.status === 'unpaid' && (
            <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-800 p-4 rounded-xl flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-orange-500 mt-0.5" />
              <div>
                <h4 className="font-semibold text-orange-800 dark:text-orange-400">Menunggu Pembayaran</h4>
                <p className="text-sm text-orange-700/80 dark:text-orange-400/80 mt-1">
                  Segera lakukan pembayaran sebelum batas waktu habis agar pesanan tidak dibatalkan otomatis.
                </p>
              </div>
            </div>
          )}

          {}
          <div className="space-y-4">
            <h3 className="font-bold text-lg">Produk yang Dibeli</h3>
            {order.items.map(item => (
              <div key={item.id} className="flex gap-4 p-4 border border-slate-100 dark:border-slate-800 rounded-xl">
                <img src={item.imageUrl} alt={item.productName} className="w-20 h-20 object-cover rounded-lg bg-slate-100" />
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-900 dark:text-white line-clamp-2 leading-tight mb-1">{item.productName}</h4>
                  <p className="text-sm text-slate-500">{item.quantity} x Rp {item.price.toLocaleString('id-ID')}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">Rp {(item.quantity * item.price).toLocaleString('id-ID')}</p>
                </div>
              </div>
            ))}
          </div>

          {}
          <div>
            <h3 className="font-bold text-lg mb-3">Info Pengiriman</h3>
            <div className="bg-slate-50 dark:bg-[#141414] p-4 rounded-xl space-y-3 text-sm">
              <div className="flex">
                <span className="w-1/3 text-slate-500">Kurir</span>
                <span className="w-2/3 font-medium">{order.courier}</span>
              </div>
              <div className="flex">
                <span className="w-1/3 text-slate-500">Estimasi Tiba</span>
                <span className="w-2/3 font-medium">{order.estimatedArrival}</span>
              </div>
              <div className="flex">
                <span className="w-1/3 text-slate-500">Alamat Tujuan</span>
                <span className="w-2/3 font-medium whitespace-pre-line leading-relaxed">{order.shippingAddress}</span>
              </div>
            </div>
          </div>

          {}
          <div>
            <h3 className="font-bold text-lg mb-3">Rincian Pembayaran</h3>
            <div className="bg-slate-50 dark:bg-[#141414] p-4 rounded-xl space-y-2 text-sm">
              <div className="flex justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                <span className="text-slate-500">Metode Pembayaran</span>
                <span className="font-medium">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Subtotal Produk</span>
                <span>Rp {order.subtotal.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Ongkos Kirim</span>
                <span>Rp {order.shippingFee.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Biaya Proteksi</span>
                <span>Rp {order.protectionFee.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-green-600 dark:text-green-400">
                <span>Diskon Promo</span>
                <span>- Rp {order.promoDiscount.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200 dark:border-slate-800 font-bold text-base">
                <span>Total Belanja</span>
                <span className="text-pumpkin">Rp {order.grandTotal.toLocaleString('id-ID')}</span>
              </div>
            </div>
          </div>
        </div>

        {}
        <div className="p-6 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-[#141414] mt-auto">
          <div>
            <button className="flex items-center gap-2 text-sm text-pumpkin font-semibold hover:underline">
              <FileText className="w-4 h-4" /> Download Invoice
            </button>
          </div>
          <div className="flex gap-3">
            {order.status === 'unpaid' && (
              <>
                <Button variant="outline" onClick={onCancelClick}>
                  Batalkan Pesanan
                </Button>
                <Button>
                  Bayar Sekarang
                </Button>
              </>
            )}
            {order.status !== 'unpaid' && (
              <Button variant="outline" onClick={onClose}>
                Tutup
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

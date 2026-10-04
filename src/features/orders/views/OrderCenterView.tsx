import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDemoSnapshot } from '../../../stores/useDemoSnapshot';
import { Search, Package, MapPin, CreditCard, ExternalLink, Truck } from 'lucide-react';
import { OrdersApi } from '../api/ordersApi';
import type { Order, OrderStatus, TrackingInfo } from '../types';
import { OrderDetailModal } from '../components/OrderDetailModal';
import { TrackingTimelineModal } from '../components/TrackingTimelineModal';
import { AfterSalesService } from '../../../lib/demoRepository';
import { useToast } from '../../../stores/useToastStore';
import { Button } from '../../../components/ui/Button';
import { Modal } from '../../../components/ui/Modal';
import { useAuthStore } from '../../../stores/useAuthStore';

const TABS: { id: OrderStatus | 'all', label: string }[] = [
  { id: 'all', label: 'Semua' },
  { id: 'unpaid', label: 'Belum Dibayar' },
  { id: 'shipping', label: 'Perlu Dikirim' },
  { id: 'shipped', label: 'Dikirim' },
  { id: 'completed', label: 'Selesai' },
  { id: 'cancelled', label: 'Dibatalkan' }
];

export function OrderCenterView() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const db = useDemoSnapshot();
  const user = useAuthStore(s => s.user);
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<OrderStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const orders = user ? db.orders.filter(o => o.userId === user.id) : [];
  const isLoading = false;

  // Modals state
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [paymentOrder, setPaymentOrder] = useState<Order | null>(null);
  const [paymentBusy, setPaymentBusy] = useState(false);
  const [actionDialog, setActionDialog] = useState<{ type: 'cancel' | 'complete' | 'return' | 'review'; order: Order } | null>(null);
  const [actionBusy, setActionBusy] = useState(false);
  
  const [trackingInfo, setTrackingInfo] = useState<TrackingInfo | null>(null);
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);
  const [isTrackingLoading, setIsTrackingLoading] = useState(false);

  const target = params.get('order');
  const linkedOrder = target ? orders.find(o => o.orderNumber === target || o.id === target) : null;
  const shownOrder = orders.find(o => o.id === selectedOrder?.id) ?? linkedOrder ?? null;
  const detailOpen = isDetailModalOpen || !!linkedOrder;

  const handleOpenDetail = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailModalOpen(true);
  };

  const handleOpenTracking = async (orderId: string) => {
    setIsTrackingLoading(true);
    const info = await OrdersApi.getTrackingInfo(orderId);
    setTrackingInfo(info);
    setIsTrackingLoading(false);
    setIsTrackingModalOpen(true);
  };

  const handleCancelOrder = () => {
    if (shownOrder) setActionDialog({ type: 'cancel', order: shownOrder });
  };

  const handleSimulatePayment = async (success: boolean) => {
    if (!paymentOrder || paymentBusy) return;
    setPaymentBusy(true);
    try {
      const result = await OrdersApi.simulatePayment(paymentOrder.orderNumber, success);
      toast({ title: result.payment?.status === 'expired' ? 'Pembayaran kedaluwarsa' : success ? 'Simulasi bayar sukses' : 'Simulasi bayar gagal', type: success && result.status === 'shipping' ? 'success' : 'error' });
      if (result.status !== 'unpaid') setPaymentOrder(null);
    } catch (e: any) {
      toast({ title: 'Gagal bayar', message: e.message, type: 'error' });
    } finally { setPaymentBusy(false); }
  };

  const handleExpirePayment = async () => {
    if (!paymentOrder || paymentBusy) return;
    setPaymentBusy(true);
    try {
      await OrdersApi.expirePayment(paymentOrder.orderNumber);
      toast({ title: 'Pesanan ditandai kedaluwarsa & dibatalkan', type: 'info' });
      setPaymentOrder(null);
    } catch (e: any) {
      toast({ title: 'Gagal', message: e.message, type: 'error' });
    } finally { setPaymentBusy(false); }
  };
  const handleAction = async (form?: HTMLFormElement) => {
    if (!actionDialog || actionBusy) return;
    const { type, order } = actionDialog;
    setActionBusy(true);
    try {
      if (type === 'cancel') {
        await OrdersApi.cancelOrder(order.orderNumber);
        setIsDetailModalOpen(false);
        setSelectedOrder(null);
        if (target) setParams({});
      } else if (type === 'complete') {
        await OrdersApi.completeOrder(order.orderNumber);
        toast({ title: 'Pesanan selesai!', message: 'Anda mendapatkan Vibe Poin 1% dari transaksi ini.', type: 'success' });
      } else if (type === 'return' && form) {
        await AfterSalesService.requestRefund(order.orderNumber, String(new FormData(form).get('reason')));
        toast({ title: 'Permintaan retur terkirim', type: 'success' });
      } else if (type === 'review' && form) {
        const data = new FormData(form);
        await AfterSalesService.reviewProduct(Number(order.items[0].productId), Number(data.get('rating')), String(data.get('comment')));
        toast({ title: 'Ulasan tersimpan', type: 'success' });
      }
      setActionDialog(null);
    } catch (e: unknown) {
      toast({ title: type === 'review' ? 'Ulasan gagal' : 'Gagal', message: e instanceof Error ? e.message : 'Operasi gagal', type: 'error' });
    } finally { setActionBusy(false); }
  };

  const filteredOrders = orders.filter(order => {
    const matchesTab = activeTab === 'all' || order.status === activeTab;
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchLower) || 
                          order.items.some(item => item.productName.toLowerCase().includes(searchLower));
    return matchesTab && matchesSearch;
  });

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'unpaid':
        return <span className="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 px-2 py-1 rounded text-xs font-bold uppercase">Belum Dibayar</span>;
      case 'shipping':
        return <span className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-1 rounded text-xs font-bold uppercase">Dikemas</span>;
      case 'shipped':
        return <span className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 px-2 py-1 rounded text-xs font-bold uppercase">Dikirim</span>;
      case 'completed':
        return <span className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-2 py-1 rounded text-xs font-bold uppercase">Selesai</span>;
      case 'cancelled':
        return <span className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 px-2 py-1 rounded text-xs font-bold uppercase">Dibatalkan</span>;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Pesanan Saya</h1>
        <p className="text-slate-500">Kelola dan lacak semua transaksi Anda di TechVibe.</p>
      </div>

      {}
      <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl border border-slate-100 dark:border-slate-800 p-4 mb-6 sticky top-20 z-10 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          
          {}
          <div className="flex overflow-x-auto w-full md:w-auto pb-2 md:pb-0 hide-scrollbar gap-2">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as OrderStatus | 'all')}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors
                  ${activeTab === tab.id 
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-black' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {}
          <div className="relative w-full md:w-64 flex-shrink-0">
            <input
              type="text"
              placeholder="Cari ID atau produk..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 dark:bg-[#141414] border border-slate-200 dark:border-slate-700 rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-pumpkin focus:border-transparent outline-none transition-all"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          </div>
        </div>
      </div>

      {}
      <div className="space-y-6">
        {isLoading ? (
          <div className="text-center py-12 text-slate-500">Memuat pesanan...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-[#1A1A1A] rounded-2xl border border-slate-100 dark:border-slate-800">
            <Package className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Tidak ada pesanan</h3>
            <p className="text-slate-500 text-sm">Belum ada transaksi yang sesuai dengan filter ini.</p>
          </div>
        ) : (
          filteredOrders.map(order => (
            <div key={order.id} className="bg-white dark:bg-[#1A1A1A] rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              
              {}
              <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-[#141414]">
                <div className="flex items-center gap-4">
                  <span className="font-mono text-sm font-semibold">{order.orderNumber}</span>
                  <span className="text-xs text-slate-500 hidden sm:inline-block">
                    {new Date(order.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  {order.hasTlater && (
                    <span className="bg-[#E5F3FF] text-[#0066CC] dark:bg-[#002D5A] dark:text-[#66B2FF] px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                      <CreditCard className="w-3 h-3" /> TLater
                    </span>
                  )}
                  {getStatusBadge(order.status)}
                </div>
              </div>

              {}
              <div className="p-4 sm:p-6 flex flex-col sm:flex-row gap-6">
                {}
                <div className="flex gap-4 flex-1">
                  <img src={order.items[0].imageUrl} alt={order.items[0].productName} className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl bg-slate-100 border border-slate-100 dark:border-slate-800" />
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white line-clamp-2 leading-tight mb-2">
                      {order.items[0].productName}
                    </h3>
                    <p className="text-sm text-slate-500 mb-1">{order.items[0].quantity} barang x Rp {order.items[0].price.toLocaleString('id-ID')}</p>
                    {order.items.length > 1 && (
                      <p className="text-xs text-slate-400 font-medium">+ {order.items.length - 1} produk lainnya</p>
                    )}
                  </div>
                </div>

                {}
                <div className="hidden md:flex flex-col justify-center border-l border-slate-100 dark:border-slate-800 pl-6 min-w-[200px]">
                  <p className="text-xs text-slate-500 mb-1 flex items-center gap-1"><Truck className="w-3 h-3" /> Kurir</p>
                  <p className="text-sm font-medium mb-3">{order.courier}</p>
                  
                  {order.status !== 'cancelled' && (
                    <>
                      <p className="text-xs text-slate-500 mb-1 flex items-center gap-1"><MapPin className="w-3 h-3" /> Estimasi Tiba</p>
                      <p className="text-sm font-medium text-pumpkin">{order.estimatedArrival}</p>
                    </>
                  )}
                </div>

                {}
                <div className="flex flex-col justify-center items-end sm:border-l border-slate-100 dark:border-slate-800 sm:pl-6 pt-4 sm:pt-0 border-t sm:border-t-0 mt-4 sm:mt-0">
                  <p className="text-xs text-slate-500 mb-1">Total Belanja</p>
                  <p className="text-lg font-bold">Rp {order.grandTotal.toLocaleString('id-ID')}</p>
                  <p className="text-xs text-slate-400 mt-1 max-w-[120px] text-right truncate" title={order.paymentMethod}>{order.paymentMethod}</p>
                </div>
              </div>

              {}
              <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap justify-between items-center gap-4 bg-slate-50/50 dark:bg-[#141414]/50">
                <button 
                  onClick={() => handleOpenDetail(order)}
                  className="text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1"
                >
                  <ExternalLink className="w-4 h-4" /> Lihat Detail
                </button>

                <div className="flex gap-2 w-full sm:w-auto">
                  {order.status === 'unpaid' && (
                    <Button size="sm" className="w-full sm:w-auto" onClick={() => setPaymentOrder(order)}>Bayar</Button>

                  )}
                  {order.status === 'shipped' && (
                    <>
                      <Button size="sm" variant="outline" onClick={() => handleOpenTracking(order.id)} disabled={isTrackingLoading}>
                        {isTrackingLoading ? 'Memuat...' : 'Lacak Pengiriman'}
                      </Button>
                      <Button size="sm" onClick={() => setActionDialog({ type: 'complete', order })}>Selesaikan Pesanan</Button>
                    </>
                  )}
                  {order.status === 'shipping' && (
                    <Button size="sm" variant="outline" onClick={() => handleOpenTracking(order.id)} disabled={isTrackingLoading}>
                      Lacak Pengiriman
                    </Button>
                  )}
                  {order.status === 'completed' && !(order as Order & { refunded?: boolean }).refunded && (
                    <Button size="sm" variant="outline" onClick={() => setActionDialog({ type: 'return', order })}>Retur</Button>
                  )}
                  {order.status === 'completed' && (order as Order & { refunded?: boolean }).refunded && (
                    <span className="text-sm font-bold text-orange-500">Refund Diproses</span>
                  )}
                  {order.status === 'completed' && (
                    <>
                      <Button size="sm" variant="outline" onClick={() => navigate('/care?topic=warranty')}>Ajukan Garansi</Button>
                      <Button size="sm" onClick={() => setActionDialog({ type: 'review', order })}>Beri Ulasan</Button>
                    </>
                  )}

                </div>
              </div>

            </div>
          ))
        )}
      </div>

      {}
      <OrderDetailModal 
        isOpen={detailOpen} 
        onClose={() => { setIsDetailModalOpen(false); setSelectedOrder(null); if (target) setParams({}); }} 
        order={shownOrder}
        onCancelClick={handleCancelOrder}
        onPayClick={() => { if (shownOrder) { setPaymentOrder(shownOrder); setIsDetailModalOpen(false); setSelectedOrder(null); if (target) setParams({}); } }}
      />

      {paymentOrder && <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4" role="dialog" aria-modal="true" aria-label="Simulasi Pembayaran"><div className="bg-white dark:bg-[#1A1A1A] rounded-2xl p-6 w-full max-w-md space-y-4"><h2 className="font-bold text-xl">Bayar {paymentOrder.orderNumber}</h2><p>Tagihan: Rp {(paymentOrder.payment?.cashAmount ?? paymentOrder.grandTotal).toLocaleString('id-ID')}</p><p>VA: {paymentOrder.payment?.virtualAccountNumber ?? '-'}</p><p>Batas: {paymentOrder.payment?.expiresAt ? new Date(paymentOrder.payment.expiresAt).toLocaleString('id-ID') : '-'}</p><div className="flex flex-wrap gap-2"><Button disabled={paymentBusy} onClick={() => void handleSimulatePayment(true)}>Sukses</Button><Button disabled={paymentBusy} variant="outline" onClick={() => void handleSimulatePayment(false)}>Gagal</Button><Button disabled={paymentBusy} variant="outline" onClick={() => void handleExpirePayment()}>Kedaluwarsa</Button><Button disabled={paymentBusy} variant="outline" onClick={() => setPaymentOrder(null)}>Tutup</Button></div></div></div>}
      <TrackingTimelineModal
        isOpen={isTrackingModalOpen}
        onClose={() => setIsTrackingModalOpen(false)}
        trackingInfo={trackingInfo}
        onReportIssue={() => {
          navigate('/care?action=create_ticket&category=Pengiriman');
        }}
      />
      <Modal isOpen={!!actionDialog} onClose={() => { if (!actionBusy) setActionDialog(null); }} title={actionDialog?.type === 'cancel' ? 'Batalkan Pesanan' : actionDialog?.type === 'complete' ? 'Selesaikan Pesanan' : actionDialog?.type === 'return' ? 'Ajukan Retur' : 'Beri Ulasan'}>
        {actionDialog?.type === 'cancel' && <div className="space-y-4">
          <p>Apakah Anda yakin ingin membatalkan pesanan ini? Stok dan limit (jika ada) akan dikembalikan.</p>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setActionDialog(null)} disabled={actionBusy}>Batal</Button>
            <Button onClick={() => handleAction()} disabled={actionBusy} className="bg-red-600 hover:bg-red-700 text-white">Batalkan</Button>
          </div>
        </div>}
        {actionDialog?.type === 'complete' && <div className="space-y-4">
          <p>Pastikan paket telah diterima dengan baik sebelum menyelesaikan pesanan. Lanjutkan?</p>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setActionDialog(null)} disabled={actionBusy}>Batal</Button>
            <Button onClick={() => handleAction()} disabled={actionBusy}>Selesaikan</Button>
          </div>
        </div>}
        {actionDialog?.type === 'return' && <form onSubmit={e => { e.preventDefault(); handleAction(e.currentTarget); }} className="space-y-4">
          <p>Silakan tulis alasan retur untuk pesanan ini.</p>
          <input name="reason" required placeholder="Alasan retur..." className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 dark:border-slate-700 dark:bg-[#101419] dark:text-slate-100" />
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setActionDialog(null)} disabled={actionBusy}>Batal</Button>
            <Button type="submit" disabled={actionBusy}>Kirim</Button>
          </div>
        </form>}
        {actionDialog?.type === 'review' && <form onSubmit={e => { e.preventDefault(); handleAction(e.currentTarget); }} className="space-y-4">
          <div>
            <label className="block text-sm mb-1 font-medium">Rating (1-5)</label>
            <input type="number" name="rating" min="1" max="5" defaultValue="5" required className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 dark:border-slate-700 dark:bg-[#101419] dark:text-slate-100" />
          </div>
          <div>
            <label className="block text-sm mb-1 font-medium">Ulasan produk</label>
            <textarea name="comment" required placeholder="Bagaimana pendapat Anda tentang produk ini?" className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 dark:border-slate-700 dark:bg-[#101419] dark:text-slate-100 min-h-[100px]" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setActionDialog(null)} disabled={actionBusy}>Batal</Button>
            <Button type="submit" disabled={actionBusy}>Kirim Ulasan</Button>
          </div>
        </form>}
      </Modal>
    </div>
  );
}

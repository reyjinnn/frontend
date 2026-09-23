import { useState, useEffect } from 'react';
import { OrdersApi } from '../../orders/api/ordersApi';
import type { Order } from '../../orders/types';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { 
  Search, 
  Filter, 
  Printer, 
  Truck, 
  Package,
  X
} from 'lucide-react';

export function AdminOrdersView() {
  const [activeTab, setActiveTab] = useState('all');
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isShipModalOpen, setIsShipModalOpen] = useState(false);

  const tabs = [
    { id: 'all', label: 'Semua Pesanan' },
    { id: 'unpaid', label: 'Belum Dibayar' },
    { id: 'shipping', label: 'Perlu Dikirim' },
    { id: 'shipped', label: 'Dikirim' },
    { id: 'completed', label: 'Selesai' },
    { id: 'cancelled', label: 'Dibatalkan' }
  ];

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const data = await OrdersApi.getOrders();
      setOrders(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter(o => activeTab === 'all' || o.status === activeTab);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'unpaid': return <span className="px-2 py-1 bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 rounded-md text-[10px] font-bold uppercase tracking-wider">Unpaid</span>;
      case 'shipping': return <span className="px-2 py-1 bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400 rounded-md text-[10px] font-bold uppercase tracking-wider">Perlu Dikirim</span>;
      case 'shipped': return <span className="px-2 py-1 bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded-md text-[10px] font-bold uppercase tracking-wider">Dikirim</span>;
      case 'completed': return <span className="px-2 py-1 bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 rounded-md text-[10px] font-bold uppercase tracking-wider">Selesai</span>;
      case 'cancelled': return <span className="px-2 py-1 bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 rounded-md text-[10px] font-bold uppercase tracking-wider">Batal</span>;
      default: return null;
    }
  };

  const handleShipOrder = (_trackingNumber: string) => {
    // In a real app, call PATCH localhost:3000/api/v1/admin/orders/{id}/shipment
    // Here we just update the local state for demonstration
    setOrders(orders.map(o => o.id === selectedOrder?.id ? { ...o, status: 'shipped' } : o));
    setIsShipModalOpen(false);
    setSelectedOrder(null);
  };

  const handleCancelOrder = async () => {
    if (!selectedOrder) return;
    if (confirm('Apakah Anda yakin ingin membatalkan pesanan ini?')) {
      try {
        await OrdersApi.cancelOrder(selectedOrder.orderNumber);
        setOrders(orders.map(o => o.id === selectedOrder.id ? { ...o, status: 'cancelled' } : o));
        setIsDetailModalOpen(false);
      } catch (e) {
        alert('Gagal membatalkan pesanan.');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-space">Manajemen Pesanan</h2>
          <p className="text-slate-500 text-sm mt-1">Kelola dan proses semua pesanan masuk dari pelanggan.</p>
        </div>
        <Button variant="outline" className="bg-white dark:bg-[#111]">
          Export CSV
        </Button>
      </div>

      <div className="bg-white dark:bg-[#111] border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
        
        {/* Tabs & Search */}
        <div className="border-b border-slate-200 dark:border-slate-800">
          <div className="flex overflow-x-auto hide-scrollbar px-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.id 
                    ? 'border-primary text-primary' 
                    : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          
          <div className="p-4 bg-slate-50 dark:bg-[#141414] flex flex-col sm:flex-row gap-4 border-t border-slate-200 dark:border-slate-800">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Cari Order ID, nama pelanggan, atau resi..."
                className="w-full pl-9 pr-4 py-2 bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
            <Button variant="outline" className="bg-white dark:bg-[#1a1a1a] shrink-0 gap-2">
              <Filter className="w-4 h-4" /> Filter Lanjutan
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto min-h-[400px]">
          {isLoading ? (
            <div className="flex items-center justify-center h-64 text-slate-500">Memuat data pesanan...</div>
          ) : filteredOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-slate-500">
              <Package className="w-12 h-12 mb-4 text-slate-300 dark:text-slate-700" />
              <p>Tidak ada pesanan ditemukan.</p>
            </div>
          ) : (
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-white dark:bg-[#111] text-slate-500 font-medium border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-4 w-12"><input type="checkbox" className="rounded border-slate-300" /></th>
                  <th className="px-6 py-4">Order ID & Item</th>
                  <th className="px-6 py-4">Pelanggan</th>
                  <th className="px-6 py-4">Total & Metode</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-[#141414] transition-colors">
                    <td className="px-6 py-4"><input type="checkbox" className="rounded border-slate-300" /></td>
                    <td className="px-6 py-4">
                      <div className="font-mono font-medium text-primary mb-1">{order.orderNumber}</div>
                      <div className="flex items-center gap-2">
                        <img src={order.items[0]?.imageUrl} alt="" className="w-8 h-8 rounded object-cover bg-slate-100" />
                        <div>
                          <p className="text-xs font-semibold truncate max-w-[200px]">{order.items[0]?.productName}</p>
                          <p className="text-[10px] text-slate-500">{order.items.length > 1 ? `+${order.items.length - 1} item lainnya` : '1 item'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium">{order.shippingAddress.split('\n')[0]}</p>
                      <p className="text-xs text-slate-500 truncate max-w-[150px]">{order.shippingAddress.split('\n')[1]}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-mono font-bold">Rp {order.grandTotal.toLocaleString('id-ID')}</p>
                      <div className="flex items-center gap-1 mt-1">
                        {order.hasTlater && <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 text-[9px] font-bold rounded">TLater</span>}
                        <p className="text-[10px] text-slate-500 truncate max-w-[150px]">{order.paymentMethod}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      {order.status === 'shipping' && (
                        <Button 
                          size="sm" 
                          onClick={() => { setSelectedOrder(order); setIsShipModalOpen(true); }}
                        >
                          Kirim Pesanan
                        </Button>
                      )}
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => { setSelectedOrder(order); setIsDetailModalOpen(true); }}
                      >
                        Detail
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Ship Order Modal */}
      {isShipModalOpen && selectedOrder && (
        <ShipOrderModal 
          order={selectedOrder} 
          onClose={() => setIsShipModalOpen(false)}
          onSubmit={handleShipOrder}
        />
      )}

      {/* Order Detail Modal */}
      {isDetailModalOpen && selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setIsDetailModalOpen(false)}
          onCancel={handleCancelOrder}
          onShip={() => { setIsDetailModalOpen(false); setIsShipModalOpen(true); }}
        />
      )}
    </div>
  );
}

// Subcomponents for Modals

function ShipOrderModal({ order, onClose, onSubmit }: { order: Order, onClose: () => void, onSubmit: (tracking: string) => void }) {
  const [tracking, setTracking] = useState('');
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-[#111] rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-scale-up">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <h3 className="font-bold text-lg font-space">Proses Pengiriman</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <p className="text-sm font-semibold">Kurir Pengiriman</p>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{order.courier}</p>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Input Nomor Resi</label>
            <Input 
              placeholder="Contoh: JNE882910292..."
              value={tracking}
              onChange={(e) => setTracking(e.target.value)}
              autoFocus
            />
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl text-xs text-blue-700 dark:text-blue-400">
            Pastikan paket telah diserahkan kepada agen logistik sebelum memasukkan nomor resi. Status pesanan akan otomatis berubah menjadi "Dikirim".
          </div>
        </div>
        <div className="p-6 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>Batal</Button>
          <Button onClick={() => onSubmit(tracking)} disabled={!tracking.trim()}>Kirim Sekarang</Button>
        </div>
      </div>
    </div>
  );
}

function OrderDetailModal({ order, onClose, onCancel, onShip }: { order: Order, onClose: () => void, onCancel: () => void, onShip: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-[#111] rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl animate-scale-up">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-start shrink-0">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-xl font-bold font-space">Detail Pesanan</h2>
              <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-[10px] font-bold rounded uppercase tracking-wider">{order.status}</span>
            </div>
            <p className="font-mono text-primary font-medium">{order.orderNumber}</p>
            <p className="text-xs text-slate-500 mt-1">{new Date(order.date).toLocaleString('id-ID')}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Printer className="w-4 h-4" /> Cetak Label
            </Button>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Informasi Pelanggan</h3>
              <p className="font-semibold">{order.shippingAddress.split('\n')[0]}</p>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 whitespace-pre-line leading-relaxed">
                {order.shippingAddress.split('\n').slice(1).join('\n')}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Informasi Pengiriman</h3>
              <p className="font-semibold">{order.courier}</p>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Estimasi Tiba: {order.estimatedArrival}</p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Daftar Produk</h3>
            <div className="space-y-4">
              {order.items.map(item => (
                <div key={item.id} className="flex gap-4 p-4 border border-slate-100 dark:border-slate-800 rounded-2xl">
                  <img src={item.imageUrl} alt="" className="w-16 h-16 rounded-xl object-cover bg-slate-50" />
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{item.productName}</p>
                    <p className="text-xs text-slate-500 mt-1">{item.quantity} x Rp {item.price.toLocaleString('id-ID')}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono font-bold text-sm">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Rincian Pembayaran</h3>
            <div className="bg-slate-50 dark:bg-[#141414] p-5 rounded-2xl space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Subtotal Produk</span>
                <span className="font-mono">Rp {order.subtotal.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Ongkos Kirim</span>
                <span className="font-mono">Rp {order.shippingFee.toLocaleString('id-ID')}</span>
              </div>
              {order.protectionFee > 0 && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Biaya Proteksi</span>
                  <span className="font-mono">Rp {order.protectionFee.toLocaleString('id-ID')}</span>
                </div>
              )}
              {order.promoDiscount > 0 && (
                <div className="flex justify-between text-green-600 dark:text-green-400">
                  <span>Diskon Promo</span>
                  <span className="font-mono">- Rp {order.promoDiscount.toLocaleString('id-ID')}</span>
                </div>
              )}
              
              <div className="border-t border-slate-200 dark:border-slate-800 pt-3 flex justify-between font-bold text-lg">
                <span>Total Tagihan</span>
                <span className="font-mono text-primary">Rp {order.grandTotal.toLocaleString('id-ID')}</span>
              </div>

              {order.hasTlater && (
                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                  <p className="font-semibold text-xs mb-2">Skema Split-Payment</p>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-blue-600 dark:text-blue-400">Dibayar via TLater (Pokok Pinjaman)</span>
                    <span className="font-mono font-medium text-blue-600 dark:text-blue-400">Rp 5.000.000</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-600 dark:text-slate-400">Dibayar via Payment Gateway ({order.paymentMethod})</span>
                    <span className="font-mono font-medium text-slate-600 dark:text-slate-400">Rp {(order.grandTotal - 5000000).toLocaleString('id-ID')}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-[#141414] shrink-0 flex justify-between items-center gap-4">
          {order.status === 'unpaid' ? (
            <Button variant="outline" className="text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200" onClick={onCancel}>
              Batalkan Pesanan
            </Button>
          ) : <div></div>}
          
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose}>Tutup</Button>
            {order.status === 'shipping' && (
              <Button className="gap-2" onClick={onShip}>
                <Truck className="w-4 h-4" /> Proses Kirim
              </Button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

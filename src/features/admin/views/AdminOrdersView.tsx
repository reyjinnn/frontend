import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Download, Package, Printer, Search, Send, Truck } from 'lucide-react';
import { AdminApi } from '../api/adminApi';
import { Page } from './adminShared';
import { useAdminData, panel, field, money, csv } from './adminState';
import { Button } from '../../../components/ui/Button';
import { Modal } from '../../../components/ui/Modal';

export function AdminOrdersView() {
  const state = useAdminData();
  const location = useLocation();
  const [filter, setFilter] = useState(() => new URLSearchParams(location.search).get('search') ?? '');
  const [status, setStatus] = useState('all');
  const [selected, setSelected] = useState<string | null>(null);
  const [cancelOrderNumber, setCancelOrderNumber] = useState<string | null>(null);
  const db = state.db;
  const orders = (db?.orders ?? []).filter(o => (status === 'all' || o.status === status) && `${o.orderNumber} ${o.shippingAddress} ${o.tracking?.receiptNumber ?? ''} ${db?.customers.find(c => c.id === o.userId)?.name ?? ''}`.toLowerCase().includes(filter.toLowerCase()));
  const order = db?.orders.find(o => o.orderNumber === selected);
  const act = (action: 'paid' | 'failed' | 'expired' | 'cancel' | 'ship' | 'track', value = '') => void state.run(() => AdminApi.orderAction(selected!, action, value), 'Pesanan diperbarui');

  const statusBadge = (s: string) => {
    switch (s) {
      case 'unpaid': return 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300';
      case 'shipping': return 'bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300';
      case 'shipped': return 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300';
      case 'completed': return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300';
      case 'cancelled': return 'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300';
      default: return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
    }
  };

  return <Page title="Manajemen Pesanan" state={state}>
    <div className={`${panel} flex flex-wrap items-center gap-3`}>
      <label className="relative min-w-0 flex-1 sm:min-w-64">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input aria-label="Cari pesanan" placeholder="Cari order, pelanggan, atau resi" className={`${field} pl-9`} value={filter} onChange={e => setFilter(e.target.value)} />
      </label>
      <select aria-label="Filter status" className={`${field} w-auto min-w-40`} value={status} onChange={e => setStatus(e.target.value)}>
        <option value="all">Semua Status</option>
        <option value="unpaid">Menunggu Bayar</option>
        <option value="shipping">Diproses</option>
        <option value="shipped">Dikirim</option>
        <option value="completed">Selesai</option>
        <option value="cancelled">Dibatalkan</option>
      </select>
      <Button variant="outline" size="sm" onClick={() => csv('orders.csv', [['orderNumber','userId','date','status','total','payment','resi'],...orders.map(o => [o.orderNumber,o.userId,o.date,o.status,o.grandTotal,o.payment?.status,o.tracking?.receiptNumber])])}>
        <Download size={16} className="mr-2 inline" />Export CSV
      </Button>
    </div>

    <div className={`grid gap-5 ${order ? 'xl:grid-cols-[minmax(0,1fr)_480px]' : ''}`}>
      <section className={`${panel} min-w-0`}>
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Daftar pesanan</h3>
          <span className="text-xs text-slate-500">{orders.length} pesanan</span>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {orders.map(o => {
            const customer = db?.customers.find(c => c.id === o.userId);
            const isSelected = selected === o.orderNumber;
            return <button type="button" key={o.id} onClick={() => setSelected(o.orderNumber)} className={`group -mx-2 flex w-[calc(100%+1rem)] cursor-pointer flex-wrap items-center justify-between gap-3 rounded-xl p-3 text-left transition hover:bg-orange-50/50 dark:hover:bg-orange-950/20 ${isSelected ? 'bg-orange-50/80 ring-1 ring-orange-400/50 dark:bg-orange-950/40 dark:ring-orange-500/50' : ''}`}>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-sm font-bold text-orange-600 dark:text-orange-400">{o.orderNumber}</span>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusBadge(o.status)}`}>{o.status}</span>
                </div>
                <p className="mt-1 text-sm font-medium">{customer?.name ?? o.userId}</p>
                <p className="text-xs text-slate-500">{o.tracking?.receiptNumber ? `Resi: ${o.tracking.receiptNumber}` : 'Belum ada resi'} · Bayar: {o.payment?.status ?? 'Seed'}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold tabular-nums">{money(o.grandTotal)}</p>
                <span className="text-xs text-slate-400">{new Date(o.date).toLocaleDateString('id-ID')}</span>
              </div>
            </button>;
          })}
          {!orders.length && <div className="py-12 text-center">
            <Package className="mx-auto mb-3 text-orange-400" />
            <p className="font-medium">{filter || status !== 'all' ? 'Pesanan tidak ditemukan' : 'Belum ada pesanan'}</p>
            <p className="mt-1 text-sm text-slate-500">{filter || status !== 'all' ? 'Coba ubah filter atau kata kunci pencarian.' : 'Transaksi checkout pelanggan akan muncul di sini.'}</p>
          </div>}
        </div>
      </section>

      {order && <aside className={`${panel} h-fit space-y-5`}>
        <div className="flex items-center justify-between border-b pb-3 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-base font-bold text-orange-600 dark:text-orange-400">{order.orderNumber}</span>
              <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusBadge(order.status)}`}>{order.status}</span>
            </div>
            <p className="text-xs text-slate-500">{new Date(order.date).toLocaleString('id-ID')}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={() => window.print()}><Printer size={15} /></Button>
            <Button size="sm" variant="outline" onClick={() => setSelected(null)}>Tutup</Button>
          </div>
        </div>

        <div className="space-y-1 text-sm">
          <p className="font-semibold text-slate-900 dark:text-slate-100">{db?.customers.find(c => c.id === order.userId)?.name ?? order.userId}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">{order.shippingAddress}</p>
          <p className="text-xs font-medium text-orange-600 dark:text-orange-400">Kurir: {order.courier}</p>
        </div>

        <div className="space-y-2">
          <h4 className="border-b pb-1 text-xs font-semibold uppercase tracking-wider text-orange-600 dark:border-slate-800 dark:text-orange-400">Barang</h4>
          <div className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
            {order.items.map((i, idx) => <div key={idx} className="flex justify-between py-2 text-xs">
              <span className="font-medium">{i.quantity} × {i.productName}</span>
              <span className="tabular-nums text-slate-500">{money(i.price * i.quantity)}</span>
            </div>)}
          </div>
        </div>

        <div className="space-y-1 rounded-xl bg-slate-50 p-3 text-xs dark:bg-slate-900/50">
          <div className="flex justify-between"><span>Subtotal</span><span className="tabular-nums">{money(order.subtotal)}</span></div>
          <div className="flex justify-between"><span>Ongkos kirim</span><span className="tabular-nums">{money(order.shippingFee)}</span></div>
          <div className="flex justify-between"><span>Biaya proteksi</span><span className="tabular-nums">{money(order.protectionFee)}</span></div>
          {order.promoDiscount > 0 && <div className="flex justify-between text-emerald-600 dark:text-emerald-400"><span>Diskon voucher</span><span className="tabular-nums">-{money(order.promoDiscount)}</span></div>}
          {order.pointsUsed > 0 && <div className="flex justify-between text-emerald-600 dark:text-emerald-400"><span>Vibe Points</span><span className="tabular-nums">-{money(order.pointsUsed)}</span></div>}
          <div className="flex justify-between border-t pt-1 font-bold dark:border-slate-800"><span>Total Tagihan</span><span className="tabular-nums text-orange-600 dark:text-orange-400">{money(order.grandTotal)}</span></div>
        </div>

        <div className="space-y-1 rounded-xl border border-slate-200 p-3 text-xs dark:border-slate-800">
          <p className="font-semibold text-slate-700 dark:text-slate-300">Rincian Pembayaran</p>
          <div className="flex justify-between"><span>Metode</span><span className="font-medium">{order.paymentMethod}</span></div>
          <div className="flex justify-between"><span>Status bayar</span><span className="capitalize">{order.payment?.status ?? 'Seed'}</span></div>
          {order.payment?.virtualAccountNumber && <div className="flex justify-between"><span>No. VA</span><span className="font-mono">{order.payment.virtualAccountNumber}</span></div>}
          {order.loanId && <div className="flex justify-between"><span>Pokok TLater</span><span>{money(db?.loans.find(l => l.loan.id === order.loanId)?.loan.principalAmount ?? 0)}</span></div>}
        </div>

        <div className="space-y-2">
          <h4 className="flex items-center gap-1.5 border-b pb-1 text-xs font-semibold uppercase tracking-wider text-orange-600 dark:border-slate-800 dark:text-orange-400">
            <Truck size={14} />Status Pengiriman
          </h4>
          <p className="text-xs text-slate-500">Resi: <span className="font-mono font-medium text-slate-800 dark:text-slate-200">{order.tracking?.receiptNumber ?? '-'}</span> · {order.tracking?.currentStatus ?? '-'}</p>
          {order.tracking?.timeline && order.tracking.timeline.length > 0 && <div className="space-y-2 border-l-2 border-orange-300 pl-3 dark:border-orange-800">
            {order.tracking.timeline.map(t => <div key={t.id} className="text-xs">
              <span className="text-slate-400">{new Date(t.timestamp).toLocaleString('id-ID')}</span>
              <p className="font-medium">{t.description}</p>
            </div>)}
          </div>}
        </div>

        <div className="space-y-2 border-t pt-3 dark:border-slate-800">
          {order.status === 'unpaid' && <div className="flex flex-wrap gap-2">
            <Button size="sm" disabled={state.busy} onClick={() => act('paid')}>Konfirmasi Bayar</Button>
            <Button size="sm" variant="outline" disabled={state.busy} onClick={() => act('failed')}>Gagal Bayar</Button>
            <Button size="sm" variant="outline" disabled={state.busy} onClick={() => act('expired')}>Kedaluwarsa</Button>
             <Button size="sm" variant="outline" disabled={state.busy} onClick={() => setCancelOrderNumber(order.orderNumber)}>Batalkan</Button>
          </div>}
          {order.status === 'shipping' && <form className="flex gap-2" onSubmit={e => { e.preventDefault(); const val = new FormData(e.currentTarget).get('resi'); act('ship', String(val)); }}>
            <input name="resi" required aria-label="Nomor resi" placeholder="Masukkan nomor resi..." className={`${field} flex-1 text-xs`} />
            <Button size="sm" disabled={state.busy}><Send size={14} className="mr-1" />Kirim</Button>
          </form>}
          {order.status === 'shipped' && <form className="flex gap-2" onSubmit={e => { e.preventDefault(); act('track', String(new FormData(e.currentTarget).get('event'))); e.currentTarget.reset(); }}>
            <input name="event" required aria-label="Update tracking" placeholder="Lokasi / peristiwa terkini..." className={`${field} flex-1 text-xs`} />
            <Button size="sm" disabled={state.busy}>Update</Button>
          </form>}
        </div>
      </aside>}
    </div>

    <section className={`${panel} mt-6`}>
      <h3 className="font-semibold">Permintaan Refund</h3>
      <div className="divide-y divide-slate-100 dark:divide-slate-800">
        {db?.refunds.map(r => <div key={r.id} className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-orange-600 dark:text-orange-400">{r.orderNumber}</span>
              <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${r.status === 'pending' ? 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300' : r.status === 'approved' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300'}`}>{r.status}</span>
            </div>
            <p className="mt-1 text-sm font-medium text-slate-800 dark:text-slate-200">{r.reason}</p>
            <p className="text-xs text-slate-500">Pengembalian tunai {money(r.cashAmount)}</p>
          </div>
          {r.status === 'pending' && <div className="flex gap-2">
            <Button size="sm" disabled={state.busy} onClick={() => void state.run(() => AdminApi.decideRefund(r.id, true))}>Setujui</Button>
            <Button size="sm" variant="outline" disabled={state.busy} onClick={() => void state.run(() => AdminApi.decideRefund(r.id, false))}>Tolak</Button>
          </div>}
        </div>)}
        {!db?.refunds.length && <p className="py-4 text-center text-sm text-slate-500">Tidak ada permohonan pengembalian dana.</p>}
      </div>
    </section>

    <Modal
      isOpen={!!cancelOrderNumber}
      onClose={() => { if (!state.busy) setCancelOrderNumber(null); }}
      title="Batalkan Pesanan"
    >
      <div className="space-y-4">
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Apakah Anda yakin ingin membatalkan pesanan <span className="font-mono font-bold text-orange-600 dark:text-orange-400">{cancelOrderNumber}</span>?
        </p>
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="outline" onClick={() => setCancelOrderNumber(null)}>
            Tutup
          </Button>
          <Button
            className="bg-red-600 hover:bg-red-700 text-white"
            disabled={state.busy}
            onClick={async () => {
              if (cancelOrderNumber && await state.run(() => AdminApi.orderAction(cancelOrderNumber, 'cancel'), 'Pesanan diperbarui')) setCancelOrderNumber(null);
            }}
          >
            Ya, Batalkan
          </Button>
        </div>
      </div>
    </Modal>
  </Page>;
}

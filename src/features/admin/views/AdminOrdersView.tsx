import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AdminApi } from '../api/adminApi';
import { Page } from './adminShared';
import { useAdminData, panel, money, csv } from './adminState';
import { Button } from '../../../components/ui/Button';

export function AdminOrdersView() {
  const state = useAdminData();
  const location = useLocation();
  const [filter, setFilter] = useState(() => new URLSearchParams(location.search).get('search') ?? '');
  const [status, setStatus] = useState('all');
  const [selected, setSelected] = useState<string | null>(null);
  const db = state.db;
  const orders = (db?.orders ?? []).filter(o => (status === 'all' || o.status === status) && `${o.orderNumber} ${o.shippingAddress} ${o.tracking?.receiptNumber ?? ''} ${db?.customers.find(c => c.id === o.userId)?.name ?? ''}`.toLowerCase().includes(filter.toLowerCase()));
  const order = db?.orders.find(o => o.orderNumber === selected);
  const act = (action: 'paid' | 'failed' | 'expired' | 'cancel' | 'ship' | 'track', value = '') => void state.run(() => AdminApi.orderAction(selected!, action, value), 'Pesanan diperbarui');
  return <Page title="Manajemen Pesanan" state={state}>
    <div className="flex flex-wrap gap-2"><input aria-label="Cari pesanan" placeholder="Cari order, pelanggan, resi" className="rounded-xl p-2 border dark:bg-[#111]" value={filter} onChange={e => setFilter(e.target.value)} /><select aria-label="Filter status" className="rounded-xl p-2 border dark:bg-[#111]" value={status} onChange={e => setStatus(e.target.value)}>{['all','unpaid','shipping','shipped','completed','cancelled'].map(s => <option key={s} value={s}>{s}</option>)}</select><Button variant="outline" onClick={() => csv('orders.csv', [['orderNumber','userId','date','status','total','payment','resi'],...orders.map(o => [o.orderNumber,o.userId,o.date,o.status,o.grandTotal,o.payment?.status,o.tracking?.receiptNumber])])}>Export CSV</Button></div>
    <div className="grid md:grid-cols-2 gap-3">{orders.map(o => <button key={o.id} onClick={() => setSelected(o.orderNumber)} className={`${panel} text-left hover:border-primary`}><p className="font-mono font-bold text-primary">{o.orderNumber}</p><p className="text-sm">{db?.customers.find(c => c.id === o.userId)?.name ?? o.userId} · {money(o.grandTotal)} · {o.status}</p><p className="text-xs text-slate-500">{o.payment?.status ?? 'Seed order'} · {o.tracking?.receiptNumber ?? 'Belum ada resi'}</p></button>)}{!orders.length && <p>Tidak ada pesanan.</p>}</div>
    {order && <section className={panel}><div className="flex justify-between"><h3 className="font-bold">Detail {order.orderNumber}</h3><Button size="sm" variant="outline" onClick={() => setSelected(null)}>Tutup</Button></div>
      <p>{db?.customers.find(c => c.id === order.userId)?.name} · {order.shippingAddress} · {order.courier}</p>
      <p className="text-sm">{order.items.map(i => `${i.quantity} × ${i.productName}`).join('; ')}</p>
      <p className="text-sm">Subtotal: {money(order.subtotal)} · Ongkir: {money(order.shippingFee)} · Proteksi: {money(order.protectionFee)} · Diskon: {money(order.promoDiscount)} · Poin: {money(order.pointsUsed)} · Total: {money(order.grandTotal)}</p>
      <p className="text-sm">Pembayaran: {order.payment?.status ?? 'Seed order'} · Tunai: {money(order.payment?.cashAmount ?? order.grandTotal)} · VA: {order.payment?.virtualAccountNumber ?? '-'} · TLater: {money(db?.loans.find(l => l.loan.id === order.loanId)?.loan.principalAmount ?? 0)}</p>
      <p className="text-sm">Resi: {order.tracking?.receiptNumber ?? '-'} · {order.tracking?.currentStatus ?? '-'}</p>
      {order.tracking?.timeline.map(t => <p key={t.id} className="text-xs">{new Date(t.timestamp).toLocaleString('id-ID')} · {t.description}</p>)}
      <div className="flex flex-wrap gap-2">{order.status === 'unpaid' && <><Button disabled={state.busy} onClick={() => act('paid')}>Konfirmasi Bayar</Button><Button variant="outline" disabled={state.busy} onClick={() => act('failed')}>Gagal Bayar</Button><Button variant="outline" disabled={state.busy} onClick={() => act('expired')}>Kedaluwarsa</Button><Button variant="outline" disabled={state.busy} onClick={() => { if (window.confirm('Batalkan pesanan ini?')) act('cancel'); }}>Batalkan</Button></>}
      {order.status === 'shipping' && <form className="flex gap-2" onSubmit={e => { e.preventDefault(); const value = new FormData(e.currentTarget).get('resi'); act('ship', String(value)); }}><input name="resi" required aria-label="Nomor resi" placeholder="Nomor resi" className="border rounded p-2 dark:bg-[#111]" /><Button disabled={state.busy}>Kirim Pesanan</Button></form>}
      {order.status === 'shipped' && <form className="flex gap-2" onSubmit={e => { e.preventDefault(); act('track', String(new FormData(e.currentTarget).get('event'))); e.currentTarget.reset(); }}><input name="event" required aria-label="Update tracking" placeholder="Lokasi/status pengiriman" className="border rounded p-2 dark:bg-[#111]" /><Button disabled={state.busy}>Update Tracking</Button></form>}
      <Button variant="outline" onClick={() => window.print()}>Cetak Invoice</Button></div>
    </section>}
    <section className={panel}><h3 className="font-bold">Permintaan Refund</h3>{db?.refunds.map(r => <div key={r.id} className="border-t pt-3"><p>{r.orderNumber} · {r.reason} · {r.status} · Tunai {money(r.cashAmount)}</p>{r.status === 'pending' && <div className="flex gap-2 mt-2"><Button size="sm" disabled={state.busy} onClick={() => void state.run(() => AdminApi.decideRefund(r.id, true))}>Setujui</Button><Button size="sm" variant="outline" disabled={state.busy} onClick={() => void state.run(() => AdminApi.decideRefund(r.id, false))}>Tolak</Button></div>}</div>)}{!db?.refunds.length && <p className="text-slate-500">Tidak ada permintaan refund.</p>}</section>
  </Page>;
}

import { useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { useAdminData, money, csv } from './adminState';
import { Feedback } from './adminShared';
export function AdminDashboardView() {
  const [range, setRange] = useState('all');
  const state = useAdminData();
  const [now, setNow] = useState(() => new Date());
  const db = state.db;
  if (!db) return <Feedback error={state.error} message="" />;
  const orders = db.orders.filter(o => {
    const date = new Date(o.date);
    if (Number.isNaN(date.getTime())) return range === 'all';
    if (range === 'today') return date.toDateString() === now.toDateString();
    if (range === 'week') return date.getTime() >= now.getTime() - 7 * 86400000;
    if (range === 'month') return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    return true;
  });
  const revenue = orders.filter(o => o.payment?.status === 'paid' && o.status !== 'cancelled').reduce((sum, o) => sum + o.grandTotal, 0);
  const sales = new Map<number, number>();
  for (const order of orders.filter(o => o.status !== 'cancelled')) for (const item of order.items) sales.set(Number(item.productId), (sales.get(Number(item.productId)) ?? 0) + item.quantity);
  const download = () => csv('techvibe-orders.csv', [['orderNumber', 'date', 'status', 'grandTotal'], ...orders.map(o => [o.orderNumber, o.date, o.status, String(o.grandTotal)])]);
  return <div className="space-y-6">
    <Feedback error={state.error} message="" />
    <div className="flex flex-wrap justify-between gap-3"><h2 className="text-2xl font-bold font-space">Ringkasan Eksekutif</h2><div className="flex gap-2"><Button variant="outline" onClick={download}>Unduh Laporan</Button><select aria-label="Periode" value={range} onChange={e => setRange(e.target.value)} className="rounded-xl p-2 dark:bg-[#111]"><option value="all">Semua waktu</option><option value="today">Hari Ini</option><option value="week">7 Hari Terakhir</option><option value="month">Bulan Ini</option></select><Button variant="outline" onClick={() => { setNow(new Date()); state.refresh(); }}>Perbarui</Button></div></div>
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">{[['Pendapatan pesanan dibayar', money(revenue)], ['Pesanan', String(orders.length)], ['Pelanggan', String(db.customers.filter(c => c.role === 'customer').length)], ['Pokok TLater tersalurkan', money(db.loans.filter(l => orders.some(o => o.loanId === l.loan.id)).reduce((s, l) => s + l.loan.principalAmount, 0))]].map(([label, value]) => <div key={label} className="bg-white dark:bg-[#111] border border-slate-200 dark:border-slate-800 rounded-2xl p-5"><p className="text-sm text-slate-500">{label}</p><p className="text-2xl font-bold font-space mt-2">{value}</p></div>)}</div>
    <div className="grid lg:grid-cols-2 gap-6"><section className="bg-white dark:bg-[#111] rounded-2xl p-5"><h3 className="font-bold mb-4">Produk Terlaris</h3>{[...sales.entries()].sort((a,b) => b[1]-a[1]).slice(0,5).map(([id,count]) => <p key={id} className="py-2 border-b border-slate-100">{db.products.find(p => p.id === id)?.name ?? `Produk #${id}`} · {count} unit</p>)}{!sales.size && <p className="text-slate-500">Belum ada penjualan.</p>}</section><section className="bg-white dark:bg-[#111] rounded-2xl p-5"><h3 className="font-bold mb-4">Pesanan Terbaru</h3>{[...orders].sort((a,b) => b.date.localeCompare(a.date)).slice(0,5).map(o => <p key={o.id} className="py-2 border-b border-slate-100">{o.orderNumber} · {db.customers.find(c => c.id === o.userId)?.name ?? o.userId} · {money(o.grandTotal)} · {o.status}</p>)}{!orders.length && <p className="text-slate-500">Belum ada pesanan.</p>}</section></div>
  </div>;
}

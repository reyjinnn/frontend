import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDownToLine, ArrowUpRight, CalendarDays, CreditCard, ShoppingBag, Users, Wallet } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { useAdminData, money, csv, field, panel } from './adminState';
import { Feedback } from './adminShared';

const statuses: Record<string, string> = { unpaid: 'Menunggu bayar', shipping: 'Diproses', shipped: 'Dikirim', completed: 'Selesai', cancelled: 'Dibatalkan' };
const statusColors: Record<string, string> = { unpaid: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400', shipping: 'bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-400', shipped: 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400', completed: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400', cancelled: 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400' };

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
    if (range === 'week') return date.getTime() >= now.getTime() - 7 * 86400000 && date.getTime() <= now.getTime();
    if (range === 'month') return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    return true;
  });
  const paid = orders.filter(o => o.payment?.status === 'paid' && o.status !== 'cancelled');
  const revenue = paid.reduce((sum, o) => sum + o.grandTotal, 0);
  const sales = new Map<number, number>();
  for (const order of orders.filter(o => o.status !== 'cancelled')) for (const item of order.items) sales.set(Number(item.productId), (sales.get(Number(item.productId)) ?? 0) + item.quantity);
  const topProducts = [...sales.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
  const maxSales = topProducts[0]?.[1] ?? 0;
  const recent = [...orders].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);
  const download = () => csv('techvibe-orders.csv', [['orderNumber', 'date', 'status', 'grandTotal'], ...orders.map(o => [o.orderNumber, o.date, o.status, String(o.grandTotal)])]);
  const metrics = [
    { label: 'Pendapatan dibayar', value: money(revenue), detail: `${paid.length} pesanan lunas`, icon: Wallet, color: 'bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400' },
    { label: 'Total pesanan', value: orders.length.toLocaleString('id-ID'), detail: 'Dalam periode terpilih', icon: ShoppingBag, color: 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400' },
    { label: 'Total pelanggan', value: db.customers.filter(c => c.role === 'customer').length.toLocaleString('id-ID'), detail: 'Semua pelanggan terdaftar', icon: Users, color: 'bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400' },
    { label: 'Pokok TLater tersalurkan', value: money(db.loans.filter(l => orders.some(o => o.loanId === l.loan.id)).reduce((sum, l) => sum + l.loan.principalAmount, 0)), detail: 'Dari pesanan periode ini', icon: CreditCard, color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' }
  ];
  return <div className="space-y-6">
    <Feedback error={state.error} message="" />
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div><p className="mb-1 text-xs font-semibold uppercase tracking-widest text-orange-600 dark:text-orange-400">Ikhtisar toko</p><h2 className="font-sans text-2xl font-bold tracking-tight sm:text-3xl">Ringkasan Bisnis</h2><p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Pantau aktivitas dan performa TechVibe dalam satu tempat.</p></div>
      <div className="flex flex-wrap items-center gap-2"><label className="relative"><CalendarDays size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><select aria-label="Periode" value={range} onChange={e => setRange(e.target.value)} className={`${field} w-auto pl-9`}><option value="all">Semua waktu</option><option value="today">Hari Ini</option><option value="week">7 Hari Terakhir</option><option value="month">Bulan Ini</option></select></label><Button variant="outline" onClick={download}><ArrowDownToLine size={16} className="mr-2" />Unduh Laporan</Button><Button variant="outline" onClick={() => { setNow(new Date()); state.refresh(); }}>Perbarui</Button></div>
    </div>
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{metrics.map(({ label, value, detail, icon: Icon, color }) => <div key={label} className={`${panel} !space-y-0`}><div className="flex items-start justify-between gap-2"><p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p><span className={`rounded-xl p-2.5 ${color}`}><Icon size={19} /></span></div><p className="mt-4 break-words font-sans text-2xl font-bold tracking-tight tabular-nums">{value}</p><p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{detail}</p></div>)}</div>
    <div className="grid gap-5 lg:grid-cols-5">
      <section className={`${panel} lg:col-span-3`}><div className="flex items-center justify-between gap-3"><div><h3 className="font-sans text-lg font-bold">Pesanan Terbaru</h3><p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">Aktivitas pesanan pada periode terpilih</p></div><Link to="/admin/orders" className="flex shrink-0 items-center gap-1 text-sm font-semibold text-orange-600 hover:text-orange-700 dark:text-orange-400">Lihat semua <ArrowUpRight size={16} /></Link></div><div className="divide-y divide-slate-100 dark:divide-slate-800">{recent.map(o => <div key={o.id} className="flex flex-wrap items-center justify-between gap-3 py-3.5"><div className="min-w-0"><p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{o.orderNumber}</p><p className="mt-1 truncate text-xs text-slate-500 dark:text-slate-400">{db.customers.find(c => c.id === o.userId)?.name ?? o.userId} · {new Date(o.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</p></div><div className="flex items-center gap-3 sm:gap-5"><span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusColors[o.status] ?? 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'}`}>{statuses[o.status] ?? o.status}</span><span className="text-right text-sm font-semibold tabular-nums">{money(o.grandTotal)}</span></div></div>)}{!recent.length && <p className="py-12 text-center text-sm text-slate-500">Belum ada pesanan dalam periode ini.</p>}</div></section>
      <section className={`${panel} lg:col-span-2`}><div><h3 className="font-sans text-lg font-bold">Produk Terlaris</h3><p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">Unit terjual dari pesanan yang tidak dibatalkan</p></div><div className="space-y-5 pt-2">{topProducts.map(([id, count], index) => <div key={id}><div className="mb-2 flex items-center justify-between gap-3 text-sm"><div className="flex min-w-0 items-center gap-3"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-xs font-bold text-orange-600 dark:bg-orange-500/10 dark:text-orange-400">{index + 1}</span><span className="truncate font-medium">{db.products.find(p => p.id === id)?.name ?? `Produk #${id}`}</span></div><span className="shrink-0 font-semibold tabular-nums">{count} unit</span></div><div className="h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"><div className="h-full rounded-full bg-orange-500" style={{ width: `${count / maxSales * 100}%` }} /></div></div>)}{!topProducts.length && <p className="py-12 text-center text-sm text-slate-500">Belum ada penjualan dalam periode ini.</p>}</div></section>
    </div>
  </div>;
}

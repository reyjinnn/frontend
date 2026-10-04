import { useState } from 'react';
import { Search, Tag } from 'lucide-react';
import { Page, InputField } from './adminShared';
import { useAdminData, panel, field, money, formValues, localDateTime } from './adminState';
import { Button } from '../../../components/ui/Button';
import { AdminApi } from '../api/adminApi';

export function AdminPromosView() {
  const state = useAdminData();
  const [editingId, setEditingId] = useState<number | 'new' | null>(null);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [now] = useState(() => Date.now());
  const promos = (state.db?.promos ?? []).filter(p => (status === 'all' || (status === 'active') === p.isActive) && `${p.code} ${p.title}`.toLowerCase().includes(search.toLowerCase()));
  const target = editingId === 'new' ? null : state.db?.promos.find(p => p.id === editingId);
  return <Page title="Promo & Diskon" state={state}>
    <div className={`${panel} flex flex-wrap items-center gap-3`}><label className="relative min-w-0 flex-1 sm:min-w-56"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input aria-label="Cari promo" placeholder="Cari kode atau nama promo" value={search} onChange={e => setSearch(e.target.value)} className={`${field} pl-9`} /></label><select aria-label="Filter status promo" className={`${field} w-auto min-w-36`} value={status} onChange={e => setStatus(e.target.value)}><option value="all">Semua status</option><option value="active">Aktif</option><option value="inactive">Nonaktif</option></select><Button size="sm" onClick={() => setEditingId('new')}><Tag size={16} className="mr-2 inline" />Buat Promo</Button></div>
    <p className="text-sm text-slate-500 dark:text-slate-400">Hanya voucher kupon yang dapat digunakan saat checkout.</p>
    <div className={`grid gap-5 ${editingId !== null ? 'xl:grid-cols-[minmax(0,1fr)_360px]' : ''}`}>
      <section className={`${panel} min-w-0`}><div className="flex justify-between"><h3 className="font-semibold">Daftar promo</h3><span className="text-xs text-slate-500">{promos.length} promo</span></div><div className="divide-y divide-slate-100 dark:divide-slate-800">{promos.map(p => <article key={p.id} className="py-4 first:pt-0 last:pb-0"><div className="flex flex-wrap items-start justify-between gap-3"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><span className="rounded-lg bg-orange-50 px-2 py-1 font-mono text-sm font-bold text-orange-700 dark:bg-orange-950 dark:text-orange-300">{p.code}</span><span className={`rounded-full px-2 py-0.5 text-xs ${p.isActive ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'}`}>{p.isActive ? 'Aktif' : 'Nonaktif'}</span></div><h4 className="mt-2 font-semibold">{p.title}</h4></div><div className="text-right"><p className="font-semibold tabular-nums text-orange-600 dark:text-orange-400">{p.discountType === 'percentage' ? `${p.discountValue}%` : money(p.discountValue)}</p><p className="text-xs text-slate-500">{p.discountType === 'percentage' ? `Maks. ${money(p.maxDiscount)}` : 'Potongan tetap'}</p></div></div><div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-slate-500 dark:text-slate-400"><span>Min. belanja {money(p.minPurchase)}</span><span>Terpakai {p.quotaTotal - (p.quotaRemaining ?? 0)} / {p.quotaTotal}</span></div><div className="mt-4 flex flex-wrap gap-2"><Button size="sm" variant="outline" disabled={p.id === undefined} onClick={() => { if (p.id !== undefined) setEditingId(p.id); }}>Edit</Button><Button size="sm" variant="outline" disabled={state.busy} onClick={() => void state.run(() => AdminApi.togglePromo(p.code))}>{p.isActive ? 'Nonaktifkan' : 'Aktifkan'}</Button><Button size="sm" variant="outline" disabled={state.busy} onClick={() => void state.run(() => AdminApi.deletePromo(p.code), 'Dihapus')}>Hapus</Button></div></article>)}{!promos.length && <div className="py-12 text-center"><Tag className="mx-auto mb-3 text-orange-400" /><p className="font-medium">{search || status !== 'all' ? 'Tidak ada promo yang cocok' : 'Belum ada promo'}</p><p className="mt-1 text-sm text-slate-500">{search || status !== 'all' ? 'Coba ubah pencarian atau filter.' : 'Buat voucher untuk menawarkan diskon kepada pelanggan.'}</p></div>}</div></section>
      {editingId !== null && <aside className={`${panel} h-fit`}><div className="flex items-center justify-between gap-3"><div><h3 className="font-semibold">{editingId === 'new' ? 'Promo baru' : 'Edit promo'}</h3><p className="text-xs text-slate-500">Atur voucher untuk checkout.</p></div><Button size="sm" variant="outline" onClick={() => setEditingId(null)}>Tutup</Button></div>
        <form key={editingId} className="space-y-4" onSubmit={e => {
          const data = formValues(e);
          const payload = {
            id: editingId === 'new' ? undefined : editingId,
            code: String(data.get('code')),
            title: String(data.get('title')),
            promoType: 'voucher',
            discountType: String(data.get('discountType')),
            discountValue: Number(data.get('discountValue')),
            minPurchase: Number(data.get('minPurchase')),
            maxDiscount: Number(data.get('maxDiscount')),
            quotaTotal: Number(data.get('quotaTotal')),
            startDate: String(data.get('startDate')),
            endDate: String(data.get('endDate')),
            isActive: data.get('isActive') === 'on'
          };
          void state.run(() => AdminApi.savePromo(payload), 'Promo tersimpan').then(ok => { if (ok) setEditingId(null); });
        }}>
          <div className="space-y-3"><h4 className="border-b pb-2 text-xs font-semibold uppercase tracking-wider text-orange-600 dark:border-slate-800 dark:text-orange-400">Identitas voucher</h4><InputField label="Kode Promo" name="code" value={target?.code} /><InputField label="Judul/Nama" name="title" value={target?.title} /></div>
          <div className="space-y-3"><h4 className="border-b pb-2 text-xs font-semibold uppercase tracking-wider text-orange-600 dark:border-slate-800 dark:text-orange-400">Potongan & kuota</h4><label className="block space-y-1 text-sm"><span>Tipe Diskon</span><select aria-label="Tipe diskon" className={field} name="discountType" defaultValue={target?.discountType ?? 'fixed'}><option value="fixed">Nominal Rupiah</option><option value="percentage">Persentase (%)</option></select></label><div className="grid grid-cols-2 gap-3"><InputField label="Nilai (Rp atau %)" name="discountValue" type="number" min={0} value={target?.discountValue} /><InputField label="Min. Belanja (Rp)" name="minPurchase" type="number" min={0} value={target?.minPurchase} /><InputField label="Maks. Potongan (Rp)" name="maxDiscount" type="number" min={0} value={target?.maxDiscount} /><InputField label="Total Kuota" name="quotaTotal" type="number" min={1} value={target?.quotaTotal} /></div></div>
          <div className="space-y-3"><h4 className="border-b pb-2 text-xs font-semibold uppercase tracking-wider text-orange-600 dark:border-slate-800 dark:text-orange-400">Periode</h4><InputField label="Berlaku Dari" name="startDate" type="datetime-local" value={localDateTime(target?.startDate ?? now)} /><InputField label="Sampai" name="endDate" type="datetime-local" value={localDateTime(target?.endDate ?? now + 86400000)} /></div><label className="flex items-center gap-2 text-sm"><input type="checkbox" name="isActive" defaultChecked={target?.isActive ?? true} className="accent-orange-500" /> Promo aktif</label><Button disabled={state.busy}>Simpan promo</Button>
        </form>
      </aside>}
    </div>
  </Page>;
}

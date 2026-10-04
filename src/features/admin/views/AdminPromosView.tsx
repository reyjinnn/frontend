import { useState } from 'react';
import { Page, InputField } from './adminShared';
import { useAdminData, panel, money, formValues, localDateTime } from './adminState';
import { Button } from '../../../components/ui/Button';
import { AdminApi } from '../api/adminApi';

export function AdminPromosView() {
  const state = useAdminData();
  const [editingId, setEditingId] = useState<number | 'new' | null>(null);
  const [now] = useState(() => Date.now());
  const promos = state.db?.promos ?? [];
  const target = editingId === 'new' ? null : state.db?.promos.find(p => p.id === editingId);
  return <Page title="Promo & Diskon" state={state}>
    <div className="flex justify-between"><p className="text-sm text-slate-500">Hanya voucher kupon didukung di checkout.</p><Button size="sm" onClick={() => setEditingId('new')}>Buat Promo Baru</Button></div>
    <div className="grid lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2 space-y-3">{promos.map(p => <div key={p.id} className={`${panel} flex justify-between items-center`}><div className="space-y-1"><p className="font-bold text-sm"><span className="font-mono text-primary mr-2">{p.code}</span> {p.title}</p><p className="text-xs text-slate-500">Tipe: {p.discountType} · Potongan: {p.discountType === 'percentage' ? `${p.discountValue}% (Maks ${money(p.maxDiscount)})` : money(p.discountValue)} · Min: {money(p.minPurchase)}</p><p className="text-xs">Kuota: {p.quotaTotal - (p.quotaRemaining ?? 0)}/{p.quotaTotal} · {p.isActive ? <span className="text-green-600">Aktif</span> : <span className="text-red-600">Nonaktif</span>}</p></div><div className="flex flex-col gap-2"><Button size="sm" variant="outline" disabled={p.id === undefined} onClick={() => { if (p.id !== undefined) setEditingId(p.id); }}>Edit</Button><Button size="sm" variant="outline" disabled={state.busy} onClick={() => void state.run(() => AdminApi.togglePromo(p.code))}>{p.isActive ? 'Matikan' : 'Nyalakan'}</Button><Button size="sm" variant="outline" disabled={state.busy} onClick={() => void state.run(() => AdminApi.deletePromo(p.code), 'Dihapus')}>Hapus</Button></div></div>)}{!promos.length && <p className="text-slate-500">Tidak ada promo.</p>}</div>
      {editingId !== null && <div className={panel}><div className="flex justify-between items-center"><h3 className="font-bold font-space">{editingId === 'new' ? 'Promo Baru' : 'Edit Promo'}</h3><Button size="sm" variant="outline" onClick={() => setEditingId(null)}>Tutup</Button></div>
        <form key={editingId} className="space-y-3" onSubmit={e => {
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
          <InputField label="Kode Promo" name="code" value={target?.code} />
          <InputField label="Judul/Nama" name="title" value={target?.title} />
          <label className="block text-sm space-y-1"><span>Tipe Diskon</span><select aria-label="Tipe diskon" className="w-full rounded-xl border p-2 dark:bg-[#111]" name="discountType" defaultValue={target?.discountType ?? 'fixed'}><option value="fixed">Nominal Rupiah (Fixed)</option><option value="percentage">Persentase (%)</option></select></label>
          <InputField label="Nilai Potongan (Rp atau %)" name="discountValue" type="number" min={0} value={target?.discountValue} />
          <InputField label="Min Belanja (Rp)" name="minPurchase" type="number" min={0} value={target?.minPurchase} />
          <InputField label="Maks Potongan (Rp) [Bila persentase]" name="maxDiscount" type="number" min={0} value={target?.maxDiscount} />
          <InputField label="Total Kuota" name="quotaTotal" type="number" min={1} value={target?.quotaTotal} />
          <InputField label="Berlaku Dari" name="startDate" type="datetime-local" value={localDateTime(target?.startDate ?? now)} />
          <InputField label="Sampai" name="endDate" type="datetime-local" value={localDateTime(target?.endDate ?? now + 86400000)} />
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="isActive" defaultChecked={target?.isActive ?? true} /> Promo Aktif</label>
          <Button disabled={state.busy}>Simpan</Button>
        </form>
      </div>}
    </div>
  </Page>;
}

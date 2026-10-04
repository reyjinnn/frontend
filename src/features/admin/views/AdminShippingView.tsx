import { AdminApi } from '../api/adminApi';
import { Page, InputField } from './adminShared';
import { useAdminData, panel, formValues } from './adminState';
import { Button } from '../../../components/ui/Button';

export function AdminShippingView() {
  const state = useAdminData();
  const db = state.db;
  return <Page title="Manajemen Pengiriman" state={state}>
    <section className={panel}><h3 className="font-bold">Pengiriman Aktif</h3>{db?.orders.filter(o => o.status === 'shipped').map(o => <div key={o.id} className="border-t pt-3"><p>{o.orderNumber} · {o.courier} · {o.tracking?.receiptNumber ?? 'Resi belum tersedia'} · {o.tracking?.currentStatus ?? o.status}</p>{o.tracking?.timeline.map(t => <p key={t.id} className="text-xs text-slate-500">{t.timestamp} · {t.description}</p>)}</div>)}{!db?.orders.some(o => o.status === 'shipped') && <p>Tidak ada pengiriman aktif.</p>}<p className="text-xs text-slate-500">Tracking lokal; tidak terhubung GPS atau API kurir. Update melalui detail pesanan.</p></section>
    {db && <form className={panel} onSubmit={e => { const data = formValues(e); void state.run(() => AdminApi.saveSettings({...db.settings,shippingFee:Number(data.get('fee'))})); }}><h3 className="font-bold">Ongkir Default</h3><InputField label="Biaya default (Rp)" name="fee" type="number" min={0} value={db.settings.shippingFee} /><Button disabled={state.busy}>Simpan</Button></form>}
    <section className={panel}><h3 className="font-bold">Kurir</h3><p className="text-xs text-slate-500">Daftar dan tarif tersimpan di repository. Subsidi ongkir dan wilayah layanan belum didukung kontrak checkout.</p>{db?.shipping.map(c => <form key={`${c.id}-${c.fee}-${c.isActive}`} className="border-t pt-3 flex flex-wrap items-end gap-3" onSubmit={e => { const data = formValues(e); void state.run(() => AdminApi.saveCourier({...c,name:String(data.get('name')),fee:Number(data.get('fee')),isActive:data.get('active') === 'on'})); }}><InputField label="Nama" name="name" value={c.name} /><InputField label="Tarif (Rp)" name="fee" type="number" min={0} value={c.fee} /><label><input name="active" type="checkbox" defaultChecked={c.isActive} /> Aktif</label><Button disabled={state.busy}>Simpan Kurir</Button></form>)}<form className="border-t pt-4 space-y-3" onSubmit={e => { const form = e.currentTarget; const data = formValues(e); void state.run(() => AdminApi.saveCourier({id:'',name:String(data.get('name')),fee:Number(data.get('fee')),isActive:true})).then(ok => {if(ok) form.reset();}); }}><h4 className="font-bold">Tambah Kurir</h4><InputField label="Nama kurir" name="name" /><InputField label="Tarif (Rp)" name="fee" type="number" min={0} /><Button disabled={state.busy}>Tambah</Button></form></section>
  </Page>;
}

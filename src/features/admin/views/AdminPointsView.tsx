import { useState } from 'react';
import { AdminApi } from '../api/adminApi';
import { Page, InputField } from './adminShared';
import { useAdminData, panel, formValues, csv } from './adminState';
import { Button } from '../../../components/ui/Button';

export function AdminPointsView() {
  const state = useAdminData();
  const [search, setSearch] = useState('');
  const db = state.db;
  const ledger = (db?.ledger ?? []).filter(e => `${e.userId} ${e.description} ${e.referenceId} ${db?.customers.find(c => c.id === e.userId)?.name ?? ''}`.toLowerCase().includes(search.toLowerCase()));
  return <Page title="Vibe Points Management" state={state}>
    <div className={panel}><h3 className="font-bold">Saldo beredar: {Object.values(db?.points ?? {}).reduce((s,v) => s+v,0).toLocaleString('id-ID')} poin</h3><p className="text-sm text-slate-500">Reward pembelian tetap 1% sesuai repository. Multiplier dan earning-rate kustom belum didukung.</p></div>
    {db && <form className={panel} onSubmit={e => { const data = formValues(e); void state.run(() => AdminApi.saveSettings({...db.settings,pointValue:Number(data.get('value'))})); }}><h3 className="font-bold">Nilai Tukar</h3><InputField label="Nilai 1 poin (Rp)" name="value" type="number" min={1} value={db.settings.pointValue} /><Button disabled={state.busy}>Simpan</Button></form>}
    <form className={panel} onSubmit={e => { const form = e.currentTarget; const data = formValues(e); const key = crypto.randomUUID(); void state.run(() => AdminApi.adjustPoints(String(data.get('user')),Number(data.get('amount')),String(data.get('reason')),key)).then(ok => { if(ok) form.reset(); }); }}><h3 className="font-bold">Penyesuaian Manual</h3><label className="block text-sm">Pelanggan<select name="user" required className="w-full border rounded-xl p-2 dark:bg-[#111]">{db?.customers.filter(c => c.role === 'customer').map(c => <option key={c.id} value={c.id}>{c.name} · {db.points[c.id] ?? 0} poin</option>)}</select></label><InputField label="Jumlah (+ kredit / - debit)" name="amount" type="number" /><InputField label="Alasan penyesuaian" name="reason" /><Button disabled={state.busy}>Sesuaikan Saldo</Button></form>
    <section className={panel}><div className="flex flex-wrap gap-3 justify-between"><h3 className="font-bold">Ledger</h3><input aria-label="Cari ledger" value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari pelanggan/referensi" className="border rounded-xl p-2 dark:bg-[#111]" /><Button variant="outline" onClick={() => csv('points-ledger.csv',[['id','userId','type','amount','balanceAfter','reference','description','createdAt'],...ledger.map(e => [e.id,e.userId,e.type,e.amount,e.balanceAfter,e.referenceId,e.description,e.createdAt])])}>Export CSV</Button></div><div className="overflow-x-auto"><table className="w-full text-sm text-left"><thead><tr>{['ID','Pelanggan','Jenis','Jumlah','Saldo','Alasan / Referensi','Waktu'].map(h => <th key={h} className="p-2">{h}</th>)}</tr></thead><tbody>{[...ledger].reverse().map(e => <tr key={e.id} className="border-t"><td className="p-2">{e.id}</td><td className="p-2">{db?.customers.find(c => c.id === e.userId)?.name ?? e.userId}</td><td className="p-2">{e.type}</td><td className="p-2">{e.amount}</td><td className="p-2">{e.balanceAfter}</td><td className="p-2">{e.description} · {e.referenceId}</td><td className="p-2">{new Date(e.createdAt).toLocaleString('id-ID')}</td></tr>)}</tbody></table></div>{!ledger.length && <p>Tidak ada ledger.</p>}</section>
  </Page>;
}

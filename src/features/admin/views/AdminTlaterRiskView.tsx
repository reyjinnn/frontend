import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AdminApi } from '../api/adminApi';
import { Page, InputField } from './adminShared';
import { useAdminData, panel, formValues, money } from './adminState';
import { Button } from '../../../components/ui/Button';

export function AdminTlaterRiskView() {
  const state = useAdminData();
  const location = useLocation();
  const [search, setSearch] = useState(() => new URLSearchParams(location.search).get('search') ?? '');
  const db = state.db;
  return <Page title="Pelanggan, KYC & Risiko TLater" state={state}>
    <input aria-label="Cari pelanggan atau NIK" placeholder="Cari pelanggan atau NIK" className="rounded-xl border p-2 dark:bg-[#111]" value={search} onChange={e => setSearch(e.target.value)} />
    <section className={panel}><h3 className="font-bold">Pelanggan & Limit Akun</h3>{db?.customers.filter(c => c.role === 'customer' && `${c.name} ${c.email}`.toLowerCase().includes(search.toLowerCase())).map(c => {
      const used = db.loans.filter(l => l.userId === c.id).reduce((s,l) => s + l.installments.filter(i => i.status !== 'paid').reduce((a,i) => a + i.principalDue,0),0);
      return <div key={c.id} className="border-t pt-3 text-sm"><p className="font-bold">{c.name} · {c.email} · {c.phone ?? '-'}</p><p>ID {c.id} · KYC {c.kycStatus} · Saldo poin {db.points[c.id] ?? 0} · Pesanan {db.orders.filter(o => o.userId === c.id).length}</p><p>Limit global: {money(db.settings.creditLimit)} · Terpakai: {money(used)} · Tersedia: {money(Math.max(0,db.settings.creditLimit-used))}</p></div>;
    })}<p className="text-xs text-slate-500">Limit per akun, suku bunga dan denda belum didukung kontrak repository; limit global berlaku untuk seluruh akun terverifikasi.</p></section>
    <section className={panel}><h3 className="font-bold">Antrean Review KYC</h3>{db?.kyc.filter(k => `${k.name} ${k.nik}`.toLowerCase().includes(search.toLowerCase())).map(k => <article key={k.userId} className="border-t pt-4 space-y-3"><p className="font-bold">{k.name} · {k.nik} · {k.status}</p><p className="text-sm">Lahir: {k.dateOfBirth} · Alamat: {k.address} · Diajukan: {new Date(k.submittedAt).toLocaleString('id-ID')}</p><div className="flex flex-wrap gap-4">{[k.ktpImageUrl,k.selfieImageUrl].map((url,i) => <a key={i} href={url} target="_blank" rel="noreferrer"><img className="w-40 h-32 object-contain rounded-xl" src={url} alt={i ? 'Swafoto pemohon' : 'KTP pemohon'} /></a>)}</div>{k.reason && <p>Alasan keputusan: {k.reason}</p>}{k.status === 'pending' && <form className="flex flex-wrap gap-2" onSubmit={e => { const data = formValues(e); void state.run(() => AdminApi.verifyKyc(k.userId,false,String(data.get('reason')))); }}><input name="reason" required aria-label="Alasan penolakan" placeholder="Alasan penolakan" className="border rounded-xl p-2 dark:bg-[#111]" /><Button type="submit" variant="outline" disabled={state.busy}>Tolak</Button><Button type="button" disabled={state.busy} onClick={() => void state.run(() => AdminApi.verifyKyc(k.userId,true))}>Setujui KYC</Button></form>}</article>)}{!db?.kyc.length && <p className="text-slate-500">Belum ada pengajuan.</p>}</section>
    {db && <form className={panel} onSubmit={e => { const data = formValues(e); void state.run(() => AdminApi.saveSettings({...db.settings,creditLimit:Number(data.get('limit'))})); }}><h3 className="font-bold">Limit Kredit Global</h3><InputField label="Limit (Rp)" name="limit" type="number" min={0} value={db.settings.creditLimit} /><Button disabled={state.busy}>Simpan Limit</Button></form>}
  </Page>;
}

import { useState } from 'react';
import { Coins, Download, Settings, SlidersHorizontal, ArrowDownUp, Search } from 'lucide-react';
import { AdminApi } from '../api/adminApi';
import { Page, InputField } from './adminShared';
import { useAdminData, panel, field, formValues, csv } from './adminState';
import { Button } from '../../../components/ui/Button';

export function AdminPointsView() {
  const state = useAdminData();
  const [search, setSearch] = useState('');
  const db = state.db;
  const ledger = (db?.ledger ?? []).filter(e => `${e.userId} ${e.description} ${e.referenceId} ${db?.customers.find(c => c.id === e.userId)?.name ?? ''}`.toLowerCase().includes(search.toLowerCase()));
  const totalPoints = Object.values(db?.points ?? {}).reduce((s, v) => s + v, 0);

  return <Page title="Vibe Points" state={state}>
    <div className="grid gap-5 lg:grid-cols-3">
      <div className="space-y-5 lg:col-span-1">
        <div className={`${panel} bg-gradient-to-br from-orange-500 to-orange-600 text-white dark:from-orange-600 dark:to-orange-800 dark:text-white`}>
          <div className="flex items-center gap-3"><div className="rounded-full bg-white/20 p-2"><Coins size={20} /></div><h3 className="font-semibold">Total Saldo Beredar</h3></div>
          <p className="mt-2 text-3xl font-bold tabular-nums tracking-tight">{totalPoints.toLocaleString('id-ID')}</p>
          <p className="mt-1 text-xs opacity-80">Reward pembelian tetap 1% dari transaksi. Multiplier belum didukung.</p>
        </div>

        {db && <form className={panel} onSubmit={e => { const data = formValues(e); void state.run(() => AdminApi.saveSettings({...db.settings,pointValue:Number(data.get('value'))})); }}>
          <div className="flex items-center gap-2 border-b pb-3 dark:border-slate-800"><Settings size={18} className="text-orange-500" /><h3 className="font-semibold">Nilai Tukar Poin</h3></div>
          <p className="mt-3 text-xs text-slate-500">Tentukan konversi nilai 1 poin ke Rupiah saat pelanggan menukarkan poin di checkout.</p>
          <div className="mt-4 space-y-3"><InputField label="Nilai 1 poin (Rp)" name="value" type="number" min={1} value={db.settings.pointValue} /><Button disabled={state.busy} className="w-full">Simpan pengaturan</Button></div>
        </form>}

        <form className={panel} onSubmit={e => { const form = e.currentTarget; const data = formValues(e); const key = crypto.randomUUID(); void state.run(() => AdminApi.adjustPoints(String(data.get('user')),Number(data.get('amount')),String(data.get('reason')),key)).then(ok => { if(ok) form.reset(); }); }}>
          <div className="flex items-center gap-2 border-b pb-3 dark:border-slate-800"><SlidersHorizontal size={18} className="text-orange-500" /><h3 className="font-semibold">Penyesuaian Manual</h3></div>
          <div className="mt-4 space-y-3">
            <label className="block space-y-1 text-sm"><span>Pelanggan</span><select name="user" required className={field}>
              <option value="">Pilih pelanggan...</option>
              {db?.customers.filter(c => c.role === 'customer').map(c => <option key={c.id} value={c.id}>{c.name} ({db.points[c.id] ?? 0} pts)</option>)}
            </select></label>
            <InputField label="Jumlah (+ kredit / - debit)" name="amount" type="number" />
            <InputField label="Alasan penyesuaian" name="reason" />
            <Button disabled={state.busy} className="w-full">Sesuaikan Saldo</Button>
          </div>
        </form>
      </div>

      <section className={`${panel} lg:col-span-2 min-w-0`}>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3 dark:border-slate-800">
          <div className="flex items-center gap-2"><ArrowDownUp size={18} className="text-orange-500" /><h3 className="font-semibold">Riwayat Ledger</h3></div>
          <div className="flex items-center gap-2">
            <label className="relative"><Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" /><input aria-label="Cari ledger" value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari referensi..." className={`${field} py-1.5 pl-8 text-sm`} /></label>
            <Button size="sm" variant="outline" onClick={() => csv('points-ledger.csv',[['id','userId','type','amount','balanceAfter','reference','description','createdAt'],...ledger.map(e => [e.id,e.userId,e.type,e.amount,e.balanceAfter,e.referenceId,e.description,e.createdAt])])}>
              <Download size={14} className="mr-1 inline" /> CSV
            </Button>
          </div>
        </div>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full whitespace-nowrap text-sm text-left">
            <thead>
              <tr className="text-slate-500 dark:text-slate-400 border-b dark:border-slate-800">
                <th className="py-2 pr-3 font-medium">Waktu</th>
                <th className="px-3 py-2 font-medium">Pelanggan</th>
                <th className="px-3 py-2 font-medium">Transaksi</th>
                <th className="px-3 py-2 font-medium text-right">Jumlah</th>
                <th className="px-3 py-2 font-medium text-right">Saldo Akhir</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {[...ledger].reverse().map(e => <tr key={e.id}>
                <td className="py-3 pr-3 text-xs text-slate-500">{new Date(e.createdAt).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' })}</td>
                <td className="px-3 py-3 font-medium text-slate-900 dark:text-slate-100">{db?.customers.find(c => c.id === e.userId)?.name ?? e.userId}</td>
                <td className="px-3 py-3 text-xs text-slate-500"><p className="text-sm font-medium text-slate-700 dark:text-slate-300">{e.description}</p>Ref: {e.referenceId}</td>
                <td className={`px-3 py-3 text-right font-bold tabular-nums ${e.type === 'credit' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                  {e.type === 'credit' ? '+' : '-'}{Math.abs(e.amount)}
                </td>
                <td className="px-3 py-3 text-right tabular-nums text-slate-700 dark:text-slate-300">{e.balanceAfter}</td>
              </tr>)}
            </tbody>
          </table>
          {!ledger.length && <p className="py-8 text-center text-sm text-slate-500">Tidak ada data riwayat poin.</p>}
        </div>
      </section>
    </div>
  </Page>;
}

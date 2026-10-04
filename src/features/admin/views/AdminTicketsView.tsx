import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { MessageSquare, Search, Send } from 'lucide-react';
import { AdminApi } from '../api/adminApi';
import { Page } from './adminShared';
import { useAdminData, panel, field, formValues } from './adminState';
import { Button } from '../../../components/ui/Button';

export function AdminTicketsView() {
  const state = useAdminData();
  const location = useLocation();
  const [search, setSearch] = useState(() => new URLSearchParams(location.search).get('search') ?? '');
  const [status, setStatus] = useState('all');
  const db = state.db;
  const tickets = (db?.tickets ?? []).filter(t => (status === 'all' || t.status === status) && `${t.ticketNumber} ${t.subject}`.toLowerCase().includes(search.toLowerCase()));
  return <Page title="TechVibe Care · Tiket" state={state}>
    <div className={`${panel} flex flex-wrap items-center gap-3`}><label className="relative min-w-0 flex-1 sm:min-w-64"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input aria-label="Cari tiket" placeholder="Cari nomor atau subjek tiket" className={`${field} pl-9`} value={search} onChange={e => setSearch(e.target.value)} /></label><select aria-label="Filter status tiket" className={`${field} w-auto min-w-36`} value={status} onChange={e => setStatus(e.target.value)}><option value="all">Semua status</option><option value="open">Terbuka</option><option value="closed">Selesai</option></select><span className="text-xs text-slate-500">{tickets.length} tiket</span></div>
    <div className="space-y-4">{tickets.map(ticket => <section className={`${panel} space-y-5`} key={ticket.id}>
      <div className="flex flex-wrap items-start justify-between gap-3 border-b pb-4 dark:border-slate-800"><div><span className="font-mono text-xs font-semibold text-orange-600 dark:text-orange-400">{ticket.ticketNumber}</span><h3 className="mt-1 text-lg font-semibold">{ticket.subject}</h3><p className="mt-1 text-xs text-slate-500">{db?.customers.find(c => c.id === ticket.userId)?.name ?? ticket.userId} · {ticket.category}</p></div><div className="flex gap-2"><span className={`h-fit rounded-full px-2.5 py-1 text-xs font-medium ${ticket.status === 'closed' ? 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300' : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'}`}>{ticket.status}</span><span className="h-fit rounded-full bg-orange-50 px-2.5 py-1 text-xs font-medium text-orange-700 dark:bg-orange-950 dark:text-orange-300">{ticket.priority}</span></div></div>
      <div className="space-y-3">{ticket.messages.map(m => <div key={m.id} className={`max-w-[90%] rounded-xl p-3 text-sm ${m.isAdmin ? 'ml-auto bg-orange-50 dark:bg-orange-950/30' : 'bg-slate-50 dark:bg-slate-900'}`}><div className="flex flex-wrap justify-between gap-2"><p className="font-semibold">{m.senderName} {m.isAdmin && <span className="text-xs text-orange-600 dark:text-orange-400">· Admin</span>}</p><time className="text-xs text-slate-500">{new Date(m.timestamp).toLocaleString('id-ID')}</time></div><p className="mt-2 whitespace-pre-wrap text-slate-700 dark:text-slate-300">{m.message}</p></div>)}</div>
      <div className="flex flex-wrap items-end gap-3 border-t pt-4 dark:border-slate-800">{ticket.status !== 'closed' && <form className="flex min-w-0 flex-1 flex-wrap gap-2" onSubmit={e => { const form = e.currentTarget; const data = formValues(e); void state.run(() => AdminApi.replyTicket(ticket.id,String(data.get('reply'))),'Balasan dikirim').then(ok => {if(ok) form.reset();}); }}><input name="reply" aria-label={`Balasan untuk ${ticket.ticketNumber}`} required placeholder="Tulis balasan kepada pelanggan..." className={`${field} min-w-44 flex-1`} /><Button disabled={state.busy}><Send size={15} className="mr-1 inline" />Kirim Balasan</Button></form>}<Button variant="outline" disabled={state.busy} onClick={() => void state.run(() => AdminApi.setTicketStatus(ticket.id,ticket.status === 'closed' ? 'open' : 'closed'))}>{ticket.status === 'closed' ? 'Buka Kembali' : 'Selesaikan'}</Button></div>
    </section>)}{!tickets.length && <div className={`${panel} py-14 text-center`}><MessageSquare className="mx-auto mb-3 text-orange-400" /><p className="font-medium">{search || status !== 'all' ? 'Tiket tidak ditemukan' : 'Belum ada tiket'}</p><p className="mt-1 text-sm text-slate-500">{search || status !== 'all' ? 'Coba ubah filter atau kata kunci pencarian.' : 'Permintaan bantuan pelanggan akan tampil di sini.'}</p></div>}</div>
  </Page>;
}

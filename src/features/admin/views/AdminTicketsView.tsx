import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AdminApi } from '../api/adminApi';
import { Page } from './adminShared';
import { useAdminData, panel, formValues } from './adminState';
import { Button } from '../../../components/ui/Button';

export function AdminTicketsView() {
  const state = useAdminData();
  const location = useLocation();
  const [search, setSearch] = useState(() => new URLSearchParams(location.search).get('search') ?? '');
  const db = state.db;
  return <Page title="TechVibe Care · Tiket" state={state}>
    <input aria-label="Cari tiket" placeholder="Cari tiket atau subjek" className="border rounded-xl p-2 dark:bg-[#111]" value={search} onChange={e => setSearch(e.target.value)} />
    {(db?.tickets ?? []).filter(t => `${t.ticketNumber} ${t.subject}`.toLowerCase().includes(search.toLowerCase())).map(ticket => <section className={panel} key={ticket.id}><div className="flex flex-wrap justify-between"><h3 className="font-bold">{ticket.ticketNumber} · {ticket.subject}</h3><p>{ticket.status} · {ticket.priority}</p></div><p className="text-sm text-slate-500">{db?.customers.find(c => c.id === ticket.userId)?.name ?? ticket.userId} · {ticket.category}</p><div className="space-y-2">{ticket.messages.map(m => <div key={m.id} className="border-t pt-2 text-sm"><p className="font-bold">{m.senderName} {m.isAdmin && '· Admin'} · {new Date(m.timestamp).toLocaleString('id-ID')}</p><p className="whitespace-pre-wrap">{m.message}</p></div>)}</div>{ticket.status !== 'closed' && <form className="flex gap-2" onSubmit={e => { const form = e.currentTarget; const data = formValues(e); void state.run(() => AdminApi.replyTicket(ticket.id,String(data.get('reply'))),'Balasan dikirim').then(ok => {if(ok) form.reset();}); }}><input name="reply" aria-label={`Balasan untuk ${ticket.ticketNumber}`} required placeholder="Balas pelanggan" className="border rounded-xl p-2 flex-1 dark:bg-[#111]" /><Button disabled={state.busy}>Kirim Balasan</Button></form>}<Button variant="outline" disabled={state.busy} onClick={() => void state.run(() => AdminApi.setTicketStatus(ticket.id,ticket.status === 'closed' ? 'open' : 'closed'))}>{ticket.status === 'closed' ? 'Buka Kembali' : 'Selesaikan'}</Button></section>)}
    {!db?.tickets.length && <p>Tidak ada tiket.</p>}
  </Page>;
}

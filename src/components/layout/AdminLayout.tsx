import { useState, type ReactNode } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/useAuthStore';
import { useThemeStore } from '../../stores/useThemeStore';
import { DEMO_MODE } from '../../lib/demoMode';
import { AdminApi } from '../../features/admin/api/adminApi';
import { useAdminData, panel, field, formValues } from '../../features/admin/views/adminState';
import { Feedback, InputField } from '../../features/admin/views/adminShared';
import { AdminTlaterRiskView } from '../../features/admin/views/AdminTlaterRiskView';
import { Button } from '../ui/Button';
import { Menu, Bell, Search, LogOut, Sun, Moon, Settings, RotateCcw, X } from 'lucide-react';

const navItems = [
  ['Dasbor', '/admin'], ['Semua Pesanan', '/admin/orders'], ['Produk & Stok', '/admin/products'],
  ['Promo & Diskon', '/admin/promos'], ['Pengiriman', '/admin/shipping'], ['TLater Risk', '/admin/tlater-risk'],
  ['Pelanggan & KYC', '/admin/customers'], ['Tiket & Bantuan', '/admin/tickets'], ['Vibe Points', '/admin/points']
];
export function AdminLayout({ children }: { children: ReactNode }) {
  const state = useAdminData();
  const { user, logout } = useAuthStore();
  const { isDarkMode, toggleTheme } = useThemeStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobile, setMobile] = useState(false);
  const [overlay, setOverlay] = useState<'search' | 'settings' | 'reset' | 'notifications' | null>(null);
  const [search, setSearch] = useState('');
  const db = state.db;
  const notifications = db?.notifications.filter(n => n.userId === user?.id) ?? [];
  const counts: Record<string, number> = {
    '/admin/orders': db?.orders.filter(o => o.status === 'shipping').length ?? 0,
    '/admin/tickets': db?.tickets.filter(t => t.status !== 'closed').length ?? 0,
    '/admin/customers': db?.kyc.filter(k => k.status === 'pending').length ?? 0
  };
  const open = (value: typeof overlay) => { setMobile(false); setOverlay(value); };
  const go = (path: string) => { navigate(path); setOverlay(null); setSearch(''); };
  const navigation = <>
    <div className="p-5 font-space font-bold text-xl text-primary flex justify-between">TechVibe <button aria-label="Tutup menu" className="md:hidden" onClick={() => setMobile(false)}><X /></button></div>
    <nav className="flex-1 overflow-y-auto p-3 space-y-1">{navItems.map(([label,path]) => <NavLink key={path} to={path} end={path === '/admin'} onClick={() => setMobile(false)} className={({isActive}) => `flex justify-between rounded-xl px-3 py-3 text-sm ${isActive ? 'bg-primary text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-primary/10'}`}><span>{label}</span>{counts[path] > 0 && <span>{counts[path]}</span>}</NavLink>)}</nav>
    <div className="border-t border-slate-200 dark:border-slate-800 p-4 space-y-2"><Button variant="outline" className="w-full" onClick={() => open('settings')}><Settings size={16} className="mr-2" />Pengaturan Toko</Button>{DEMO_MODE && <Button variant="outline" className="w-full" onClick={() => open('reset')}><RotateCcw size={16} className="mr-2" />Reset Demo DB</Button>}<Button variant="outline" className="w-full text-red-600" onClick={() => { logout(); navigate('/admin/login', { replace:true }); }}><LogOut size={16} className="mr-2" />Keluar</Button></div>
  </>;
  const query = search.trim().toLowerCase();
  const matches = query && db ? [
    ...db.orders.filter(o => `${o.orderNumber} ${o.shippingAddress} ${o.tracking?.receiptNumber ?? ''}`.toLowerCase().includes(query)).map(o => ({id:`order-${o.id}`,label:o.orderNumber,path:`/admin/orders?search=${encodeURIComponent(o.orderNumber)}`})),
    ...db.products.filter(p => `${p.name} ${p.sku}`.toLowerCase().includes(query)).map(p => ({id:`product-${p.id}`,label:`${p.name} · ${p.sku}`,path:`/admin/products?search=${encodeURIComponent(p.sku)}`})),
    ...db.customers.filter(c => c.role === 'customer' && `${c.name} ${c.email}`.toLowerCase().includes(query)).map(c => ({id:`customer-${c.id}`,label:`${c.name} · ${c.email}`,path:`/admin/customers?search=${encodeURIComponent(c.email)}`})),
    ...db.tickets.filter(t => `${t.ticketNumber} ${t.subject}`.toLowerCase().includes(query)).map(t => ({id:`ticket-${t.id}`,label:`${t.ticketNumber} · ${t.subject}`,path:`/admin/tickets?search=${encodeURIComponent(t.ticketNumber)}`}))
  ].slice(0,20) : [];
  return <div className="flex h-screen bg-slate-50 dark:bg-[#0a0a0a] text-slate-900 dark:text-slate-50">
    <aside className="hidden md:flex flex-col w-64 shrink-0 bg-white dark:bg-[#111] border-r border-slate-200 dark:border-slate-800">{navigation}</aside>
    <main className="flex-1 min-w-0 flex flex-col overflow-hidden"><header className="flex items-center justify-between gap-2 p-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111]"><div className="flex items-center gap-3"><button aria-label="Buka menu" className="md:hidden" onClick={() => setMobile(true)}><Menu /></button><h1 className="hidden sm:block font-bold">{navItems.find(([,path]) => path === location.pathname)?.[0] ?? 'Admin'}</h1>{DEMO_MODE && <span className="rounded-full bg-primary/10 text-primary px-2 py-1 text-xs font-bold">Mode Demo</span>}</div><div className="flex items-center gap-3"><button aria-label="Pencarian global" onClick={() => open('search')}><Search size={20} /></button><button aria-label="Ganti tema" onClick={toggleTheme}>{isDarkMode ? <Sun size={20} /> : <Moon size={20} />}</button><button aria-label={`Notifikasi, ${notifications.filter(n => !n.isRead).length} belum dibaca`} onClick={() => open('notifications')} className="flex items-center gap-1"><Bell size={20} />{notifications.some(n => !n.isRead) && <span className="text-xs text-primary">{notifications.filter(n => !n.isRead).length}</span>}</button><span className="hidden lg:block text-sm">{user?.name}</span></div></header>
      <div className="flex-1 overflow-auto p-4 md:p-8"><Feedback error={state.error} message="" />{location.pathname === '/admin/customers' ? <AdminTlaterRiskView key={location.search} /> : <div key={location.pathname + location.search}>{children}</div>}</div>
    </main>
    {mobile && <div className="fixed inset-0 z-50 md:hidden"><button aria-label="Tutup menu" className="absolute inset-0 bg-black/50" onClick={() => setMobile(false)} /><aside className="relative flex flex-col h-full w-64 max-w-[85%] bg-white dark:bg-[#111]">{navigation}</aside></div>}
    {overlay && <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"><section role="dialog" aria-modal="true" aria-label={overlay} className={`${panel} w-full max-w-xl max-h-[90vh] overflow-auto`}><div className="flex justify-between items-center"><h2 className="font-bold">{overlay === 'reset' ? 'Konfirmasi Reset Demo' : overlay === 'settings' ? 'Pengaturan Toko & Kontak' : overlay === 'search' ? 'Pencarian Global' : 'Notifikasi Admin'}</h2><button aria-label="Tutup dialog" onClick={() => setOverlay(null)}><X /></button></div><Feedback error={state.error} message={state.message} />
      {overlay === 'search' && <><input autoFocus aria-label="Cari order, produk, pelanggan, tiket" placeholder="Cari order, produk, pelanggan, tiket" className={field} value={search} onChange={e => setSearch(e.target.value)} /><div className="space-y-2">{matches.map(m => <button key={m.id} className="block w-full text-left p-2 rounded-xl hover:bg-primary/10" onClick={() => go(m.path)}>{m.label}</button>)}{query && !matches.length && <p>Tidak ada hasil.</p>}</div></>}
      {overlay === 'notifications' && <><Button disabled={state.busy || !notifications.some(n => !n.isRead)} variant="outline" onClick={() => void state.run(() => AdminApi.readNotifications(), 'Ditandai dibaca')}>Tandai Semua Dibaca</Button>{notifications.map(n => <article key={n.id} className="border-t pt-3"><h3 className="font-bold">{n.title}</h3><p>{n.message}</p><p className="text-xs text-slate-500">{new Date(n.createdAt).toLocaleString('id-ID')} · {n.isRead ? 'Dibaca' : 'Baru'}</p></article>)}{!notifications.length && <p>Belum ada notifikasi untuk akun admin ini.</p>}</>}
      {overlay === 'settings' && db && <form className="space-y-4" onSubmit={e => { const data = formValues(e); void state.run(() => AdminApi.saveSettings({ ...db.settings, shippingFee:Number(data.get('fee')), pointValue:Number(data.get('point')), creditLimit:Number(data.get('limit')), storeName:String(data.get('storeName')), contactEmail:String(data.get('contactEmail')), contactPhone:String(data.get('contactPhone')), interest1:Number(data.get('interest1')), interest3:Number(data.get('interest3')), interest6:Number(data.get('interest6')), adminFeePercent:Number(data.get('adminFeePercent')), adminFeeFixed:Number(data.get('adminFeeFixed')) })); }}><InputField label="Nama Toko" name="storeName" value={db.settings.storeName} /><InputField label="Email Kontak" name="contactEmail" value={db.settings.contactEmail} /><InputField label="Telepon Kontak" name="contactPhone" value={db.settings.contactPhone} /><InputField label="Ongkir default (Rp)" name="fee" type="number" min={0} value={db.settings.shippingFee} /><InputField label="Nilai 1 poin (Rp)" name="point" type="number" min={1} value={db.settings.pointValue} /><InputField label="Limit global TLater (Rp)" name="limit" type="number" min={0} value={db.settings.creditLimit} /><div className="grid grid-cols-2 gap-2"><InputField label="Bunga 1 Bln (%)" name="interest1" type="number" step="0.1" min={0} value={db.settings.interest1} /><InputField label="Bunga 3 Bln (%)" name="interest3" type="number" step="0.1" min={0} value={db.settings.interest3} /><InputField label="Bunga 6 Bln (%)" name="interest6" type="number" step="0.1" min={0} value={db.settings.interest6} /><InputField label="Biaya Admin (%)" name="adminFeePercent" type="number" step="0.1" min={0} value={db.settings.adminFeePercent} /><InputField label="Biaya Admin (Fixed)" name="adminFeeFixed" type="number" min={0} value={db.settings.adminFeeFixed} /></div><Button disabled={state.busy}>Simpan Pengaturan</Button></form>}
      {overlay === 'reset' && <><p>Reset menghapus seluruh akun, pesanan, saldo poin, pinjaman, KYC, tiket, promo, kurir, dan perubahan katalog demo di browser ini, termasuk data tab lain. Data tidak dapat dipulihkan. Setelah keluar dan memuat ulang, seed repository akan dibuat kembali.</p><div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setOverlay(null)}>Batal</Button><Button disabled={state.busy} onClick={() => void state.run(() => AdminApi.resetDemo(), 'Demo direset').then(ok => { if (ok) { logout(); window.location.assign('/admin/login'); } })}>Ya, Hapus Data Demo</Button></div></>}
    </section></div>}
  </div>;
}

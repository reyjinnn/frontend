import { useEffect, useRef, useState, type ReactNode } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/useAuthStore';
import { useThemeStore } from '../../stores/useThemeStore';
import { DEMO_MODE } from '../../lib/demoMode';
import { AdminApi } from '../../features/admin/api/adminApi';
import { useAdminData, panel, field, formValues } from '../../features/admin/views/adminState';
import { Feedback, InputField } from '../../features/admin/views/adminShared';
import { AdminTlaterRiskView } from '../../features/admin/views/AdminTlaterRiskView';
import { Button } from '../ui/Button';
import { Menu, Bell, Search, LogOut, Sun, Moon, Settings, X, LayoutDashboard, ShoppingBag, Package, Tag, Truck, ShieldCheck, Users, Headphones, Gift, ChevronRight, Command } from 'lucide-react';

const navGroups = [
  { label: 'IKHTISAR', items: [{ label: 'Dasbor', path: '/admin', icon: LayoutDashboard }] },
  { label: 'OPERASIONAL', items: [{ label: 'Semua Pesanan', path: '/admin/orders', icon: ShoppingBag }, { label: 'Produk & Stok', path: '/admin/products', icon: Package }, { label: 'Promo & Diskon', path: '/admin/promos', icon: Tag }, { label: 'Pengiriman', path: '/admin/shipping', icon: Truck }] },
  { label: 'PELANGGAN', items: [{ label: 'TLater Risk', path: '/admin/tlater-risk', icon: ShieldCheck }, { label: 'Pelanggan & KYC', path: '/admin/customers', icon: Users }, { label: 'Tiket & Bantuan', path: '/admin/tickets', icon: Headphones }, { label: 'Vibe Points', path: '/admin/points', icon: Gift }] }
];
export function AdminLayout({ children }: { children: ReactNode }) {
  const state = useAdminData();
  const { user, logout } = useAuthStore();
  const { isDarkMode, toggleTheme } = useThemeStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobile, setMobile] = useState(false);
  const [overlay, setOverlay] = useState<'search' | 'settings' | 'notifications' | null>(null);
  const [search, setSearch] = useState('');
  const dialogRef = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!mobile && !overlay) return;
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const elements = () => Array.from(dialogRef.current?.querySelectorAll<HTMLElement>('button:not(:disabled), a[href], input, select, textarea, [tabindex="0"]') ?? []);
    elements()[0]?.focus();
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setMobile(false); setOverlay(null); }
      if (event.key === 'Tab') {
        const items = elements();
        const first = items[0];
        const last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => { document.body.style.overflow = overflow; document.removeEventListener('keydown', handleKey); previous?.focus(); };
  }, [mobile, overlay]);
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
    <div className="flex items-center justify-between p-5">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-500 font-sans font-bold text-white shadow-sm shadow-orange-500/20">T</div>
        <span className="font-sans font-bold tracking-tight text-slate-900 dark:text-white">TechVibe</span>
      </div>
      <button aria-label="Tutup menu" className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 md:hidden dark:hover:bg-slate-800" onClick={() => setMobile(false)}><X size={20} /></button>
    </div>
    <nav className="flex-1 space-y-6 overflow-y-auto p-4">
      {navGroups.map(group => (
        <div key={group.label}>
          <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{group.label}</p>
          <div className="space-y-1">
            {group.items.map(({ label, path, icon: Icon }) => (
              <NavLink key={path} to={path} end={path === '/admin'} onClick={() => setMobile(false)} className={({ isActive }) => `group flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${isActive ? 'bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400' : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-[#1a1f26]'}`}>
                <div className="flex items-center gap-3">
                  <Icon size={18} className={location.pathname === path || (path === '/admin' && location.pathname === '/admin') ? 'text-orange-600 dark:text-orange-400' : 'text-slate-400 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300'} />
                  <span>{label}</span>
                </div>
                {counts[path] > 0 && <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-100 px-1.5 text-xs font-semibold text-orange-600 dark:bg-orange-500/20 dark:text-orange-400">{counts[path]}</span>}
              </NavLink>
            ))}
          </div>
        </div>
      ))}
    </nav>
    <div className="space-y-2 border-t border-slate-200 p-4 dark:border-slate-800">
      <Button variant="outline" className="w-full justify-start border-transparent bg-transparent shadow-none hover:bg-slate-50 dark:hover:bg-slate-800" onClick={() => open('settings')}><Settings size={18} className="mr-3 text-slate-400" />Pengaturan</Button>
      <Button variant="outline" className="w-full justify-start border-transparent bg-transparent text-red-600 shadow-none hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-950/30 dark:hover:text-red-300" onClick={() => { logout(); navigate('/admin/login', { replace: true }); }}><LogOut size={18} className="mr-3" />Keluar</Button>
    </div>
  </>;
  const query = search.trim().toLowerCase();
  const matches = query && db ? [
    ...db.orders.filter(o => `${o.orderNumber} ${o.shippingAddress} ${o.tracking?.receiptNumber ?? ''}`.toLowerCase().includes(query)).map(o => ({id:`order-${o.id}`,label:o.orderNumber,path:`/admin/orders?search=${encodeURIComponent(o.orderNumber)}`})),
    ...db.products.filter(p => `${p.name} ${p.sku}`.toLowerCase().includes(query)).map(p => ({id:`product-${p.id}`,label:`${p.name} · ${p.sku}`,path:`/admin/products?search=${encodeURIComponent(p.sku)}`})),
    ...db.customers.filter(c => c.role === 'customer' && `${c.name} ${c.email}`.toLowerCase().includes(query)).map(c => ({id:`customer-${c.id}`,label:`${c.name} · ${c.email}`,path:`/admin/customers?search=${encodeURIComponent(c.email)}`})),
    ...db.tickets.filter(t => `${t.ticketNumber} ${t.subject}`.toLowerCase().includes(query)).map(t => ({id:`ticket-${t.id}`,label:`${t.ticketNumber} · ${t.subject}`,path:`/admin/tickets?search=${encodeURIComponent(t.ticketNumber)}`}))
  ].slice(0,20) : [];
  const title = navGroups.flatMap(group => group.items).find(item => item.path === location.pathname)?.label ?? 'Admin';
  const dialogTitle = overlay === 'settings' ? 'Pengaturan Toko & Kontak' : overlay === 'search' ? 'Pencarian Global' : 'Notifikasi Admin';
  return <div className="flex h-dvh bg-[#f7f8fa] text-slate-900 dark:bg-[#101419] dark:text-slate-100">
    <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-[#171b22] md:flex">{navigation}</aside>
    <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
      <header className="flex min-h-16 items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 dark:border-slate-800 dark:bg-[#171b22] sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <button aria-label="Buka menu" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 md:hidden dark:hover:bg-slate-800" onClick={() => setMobile(true)}><Menu size={20} /></button>
          <div className="flex min-w-0 items-center gap-2 text-sm"><span className="hidden text-slate-500 sm:inline dark:text-slate-400">Admin</span><ChevronRight size={14} className="hidden text-slate-400 sm:inline" /><h1 className="truncate font-semibold">{title}</h1></div>
          {DEMO_MODE && <span className="hidden rounded-full bg-orange-50 px-2 py-1 text-xs font-semibold text-orange-600 dark:bg-orange-500/10 dark:text-orange-400 sm:inline">Mode Demo</span>}
        </div>
        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <button aria-label="Pencarian global" onClick={() => open('search')} className="flex items-center gap-2 rounded-xl border border-slate-200 px-2.5 py-2 text-slate-500 transition hover:border-orange-300 hover:text-orange-600 dark:border-slate-700 dark:text-slate-400 dark:hover:text-orange-400 sm:pr-12"><Search size={18} /><span className="hidden text-sm sm:inline">Cari apa saja...</span><Command size={14} className="hidden text-slate-400 lg:inline" /></button>
          <button aria-label="Ganti tema" onClick={toggleTheme} className="rounded-xl p-2.5 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800">{isDarkMode ? <Sun size={19} /> : <Moon size={19} />}</button>
          <button aria-label={`Notifikasi, ${notifications.filter(n => !n.isRead).length} belum dibaca`} onClick={() => open('notifications')} className="relative rounded-xl p-2.5 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"><Bell size={19} />{notifications.some(n => !n.isRead) && <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-orange-500 ring-2 ring-white dark:ring-[#171b22]" />}</button>
          <div className="ml-1 flex items-center gap-2 border-l border-slate-200 pl-3 dark:border-slate-700"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-100 text-sm font-bold text-orange-700 dark:bg-orange-500/20 dark:text-orange-300">{user?.name?.charAt(0).toUpperCase() ?? 'A'}</span><span className="hidden max-w-32 truncate text-sm font-medium lg:inline">{user?.name}</span></div>
        </div>
      </header>
      <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8"><div className="mx-auto max-w-7xl"><Feedback error={state.error} message="" />{location.pathname === '/admin/customers' ? <AdminTlaterRiskView key={location.search} /> : <div key={location.pathname + location.search}>{children}</div>}</div></div>
    </main>
    {mobile && <div className="fixed inset-0 z-50 md:hidden"><button aria-label="Tutup menu" className="absolute inset-0 bg-slate-950/60" onClick={() => setMobile(false)} /><aside ref={!overlay ? dialogRef : undefined} role="dialog" aria-modal="true" aria-label="Menu navigasi" className="relative flex h-full w-72 max-w-[85%] flex-col bg-white shadow-xl dark:bg-[#171b22]">{navigation}</aside></div>}
    {overlay && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-3 sm:p-6" onMouseDown={e => { if (e.target === e.currentTarget) setOverlay(null); }}><section ref={dialogRef} role="dialog" aria-modal="true" aria-label={dialogTitle} className={`${panel} w-full max-w-2xl max-h-[min(90dvh,850px)] overflow-y-auto shadow-2xl`}><div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4 dark:border-slate-800"><div><h2 className="font-sans text-xl font-bold">{dialogTitle}</h2><p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{overlay === 'settings' ? 'Kelola identitas toko dan pengaturan operasional.' : overlay === 'search' ? 'Temukan data di seluruh halaman admin.' : overlay === 'notifications' ? 'Pembaruan terbaru untuk akun Anda.' : 'Tindakan ini tidak dapat dibatalkan.'}</p></div><button aria-label="Tutup dialog" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => setOverlay(null)}><X size={20} /></button></div><Feedback error={state.error} message={state.message} />
      {overlay === 'search' && <><div className="relative"><Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input autoFocus aria-label="Cari order, produk, pelanggan, tiket" placeholder="Cari order, produk, pelanggan, tiket" className={`${field} pl-10`} value={search} onChange={e => setSearch(e.target.value)} /></div><div className="max-h-80 space-y-1 overflow-y-auto">{matches.map(m => <button key={m.id} className="block w-full rounded-xl p-3 text-left text-sm transition hover:bg-orange-50 hover:text-orange-700 dark:hover:bg-orange-500/10 dark:hover:text-orange-400" onClick={() => go(m.path)}>{m.label}</button>)}{query && !matches.length && <p className="py-8 text-center text-sm text-slate-500">Tidak ada hasil untuk “{search}”.</p>}{!query && <p className="py-8 text-center text-sm text-slate-500">Mulai ketik untuk mencari pesanan, produk, pelanggan, atau tiket.</p>}</div></>}
      {overlay === 'notifications' && <><Button disabled={state.busy || !notifications.some(n => !n.isRead)} variant="outline" onClick={() => void state.run(() => AdminApi.readNotifications(), 'Ditandai dibaca')}>Tandai Semua Dibaca</Button>{notifications.map(n => <article key={n.id} className="border-t pt-3"><h3 className="font-bold">{n.title}</h3><p>{n.message}</p><p className="text-xs text-slate-500">{new Date(n.createdAt).toLocaleString('id-ID')} · {n.isRead ? 'Dibaca' : 'Baru'}</p></article>)}{!notifications.length && <p>Belum ada notifikasi untuk akun admin ini.</p>}</>}
      {overlay === 'settings' && db && <form className="space-y-4" onSubmit={e => { const data = formValues(e); void state.run(() => AdminApi.saveSettings({ ...db.settings, shippingFee:Number(data.get('fee')), pointValue:Number(data.get('point')), creditLimit:Number(data.get('limit')), storeName:String(data.get('storeName')), contactEmail:String(data.get('contactEmail')), contactPhone:String(data.get('contactPhone')), interest1:Number(data.get('interest1')), interest3:Number(data.get('interest3')), interest6:Number(data.get('interest6')), adminFeePercent:Number(data.get('adminFeePercent')), adminFeeFixed:Number(data.get('adminFeeFixed')) })); }}>
        <fieldset className="space-y-4 rounded-xl border border-slate-200 p-4 dark:border-slate-700"><legend className="px-2 text-sm font-semibold">Identitas & kontak</legend><InputField label="Nama Toko" name="storeName" value={db.settings.storeName} /><div className="grid gap-4 sm:grid-cols-2"><InputField label="Email Kontak" name="contactEmail" type="email" value={db.settings.contactEmail} /><InputField label="Telepon Kontak" name="contactPhone" type="tel" value={db.settings.contactPhone} /></div></fieldset>
        <fieldset className="rounded-xl border border-slate-200 p-4 dark:border-slate-700"><legend className="px-2 text-sm font-semibold">Pengiriman & loyalitas</legend><div className="grid gap-4 sm:grid-cols-2"><InputField label="Ongkir default (Rp)" name="fee" type="number" min={0} value={db.settings.shippingFee} /><InputField label="Nilai 1 poin (Rp)" name="point" type="number" min={1} value={db.settings.pointValue} /></div></fieldset>
        <fieldset className="space-y-4 rounded-xl border border-slate-200 p-4 dark:border-slate-700"><legend className="px-2 text-sm font-semibold">TLater & biaya layanan</legend><InputField label="Limit global TLater (Rp)" name="limit" type="number" min={0} value={db.settings.creditLimit} /><div className="grid gap-4 sm:grid-cols-3"><InputField label="Bunga 1 Bln (%)" name="interest1" type="number" step="0.1" min={0} value={db.settings.interest1} /><InputField label="Bunga 3 Bln (%)" name="interest3" type="number" step="0.1" min={0} value={db.settings.interest3} /><InputField label="Bunga 6 Bln (%)" name="interest6" type="number" step="0.1" min={0} value={db.settings.interest6} /></div><div className="grid gap-4 sm:grid-cols-2"><InputField label="Biaya Admin (%)" name="adminFeePercent" type="number" step="0.1" min={0} value={db.settings.adminFeePercent} /><InputField label="Biaya Admin (Fixed)" name="adminFeeFixed" type="number" min={0} value={db.settings.adminFeeFixed} /></div></fieldset>
        <div className="flex justify-end gap-3 border-t border-slate-100 pt-4 dark:border-slate-800"><Button type="button" variant="outline" onClick={() => setOverlay(null)}>Batal</Button><Button disabled={state.busy}>Simpan Pengaturan</Button></div>
      </form>}
    </section></div>}
  </div>;
}

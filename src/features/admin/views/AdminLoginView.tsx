import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../stores/useAuthStore';
import { AuthService } from '../../../services/auth.service';
import { DEMO_MODE } from '../../../lib/demoMode';
import { readDemoDB } from '../../../lib/demoRepository';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { ShieldCheck, ArrowRight, Lock, ShoppingBag, Package, Users } from 'lucide-react';
import { Feedback } from './adminShared';

export function AdminLoginView() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState('');
  const handleLogin = async () => {
    setIsLoading(true);
    setError('');
    try {
      const result = await AuthService.login(email, password);
      if (result.user.role !== 'admin') {
        useAuthStore.getState().logout();
        throw new Error('Akun ini bukan admin.');
      }
      login();
      navigate('/admin', { replace: true });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Login gagal');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-dvh bg-[#f7f8fa] text-slate-900 dark:bg-[#101419] dark:text-slate-100">
      <aside className="relative hidden w-[46%] flex-col justify-between overflow-hidden bg-[#171b22] p-10 text-white lg:flex xl:p-16">
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-orange-500/10 blur-3xl" />
        <div className="relative flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 font-sans text-xl font-bold">T</span><span className="font-sans text-xl font-bold tracking-tight">TechVibe</span><span className="ml-2 rounded-full border border-white/15 px-2.5 py-1 text-xs text-slate-300">Admin</span></div>
        <div className="relative max-w-lg"><span className="mb-6 inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1.5 text-xs font-medium text-orange-300"><ShieldCheck size={14} /> Ruang kerja admin</span><h1 className="font-sans text-4xl font-bold leading-tight tracking-tight xl:text-5xl">Semua kendali toko, <span className="text-orange-400">dalam satu tempat.</span></h1><p className="mt-5 max-w-md text-base leading-relaxed text-slate-400">Kelola pesanan, produk, dan pelanggan TechVibe dengan lebih mudah dan terarah.</p><div className="mt-10 grid grid-cols-3 gap-3">{[{ label: 'Pesanan', icon: ShoppingBag }, { label: 'Produk', icon: Package }, { label: 'Pelanggan', icon: Users }].map(({ label, icon: Icon }) => <div key={label} className="rounded-2xl border border-white/10 bg-white/5 p-4"><Icon size={21} className="mb-4 text-orange-400" /><span className="text-sm font-medium text-slate-200">{label}</span></div>)}</div></div>
        <p className="relative text-xs text-slate-500">© TechVibe · Panel administrasi</p>
      </aside>
      <main className="flex min-w-0 flex-1 flex-col px-5 py-6 sm:px-10 lg:px-12">
        <div className="flex items-center gap-2 lg:invisible"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500 font-sans font-bold text-white">T</span><span className="font-sans font-bold">TechVibe</span></div>
        <div className="flex flex-1 items-center justify-center py-10"><div className="w-full max-w-md">
          <div className="mb-8"><div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400"><Lock size={22} /></div><p className="text-xs font-semibold uppercase tracking-widest text-orange-600 dark:text-orange-400">Panel Administrasi</p><h2 className="mt-2 font-sans text-3xl font-bold tracking-tight sm:text-4xl">Selamat datang kembali</h2><p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Masuk menggunakan akun admin untuk melanjutkan.</p></div>
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm shadow-slate-900/5 dark:border-slate-800 dark:bg-[#171b22] sm:p-8">
            <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); void handleLogin(); }}>
              <div><label htmlFor="admin-email" className="mb-2 block text-sm font-semibold">Email Admin</label><Input id="admin-email" name="email" type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@techvibe.id" /></div>
              <div><label htmlFor="admin-password" className="mb-2 block text-sm font-semibold">Password</label><Input id="admin-password" name="password" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" /></div>
              <Feedback error={error} message="" />
              <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">Sesi berlaku di tab ini. Hubungi pengelola untuk pemulihan akun.</p>
              <Button type="submit" className="flex w-full justify-center gap-2" isLoading={isLoading}><Lock className="h-4 w-4" />Masuk Sistem</Button>
            </form>
            {DEMO_MODE && <div className="mt-7 border-t border-slate-100 pt-6 dark:border-slate-800"><p className="text-sm font-semibold">Akses Demonstrasi</p><p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">Gunakan kredensial admin dari repository demo. Akun seed baru: admin@techvibe.id / Admin123!. Akun lama dapat memiliki kredensial berbeda.</p><Button type="button" variant="outline" className="mt-4 w-full" onClick={() => { const account = readDemoDB().customers.find(c => c.role === 'admin'); if (account) setEmail(account.email); }}>Isi email admin <ArrowRight className="ml-2 h-4 w-4" /></Button></div>}
          </div>
          <p className="mt-6 text-center text-xs text-slate-400">Akses khusus untuk tim administrasi TechVibe.</p>
        </div></div>
      </main>
    </div>
  );
}

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../stores/useAuthStore';
import { AuthService } from '../../../services/auth.service';
import { DEMO_MODE } from '../../../lib/demoMode';
import { readDemoDB } from '../../../lib/demoRepository';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { ShieldCheck, ArrowRight, Lock } from 'lucide-react';

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
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0a] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
            <ShieldCheck className="w-8 h-8 text-primary" />
          </div>
        </div>
        <h2 className="text-center text-3xl font-bold font-space text-slate-900 dark:text-white">
          Admin Portal
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600 dark:text-slate-400">
          TechVibe Unified Backoffice System
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-[#111] py-8 px-4 shadow-xl shadow-primary/5 sm:rounded-3xl sm:px-10 border border-slate-100 dark:border-slate-800">
          <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); void handleLogin(); }}>
            <Input
              label="Email Admin"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@techvibe.id"
            />
            
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />

            {error && <p role="alert" className="text-red-600">{error}</p>}
            <p className="text-sm text-slate-500">Sesi berlaku di tab ini. Hubungi pengelola untuk pemulihan akun.</p>

            <Button 
              type="submit" 
              className="w-full flex justify-center gap-2"
              isLoading={isLoading}
            >
              <Lock className="w-4 h-4" />
              Masuk Sistem
            </Button>
          </form>

          {DEMO_MODE && <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-800" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white dark:bg-[#111] px-2 text-slate-500">
                  Akses Demonstrasi
                </span>
              </div>
            </div>

            <p className="mt-6 text-sm text-slate-600 dark:text-slate-400">Gunakan kredensial admin dari repository demo. Akun seed baru: admin@techvibe.id / Admin123!. Akun lama dapat memiliki kredensial berbeda.</p>
            <Button type="button" variant="outline" className="mt-4 w-full" onClick={() => { const account = readDemoDB().customers.find(c => c.role === 'admin'); if (account) setEmail(account.email); }}>
              Isi email admin <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>}
        </div>
      </div>
    </div>
  );
}

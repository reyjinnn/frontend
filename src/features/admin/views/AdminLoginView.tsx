import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../stores/useAuthStore';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { ShieldCheck, ArrowRight, Lock } from 'lucide-react';

export function AdminLoginView() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleDemoLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      login(
        {
          id: 'admin-999',
          name: 'Super Admin',
          email: 'admin@techvibe.id',
          role: 'admin',
          kycStatus: 'verified'
        },
        'mock-admin-token-123',
        'mock-admin-refresh-123'
      );
      navigate('/admin');
      setIsLoading(false);
    }, 800);
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
          <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleDemoLogin(); }}>
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

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary dark:border-slate-700 dark:bg-slate-800"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-600 dark:text-slate-400">
                  Ingat saya
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-semibold text-primary hover:text-primary-600">
                  Lupa password?
                </a>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full flex justify-center gap-2"
              isLoading={isLoading}
            >
              <Lock className="w-4 h-4" />
              Masuk Sistem
            </Button>
          </form>

          <div className="mt-8">
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

            <div className="mt-6">
              <Button 
                variant="outline"
                className="w-full flex justify-center gap-2 border-dashed"
                onClick={handleDemoLogin}
                isLoading={isLoading}
              >
                1-Click Demo Login as Admin
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

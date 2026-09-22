import { useAuthStore } from '../../../stores/useAuthStore';
import { useUIStore } from '../../../stores/useUIStore';
import { AddressList } from '../../address/AddressList';
import { Button } from '../../../components/ui/Button';

export function ProfileView() {
  const { user, isAuthenticated } = useAuthStore();
  const { openLogin } = useUIStore();

  return (
    <div className="bg-white dark:bg-[#1A1A1A] rounded-3xl shadow-card p-6 md:p-10 border border-slate-100 dark:border-slate-800/60">
      <h2 className="text-2xl font-semibold mb-6">Dashboard Profil (Sprint 1)</h2>
      
      {isAuthenticated ? (
        <div className="space-y-8">
          <div className="p-6 bg-slate-50 dark:bg-[#141414] rounded-2xl border border-slate-200 dark:border-slate-800">
            <h3 className="font-semibold text-lg mb-2">Informasi Akun</h3>
            <p className="text-slate-600 dark:text-slate-400">Nama: {user?.name}</p>
            <p className="text-slate-600 dark:text-slate-400">Email: {user?.email}</p>
            <p className="text-slate-600 dark:text-slate-400">No HP: {user?.phone}</p>
          </div>
          
          <AddressList />
        </div>
      ) : (
        <div className="text-center py-20">
          <h3 className="text-xl font-medium text-slate-600 dark:text-slate-400 mb-4">Silakan masuk untuk melihat profil dan buku alamat Anda.</h3>
          <Button onClick={openLogin}>Masuk Sekarang</Button>
        </div>
      )}
    </div>
  );
}

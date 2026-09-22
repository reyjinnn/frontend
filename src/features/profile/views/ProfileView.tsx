import { useState } from 'react';
import { useAuthStore } from '../../../stores/useAuthStore';
import { useUIStore } from '../../../stores/useUIStore';
import { AddressList } from '../../address/AddressList';
import { Button } from '../../../components/ui/Button';
import { KycModal } from '../../auth/components/KycModal';
import { Link } from 'react-router-dom';
import { ShieldAlert, CreditCard, Coins, CheckCircle2 } from 'lucide-react';

export function ProfileView() {
  const { user, isAuthenticated } = useAuthStore();
  const { openLogin } = useUIStore();
  const [isKycOpen, setIsKycOpen] = useState(false);

  return (
    <div className="bg-white dark:bg-[#1A1A1A] rounded-3xl shadow-card p-6 md:p-10 border border-slate-100 dark:border-slate-800/60">
      <h2 className="text-2xl font-semibold mb-6">Dashboard Profil</h2>
      
      {isAuthenticated ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1 space-y-6">
            <div className="p-6 bg-slate-50 dark:bg-[#141414] rounded-2xl border border-slate-200 dark:border-slate-800">
              <h3 className="font-semibold text-lg mb-4">Informasi Akun</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-1 text-sm font-medium">Nama</p>
              <p className="mb-3 font-semibold">{user?.name}</p>
              <p className="text-slate-600 dark:text-slate-400 mb-1 text-sm font-medium">Email</p>
              <p className="mb-3 font-semibold">{user?.email}</p>
              <p className="text-slate-600 dark:text-slate-400 mb-1 text-sm font-medium">No HP</p>
              <p className="mb-3 font-semibold">{user?.phone || '-'}</p>

              <hr className="border-slate-200 dark:border-slate-700 my-4" />
              
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-medium">Status KYC</span>
                {user?.kycStatus === 'verified' ? (
                  <span className="flex items-center gap-1 text-xs font-bold text-green-500 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                  </span>
                ) : user?.kycStatus === 'pending' ? (
                  <span className="flex items-center gap-1 text-xs font-bold text-orange-500 bg-orange-50 dark:bg-orange-900/20 px-2 py-1 rounded">
                    Pending
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                    Unverified
                  </span>
                )}
              </div>
              
              {user?.kycStatus !== 'verified' && user?.kycStatus !== 'pending' && (
                <Button variant="outline" size="sm" className="w-full text-xs py-2 h-auto flex items-center justify-center gap-2" onClick={() => setIsKycOpen(true)}>
                  <ShieldAlert className="w-4 h-4" /> Verifikasi Sekarang
                </Button>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-1 gap-4">
              <Link to="/tlater" className="flex items-center gap-3 p-4 bg-white dark:bg-[#1A1A1A] border border-slate-200 dark:border-slate-700 rounded-2xl hover:border-pumpkin transition-colors group">
                <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center group-hover:bg-pumpkin/10 group-hover:text-pumpkin transition-colors">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">TLater Hub</h4>
                  <p className="text-[10px] text-slate-500">Batas PayLater Anda</p>
                </div>
              </Link>

              <Link to="/points" className="flex items-center gap-3 p-4 bg-white dark:bg-[#1A1A1A] border border-slate-200 dark:border-slate-700 rounded-2xl hover:border-pumpkin transition-colors group">
                <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center group-hover:bg-pumpkin/10 group-hover:text-pumpkin transition-colors">
                  <Coins className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Vibe Poin</h4>
                  <p className="text-[10px] text-slate-500">Dompet & Riwayat Poin</p>
                </div>
              </Link>
            </div>
          </div>
          
          <div className="md:col-span-2 space-y-6">
            <AddressList />
          </div>
          
          <KycModal isOpen={isKycOpen} onClose={() => setIsKycOpen(false)} />
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
